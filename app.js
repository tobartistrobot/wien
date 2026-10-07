(() => {
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
const CFG = {
  url: "https://fokjxpkfwzpgovvgtsmu.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZva2p4cGtmd3pwZ292dmd0c211Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODYxNzEsImV4cCI6MjEwNTE2MjE3MX0.A9r9bTXXbIGU7RNyY1xDyp4wLGmxjppLEMQDb_bGcwg"
};

/* ---------- Estado compartido entre los dos móviles ----------
   Cada dato es una entrada clave → { v: valor, at: milisegundos, d: pendiente de subir }.
   Gana siempre la escritura más reciente. Claves:
   r:<juego> resultado · s:<sitio> sello · m:<sitio> mensaje desbloqueado · b:<día> apuesta
   f:<sitio> foto de los dos · n nombres de los jugadores */
let KV = store.get("wien-kv", {});
let me = store.get("wien-me", null);          // "k" (Kevin) o "p" (Pilu)
let code = store.get("wien-code", "");        // clave de pareja
let since = store.get("wien-since", null);
const DEV = store.get("wien-dev", null) || (() => { const id = Math.random().toString(36).slice(2, 10); store.set("wien-dev", id); return id; })();
let secrets = store.get("wien-secrets", {});  // secretos rascados (solo en este móvil)
let readMsg = store.get("wien-read", {});     // mensajes ya leídos en este móvil
let results = {}, stamps = {}, opened = {}, bets = {}, fotos = {}, players = { k: "Kevin", p: "Pilu" };
const OTHER = { k: "p", p: "k" };

function saveKV() { store.set("wien-kv", KV); }
function derive() {
  results = {}; stamps = {}; opened = {}; bets = {}; fotos = {}; players = { k: "Kevin", p: "Pilu" };
  for (const key in KV) {
    const v = KV[key] && KV[key].v; if (!v || v.del) continue;
    if (key === "n") { players = { k: String(v.k || "Kevin").slice(0, 14), p: String(v.p || "Pilu").slice(0, 14) }; continue; }
    const pre = key.slice(0, 2), id = key.slice(2);
    if (pre === "r:") results[id] = v; else if (pre === "s:") stamps[id] = String(v.d || "");
    else if (pre === "m:") opened[id] = v; else if (pre === "b:") bets[id] = v; else if (pre === "f:") fotos[id] = v;
  }
}
function kvSet(key, v, at) {
  const e = KV[key];
  if (at && e && e.at >= at) return;            // esa escritura (u otra posterior) ya está aquí
  at = at || Math.max(Date.now(), e ? e.at + 1 : 0);
  KV[key] = { v: { ...v, by: v.by || me || "k" }, at, d: 1 };
  saveKV(); schedulePush();
}
function kvDel(key) { if (KV[key] && !KV[key].v.del) kvSet(key, { del: 1 }); }
const dirtyCount = () => Object.keys(KV).filter(k => KV[k].d).length;

/* ---------- Red ----------
   NET es el transporte: llamadas a la base de datos y un canal en tiempo real entre los dos móviles. */
function supaNet() {
  let client = null, ch = null;
  const cl = () => client || (client = window.supabase.createClient(CFG.url, CFG.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    realtime: { params: { eventsPerSecond: 20 } }
  }));
  return {
    ready: () => !!(window.supabase && window.supabase.createClient),
    async rpc(fn, args) { const { data, error } = await cl().rpc(fn, args); if (error) throw error; return data; },
    join(name, onMsg, onStatus) {
      if (ch) { try { cl().removeChannel(ch); } catch (e) {} ch = null; }
      ch = cl().channel(name, { config: { broadcast: { self: false, ack: false } } });
      ch.on("broadcast", { event: "m" }, m => onMsg(m.payload));
      ch.subscribe(st => onStatus(st === "SUBSCRIBED"));
    },
    send(payload) { if (!ch) return; try { const r = ch.send({ type: "broadcast", event: "m", payload }); if (r && r.catch) r.catch(() => {}); } catch (e) {} },
    leave() { if (ch) { try { cl().removeChannel(ch); } catch (e) {} ch = null; } }
  };
}
const NET = window.__WIEN_NET__ || supaNet();
const net = { db: null, rt: false, peer: 0, twin: false, bad: false, joined: "" };
const syncOn = () => !!(code && me && !net.bad && NET.ready());
const peerOnline = () => syncOn() && net.rt && Date.now() - net.peer < 20000;

async function sha(text) {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    let h = 5381, g = 52711; for (let i = 0; i < text.length; i++) { h = (h * 33) ^ text.charCodeAt(i); g = (g * 33) ^ text.charCodeAt(i); }
    return (h >>> 0).toString(16).padStart(8, "0") + (g >>> 0).toString(16).padStart(8, "0") + text.length.toString(16);
  }
}

let pushT = null, pushing = false, pulling = false;
function schedulePush() { clearTimeout(pushT); pushT = setTimeout(push, 250); renderNet(); }
async function push() {
  if (!syncOn() || pushing) return;
  const items = Object.keys(KV).filter(k => KV[k].d).map(k => ({ key: k, value: KV[k].v, at: KV[k].at }));
  if (!items.length) return;
  pushing = true; let ok = false;
  try {
    const r = await NET.rpc("wien_push", { p_code: code, p_by: me, p_items: items });
    if (r && r.ok) {
      ok = true; items.forEach(it => { const e = KV[it.key]; if (e && e.at === it.at) delete e.d; });
      saveKV(); net.db = true; NET.send({ t: "sync", f: me, dev: DEV });
    } else if (r && r.ok === false && !r.error) badCode();
  } catch (e) { net.db = false; }
  pushing = false; renderNet();
  if (ok && dirtyCount()) schedulePush();
}
async function pull(full) {
  if (!syncOn() || pulling) return;
  pulling = true;
  try {
    const r = await NET.rpc("wien_pull", { p_code: code, p_since: full ? null : since });
    if (r && r.ok) {
      net.db = true;
      const rows = r.rows || [];
      if (rows.length) {
        // el cursor retrocede unos segundos para no perder escrituras casi simultáneas
        const last = rows.reduce((m, x) => (x.ts > m ? x.ts : m), "");
        if (last) { since = new Date(new Date(last).getTime() - 10000).toISOString(); store.set("wien-since", since); }
      }
      merge(rows);
    } else if (r && r.ok === false) badCode();
  } catch (e) { net.db = false; }
  pulling = false; renderNet();
}
function merge(rows) {
  const ch = [];
  rows.forEach(r => {
    const e = KV[r.key], at = +r.at || 0;
    if (!e || at > e.at) { ch.push({ key: r.key, old: e ? e.v : null, v: r.value }); KV[r.key] = { v: r.value, at }; }
  });
  if (ch.length) { saveKV(); derive(); onRemote(ch); }
  return ch.length;
}
function badCode() { net.bad = true; renderNet(); toast("La clave de pareja no es válida. Tócalo arriba para corregirla."); }

async function connect() {
  if (!syncOn()) { renderNet(); return; }
  const name = "wien:" + (await sha(code + "|canal")).slice(0, 40);
  if (net.joined !== name) {
    net.joined = name; net.rt = false;
    NET.join(name, onNetMsg, ok => { const was = net.rt; net.rt = ok; if (ok && !was) { hello(); pull(); } renderNet(); });
  }
  pull(true); push(); syncPhotos();
}
function hello(re) { if (syncOn() && net.rt) NET.send({ t: "hi", f: me, dev: DEV, re: re ? 1 : 0 }); }
function onNetMsg(m) {
  if (!m || typeof m !== "object" || m.dev === DEV) return;
  if (m.f === me) { if (!net.twin) { net.twin = true; renderNet(); toast(`Ojo: los dos móviles dicen ser ${players[me]}.`); } return; }
  const was = peerOnline();
  net.twin = false;
  if (m.t === "off") { net.peer = 0; renderNet(); liveWatch(); return; }
  net.peer = Date.now();
  if (!was) { renderNet(); if (m.t === "hi" && !m.re) hello(true); }
  if (m.t === "sync") pull().then(syncPhotos);
  else if (m.g) onLiveMsg(m);
}
setInterval(() => {
  if (document.hidden) return;
  hello(); renderNet(); liveWatch();
}, 8000);
setInterval(() => { if (!document.hidden && syncOn()) { pull(); push(); syncPhotos(); } }, 30000);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { if (syncOn() && net.rt) NET.send({ t: "off", f: me, dev: DEV }); return; }
  if (syncOn()) { hello(); pull(); push(); syncPhotos(); }
  idleReload();
});
addEventListener("online", () => { if (syncOn()) { pull(); push(); syncPhotos(); } });
addEventListener("offline", () => { net.db = false; renderNet(); });
addEventListener("pagehide", () => { if (syncOn() && net.rt) NET.send({ t: "off", f: me, dev: DEV }); });

/* Indicador de conexión, arriba a la derecha */
function renderNet() {
  const el = $("#net"); if (!el) return;
  let cls = "off", txt = "Solo en este móvil";
  if (code && me) {
    const n = dirtyCount();
    if (net.bad) { cls = "warn"; txt = "Clave incorrecta"; }
    else if (net.twin) { cls = "warn"; txt = `¿Dos ${players[me]}?`; }
    else if (net.db === false || !navigator.onLine) { cls = "warn"; txt = n ? `Sin conexión · ${n} por subir` : "Sin conexión"; }
    else if (peerOnline()) { cls = "on"; txt = `${players[OTHER[me]]} en línea`; }
    else if (net.db) { cls = "ok"; txt = n ? "Sincronizando…" : "Sincronizado"; }
    else { cls = "ok"; txt = "Conectando…"; }
  }
  el.className = "net " + cls; el.querySelector("span").textContent = txt;
}

/* Lo que llega del otro móvil */
function onRemote(changes) {
  const quiet = !!A, notes = [];
  changes.forEach(c => {
    // el resultado de la partida en curso ha llegado por la base de datos antes que por el canal
    if (L && !L.done && A && c.key === "r:" + A.id && c.v && !c.v.del) {
      L.done = true; finish({ k: +c.v.k || 0, p: +c.v.p || 0 }, c.v.w, "", { at: +c.v.at || Date.now(), s: c.v.s, ex: c.v.ex });
    }
    const pre = c.key.slice(0, 2), id = c.key.slice(2), v = c.v || {}, who = players[v.by] || "";
    const fresh = !c.old || c.old.del;
    if (v.del) return;
    if (pre === "r:" && fresh) {
      const k = id.slice(0, id.lastIndexOf("-")), g = gamesOf(k)[+id.slice(id.lastIndexOf("-") + 1)];
      if (g) notes.push(`${who} apunta «${g.title}»: ${v.w === "t" ? "empate" : v.w === "n" ? "nadie puntúa" : "gana " + players[v.w]}`);
    } else if (pre === "s:" && fresh && PLACES[id]) notes.push(`${who} ha sellado ${PLACES[id].name}`);
    else if (pre === "m:" && fresh && PLACES[id]) notes.push(`Mensaje desbloqueado en ${PLACES[id].name}`);
    else if (pre === "b:") {
      const d = DAYS.find(x => x.key === id), was = c.old && !c.old.del ? c.old : null;
      if (d && v.st === "closed" && (!was || was.st !== "closed")) setTimeout(() => singDay(id), 400);
      else if (d && (!was || was.text !== v.text)) notes.push(`${who} propone para el ${d.label.split(" ")[0].toLowerCase()}: «${v.text}»`);
    } else if (pre === "f:" && fresh && PLACES[id]) notes.push(`${who} ha añadido vuestra foto en ${PLACES[id].name}`);
  });
  renderAll();
  if (notes.length && !quiet) toast(notes.length > 1 ? `${notes[0]} y ${notes.length - 1} más` : notes[0], 3600);
  syncPhotos();
}
function renderAll() {
  renderHero(); renderPlan(); renderPassport(); renderScore(); renderNet();
  if (current && !A) refreshSheet();
  if ($("#recap").classList.contains("on")) renderRecap();
}
function refreshSheet() {
  const k = current.k, b = $("#stamp-btn");
  if (b) { b.classList.toggle("stamped", !!stamps[k]); b.lastChild.textContent = stamps[k] ? "Sellado" : "Sellar pasaporte"; }
  const gs = $("#games-slot"); if (gs) gs.innerHTML = gamesSection(k);
  const ms = $("#msg-slot"); if (ms && !ms.querySelector(".env.opening")) ms.innerHTML = msgCard(k);
  const us = $("#us-slot"); if (us) us.innerHTML = usBlock(k);
}


/* ---------- Hora de Viena ---------- */
function viennaNow() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Vienna", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const g = t => parts.find(p => p.type === t).value;
  return { date: `${g("year")}-${g("month")}-${g("day")}`, time: `${g("hour")}:${g("minute")}` };
}
const START = Date.UTC(2026, 9, 9, 15, 30); // 17:30 en Viena
const END = Date.UTC(2026, 9, 12, 10, 0);
const flat = [];
DAYS.forEach((d, di) => d.stops.forEach((s, si) => { if (s.t) flat.push({ key: d.key + " " + s.t, di, si }); }));
function status() {
  const n = viennaNow(), stamp = n.date + " " + n.time;
  let cur = null, next = null;
  for (let i = 0; i < flat.length; i++) {
    if (flat[i].key <= stamp) cur = flat[i]; else { next = flat[i]; break; }
  }
  if (cur && DAYS[cur.di].key !== n.date && (!next || DAYS[next.di].key !== n.date)) cur = null;
  return { stamp, cur, next, today: DAYS.findIndex(d => d.key === n.date) };
}

/* ---------- Hero ---------- */
function plural(n, a, b) { return n + " " + (n === 1 ? a : b); }
function renderHero() {
  const box = $("#countdown"), now = Date.now();
  if (now < START) {
    const ms = START - now, d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60;
    box.innerHTML = `<p class="big">Faltan ${plural(d, "día", "días")}, ${plural(h, "hora", "horas")} y ${plural(m, "minuto", "minutos")}</p>
      <p class="small">Aterrizamos el viernes 9 de octubre y a las 17:30 empieza todo.</p>`;
  } else if (now < END) {
    const st = status();
    const s = st.cur ? DAYS[st.cur.di].stops[st.cur.si] : null;
    const nx = st.next ? DAYS[st.next.di].stops[st.next.si] : null;
    box.innerHTML = `<p class="big"><span class="live-dot"></span>${s ? esc(s.title) : "Viena os espera"}</p>
      <p class="small">${nx ? `Después, a las ${nx.t}: ${esc(nx.title)}` : "Último capítulo del viaje."}</p>${heroBet()}`;
  } else {
    box.innerHTML = `<p class="big">Viena ya es vuestra</p><p class="small">${Object.keys(stamps).length} sellos en el pasaporte. Hasta la próxima.</p>`;
  }
}

/* ---------- Plan ---------- */
let day = 0;
function renderDays() {
  const h = DAYS.map((d, i) => `<button class="day-btn" role="tab" aria-selected="${i === day}" data-i="${i}">
    <span class="d1">${d.short}</span><span class="d2">${d.num}</span></button>`).join("");
  $("#days").innerHTML = h; $("#days-map").innerHTML = h;
}
function renderPlan() {
  renderDays();
  const d = DAYS[day], st = status();
  $("#day-title").textContent = d.title;
  renderBetCard();
  $("#timeline").innerHTML = d.stops.map((s, si) => {
    const P = s.p ? PLACES[s.p] : null;
    const isNow = st.cur && st.cur.di === day && st.cur.si === si;
    const past = st.stamp > d.key + " " + (s.t || "23:59") && !isNow;
    const tags = [];
    if (isNow) tags.push(`<span class="tag now">Ahora</span>`);
    if (s.tag) tags.push(`<span class="tag ${s.tag[0]}">${esc(s.tag[1])}</span>`);
    if (P && GAMES[s.p]) { const n = GAMES[s.p].length, pl = playedOf(s.p); tags.push(`<span class="tag game">${pl === n ? "Juegos completos" : pl ? `${pl} de ${n} juegos` : `${n} juegos`}</span>`); }
    if (P && stamps[s.p]) tags.push(`<span class="stamp-mini">Sellado</span>`);
    if (P && opened[s.p] && !readMsg[s.p]) tags.push(`<span class="tag msg">Mensaje para abrir</span>`);
    return `<li class="stop ${isNow ? "now" : past ? "done" : ""}">
      <time>${s.t || ""}</time><span class="node"></span>
      <button class="card ${P ? "" : "plain-stop"}" data-di="${day}" data-si="${si}" ${P ? "" : "disabled"}>
        ${P ? `<span class="thumb">${P.photos ? `<img src="${P.photos.now.src}" alt="" loading="lazy" decoding="async">` : art(P.art)}</span>` : ""}
        <span><h3>${esc(s.title)}</h3><span class="kind">${esc(P ? P.name : s.note)}</span>
        ${tags.length ? `<span class="tags">${tags.join("")}</span>` : ""}</span>
      </button></li>`;
  }).join("");
}
["#days", "#days-map"].forEach(id => $(id).addEventListener("click", e => {
  const b = e.target.closest(".day-btn"); if (!b) return;
  day = +b.dataset.i; renderPlan(); renderMap();
}));
$("#timeline").addEventListener("click", e => {
  const c = e.target.closest(".card"); if (!c || c.disabled) return;
  openSheet(+c.dataset.di, +c.dataset.si);
});

/* ---------- Mapa ---------- */
const W = 520, H = 336;
let B = { lonMin: 16.296, lonMax: 16.426, latMin: 48.168, latMax: 48.224 };
const X = lon => ((lon - B.lonMin) / (B.lonMax - B.lonMin)) * W;
const Y = lat => ((B.latMax - lat) / (B.latMax - B.latMin)) * H;
const line = pts => pts.map((p, i) => (i ? "L" : "M") + X(p[1]).toFixed(1) + " " + Y(p[0]).toFixed(1)).join(" ");
function fit(pts) {
  const la = pts.map(p => p[0]), lo = pts.map(p => p[1]);
  const cy = (Math.min(...la) + Math.max(...la)) / 2, cx = (Math.min(...lo) + Math.max(...lo)) / 2;
  let latS = Math.max(Math.max(...la) - Math.min(...la), .008) * 1.45, lonS = Math.max(Math.max(...lo) - Math.min(...lo), .012) * 1.3;
  const wk = lonS * 74.2, hk = latS * 111, ar = W / H;
  if (wk / hk < ar) lonS = hk * ar / 74.2; else latS = wk / ar / 111;
  B = { lonMin: cx - lonS / 2, lonMax: cx + lonS / 2, latMin: cy - latS / 2, latMax: cy + latS / 2 };
}
function renderMap() {
  const d = DAYS[day];
  const stops = d.stops.filter(s => s.p);
  if (!stops.length) { $("#map").innerHTML = `<p class="map-empty">Este día no tiene paradas que pintar en el mapa.</p>`; $("#map-day").textContent = d.label; return; }
  fit(stops.map(s => [PLACES[s.p].lat, PLACES[s.p].lon]));
  const ring = [[48.2155, 16.3655], [48.2150, 16.3715], [48.2115, 16.3780], [48.2070, 16.3800], [48.2035, 16.3780], [48.2010, 16.3735], [48.2025, 16.3690], [48.2045, 16.3620], [48.2105, 16.3585], [48.2155, 16.3655]];
  const canal = [[48.2300, 16.3600], [48.2230, 16.3665], [48.2160, 16.3720], [48.2120, 16.3790], [48.2060, 16.3880], [48.1990, 16.3990], [48.1900, 16.4150], [48.1820, 16.4300]];
  const wien = [[48.1880, 16.2960], [48.1905, 16.3300], [48.1960, 16.3500], [48.1990, 16.3640], [48.2030, 16.3780], [48.2060, 16.3860]];
  const box = (a, b, c, e) => `M${X(b)} ${Y(a)} H${X(e)} V${Y(c)} H${X(b)}Z`;
  const pts = stops.map(s => { const P = PLACES[s.p]; return { x: X(P.lon), y: Y(P.lat), ox: X(P.lon), oy: Y(P.lat) }; });
  for (let it = 0; it < 60; it++) for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    let dx = pts[j].x - pts[i].x, dy = pts[j].y - pts[i].y, dist = Math.hypot(dx, dy);
    if (dist < 30) { if (dist < .01) { dx = 1; dy = -.6; dist = 1.17; } const push = (30 - dist) / 2; dx /= dist; dy /= dist;
      pts[i].x -= dx * push; pts[i].y -= dy * push; pts[j].x += dx * push; pts[j].y += dy * push; }
  }
  pts.forEach(p => { p.x = Math.min(W - 16, Math.max(16, p.x)); p.y = Math.min(H - 16, Math.max(16, p.y)); });
  const pins = stops.map((s, i) => {
    const p = pts[i], si = d.stops.indexOf(s);
    return `<g class="pin" data-si="${si}" tabindex="0" role="button" aria-label="${i + 1}. ${esc(s.title)}">
      ${Math.hypot(p.x - p.ox, p.y - p.oy) > 4 ? `<path d="M${p.ox} ${p.oy} L${p.x} ${p.y}" stroke="var(--ink)" stroke-width="1.2" opacity=".5"/>` : ""}
      <circle cx="${p.ox}" cy="${p.oy}" r="3" fill="var(--ink)"/>
      <circle cx="${p.x}" cy="${p.y}" r="13" fill="var(--ink)" stroke="var(--gold)" stroke-width="2"/>
      <text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="14" font-family="Jost,sans-serif" font-weight="600" fill="var(--bg)">${i + 1}</text></g>`;
  }).join("");
  const route = stops.length > 1 ? `<path class="route" d="${pts.map((p, i) => (i ? "L" : "M") + p.ox.toFixed(1) + " " + p.oy.toFixed(1)).join(" ")}"/>` : "";
  const label = (t, lat, lon, a = "middle") => `<text x="${X(lon)}" y="${Y(lat)}" text-anchor="${a}" font-size="13" font-family="Jost,sans-serif" fill="var(--muted)" font-style="italic">${t}</text>`;
  $("#map").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa ilustrado de Viena con las paradas del día">
    <rect width="${W}" height="${H}" fill="var(--surface)"/>
    <path d="${box(48.1870, 16.3020, 48.1780, 16.3190)}" fill="var(--green)" opacity=".2"/>
    <path d="${box(48.1972, 16.3790, 48.1908, 16.3845)}" fill="var(--green)" opacity=".2"/>
    <path d="${box(48.2068, 16.3765, 48.2020, 16.3835)}" fill="var(--green)" opacity=".2"/>
    <path d="${box(48.2062, 16.3645, 48.2038, 16.3680)}" fill="var(--green)" opacity=".2"/>
    <path d="${line(ring)}" fill="color-mix(in srgb,var(--gold) 9%,transparent)" stroke="var(--gold)" stroke-width="2.5" opacity=".85"/>
    <path d="${line(canal)}" fill="none" stroke="var(--art-water)" stroke-width="12" stroke-linecap="round" opacity=".7"/>
    <path d="${line(wien)}" fill="none" stroke="var(--art-water)" stroke-width="5" stroke-linecap="round" opacity=".55"/>
    ${label("Donaukanal", 48.2105, 16.3850, "start")}${label("Ring", 48.2130, 16.3600, "end")}
    ${label("Schönbrunn", 48.1765, 16.3105)}${label("Favoriten", 48.1720, 16.3840, "start")}${label("Erdberg", 48.1890, 16.4180)}${label("Centro", 48.2090, 16.3680)}
    ${route}${pins}
  </svg>`;
  $("#map-day").textContent = `${d.label}: ${stops.length === 1 ? "1 parada" : stops.length + " paradas"}. Toca un número para abrir su ficha.`;
}
$("#map").addEventListener("click", e => { const g = e.target.closest(".pin"); if (g) openSheet(day, +g.dataset.si); });
$("#map").addEventListener("keydown", e => { const g = e.target.closest(".pin"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openSheet(day, +g.dataset.si); } });

/* ---------- Pasaporte ---------- */
const PP = Object.keys(PLACES);
function stampSVG(k, on, big) {
  const P = PLACES[k], id = "arc-" + k + (big ? "-b" : "");
  const col = on ? "var(--crimson)" : "var(--line)";
  return `<svg viewBox="0 0 100 100" class="stamp" aria-hidden="true">
    <defs><path id="${id}" d="M50 50 m-34 0 a34 34 0 1 1 68 0 a34 34 0 1 1 -68 0"/></defs>
    <circle cx="50" cy="50" r="46" fill="none" stroke="${col}" stroke-width="3" ${on ? "" : 'stroke-dasharray="4 5"'}/>
    <circle cx="50" cy="50" r="27" fill="none" stroke="${col}" stroke-width="1.5"/>
    ${on ? `<text font-size="9.5" font-family="Jost,sans-serif" font-weight="600" letter-spacing="1" fill="${col}"><textPath href="#${id}">${esc(P.name.toUpperCase().slice(0, 26))} · WIEN 2026 ·</textPath></text>
    <text x="50" y="47" text-anchor="middle" font-family="'Poiret One',sans-serif" font-size="15" fill="${col}">Wien</text>
    <text x="50" y="62" text-anchor="middle" font-family="Jost,sans-serif" font-size="9" fill="${col}">${esc(stamps[k] || "")}</text>` :
    `<text x="50" y="55" text-anchor="middle" font-family="'Poiret One',sans-serif" font-size="14" fill="var(--muted)">?</text>`}
  </svg>`;
}
function renderPassport() {
  const n = PP.filter(k => stamps[k]).length;
  $("#pp-count").textContent = `${n}/${PP.length}`;
  $("#stamps").innerHTML = PP.map((k, i) => `<button class="stampslot ${stamps[k] ? "on" : ""}" data-k="${k}" style="--rot:${((i * 37) % 22) - 11}deg">
    ${stampSVG(k, !!stamps[k])}<span>${esc(PLACES[k].name)}</span></button>`).join("");
  $("#pp-done").classList.toggle("on", n === PP.length);
}
$("#stamps").addEventListener("click", e => {
  const b = e.target.closest(".stampslot"); if (!b) return;
  const k = b.dataset.k;
  for (let di = 0; di < DAYS.length; di++) { const si = DAYS[di].stops.findIndex(s => s.p === k); if (si > -1) return openSheet(di, si); }
});
$("#pp-reset").addEventListener("click", () => {
  if (!confirm("¿Borrar todos los sellos? Se borran en los dos móviles.")) return;
  Object.keys(stamps).forEach(k => kvDel("s:" + k)); derive(); renderPassport(); renderPlan(); toast("Pasaporte en blanco");
});

/* ---------- Ficha ---------- */
let current = null, askAbort = null;
function sentences(t) { return t.match(/[^.!?]+[.!?]+\s*/g) || [t]; }
function openSheet(di, si) {
  const s = DAYS[di].stops[si], k = s.p, P = PLACES[k];
  current = { di, si, k };
  let off = 0;
  const spans = sentences(P.audio).map(x => { const h = `<span data-a="${off}" data-b="${off + x.length}">${esc(x)}</span>`; off += x.length; return h; }).join("");
  $("#sheet-body").innerHTML = `
    <div id="art-slot">${artBlock(k)}</div>
    <p class="place-when">${esc(DAYS[di].label)}${s.t ? ", " + s.t : ""}</p>
    <h1 class="place-name" id="sheet-title">${esc(s.title)}</h1>
    <p class="note">${esc(P.name)}. ${esc(P.kind)}. ${esc(s.note)}</p>
    <div class="actions">
      <a class="btn gmaps" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(P.q)}">
        <svg viewBox="0 0 24 24" class="gm-ic"><path d="M12 22s-7-6.4-7-12a7 7 0 0 1 14 0c0 5.6-7 12-7 12z" fill="#EA4335" stroke="none"/><circle cx="12" cy="10" r="2.8" fill="#fff" stroke="none"/></svg>Abrir en Google Maps</a>
      ${s.link ? `<a class="btn" target="_blank" rel="noopener" href="${s.link[0]}"><svg viewBox="0 0 24 24"><path d="M4 8h16v10H4z M8 8V6h8v2"/></svg>${esc(s.link[1])}</a>` : ""}
      <button class="btn ${stamps[k] ? "stamped" : ""}" id="stamp-btn"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8.5 12.5l2.3 2.3 4.7-5"/></svg>${stamps[k] ? "Sellado" : "Sellar pasaporte"}</button>
    </div>
    <div id="msg-slot">${msgCard(k)}</div>
    <section class="guide" id="guide" aria-label="Audioguía">
      <div class="guide-head">
        <button class="play" id="play" aria-label="Escuchar la audioguía"><svg viewBox="0 0 24 24" id="play-ic"><path d="M8 5v14l11-7z"/></svg></button>
        <div><h4>Audioguía</h4><p>${Math.max(1, Math.round(P.audio.split(" ").length / 150))} min, en español</p></div>
        <div class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <p class="script" id="script">${spans}</p>
    </section>
    <h5>Curiosidades</h5>
    <ol class="facts">${P.facts.map(f => `<li>${esc(f)}</li>`).join("")}</ol>
    <h5>El secreto</h5>
    <div class="secret ${secrets[k] ? "revealed" : ""}" id="secret"><p class="secret-text">${esc(P.secret)}</p><canvas aria-label="Rasca para descubrir el secreto" role="img"></canvas></div>
    <div id="games-slot">${gamesSection(k)}</div>
    <div id="us-slot">${usBlock(k)}</div>
    <div class="ask" id="ask">
      <h5>Pregúntale al guía</h5>
      <form id="ask-form"><input id="ask-in" placeholder="¿Qué quieres saber de este sitio?" aria-label="Tu pregunta" autocomplete="off"><button class="btn primary" type="submit">Preguntar</button></form>
      <p class="ask-out" id="ask-out"></p>
    </div>`;
  $("#sheet").classList.add("on"); $("#sheet-bg").classList.add("on");
  $("#sheet").scrollTop = 0; document.body.style.overflow = "hidden";
  $("#sheet-close").focus({ preventScroll: true });
  if (!secrets[k]) setupScratch();
  if (sampleFn) $("#ask").classList.add("on");
  history.pushState({ sheet: 1 }, "");
}
function closeSheet(fromPop) {
  if (A) closeGame();
  if (!$("#sheet").classList.contains("on")) return;
  stopSpeech(); if (askAbort) askAbort.abort();
  $("#sheet").classList.remove("on"); $("#sheet-bg").classList.remove("on");
  document.body.style.overflow = ""; current = null;
  if (!fromPop && history.state && history.state.sheet) history.back();
  renderPlan(); idleReload();
}
$("#sheet-close").addEventListener("click", () => closeSheet());
$("#sheet-bg").addEventListener("click", () => closeSheet());
addEventListener("popstate", () => closeSheet(true));
addEventListener("keydown", e => { if (e.key === "Escape") { if ($("#modal").classList.contains("on")) closeModal(); else if (A) closeGame(); else closeSheet(); } });

$("#sheet-body").addEventListener("click", e => {
  const eb = e.target.closest("[data-era]");
  if (eb) {
    const era = eb.dataset.era, old = era === "old";
    $("#art").classList.toggle("old", old); $("#art").classList.toggle("us", era === "us");
    document.querySelectorAll("[data-era]").forEach(b => b.setAttribute("aria-pressed", String(b === eb)));
    const P = PLACES[current.k], cr = $("#credit");
    if (cr) cr.textContent = era === "us" ? `Vosotros en ${P.name}${stamps[current.k] ? ", " + stamps[current.k] : ""}` : P.photos ? ((old ? P.photos.old.credit : P.photos.now.credit) || "") : "";
  }
  if (e.target.closest("#play")) toggleSpeech();
  const gc = e.target.closest(".gcard"); if (gc) openGame(current.k, +gc.dataset.g);
  if (e.target.closest("#stamp-btn")) doStamp();
});

/* ---------- Sellos ---------- */
function doStamp() {
  const k = current.k, b = $("#stamp-btn");
  const had = !!stamps[k];
  if (had) { kvDel("s:" + k); derive(); b.classList.remove("stamped"); b.lastChild.textContent = "Sellar pasaporte"; toast("Sello quitado"); }
  else {
    const n = viennaNow(); kvSet("s:" + k, { d: n.date.slice(8, 10) + "." + n.date.slice(5, 7) + "." + n.date.slice(0, 4) }); derive();
    b.classList.add("stamped"); b.lastChild.textContent = "Sellado";
    const big = $("#big-stamp"); big.innerHTML = stampSVG(k, true, true); big.classList.remove("go"); void big.offsetWidth; big.classList.add("go");
    if (navigator.vibrate) try { navigator.vibrate([30, 40, 60]); } catch (e) {}
    const total = PP.filter(x => stamps[x]).length + 0;
    setTimeout(() => toast(total === PP.length ? "Pasaporte completo. Viena es vuestra." : `Sello ${total} de ${PP.length}`), 650);
  }
  renderPassport(); renderPlan();
  if (!had) onStamped(k);
}

/* ---------- Audioguía ---------- */
let speaking = false;
function stopSpeech() {
  speaking = false;
  try { speechSynthesis.cancel(); } catch (e) {}
  const g = $("#guide"); if (g) g.classList.remove("playing");
  const ic = $("#play-ic"); if (ic) ic.innerHTML = '<path d="M8 5v14l11-7z"/>';
  document.querySelectorAll("#script span.hl").forEach(s => s.classList.remove("hl"));
}
function pickVoice() {
  const vs = speechSynthesis.getVoices();
  return vs.find(v => v.lang === "es-ES" && /google|natural|premium|enhanced/i.test(v.name)) || vs.find(v => v.lang === "es-ES") || vs.find(v => /^es/i.test(v.lang));
}
function toggleSpeech() {
  if (!("speechSynthesis" in window)) { showWarn("Este navegador no puede leer en voz alta. Puedes leer la audioguía aquí debajo."); return; }
  if (speaking) { stopSpeech(); return; }
  const P = PLACES[current.k];
  const u = new SpeechSynthesisUtterance(P.audio);
  u.lang = "es-ES"; u.rate = .96; u.pitch = 1;
  const v = pickVoice(); if (v) u.voice = v;
  const spans = [...document.querySelectorAll("#script span")];
  const hl = i => spans.forEach(s => s.classList.toggle("hl", +s.dataset.a <= i && i < +s.dataset.b));
  u.onstart = () => hl(0);
  u.onboundary = e => { hl(e.charIndex); const on = spans.find(s => s.classList.contains("hl")); if (on && on.getBoundingClientRect().bottom > innerHeight - 40) on.scrollIntoView({ block: "center", behavior: "smooth" }); };
  u.onend = u.onerror = () => stopSpeech();
  speaking = true; $("#guide").classList.add("playing");
  $("#play-ic").innerHTML = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>';
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
function showWarn(t) { const g = $("#guide"); if (!g.querySelector(".warnmsg")) g.insertAdjacentHTML("beforeend", `<p class="warnmsg">${esc(t)}</p>`); }
try { speechSynthesis.onvoiceschanged = () => {}; speechSynthesis.getVoices(); } catch (e) {}

/* ---------- Rasca el secreto ---------- */
function setupScratch() {
  const box = $("#secret"), cv = box.querySelector("canvas"), ctx = cv.getContext("2d");
  const r = box.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.scale(dpr, dpr);
  const gr = ctx.createLinearGradient(0, 0, r.width, r.height);
  gr.addColorStop(0, "#9C7A22"); gr.addColorStop(.3, "#F1D98E"); gr.addColorStop(.55, "#B8912F"); gr.addColorStop(.8, "#EAD08A"); gr.addColorStop(1, "#8A6A1F");
  ctx.fillStyle = gr; ctx.fillRect(0, 0, r.width, r.height);
  ctx.globalAlpha = .18; ctx.fillStyle = "#3B2A05";
  for (let x = 0; x < r.width; x += 14) for (let y = 0; y < r.height; y += 14) if (((x + y) / 14) % 2 === 0) ctx.fillRect(x, y, 14, 14);
  ctx.globalAlpha = 1; ctx.fillStyle = "#2B2006"; ctx.textAlign = "center";
  ctx.font = "26px 'Poiret One', sans-serif"; ctx.fillText("Rasca con el dedo", r.width / 2, r.height / 2 - 4);
  ctx.font = "15px Jost, sans-serif"; ctx.fillText("Lo que casi nadie sabe de este sitio", r.width / 2, r.height / 2 + 22);
  ctx.globalCompositeOperation = "destination-out";
  let down = false, last = null, moves = 0;
  const pos = e => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const draw = p => { ctx.lineWidth = 42; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(...(last || p)); ctx.lineTo(...p); ctx.stroke(); last = p; };
  const check = () => {
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data; let clear = 0, tot = 0;
    for (let i = 3; i < d.length; i += 4 * 40) { tot++; if (d[i] === 0) clear++; }
    if (clear / tot > .5) reveal();
  };
  const reveal = () => { box.classList.add("revealed"); secrets[current.k] = 1; store.set("wien-secrets", secrets); if (navigator.vibrate) try { navigator.vibrate(40); } catch (e) {} };
  cv.addEventListener("pointerdown", e => { down = true; last = null; cv.setPointerCapture(e.pointerId); draw(pos(e)); });
  cv.addEventListener("pointermove", e => { if (!down) return; draw(pos(e)); if (++moves % 12 === 0) check(); });
  const up = () => { if (down) { down = false; check(); } };
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
  cv.addEventListener("keydown", e => { if (e.key === "Enter") reveal(); });
  cv.tabIndex = 0;
}

/* ---------- Pregúntale al guía (Claude) ---------- */
let sampleFn = null;
(async () => {
  try {
    if (!window.claude || !window.claude.use) return;
    const s = await window.claude.use("sample");
    if (s) { sampleFn = s; const a = $("#ask"); if (a) a.classList.add("on"); }
  } catch (e) {}
})();
$("#sheet-body").addEventListener("submit", async e => {
  if (e.target.id !== "ask-form") return;
  e.preventDefault();
  const q = $("#ask-in").value.trim(); if (!q || !sampleFn || !current) return;
  const P = PLACES[current.k], out = $("#ask-out");
  if (askAbort) askAbort.abort(); askAbort = new AbortController();
  out.className = "ask-out thinking"; out.textContent = "Pensando…";
  const prompt = `Eres un guía turístico de Viena, cercano y con gracia, que habla con una pareja española de viaje (del 9 al 12 de octubre de 2026). Responde en español de España, en 3 a 5 frases, sin listas ni formato markdown. Si no estás seguro de un dato concreto (horarios, precios), dilo y sugiere comprobarlo.\n\nLugar: ${P.name} (${P.kind}).\nContexto: ${P.audio}\n\nPregunta: ${q}`;
  try {
    const r = await sampleFn(prompt, { signal: askAbort.signal, modelTier: "quick", onText: ({ text }) => { out.className = "ask-out"; out.textContent = text; } });
    out.className = "ask-out"; out.textContent = r.text;
  } catch (err) {
    out.className = "ask-out";
    if (err && err.code === "cancelled") return;
    if (err && err.code === "not_granted") { out.textContent = "El guía no está disponible en esta cuenta."; $("#ask").classList.remove("on"); return; }
    out.textContent = err && err.code === "rate_limited" ? "El guía necesita un respiro. Prueba otra vez en un minuto." : "No he podido responder. Prueba otra vez.";
  }
});

/* ---------- Juegos ---------- */
const TYPES = {
  buzz: ["Duelo de pulsador", 2, "M13 2 4 14h7l-1 8 9-12h-7z"],
  guess: ["Apuesta secreta", 3, "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4v5l3 2"],
  hunt: ["Búsqueda en el sitio", 2, "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4-4"],
  mission: ["Reto", 2, "M5 21V4h11l-2 4 2 4H5"],
  order: ["Ordena la historia", 3, "M4 6h10M4 12h7M4 18h4M17 4v16m0 0-3-3m3 3 3-3"],
  zoom: ["Foto recortada", 2, "M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0"],
  sing: ["Canta la palabra", 1, "M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"]
};
const gid = (k, i) => k + "-" + i;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const nm = pl => esc(players[pl]);
function totals() { let k = 0, p = 0; for (const r of Object.values(results)) { k += r.k || 0; p += r.p || 0; } return { k, p }; }
function gamesOf(k) { return GAMES[k] || []; }
function playedOf(k) { return gamesOf(k).filter((g, i) => results[gid(k, i)]).length; }
const TAUNTS = {
  k: ["Pilu, esto no ha terminado.", "Kevin se viene arriba.", "Punto para el informático."],
  p: ["Kevin, tu reputación está en juego.", "La competitiva ataca de nuevo.", "Pilu no perdona."],
  t: ["Empate. Nadie cede.", "Tablas. La tensión sube."],
  n: ["Nadie puntúa. Viena gana esta ronda."]
};
const taunt = w => { const l = TAUNTS[w]; return l[Math.floor(Math.random() * l.length)]; };

function gamesSection(k) {
  const t = totals();
  return `<h5>Juegos</h5>
  <div class="mini-score"><span>${nm("k")} <b>${t.k}</b></span><span class="vs">contra</span><span><b>${t.p}</b> ${nm("p")}</span></div>
  <ul class="glist">${gamesOf(k).map((g, i) => {
    const r = results[gid(k, i)], T = TYPES[g.type];
    const res = r ? (r.w === "t" ? "Empate" : r.w === "n" ? "Nadie puntuó" : "Ganó " + nm(r.w)) : `Hasta ${g.type === "sing" ? 3 : g.type === "guess" ? 5 : T[1]} puntos`;
    return `<li><button class="gcard ${r ? "played" : ""}" data-g="${i}">
      <span class="gic"><svg viewBox="0 0 24 24"><path d="${T[2]}"/></svg></span>
      <span class="gtx"><span class="gtype">${T[0]}</span><span class="gtitle">${esc(g.title)}</span><span class="gres">${res}</span></span>
      <span class="gplay">${r ? "Repetir" : "Jugar"}</span></button></li>`;
  }).join("")}</ul>`;
}

/* Arena */
let A = null; // estado del juego abierto
let L = null; // partida en dos móviles: { sid, role: "host" | "guest", st: {...} }
const LIVE = { buzz: 1, guess: 1, hunt: 1, zoom: 1, order: 1 };
const LOCAL = { buzz: gBuzz, guess: gGuess, hunt: gHunt, mission: gMission, order: gOrder, sing: gSing, zoom: gZoom };
const pts2 = w => ({ k: w === "k" ? 2 : w === "t" ? 1 : 0, p: w === "p" ? 2 : w === "t" ? 1 : 0 });

function openGame(k, i, opt = {}) {
  stopSpeech(); hideInvite();
  if (A) { if (A.timer) clearInterval(A.timer); if (L) { if (!L.done) netSend("bye"); stopLive(); } }
  const g = gamesOf(k)[i];
  A = { k, i, g, id: gid(k, i) }; L = null; $("#arena").onclick = null;
  $("#arena").classList.add("on"); $("#arena").setAttribute("aria-hidden", "false"); $("#arena").scrollTop = 0;
  if (opt.guest) return liveGuest(opt.sid);
  if (LIVE[g.type] && peerOnline() && !opt.solo) return liveLobby();
  LOCAL[g.type]();
}
function closeGame() {
  if (A && A.timer) clearInterval(A.timer);
  if (L) { if (!L.done) netSend("bye"); stopLive(); }
  A = null; $("#arena").classList.remove("on"); $("#arena").setAttribute("aria-hidden", "true"); $("#arena").onclick = null;
  if (current) refreshSheet();
  renderScore(); renderPlan(); renderHero(); idleReload();
}
function arenaFrame(inner, cls = "") {
  const T = TYPES[A.g.type];
  $("#arena").innerHTML = `<div class="arena-in ${cls}">
    <div class="arena-bar"><button class="icon-btn" data-x aria-label="Cerrar juego"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    <span class="arena-type">${T[0]}${L ? " · dos móviles" : ""}</span></div>${inner}</div>`;
}
function finish(pts, w, extra = "", meta) {
  $("#arena").onclick = null; if (A.timer) clearInterval(A.timer);
  const prevBest = totals();
  const rec = { k: pts.k, p: pts.p, w, at: (meta && meta.at) || Date.now() };
  if (meta && meta.s != null) rec.s = meta.s;
  if (meta && meta.ex) rec.ex = meta.ex;
  kvSet("r:" + A.id, rec, meta && meta.at); derive(); A.fin = true;
  const t = totals();
  const head = w === "t" ? "Empate" : w === "n" ? "Nadie puntúa" : `Gana ${nm(w)}`;
  const line = `${pts.k ? `+${pts.k} ${nm("k")}` : ""}${pts.k && pts.p ? " · " : ""}${pts.p ? `+${pts.p} ${nm("p")}` : ""}`;
  const leader = t.k === t.p ? "Marcador igualado" : `Manda ${nm(t.k > t.p ? "k" : "p")}`;
  const flip = (prevBest.k > prevBest.p) !== (t.k > t.p) && t.k !== t.p && prevBest.k !== prevBest.p;
  const next = gamesOf(A.k).findIndex((g, j) => j !== A.i && !results[gid(A.k, j)]);
  $("#arena").innerHTML = `<div class="arena-in"><div class="arena-bar"><button class="icon-btn" data-x aria-label="Cerrar juego"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><span class="arena-type">Resultado</span></div>
    <div class="result">
      <p class="r-head ${w === "k" || w === "p" ? "win" : ""}">${head}</p>
      ${line ? `<p class="r-pts">${line}</p>` : ""}
      <p class="r-taunt">${taunt(w)}</p>
      ${extra}
      <div class="r-fact"><span>El datillo</span><p>${esc(A.g.fact)}</p></div>
      <div class="r-board"><span>${nm("k")} <b>${t.k}</b></span><span>${leader}${flip ? ". ¡Sorpasso!" : ""}</span><span><b>${t.p}</b> ${nm("p")}</span></div>
      <div class="r-actions">${next > -1 ? `<button class="btn primary" data-next="${next}">Siguiente juego</button>` : ""}<button class="btn" data-x>${current ? "Volver a la ficha" : "Cerrar"}</button></div>
    </div></div>`;
  $("#arena").scrollTop = 0;
  if (w === "k" || w === "p") confetti();
  if (navigator.vibrate) try { navigator.vibrate(w === "n" ? 30 : [40, 60, 90]); } catch (e) {}
  setTimeout(() => { const r = $("#zrev"); if (!r) return; r.querySelector(".zr-in").style.transform = "none"; setTimeout(() => r.classList.add("done"), 60); }, 450);
}

/* Trozos del resultado que comparten el modo de un móvil y el de dos */
const fmtN = n => Number(n).toLocaleString("es-ES");
const fmtT = s => s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${s % 60} s`;
function xGuess(ans, b) {
  const bar = pl => `<div class="gbar"><span>${nm(pl)}</span><b>${fmtN(b[pl])}</b><i style="--w:${Math.max(4, 100 - (Math.abs(b[pl] - ans) / Math.max(Math.abs(ans), 1)) * 100)}%"></i><em>${b[pl] === ans ? "¡Exacto! +2 extra" : "a " + fmtN(Math.abs(b[pl] - ans))}</em></div>`;
  return `<p class="r-sol">La respuesta: <b>${fmtN(ans)}</b> ${esc(A.g.unit || "")}</p>${bar("k")}${bar("p")}`;
}
function xTime(w, s) { return w !== "n" && s != null ? `<p class="r-sol">Tiempo: ${fmtT(s)}</p>` : ""; }
function xZoom(k) {
  const P = PLACES[k], Z = P.zoom; if (!Z || !P.photos) return "";
  const [x, y, rw, rh] = Z.rect, sc = Math.min(1 / rw, 1 / rh);
  const cl = v => Math.min(Math.max(v, 0), 1 - 1 / sc);
  const tx = cl(x + rw / 2 - 0.5 / sc), ty = cl(y + rh / 2 - 0.5 / sc);
  return `<div class="zrev" id="zrev"><div class="zr-in" style="transform:scale(${sc}) translate(${-tx * 100}%,${-ty * 100}%)">
      <img src="${P.photos.now.src}" alt="${esc(P.name)}, foto completa">
      <span class="zr-box" style="left:${x * 100}%;top:${y * 100}%;width:${rw * 100}%;height:${rh * 100}%"></span></div></div>
    <p class="zcap">${esc(P.photos.now.credit || "")}</p>`;
}
function xOrder(g, o, w) {
  const a = o.k, b = o.p;
  const tie = a.c === b.c && w !== "t" ? `<p class="pass-help">Empate en aciertos, así que gana el más rápido.</p>` : "";
  return `<p class="r-sol">${nm("k")}: ${a.c}/${g.items.length} en ${Number(a.t).toFixed(1)} s. ${nm("p")}: ${b.c}/${g.items.length} en ${Number(b.t).toFixed(1)} s.</p>${tie}
    <ol class="osol">${g.items.map(x => `<li><b>${x[1]}</b> ${esc(x[0])}</li>`).join("")}</ol>`;
}
function xBuzz(g, x) {
  if (x.sol) return `<p class="r-sol">La respuesta era: ${esc(g.opts[g.a])}</p>`;
  const one = pl => x.ms && x.ms[pl] != null ? `${nm(pl)}: ${(x.ms[pl] / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 })} s` : `${nm(pl)}: ${x.bad && x.bad[pl] ? "falló" : "no llegó"}`;
  return `<p class="r-sol">${one("k")} · ${one("p")}</p>`;
}
function liveExtra(x) {
  const g = A.g; x = x || {};
  if (g.type === "buzz") return xBuzz(g, x);
  if (g.type === "guess") return xGuess(x.ans, x.bets);
  if (g.type === "hunt") return xTime(x.w, x.s);
  if (g.type === "zoom") return xTime(x.w, x.s) + xZoom(A.k);
  if (g.type === "order") return xOrder(g, x.ord, x.w);
  return "";
}

/* ---------- Dos móviles: cada uno juega en el suyo ----------
   Quien abre el juego hace de anfitrión y decide el resultado; el otro móvil le manda sus jugadas. */
const peer = () => OTHER[me];
function netSend(t, d) { if (L) NET.send({ g: 1, sid: L.sid, f: me, dev: DEV, t, ...(d || {}) }); }
function later(fn, ms) { const id = setTimeout(fn, ms); if (L) L.ts.push(id); return id; }
function every(fn, ms) { const id = setInterval(fn, ms); if (L) L.is.push(id); return id; }
function stopLive() { if (!L) return; L.ts.forEach(clearTimeout); L.is.forEach(clearInterval); L = null; }
function newLive(sid, role) { L = { sid, role, st: { ans: {}, bets: {}, ord: {} }, ts: [], is: [], started: false, done: false, born: Date.now(), lost: 0 }; }
const num = v => +v || 0;
const okW = w => (w === "k" || w === "p" || w === "t") ? w : "n";
function waitBox(title, text, btn = "") {
  arenaFrame(`<p class="arena-title">${esc(A.g.title)}</p>
    <div class="pass wait"><p class="pass-who">${title}</p><p class="pass-help" id="wait-msg">${text}</p><div class="dots" aria-hidden="true"><i></i><i></i><i></i></div></div>${btn}`);
}

function liveLobby() {
  newLive(Math.random().toString(36).slice(2, 9), "host");
  waitBox("Cada uno en su móvil", `Avisando a ${nm(peer())}…`, `<button class="btn big-go" data-solo>Jugar los dos en este móvil</button>`);
  const inv = () => { if (L && !L.joined && !L.declined) netSend("inv", { k: A.k, i: A.i }); };
  inv(); every(inv, 2500);
  $("#arena").onclick = e => {
    if (!e.target.closest("[data-solo]")) return;
    netSend("bye"); stopLive(); $("#arena").onclick = null; LOCAL[A.g.type]();
  };
}
function lobbyMsg(t) { const m = $("#wait-msg"); if (m) m.textContent = t; }

/* Invitación en el otro móvil */
let invite = null, inviteT = null; const declined = {};
function onInvite(m) {
  const g = gamesOf(m.k)[m.i]; if (!g || !LIVE[g.type] || declined[m.sid]) return;
  if (L && L.role === "host" && !L.started) {
    // los dos han abierto un juego a la vez: manda el identificador menor
    if (A.k === m.k && A.i === m.i && m.sid < L.sid) { stopLive(); return openGame(m.k, m.i, { guest: true, sid: m.sid }); }
    if (A.k === m.k && A.i === m.i) return;
  }
  if (L && L.sid === m.sid) return;
  if (A && !A.fin && !(L && L.role === "host" && !L.started)) { NET.send({ g: 1, sid: m.sid, f: me, dev: DEV, t: "busy" }); return; }
  clearTimeout(inviteT); inviteT = setTimeout(hideInvite, 6500);
  if (invite && invite.sid === m.sid) return;
  invite = { sid: m.sid, k: m.k, i: m.i };
  const el = $("#invite");
  el.innerHTML = `<div class="inv-in"><p class="inv-who">${nm(peer())} te reta</p>
    <p class="inv-what">${TYPES[g.type][0]} · ${esc(g.title)}</p><p class="inv-where">${esc(PLACES[m.k].name)}</p>
    <div class="row2"><button class="btn ghost" data-inv="no">Ahora no</button><button class="btn primary" data-inv="yes">¡Voy!</button></div></div>`;
  el.classList.add("on");
  if (navigator.vibrate) try { navigator.vibrate([60, 50, 60]); } catch (e) {}
}
function hideInvite(sid) {
  if (sid && (!invite || invite.sid !== sid)) return;
  clearTimeout(inviteT); invite = null; $("#invite").classList.remove("on");
}
$("#invite").addEventListener("click", e => {
  const b = e.target.closest("[data-inv]"); if (!b || !invite) return;
  const v = invite;
  if (b.dataset.inv === "yes") openGame(v.k, v.i, { guest: true, sid: v.sid });
  else { declined[v.sid] = 1; NET.send({ g: 1, sid: v.sid, f: me, dev: DEV, t: "no" }); hideInvite(); }
});

function liveGuest(sid) {
  newLive(sid, "guest");
  waitBox(`Conectando con ${nm(peer())}`, "Un segundo…");
  netSend("join");
  let n = 0;
  every(() => {
    if (!L || L.done) return;
    if (!L.started) { if (++n > 4) return liveFail("No llega respuesta del otro móvil."); netSend("join"); return; }
    if (L.pending) netSend(L.pending.t, L.pending.d);
    netSend("q");
  }, 2500);
}
function liveFail(text) {
  if (!L) return;
  const host = L.role === "host", started = L.started;
  stopLive();
  if (!A || A.fin) return;
  if (A.timer) clearInterval(A.timer);
  arenaFrame(`<p class="arena-title">${esc(A.g.title)}</p>
    <div class="pass"><p class="pass-who">Partida cortada</p><p class="pass-help">${esc(text)}</p></div>
    <button class="btn primary big-go" data-solo>Jugar los dos en este móvil</button><button class="btn ghost" data-x>Cerrar</button>`);
  $("#arena").onclick = e => { if (e.target.closest("[data-solo]")) { $("#arena").onclick = null; LOCAL[A.g.type](); } };
}
/* Si el otro móvil desaparece en mitad de una partida, no nos quedamos esperando.
   En las búsquedas no se corta: es normal guardar el móvil mientras se busca. */
function liveWatch() {
  if (!L || L.done) return;
  if (peerOnline()) { L.lost = 0; return; }
  if (L.role === "host" && !L.joined) return lobbyMsg(`${players[peer()]} no está conectado ahora mismo.`);
  if (L.started && (A.g.type === "hunt" || A.g.type === "zoom")) return;
  L.lost = L.lost || Date.now();
  if (Date.now() - L.lost > 10000) liveFail(`Se ha perdido la conexión con ${players[peer()]}.`);
}

function onLiveMsg(m) {
  if (m.t === "inv") return onInvite(m);
  if (!L || m.sid !== L.sid) { if (m.t === "bye") hideInvite(m.sid); return; }
  if (L.role === "host") {
    if (m.t === "join") {
      if (!L.joined) { L.joined = true; L.go = liveParams(); lobbyMsg(`${players[peer()]} se ha unido.`); $("#arena").onclick = null; }
      netSend("go", { P: L.go });
    } else if (m.t === "no") { L.declined = true; lobbyMsg(`${players[peer()]} ahora no puede. Podéis jugar en este móvil.`); }
    else if (m.t === "res") guestRes(m);
    else if (m.t === "busy") lobbyMsg(`${players[peer()]} está en mitad de otro juego.`);
    else if (m.t === "rdy") { if (!L.started) liveStart(L.go); }
    else if (m.t === "q") { if (L.done && L.res) netSend("res", L.res); else if (L.phase) netSend("st", { ph: L.phase }); }
    else if (m.t === "bye") liveFail(`${players[peer()]} ha cerrado el juego.`);
    else { netSend("ack", { a: m.t }); if (L.started && !L.done) hostOn(m.f, m.t, m); }
  } else {
    if (m.t === "go") { L.go = m.P || {}; netSend("rdy"); if (!L.started) liveStart(L.go); }
    else if (m.t === "ack") { if (L.pending && L.pending.t === m.a) L.pending = null; }
    else if (m.t === "st") guestPhase(m.ph);
    else if (m.t === "res") guestRes(m);
    else if (m.t === "bye") liveFail(`${players[peer()]} ha cerrado el juego.`);
  }
}
function guestRes(m) {
  if (!L || L.done || !m.pts) return;
  L.done = true; L.pending = null;
  const w = okW(m.w), mt = m.meta || {};
  finish({ k: num(m.pts.k), p: num(m.pts.p) }, w, liveExtra({ ...(m.x || {}), w }), { at: num(mt.at) || Date.now(), s: mt.s != null ? num(mt.s) : null, ex: okW(mt.ex) === "n" ? null : mt.ex });
}
/* Mi jugada: el anfitrión la procesa directamente; el invitado se la manda y la repite hasta que llegue */
function play(t, d) {
  if (!L || L.done) return;
  if (L.role === "host") hostOn(me, t, d || {});
  else { L.pending = { t, d: d || {} }; netSend(t, d); }
}
function liveFinish(pts, w, x, meta) {
  if (!L || L.done) return;
  L.done = true;
  x = { ...(x || {}), w }; meta = { ...(meta || {}), at: Date.now() };
  L.res = { pts, w, x, meta };
  netSend("res", L.res);
  finish(pts, w, liveExtra(x), meta);
}
function liveParams() {
  const g = A.g;
  if (g.type === "buzz") return { ord: shuffle(g.opts.map((o, i) => i)) };
  if (g.type === "hunt") return { target: g.targets ? g.targets[Math.floor(Math.random() * g.targets.length)] : "" };
  return {};
}
function liveStart(P) {
  L.started = true; $("#arena").onclick = null;
  const run = { buzz: lvBuzz, guess: lvGuess, hunt: lvFind, zoom: lvFind, order: lvOrder }[A.g.type];
  if (A.g.type === "guess" || A.g.type === "order") return run(P);
  let n = 3;
  const tick = () => {
    if (!L) return;
    if (n === 0) return run(P);
    arenaFrame(`<p class="arena-title">${esc(A.g.title)}</p><p class="count" aria-live="assertive">${n}</p><p class="arena-help center">Preparados los dos…</p>`);
    n--; later(tick, 700);
  };
  tick();
}
function hostOn(from, t, d) {
  const S = L.st, type = A.g.type;
  if (type === "buzz" && t === "ans") { if (!S.ans[from]) { S.ans[from] = { ok: !!d.ok, ms: num(d.ms) }; decideBuzz(); } }
  else if (type === "guess" && t === "bet") { if (S.bets[from] == null && isFinite(+d.v)) { S.bets[from] = +d.v; guessStep(); } }
  else if (type === "guess" && t === "real") { if (L.phase === "real" && isFinite(+d.v)) guessReveal(+d.v); }
  else if ((type === "hunt" || type === "zoom") && t === "found") liveFinish(pts2(from), from, { s: num(d.s) }, { s: num(d.s) });
  else if ((type === "hunt" || type === "zoom") && t === "giveup") liveFinish(pts2("n"), "n", {});
  else if (type === "order" && t === "ord") { if (!S.ord[from]) { S.ord[from] = { c: num(d.c), t: num(d.s) }; orderStep(); } }
}
function guestPhase(ph) {
  if (!L || L.done || L.phase === ph) return;
  L.phase = ph;
  if (A.g.type === "guess" && ph === "real") guessRealForm();
}

/* Pulsador: cada uno contesta en su móvil y gana quien acierta en menos tiempo */
function lvBuzz(P) {
  const g = A.g, t0 = performance.now(); let mine = false;
  L.elapsed = () => performance.now() - t0;
  const ord = (P.ord && P.ord.length === g.opts.length) ? P.ord : g.opts.map((o, i) => i);
  arenaFrame(`<p class="arena-title">${esc(g.title)}</p>
    <p class="arena-help">Cada uno en su móvil. Quien acierte en menos tiempo se lleva ${TYPES.buzz[1]} puntos. Si fallas, quedas bloqueado.</p>
    <div class="half solo h-${me}"><p class="h-who">${nm(me)}</p><p class="h-q">${esc(g.q)}</p>
      <div class="h-opts">${ord.map(i => `<button class="h-opt" data-o="${i}">${esc(g.opts[i])}</button>`).join("")}</div>
      <p class="h-msg" aria-live="polite"></p></div>`, "is-buzz");
  $("#arena .h-opts").addEventListener("click", e => {
    const b = e.target.closest(".h-opt"); if (!b || mine || !L || L.done) return;
    mine = true;
    const ok = +b.dataset.o === g.a, ms = Math.round(performance.now() - t0);
    b.classList.add(ok ? "right" : "wrong");
    $("#arena .h-msg").textContent = ok ? "¡Correcto! Comprobando quién ha sido más rápido…" : `Fallo. Bloqueado. A ver qué hace ${players[peer()]}…`;
    if (!ok) { $("#arena .half").classList.add("locked"); if (navigator.vibrate) try { navigator.vibrate(120); } catch (e) {} }
    play("ans", { ok: ok ? 1 : 0, ms });
  });
}
function decideBuzz() {
  const S = L.st, a = S.ans; clearTimeout(S.tm);
  const end = w => {
    const ms = {}, bad = {};
    ["k", "p"].forEach(pl => { if (a[pl] && a[pl].ok) ms[pl] = a[pl].ms; else if (a[pl]) bad[pl] = 1; });
    liveFinish(pts2(w), w, w === "n" ? { sol: 1 } : { ms, bad });
  };
  if (a.k && a.p) {
    if (a.k.ok && a.p.ok) return end(a.k.ms === a.p.ms ? "t" : a.k.ms < a.p.ms ? "k" : "p");
    return end(a.k.ok ? "k" : a.p.ok ? "p" : "n");
  }
  const one = a.k ? "k" : a.p ? "p" : null;
  if (!one || !a[one].ok) return; // nadie ha acertado todavía: seguimos
  // Uno ha acertado y el otro aún no ha contestado. Si acertó el anfitrión, damos un margen por si
  // la jugada del invitado viene de camino; si acertó el invitado, el anfitrión tiene hasta ese mismo tiempo.
  const wait = one === me ? 1300 : Math.max(0, a[one].ms - (L.elapsed ? L.elapsed() : 0));
  S.tm = later(() => { if (L && !L.done && !L.st.ans[OTHER[one]]) end(one); }, wait);
}

/* Apuesta secreta: cada uno escribe la suya en su móvil */
function lvGuess() {
  const g = A.g; L.phase = "bet";
  arenaFrame(`<p class="arena-title">${esc(g.title)}</p><p class="arena-q">${esc(g.q)}</p>
    <div class="pass"><p class="pass-who">Tu apuesta, ${nm(me)}</p><p class="pass-help">${nm(peer())} escribe la suya en su móvil. Nadie ve la del otro hasta el final.</p>
    <form class="bet"><input type="text" inputmode="decimal" autocomplete="off" aria-label="Tu número" placeholder="Tu número" required>
    <button class="btn primary" type="submit">Guardar en secreto</button></form></div>`);
  const f = $("#arena form"), inp = f.querySelector("input"); setTimeout(() => inp.focus(), 50);
  f.addEventListener("submit", e => {
    e.preventDefault(); const v = parseFloat(inp.value.replace(",", ".")); if (isNaN(v) || !L) return;
    L.mine = v; inp.blur();
    waitBox("Apuesta guardada", `Esperando la de ${nm(peer())}…`);
    play("bet", { v });
  });
}
function guessStep() {
  const S = L.st, g = A.g;
  if (S.bets.k == null || S.bets.p == null) return;
  if (g.onsite) { L.phase = "real"; netSend("st", { ph: "real" }); guessRealForm(); } else guessReveal(g.answer);
}
function guessRealForm() {
  arenaFrame(`<p class="arena-title">${esc(A.g.title)}</p><div class="pass"><p class="pass-who">Apuestas guardadas</p>
    <p class="pass-help">Ahora contad juntos en el sitio. Que uno de los dos escriba la cifra real.</p>
    <form class="bet"><input type="number" inputmode="numeric" aria-label="Cifra real" placeholder="Cifra real" required><button class="btn primary" type="submit">Ver quién gana</button></form></div>`);
  const f = $("#arena form");
  f.addEventListener("submit", e => {
    e.preventDefault(); const v = parseFloat(f.querySelector("input").value); if (isNaN(v) || !L) return;
    if (L.role !== "host") waitBox("Cifra enviada", "Calculando…");
    play("real", { v });
  });
}
function guessReveal(ans) {
  const b = L.st.bets, dk = Math.abs(b.k - ans), dp = Math.abs(b.p - ans);
  const w = dk < dp ? "k" : dp < dk ? "p" : "t", pts = { k: 0, p: 0 };
  if (w === "t") pts.k = pts.p = 3; else pts[w] = 3;
  if (dk === 0) pts.k += 2; if (dp === 0) pts.p += 2;
  liveFinish(pts, w, { ans, bets: { k: b.k, p: b.p } }, { ex: dk === 0 && dp === 0 ? "t" : dk === 0 ? "k" : dp === 0 ? "p" : null });
}

/* Búsqueda y foto recortada: mismo objetivo en los dos móviles, gana quien pulse primero */
function lvFind(P) {
  const g = A.g, zoom = g.type === "zoom", PL = PLACES[A.k], Z = PL.zoom; let hint = false; const t0 = Date.now();
  const secs = () => Math.floor((Date.now() - t0) / 1000);
  const draw = () => {
    arenaFrame(`<p class="arena-title">${esc(g.title)}</p>
      ${zoom && Z ? `<div class="zcrop"><img src="${Z.src}" alt="Trozo ampliado de una foto de ${esc(PL.name)}"></div>
        ${g.hint ? (hint ? `<p class="zhint"><b>Pista:</b> ${esc(g.hint)}</p>` : `<button class="btn" data-hint>Ver pista</button>`) : ""}` :
        `<p class="arena-q">${esc(g.q)}</p>${P.target ? `<p class="target">${esc(P.target)}</p>` : ""}`}
      <p class="clock" id="clock">0:00</p>
      <button class="found-btn wide f-${me}" data-found>¡Lo he encontrado!</button>
      <button class="btn ghost" data-giveup>Nadie, nos rendimos</button>`);
    paint();
  };
  const paint = () => { const s = secs(), c = $("#clock"); if (c) c.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  draw(); every(paint, 250);
  $("#arena").onclick = e => {
    if (!L || L.done) return;
    if (e.target.closest("[data-hint]")) { hint = true; return draw(); }
    const found = e.target.closest("[data-found]"), up = e.target.closest("[data-giveup]");
    if (!found && !up) return;
    const s = secs(), w = found ? me : "n";
    if (L.role !== "host") {
      waitBox(found ? "¡Cantado!" : "Rendición", "Confirmando…");
      // si el otro móvil está guardado en un bolsillo y no contesta, lo damos por bueno aquí
      later(() => { if (L && !L.done) liveFinish(pts2(w), w, found ? { s } : {}, found ? { s } : null); }, 5000);
    }
    play(found ? "found" : "giveup", found ? { s } : {});
  };
}

/* Ordena la historia: los dos a la vez, cada uno en su móvil */
function lvOrder() {
  const g = A.g;
  const items = shuffle(g.items.map((x, i) => i)); let picked = []; const t0 = Date.now();
  const draw = () => {
    arenaFrame(`<p class="arena-title">${esc(g.title)}</p><div class="pass"><p class="pass-who">Tu turno, ${nm(me)}</p>
      <p class="pass-help">${nm(peer())} juega a la vez en su móvil. Toca del más antiguo al más reciente. Si empatáis en aciertos, gana el más rápido.</p></div>
      <div class="olist">${items.map(i => { const n = picked.indexOf(i); return `<button class="oitem ${n > -1 ? "on" : ""}" data-i="${i}"><span class="onum">${n > -1 ? n + 1 : ""}</span>${esc(g.items[i][0])}</button>`; }).join("")}</div>
      <div class="row2"><button class="btn ghost" data-undo ${picked.length ? "" : "disabled"}>Deshacer</button>
      <button class="btn primary" data-done ${picked.length === items.length ? "" : "disabled"}>Listo</button></div>`);
  };
  draw();
  $("#arena").onclick = e => {
    if (!L || L.done) return;
    const it = e.target.closest(".oitem");
    if (it && picked.indexOf(+it.dataset.i) < 0) { picked.push(+it.dataset.i); draw(); }
    if (e.target.closest("[data-undo]")) { picked.pop(); draw(); }
    if (e.target.closest("[data-done]") && picked.length === items.length) {
      $("#arena").onclick = null;
      const c = picked.filter((v, idx) => v === idx).length, t = (Date.now() - t0) / 1000;
      waitBox("Orden guardado", `Esperando a ${nm(peer())}…`);
      play("ord", { c, s: t });
    }
  };
}
function orderStep() {
  const o = L.st.ord, a = o.k, b = o.p; if (!a || !b) return;
  const w = a.c > b.c ? "k" : b.c > a.c ? "p" : a.t < b.t ? "k" : b.t < a.t ? "p" : "t";
  const pts = { k: 0, p: 0 }; if (w === "t") pts.k = pts.p = 2; else pts[w] = 3;
  liveFinish(pts, w, { ord: { k: a, p: b } });
}

$("#arena").addEventListener("click", e => {
  if (e.target.closest("[data-x]")) return closeGame();
  const nx = e.target.closest("[data-next]");
  if (nx && A) { const k = A.k; if (A.timer) clearInterval(A.timer); openGame(k, +nx.dataset.next); }
});

/* Duelo de pulsador: pantalla dividida, el móvil entre los dos */
function gBuzz() {
  const g = A.g, order = shuffle(g.opts.map((o, i) => i));
  A.locked = { k: false, p: false }; A.done = false;
  const half = pl => `<div class="half h-${pl}" data-pl="${pl}">
    <p class="h-who">${nm(pl)}</p><p class="h-q">${esc(g.q)}</p>
    <div class="h-opts">${order.map(i => `<button class="h-opt" data-o="${i}">${esc(g.opts[i])}</button>`).join("")}</div>
    <p class="h-msg" aria-live="polite"></p></div>`;
  arenaFrame(`<p class="arena-title">${esc(g.title)}</p>
    <p class="arena-help">Dejad el móvil entre los dos. El primero que acierte se lleva ${TYPES.buzz[1]} puntos. Si fallas, quedas bloqueado.</p>
    <div class="duel">${half("p")}<div class="duel-mid">VS</div>${half("k")}</div>`, "is-buzz");
  $("#arena .duel").addEventListener("click", e => {
    const b = e.target.closest(".h-opt"); if (!b || A.done) return;
    const pl = b.closest(".half").dataset.pl; if (A.locked[pl]) return;
    const o = +b.dataset.o;
    if (o === g.a) {
      A.done = true; b.classList.add("right");
      document.querySelectorAll(`.half[data-pl="${OTHER[pl]}"] .h-opt[data-o="${o}"]`).forEach(x => x.classList.add("right"));
      $(`.half[data-pl="${pl}"] .h-msg`).textContent = "¡Correcto!";
      $(`.half[data-pl="${OTHER[pl]}"] .h-msg`).textContent = `${players[pl]} ha sido más rápido`;
      setTimeout(() => finish({ k: pl === "k" ? 2 : 0, p: pl === "p" ? 2 : 0 }, pl), 1100);
    } else {
      b.classList.add("wrong"); A.locked[pl] = true;
      $(`.half[data-pl="${pl}"]`).classList.add("locked");
      $(`.half[data-pl="${pl}"] .h-msg`).textContent = "Fallo. Bloqueado.";
      if (navigator.vibrate) try { navigator.vibrate(120); } catch (e) {}
      if (A.locked.k && A.locked.p) {
        A.done = true;
        document.querySelectorAll(`.h-opt[data-o="${g.a}"]`).forEach(x => x.classList.add("right"));
        setTimeout(() => finish({ k: 0, p: 0 }, "n", `<p class="r-sol">La respuesta era: ${esc(g.opts[g.a])}</p>`), 1300);
      }
    }
  });
}

/* Apuesta secreta: cada uno escribe su número a escondidas */
function gGuess() {
  const g = A.g; A.bets = {};
  const step = pl => {
    arenaFrame(`<p class="arena-title">${esc(g.title)}</p><p class="arena-q">${esc(g.q)}</p>
      <div class="pass"><p class="pass-who">Turno de ${nm(pl)}</p><p class="pass-help">${nm(OTHER[pl])}, no mires.</p>
      <form class="bet"><input type="password" inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-label="Tu número" placeholder="Tu número" required>
      <button class="btn primary" type="submit">Guardar en secreto</button></form></div>`);
    const f = $("#arena form"); const inp = f.querySelector("input"); setTimeout(() => inp.focus(), 50);
    f.addEventListener("submit", e => {
      e.preventDefault(); const v = parseFloat(inp.value.replace(",", ".")); if (isNaN(v)) return;
      A.bets[pl] = v;
      if (pl === "p") step("k"); else if (g.onsite) real(); else reveal(g.answer);
    });
  };
  const real = () => {
    arenaFrame(`<p class="arena-title">${esc(g.title)}</p><div class="pass"><p class="pass-who">Apuestas guardadas</p>
      <p class="pass-help">Ahora contad juntos en el sitio. ¿Cuál es la cifra real?</p>
      <form class="bet"><input type="number" inputmode="numeric" aria-label="Cifra real" placeholder="Cifra real" required><button class="btn primary" type="submit">Ver quién gana</button></form></div>`);
    const f = $("#arena form");
    f.addEventListener("submit", e => { e.preventDefault(); const v = parseFloat(f.querySelector("input").value); if (!isNaN(v)) reveal(v); });
  };
  const reveal = ans => {
    const dk = Math.abs(A.bets.k - ans), dp = Math.abs(A.bets.p - ans);
    let w = dk < dp ? "k" : dp < dk ? "p" : "t";
    const pts = { k: 0, p: 0 };
    if (w === "t") { pts.k = pts.p = 3; } else pts[w] = 3;
    if (dk === 0) pts.k += 2; if (dp === 0) pts.p += 2;
    finish(pts, w, xGuess(ans, A.bets), { ex: dk === 0 && dp === 0 ? "t" : dk === 0 ? "k" : dp === 0 ? "p" : null });
  };
  step("p");
}

/* Búsqueda en el sitio */
function gHunt() {
  const g = A.g;
  const pick = () => g.targets ? g.targets[Math.floor(Math.random() * g.targets.length)] : "";
  A.target = pick();
  const draw = () => {
    arenaFrame(`<p class="arena-title">${esc(g.title)}</p><p class="arena-q">${esc(g.q)}</p>
      ${A.target ? `<p class="target">${esc(A.target)}</p><button class="btn" data-reroll>Otro objetivo</button>` : ""}
      <button class="btn primary big-go" data-go>Empezar la búsqueda</button>`);
  };
  draw();
  $("#arena").onclick = e => {
    if (e.target.closest("[data-reroll]")) { let t; do t = pick(); while (t === A.target && g.targets.length > 1); A.target = t; draw(); }
    if (e.target.closest("[data-go]")) run();
  };
  const run = () => {
    const t0 = Date.now();
    arenaFrame(`<p class="arena-title">${esc(g.title)}</p>${A.target ? `<p class="target">${esc(A.target)}</p>` : `<p class="arena-q">${esc(g.q)}</p>`}
      <p class="clock" id="clock">0:00</p>
      <div class="found"><button class="found-btn f-p" data-f="p">¡Lo encontró ${nm("p")}!</button><button class="found-btn f-k" data-f="k">¡Lo encontró ${nm("k")}!</button></div>
      <button class="btn ghost" data-f="n">Nadie, nos rendimos</button>`);
    A.timer = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000), c = $("#clock"); if (c) c.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }, 250);
    $("#arena").onclick = e => {
      const f = e.target.closest("[data-f]"); if (!f) return;
      clearInterval(A.timer); $("#arena").onclick = null;
      const w = f.dataset.f, s = Math.floor((Date.now() - t0) / 1000);
      finish(pts2(w), w, xTime(w, s), w !== "n" ? { s } : null);
    };
  };
}

/* Foto recortada: trozo ampliado de la foto real; al final, la foto completa */
function gZoom() {
  const g = A.g, P = PLACES[A.k], Z = P.zoom;
  if (!Z || !P.photos) { arenaFrame(`<p class="arena-title">${esc(g.title)}</p><p class="arena-q">Este sitio aún no tiene foto.</p>`); return; }
  let hint = false;
  const draw = () => {
    arenaFrame(`<p class="arena-title">${esc(g.title)}</p><p class="arena-q">${esc(g.q)}</p>
      <div class="zcrop"><img src="${Z.src}" alt="Trozo ampliado de una foto de ${esc(P.name)}"></div>
      ${g.hint ? (hint ? `<p class="zhint"><b>Pista:</b> ${esc(g.hint)}</p>` : `<button class="btn" data-hint>Ver pista</button>`) : ""}
      <button class="btn primary big-go" data-go>Empezar la búsqueda</button>`);
  };
  draw();
  $("#arena").onclick = e => {
    if (e.target.closest("[data-hint]")) { hint = true; draw(); }
    if (e.target.closest("[data-go]")) run();
  };
  const run = () => {
    const t0 = Date.now();
    arenaFrame(`<p class="arena-title">${esc(g.title)}</p>
      <div class="zcrop"><img src="${Z.src}" alt="Trozo ampliado de una foto de ${esc(P.name)}"></div>
      ${hint ? `<p class="zhint"><b>Pista:</b> ${esc(g.hint)}</p>` : ""}
      <p class="clock" id="clock">0:00</p>
      <div class="found"><button class="found-btn f-p" data-f="p">¡Lo encontró ${nm("p")}!</button><button class="found-btn f-k" data-f="k">¡Lo encontró ${nm("k")}!</button></div>
      <button class="btn ghost" data-f="n">Nadie, nos rendimos</button>`);
    A.timer = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000), c = $("#clock"); if (c) c.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }, 250);
    $("#arena").onclick = e => {
      const f = e.target.closest("[data-f]"); if (!f) return;
      clearInterval(A.timer); $("#arena").onclick = null;
      const w = f.dataset.f, s = Math.floor((Date.now() - t0) / 1000);
      finish(pts2(w), w, xTime(w, s) + xZoom(A.k), w !== "n" ? { s } : null);
    };
  };
}

/* Reto con juez */
function gMission() {
  const g = A.g;
  arenaFrame(`<p class="arena-title">${esc(g.title)}</p><p class="arena-q big">${esc(g.q)}</p>
    <p class="pass-help">Cuando terminéis, marcad quién ha ganado.</p>
    <div class="found"><button class="found-btn f-p" data-m="p">Gana ${nm("p")}</button><button class="found-btn f-k" data-m="k">Gana ${nm("k")}</button></div>
    <div class="row2"><button class="btn" data-m="t">Empate</button><button class="btn ghost" data-m="n">Nadie</button></div>`);
  $("#arena").onclick = e => {
    const m = e.target.closest("[data-m]"); if (!m) return; $("#arena").onclick = null;
    const w = m.dataset.m;
    finish({ k: w === "k" ? 2 : w === "t" ? 1 : 0, p: w === "p" ? 2 : w === "t" ? 1 : 0 }, w);
  };
}

/* Ordena la historia */
function gOrder() {
  const g = A.g; A.ord = {};
  const turn = pl => {
    const items = shuffle(g.items.map((x, i) => i)); let picked = []; const t0 = Date.now();
    const draw = () => {
      arenaFrame(`<p class="arena-title">${esc(g.title)}</p><div class="pass"><p class="pass-who">Turno de ${nm(pl)}</p>
        <p class="pass-help">${pl === "p" ? nm("k") + ", no mires." : "Sin mirar lo que hizo " + nm("p") + "."} Toca del más antiguo al más reciente.</p></div>
        <div class="olist">${items.map(i => { const n = picked.indexOf(i); return `<button class="oitem ${n > -1 ? "on" : ""}" data-i="${i}"><span class="onum">${n > -1 ? n + 1 : ""}</span>${esc(g.items[i][0])}</button>`; }).join("")}</div>
        <div class="row2"><button class="btn ghost" data-undo ${picked.length ? "" : "disabled"}>Deshacer</button>
        <button class="btn primary" data-done ${picked.length === items.length ? "" : "disabled"}>Listo</button></div>`);
    };
    draw();
    $("#arena").onclick = e => {
      const it = e.target.closest(".oitem");
      if (it && picked.indexOf(+it.dataset.i) < 0) { picked.push(+it.dataset.i); draw(); }
      if (e.target.closest("[data-undo]")) { picked.pop(); draw(); }
      if (e.target.closest("[data-done]") && picked.length === items.length) {
        const correct = picked.filter((v, idx) => v === idx).length;
        A.ord[pl] = { c: correct, t: (Date.now() - t0) / 1000 };
        $("#arena").onclick = null;
        if (pl === "p") turn("k"); else end();
      }
    };
  };
  const end = () => {
    const a = A.ord.k, b = A.ord.p;
    let w = a.c > b.c ? "k" : b.c > a.c ? "p" : a.t < b.t ? "k" : b.t < a.t ? "p" : "t";
    const pts = { k: 0, p: 0 }; if (w === "t") pts.k = pts.p = 2; else pts[w] = 3;
    finish(pts, w, xOrder(g, A.ord, w));
  };
  turn("p");
}

/* Canta la palabra */
function gSing() {
  const g = A.g, words = shuffle(g.words); let round = 0; const pts = { k: 0, p: 0 }; const ROUNDS = 6;
  const draw = () => {
    if (round >= ROUNDS) {
      const w = pts.k > pts.p ? "k" : pts.p > pts.k ? "p" : "t";
      return finish({ ...pts }, pts.k + pts.p === 0 ? "n" : w, `<p class="r-sol">${nm("k")} ${pts.k} de 3 · ${nm("p")} ${pts.p} de 3</p>`);
    }
    const pl = round % 2 === 0 ? "p" : "k";
    arenaFrame(`<p class="arena-title">Ronda ${round + 1} de ${ROUNDS}</p><div class="pass"><p class="pass-who">Canta ${nm(pl)}</p></div>
      <p class="sing-word">${esc(words[round])}</p>
      <div class="ring" id="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg" id="ring-fg"/></svg><span id="ring-n">10</span></div>
      <button class="btn primary big-go" data-start>¡Ya!</button>
      <div class="found" hidden id="sing-judge"><button class="found-btn f-ok" data-s="1">¡Lo ha cantado!</button><button class="found-btn f-no" data-s="0">No le ha salido</button></div>
      <p class="pass-help">Marcador: ${nm("k")} ${pts.k} · ${nm("p")} ${pts.p}</p>`);
    $("#arena").onclick = e => {
      if (e.target.closest("[data-start]")) {
        e.target.closest("[data-start]").hidden = true; $("#sing-judge").hidden = false;
        const t0 = Date.now(), fg = $("#ring-fg"), C = 2 * Math.PI * 52; fg.style.strokeDasharray = C;
        A.timer = setInterval(() => {
          const left = Math.max(0, 10 - (Date.now() - t0) / 1000);
          fg.style.strokeDashoffset = C * (1 - left / 10); $("#ring-n").textContent = Math.ceil(left);
          if (left <= 0) { clearInterval(A.timer); $("#ring").classList.add("out"); if (navigator.vibrate) try { navigator.vibrate(200); } catch (e) {} }
        }, 100);
      }
      const s = e.target.closest("[data-s]");
      if (s) { clearInterval(A.timer); if (s.dataset.s === "1") pts[pl]++; round++; draw(); }
    };
  };
  draw();
}

/* Confeti */
function confetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas"); c.className = "confetti"; document.body.appendChild(c);
  const ctx = c.getContext("2d"), W = c.width = innerWidth, H = c.height = innerHeight;
  const cols = ["#C9A227", "#F1D98E", "#2F5D50", "#8E2537", "#E9B92B"];
  const ps = Array.from({ length: 90 }, () => ({ x: W / 2 + (Math.random() - .5) * 60, y: H * .35, vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 3, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6, s: Math.random() * .3 - .15 }));
  let f = 0;
  (function tick() {
    ctx.clearRect(0, 0, W, H);
    ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.a += p.s; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore(); });
    if (++f < 110) requestAnimationFrame(tick); else c.remove();
  })();
}

/* Marcador */
function renderScore() {
  const t = totals(), all = Object.keys(GAMES).reduce((n, k) => n + GAMES[k].length, 0), played = Object.keys(results).length;
  const lead = t.k === t.p ? null : t.k > t.p ? "k" : "p";
  $("#score").innerHTML = `
    <div class="sb">
      <button class="sb-p ${lead === "k" ? "lead" : ""}" data-name="k"><span class="crown" aria-hidden="true">${lead === "k" ? crown() : ""}</span><span class="sb-n">${t.k}</span><span class="sb-name">${nm("k")}</span></button>
      <span class="sb-vs">contra</span>
      <button class="sb-p ${lead === "p" ? "lead" : ""}" data-name="p"><span class="crown" aria-hidden="true">${lead === "p" ? crown() : ""}</span><span class="sb-n">${t.p}</span><span class="sb-name">${nm("p")}</span></button>
    </div>
    <p class="sb-meta">${played} de ${all} juegos jugados. Toca un nombre para cambiarlo.</p>
    <button class="btn primary recap-btn" id="recap-open"><svg viewBox="0 0 24 24"><path d="M5 4h14v16l-7-4-7 4z"/></svg>Ver el resumen del viaje</button>
    ${betsList()}
    <ul class="hist">${Object.keys(PLACES).map(k => {
      const gs = gamesOf(k); if (!gs.length) return "";
      return `<li><button data-open="${k}"><span>${esc(PLACES[k].name)}</span><span class="hist-dots">${gs.map((g, i) => { const r = results[gid(k, i)]; return `<i class="${r ? "d-" + r.w : ""}" title="${esc(g.title)}"></i>`; }).join("")}</span></button></li>`;
    }).join("")}</ul>
    <p class="sb-legend"><i class="d-k"></i> ${nm("k")} <i class="d-p"></i> ${nm("p")} <i class="d-t"></i> empate <i></i> pendiente</p>
    <button class="pp-reset" id="score-reset">Reiniciar el marcador</button>`;
}
function crown() { return `<svg viewBox="0 0 24 24"><path d="M3 18h18l-2-10-5 5-2-7-2 7-5-5z" fill="var(--gold)"/></svg>`; }
$("#score").addEventListener("click", e => {
  const n = e.target.closest("[data-name]");
  if (n) { const v = prompt("Nombre del jugador", players[n.dataset.name]); if (v && v.trim()) { kvSet("n", { ...players, [n.dataset.name]: v.trim().slice(0, 14) }); derive(); renderScore(); renderNet(); } return; }
  const o = e.target.closest("[data-open]");
  if (o) { const k = o.dataset.open; for (let di = 0; di < DAYS.length; di++) { const si = DAYS[di].stops.findIndex(s => s.p === k); if (si > -1) { openSheet(di, si); setTimeout(() => { const gs = $("#games-slot"); if (gs) gs.scrollIntoView({ behavior: "smooth" }); }, 400); return; } } }
  if (e.target.closest("#recap-open")) return openRecap();
  const paid = e.target.closest("[data-paid]"); if (paid) return togglePaid(paid.dataset.paid);
  if (e.target.closest("#score-reset") && confirm("¿Borrar todos los resultados del duelo? Se borran en los dos móviles.")) { Object.keys(results).forEach(id => kvDel("r:" + id)); derive(); renderScore(); renderPlan(); toast("Marcador a cero"); }
});

/* ---------- Navegación ---------- */
function show(v) {
  document.querySelectorAll(".view").forEach(x => x.classList.toggle("on", x.id === "v-" + v));
  document.querySelectorAll(".nav button").forEach(b => b.setAttribute("aria-current", b.dataset.v === v ? "page" : "false"));
  scrollTo({ top: $("#v-" + v).offsetTop - 20, behavior: "smooth" });
}
document.querySelectorAll(".nav button").forEach(b => b.addEventListener("click", () => show(b.dataset.v)));

/* ---------- Tema ---------- */
function setTheme(t) { document.documentElement.setAttribute("data-theme", t); store.set("wien-theme", t); }
const saved = store.get("wien-theme", null); if (saved) document.documentElement.setAttribute("data-theme", saved);
$("#theme").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  setTheme(cur === "dark" ? "light" : "dark");
});

let tt; function toast(t, ms) { const el = $("#toast"); el.textContent = t; el.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("on"), ms || 2400); }


/* ---------- Ventana emergente ---------- */
let modalAfter = null;
function openModal(html, opt = {}) {
  $("#modal-card").onclick = null;
  $("#modal-card").innerHTML = (opt.lock ? "" : `<button class="icon-btn modal-x" data-mx aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>`) + html;
  $("#modal").classList.add("on"); $("#modal").dataset.lock = opt.lock ? "1" : ""; $("#modal").setAttribute("aria-hidden", "false");
  modalAfter = opt.after || null;
}
function closeModal() {
  if (!$("#modal").classList.contains("on") || $("#modal").dataset.lock) return;
  $("#modal").classList.remove("on"); $("#modal").setAttribute("aria-hidden", "true");
  const f = modalAfter; modalAfter = null; if (f) f();
  idleReload();
}
$("#modal").addEventListener("click", e => { if (e.target.closest("[data-mx]") || e.target === $("#modal")) closeModal(); });

/* ---------- Foto de la ficha: hoy, antes y nosotros ---------- */
function artBlock(k) {
  const P = PLACES[k], us = PH[k];
  const oldLabel = P.photos ? (P.photos.old.year || "Antes") : (P.era === "Antes" ? "Antes" : P.era);
  return `<div class="art ${P.photos ? "has-ph" : ""}" id="art">${P.photos ? `<img class="ph ph-now" src="${P.photos.now.src}" alt="${esc(P.name)} hoy"><img class="ph ph-old" src="${P.photos.old.src}" alt="${esc(P.name)} en ${esc(P.photos.old.year || P.era)}">` : art(P.art)}${us ? `<img class="ph ph-us" src="${us.src}" alt="Vosotros en ${esc(P.name)}">` : ""}<span class="era-cap">${esc(P.photos ? (P.photos.old.year || P.era) : P.era)}</span>
      <div class="era" role="group" aria-label="Qué foto ver">
        <button aria-pressed="true" data-era="now">Hoy</button><button aria-pressed="false" data-era="old">${esc(oldLabel)}</button>${us ? `<button aria-pressed="false" data-era="us">Nosotros</button>` : ""}</div></div>
    <p class="credit" id="credit">${esc(P.photos ? (P.photos.now.credit || "") : "")}</p>`;
}

/* ---------- Mensajes sellados: se abren al llegar al sitio ---------- */
let geo = null, geoWatch = null, geoErr = 0;
function distM(a, b, c, d) {
  const R = 6371000, r = Math.PI / 180, x = (d - b) * r * Math.cos(((a + c) / 2) * r), y = (c - a) * r;
  return Math.sqrt(x * x + y * y) * R;
}
const fmtDist = m => m < 950 ? `${Math.max(10, Math.round(m / 10) * 10)} m` : `${(m / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 })} km`;
/* Del día en que llega Kevin al último día de Pilu en Viena */
function tripOn() { const d = viennaNow().date; return d >= "2026-10-09" && d <= "2026-10-21"; }
const isExtra = k => DAYS.some(d => d.extra && d.stops.some(s => s.p === k)) && !DAYS.some(d => !d.extra && d.stops.some(s => s.p === k));
/* Un sitio del itinerario no se abre por GPS antes de su día: así el viernes no destapa lo del domingo */
function dueDay(k) { if (isExtra(k)) return tripOn(); const d = DAYS.find(x => !x.extra && x.stops.some(s => s.p === k)); return !!d && viennaNow().date >= d.key; }
function startGeo() {
  if (!navigator.geolocation) { geoErr = 9; return; }
  if (geoWatch != null) return;
  geoWatch = navigator.geolocation.watchPosition(p => {
    geo = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy || 0 }; geoErr = 0; store.set("wien-geo", 1); onGeo();
  }, e => {
    geoErr = e.code;
    if (e.code === 1) { stopGeo(); store.del("wien-geo"); }
    onGeo();
  }, { enableHighAccuracy: true, maximumAge: 20000, timeout: 30000 });
}
function stopGeo() { if (geoWatch != null) { try { navigator.geolocation.clearWatch(geoWatch); } catch (e) {} geoWatch = null; } }
document.addEventListener("visibilitychange", () => { if (document.hidden) stopGeo(); else if (store.get("wien-geo", 0)) startGeo(); });
function distTo(k) { return geo ? distM(geo.lat, geo.lon, PLACES[k].lat, PLACES[k].lon) : null; }
/* Se da por alcanzado un sitio si estamos dentro de su radio y además es el más cercano de todos:
   así la catedral no abre el mensaje del bar de enfrente, ni la Ópera el del puesto de salchichas. */
function near(k) {
  const d = distTo(k); if (d == null || geo.acc > 150 || !dueDay(k)) return false;
  if (d - Math.min(geo.acc, 60) > (RADIUS[k] || 200)) return false;
  for (const j in MESSAGES) if (j !== k && distTo(j) < d) return false;
  return true;
}
function onGeo() {
  for (const k in MESSAGES) if (!opened[k] && near(k)) unlockMsg(k, true);
  paintMsg();
}
function paintMsg() {
  if (!current || A) return;
  const ms = $("#msg-slot"); if (ms && !ms.querySelector(".opening")) ms.innerHTML = msgCard(current.k);
}
function unlockMsg(k, auto) {
  if (opened[k] || !MESSAGES[k]) return;
  kvSet("m:" + k, { via: auto ? "gps" : "mano" }); derive();
  if (navigator.vibrate) try { navigator.vibrate([40, 60, 40, 60, 120]); } catch (e) {}
  if (!(current && current.k === k)) toast(`Habéis llegado a ${PLACES[k].name}: tenéis un mensaje.`, 4200);
  renderPlan(); paintMsg();
}
/* Por si el GPS falla: se puede abrir a mano, pero solo el día y a la hora en que tocaba ese sitio */
function canForce(k) {
  if (isExtra(k)) return tripOn();
  const n = viennaNow();
  return DAYS.some(d => d.key === n.date && d.stops.some(s => {
    if (s.p !== k || !s.t) return false;
    const m = +s.t.slice(0, 2) * 60 + +s.t.slice(3) - 45, now = +n.time.slice(0, 2) * 60 + +n.time.slice(3);
    return now >= m;
  }));
}
function msgCard(k) {
  const M = MESSAGES[k]; if (!M) return "";
  const seal = `<span class="seal" aria-hidden="true">W</span>`;
  if (opened[k]) {
    if (readMsg[k]) return `<div class="env open"><p class="env-k">Vuestro mensaje en ${esc(PLACES[k].name)}</p><p class="env-text">${esc(M)}</p></div>`;
    return `<button class="env ready" data-msg="open">${seal}<span class="env-t"><b>Tenéis un mensaje</b><span>Habéis llegado. Tocad para abrirlo juntos.</span></span></button>`;
  }
  const d = distTo(k);
  const where = d != null ? `Estáis a ${fmtDist(d)}. Se abre solo al llegar.`
    : geoErr === 1 ? "Este móvil no tiene permiso de ubicación. Dádselo en los ajustes del navegador."
    : geoWatch != null ? "Buscando vuestra posición…" : "Se abre solo cuando lleguéis aquí.";
  return `<div class="env locked">${seal}<span class="env-t"><b>Mensaje sellado</b><span>${where}</span></span>
    <span class="env-b">${geoWatch == null && geoErr !== 1 ? `<button class="btn" data-msg="geo">Comprobar si hemos llegado</button>` : ""}
    ${canForce(k) ? `<button class="btn ghost" data-msg="force">Ya estamos aquí y el GPS no se entera</button>` : ""}</span></div>`;
}
$("#sheet-body").addEventListener("click", e => {
  const b = e.target.closest("[data-msg]"); if (!b || !current) return;
  const k = current.k, a = b.dataset.msg;
  if (a === "geo") { startGeo(); paintMsg(); }
  else if (a === "force") { if (confirm(`¿Seguro que estáis ya en ${PLACES[k].name}? El mensaje solo se abre una vez.`)) unlockMsg(k, false); }
  else if (a === "open") {
    readMsg[k] = 1; store.set("wien-read", readMsg);
    $("#msg-slot").innerHTML = msgCard(k);
    const el = $("#msg-slot .env"); el.classList.add("opening"); setTimeout(() => el.classList.remove("opening"), 1500);
    if (navigator.vibrate) try { navigator.vibrate(40); } catch (e) {}
    renderPlan();
  }
});

/* ---------- Apuestas del día ---------- */
const BET_DAYS = DAYS.slice(0, 3).map(d => d.key);
const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Vienna", year: "numeric", month: "2-digit", day: "2-digit" });
const dayOf = at => { try { return dayFmt.format(new Date(at)); } catch (e) { return ""; } };
const dayName = key => DAYS.find(d => d.key === key).label.split(" ")[0].toLowerCase();
function dayScore(key) {
  let k = 0, p = 0, n = 0;
  for (const r of Object.values(results)) if (r.at && dayOf(r.at) === key) { k += r.k || 0; p += r.p || 0; n++; }
  return { k, p, n };
}
function betVerdict(key) {
  const b = bets[key]; if (!b || b.st !== "closed" || !b.res) return null;
  const r = b.res, name = dayName(key);
  if (r.w === "t") return { head: `Empate el ${name}`, score: `${players.k} ${r.k} · ${r.p} ${players.p}`, debt: `«${b.text}» se paga a medias. O lo decide el primer juego de mañana.`, w: "t" };
  return { head: `El ${name} es de ${players[r.w]}`, score: `${players.k} ${r.k} · ${r.p} ${players.p}`, debt: `${players[OTHER[r.w]]}, te toca: «${b.text}»`, w: r.w };
}
function heroBet() {
  const n = viennaNow(); if (!BET_DAYS.includes(n.date)) return "";
  const b = bets[n.date];
  if (!b) return `<p class="small bet-line">Hoy aún no os jugáis nada. Pactad la apuesta del día en el plan.</p>`;
  if (b.st === "closed") { const v = betVerdict(n.date); return v ? `<p class="small bet-line">${esc(v.head)}. ${esc(v.debt)}</p>` : ""; }
  return `<p class="small bet-line">En juego hoy: «${esc(b.text)}»</p>`;
}
function renderBetCard() {
  const el = $("#bet-card"), d = DAYS[day];
  if (!BET_DAYS.includes(d.key)) { el.innerHTML = ""; return; }
  const b = bets[d.key], sc = dayScore(d.key), n = viennaNow(), name = dayName(d.key);
  const late = n.date > d.key || (n.date === d.key && n.time >= "21:00");
  if (!b) {
    el.innerHTML = `<div class="betc none"><p class="betc-k">La apuesta del ${name}</p><p class="betc-t">¿Qué os jugáis este día?</p>
      <p class="betc-s">Quien sume más puntos ese día, gana. La app lo recuerda y lo canta al cerrar el día.</p>
      <button class="btn primary" data-bet="edit">Pactar apuesta</button></div>`;
  } else if (b.st !== "closed") {
    el.innerHTML = `<div class="betc"><p class="betc-k">En juego el ${name}</p><p class="betc-t">«${esc(b.text)}»</p>
      <p class="betc-s"><span>${nm("k")} <b>${sc.k}</b></span><span class="vs">puntos del día</span><span><b>${sc.p}</b> ${nm("p")}</span></p>
      <div class="row2"><button class="btn ghost" data-bet="edit">Cambiar</button><button class="btn ${late ? "primary" : ""}" data-bet="close">Cerrar el día</button></div></div>`;
  } else {
    const v = betVerdict(d.key);
    el.innerHTML = `<div class="betc closed"><p class="betc-k">Día cerrado · ${esc(v.score)}</p><p class="betc-t">${esc(v.head)}</p>
      <p class="betc-s one">${esc(v.debt)}</p>
      <div class="row2"><button class="btn ghost" data-bet="reopen">Reabrir</button>${v.w === "t" ? "" : `<button class="btn ${b.paid ? "stamped" : ""}" data-paid="${d.key}">${b.paid ? "Deuda saldada" : "Marcar como pagada"}</button>`}</div></div>`;
  }
}
$("#bet-card").addEventListener("click", e => {
  const key = DAYS[day].key, b = bets[key];
  const paid = e.target.closest("[data-paid]"); if (paid) return togglePaid(key);
  const a = e.target.closest("[data-bet]"); if (!a) return;
  if (a.dataset.bet === "edit") return betDialog(key);
  if (a.dataset.bet === "reopen" && b) { kvSet("b:" + key, { text: b.text, st: "open" }); derive(); renderAll(); return; }
  if (a.dataset.bet === "close" && b) {
    const sc = dayScore(key);
    if (!confirm(sc.n ? `¿Cerrar el ${dayName(key)}? ${players.k} ${sc.k}, ${players.p} ${sc.p}.` : `Ese día aún no tiene juegos apuntados. ¿Cerrarlo igualmente?`)) return;
    const w = sc.k > sc.p ? "k" : sc.p > sc.k ? "p" : "t";
    kvSet("b:" + key, { text: b.text, st: "closed", res: { w, k: sc.k, p: sc.p }, paid: false }); derive(); renderAll(); singDay(key);
  }
});
function betDialog(key) {
  const b = bets[key], ideas = BET_IDEAS.filter(x => !x[1] || x[1] === key).map(x => x[0]);
  openModal(`<p class="m-k">La apuesta del ${dayName(key)}</p><h3 class="m-t">¿Qué os jugáis?</h3>
    <form id="bet-form"><input class="m-in" id="bet-in" maxlength="90" autocomplete="off" placeholder="Quien pierda…" value="${esc(b ? b.text : "")}" aria-label="La apuesta">
      <div class="chips">${ideas.map(t => `<button type="button" class="chip" data-idea>${esc(t)}</button>`).join("")}</div>
      <button class="btn primary big-go" type="submit">Trato hecho</button></form>`);
  $("#bet-form").addEventListener("click", e => { const c = e.target.closest("[data-idea]"); if (c) { $("#bet-in").value = c.textContent; $("#bet-in").focus(); } });
  $("#bet-form").addEventListener("submit", e => {
    e.preventDefault(); const t = $("#bet-in").value.trim().slice(0, 90); if (!t) return;
    kvSet("b:" + key, { text: t, st: "open" }); derive(); closeModal(); renderAll(); toast("Apuesta pactada. No vale rajarse.");
  });
}
function togglePaid(key) { const b = bets[key]; if (!b || b.st !== "closed") return; kvSet("b:" + key, { text: b.text, st: "closed", res: b.res, paid: !b.paid }); derive(); renderAll(); }
function singDay(key) {
  const v = betVerdict(key); if (!v || A) return;
  const d = DAYS.find(x => x.key === key);
  openModal(`<div class="sing"><p class="m-k">${esc(d.label)}</p><p class="r-head ${v.w === "t" ? "" : "win"}">${esc(v.head)}</p>
    <p class="sing-score">${esc(v.score)}</p><p class="sing-debt">${esc(v.debt)}</p>
    <button class="btn primary big-go" data-mx>${v.w === "t" ? "Tablas" : "Lo prometido es deuda"}</button></div>`);
  if (v.w !== "t") confetti();
  if (navigator.vibrate) try { navigator.vibrate([60, 60, 60, 60, 160]); } catch (e) {}
}
function betsList() {
  const rows = BET_DAYS.map(key => {
    const b = bets[key], d = DAYS.find(x => x.key === key), v = betVerdict(key);
    const txt = !b ? "Sin apuesta todavía" : v ? `«${esc(b.text)}» · ${v.w === "t" ? "empate, a medias" : "paga " + nm(OTHER[v.w])}` : `«${esc(b.text)}» · en juego`;
    return `<li><span class="bl-d">${d.short} ${d.num}</span><span class="bl-t">${txt}</span>${v && v.w !== "t" ? `<button class="chip ${b.paid ? "on" : ""}" data-paid="${key}">${b.paid ? "Pagada" : "Pendiente"}</button>` : ""}</li>`;
  }).join("");
  return `<h5 class="sb-h">Apuestas</h5><ul class="betl">${rows}</ul>`;
}

/* ---------- Foto de los dos al sellar ---------- */
const PH = {}; let idb = null, phBusy = false, phReady = false;
function phLoad() {
  return new Promise(res => {
    try {
      const r = indexedDB.open("wien", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("ph");
      r.onerror = () => res();
      r.onsuccess = () => {
        idb = r.result;
        const rq = idb.transaction("ph").objectStore("ph").openCursor();
        rq.onsuccess = () => { const c = rq.result; if (c) { PH[c.key] = c.value; c.continue(); } else res(); };
        rq.onerror = () => res();
      };
    } catch (e) { res(); }
  });
}
function phPut(k, v) { PH[k] = v; if (idb) try { idb.transaction("ph", "readwrite").objectStore("ph").put(v, k); } catch (e) {} }
function phDel(k) { delete PH[k]; if (idb) try { idb.transaction("ph", "readwrite").objectStore("ph").delete(k); } catch (e) {} }
function photoChanged(k) {
  if (current && current.k === k && !A) { $("#art-slot").innerHTML = artBlock(k); $("#us-slot").innerHTML = usBlock(k); }
  if ($("#recap").classList.contains("on")) renderRecap();
}
async function shrink(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    let max = 1280, q = .74, out = "";
    for (let n = 0; n < 6; n++) {
      const sc = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(img.naturalWidth * sc)); c.height = Math.max(1, Math.round(img.naturalHeight * sc));
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      out = c.toDataURL("image/jpeg", q);
      if (out.length < 600000) break;
      max = Math.round(max * .8); q -= .06;
    }
    return out;
  } finally { URL.revokeObjectURL(url); }
}
function pickPhoto(k) {
  const inp = $("#ph-in"); inp.value = "";
  inp.onchange = async () => {
    const f = inp.files && inp.files[0]; if (!f) return;
    try {
      const src = await shrink(f);
      if (!/^data:image\/jpeg;base64,/.test(src)) throw new Error("formato");
      kvSet("f:" + k, {}); derive();
      phPut(k, { src, t: KV["f:" + k].at, pend: 1 });
      photoChanged(k); toast("Foto guardada en vuestro álbum"); syncPhotos();
    } catch (e) { toast("No he podido leer esa foto. Probad con otra."); }
  };
  inp.click();
}
/* Sube las fotos hechas en este móvil y baja las del otro */
async function syncPhotos() {
  if (!syncOn() || phBusy || !phReady) return;
  phBusy = true;
  try {
    for (const k in PLACES) {
      const e = KV["f:" + k], meta = e && !e.v.del ? e : null, loc = PH[k];
      if (!meta) { if (loc && e) { phDel(k); photoChanged(k); } continue; }
      if (loc && loc.pend && loc.t === meta.at) {
        const r = await NET.rpc("wien_photo_put", { p_code: code, p_place: k, p_data: loc.src, p_by: me, p_at: loc.t });
        if (r && r.ok) { phPut(k, { src: loc.src, t: loc.t }); NET.send({ t: "sync", f: me, dev: DEV }); photoChanged(k); }
      } else if (!loc || loc.t < meta.at) {
        const r = await NET.rpc("wien_photo_get", { p_code: code, p_place: k });
        if (r && r.ok && r.data && +r.at >= meta.at && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(r.data)) { phPut(k, { src: r.data, t: +r.at }); photoChanged(k); }
      }
    }
  } catch (e) {}
  phBusy = false;
}
function usBlock(k) {
  const ph = PH[k], P = PLACES[k];
  if (ph) return `<h5>Vuestra foto</h5><figure class="us"><img src="${ph.src}" alt="Vosotros en ${esc(P.name)}">
    <figcaption>${stamps[k] ? "Sellado el " + esc(stamps[k]) : "Viena, 2026"}${ph.pend ? " · se subirá cuando haya conexión" : ""}</figcaption></figure>
    <div class="row2"><button class="btn" data-us="pick">Cambiar foto</button><button class="btn ghost" data-us="del">Quitar</button></div>`;
  return `<h5>Vuestra foto</h5><button class="us-empty" data-us="pick">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
    <b>Añadid aquí la foto de los dos</b><span>Saldrá en el álbum del final, junto a la de hoy y la antigua.</span></button>`;
}
$("#sheet-body").addEventListener("click", e => {
  const b = e.target.closest("[data-us]"); if (!b || !current) return;
  const k = current.k;
  if (b.dataset.us === "pick") pickPhoto(k);
  else if (confirm("¿Quitar esta foto del álbum? Se quita en los dos móviles.")) { kvDel("f:" + k); derive(); phDel(k); photoChanged(k); }
});
function onStamped(k) {
  if (tripOn()) unlockMsg(k, false);
  if (PH[k]) return;
  setTimeout(() => {
    if (!current || current.k !== k || A || PH[k] || $("#modal").classList.contains("on")) return;
    openModal(`<p class="m-k">Sello puesto en ${esc(PLACES[k].name)}</p><h3 class="m-t">¿Foto de los dos para el álbum?</h3>
      <p class="m-p">Una por sitio. Al final del viaje las veréis todas juntas, con la foto de hoy y la de hace un siglo.</p>
      <div class="row2"><button class="btn ghost" data-mx>Luego</button><button class="btn primary" id="stamp-photo">Hacer la foto</button></div>`);
    $("#stamp-photo").addEventListener("click", () => { closeModal(); pickPhoto(k); });
  }, 1100);
}

/* ---------- Resumen del viaje ---------- */
function moments() {
  const out = [];
  const rs = Object.entries(results).map(([id, r]) => {
    const cut = id.lastIndexOf("-"), k = id.slice(0, cut), g = gamesOf(k)[+id.slice(cut + 1)];
    return g && PLACES[k] ? { k, g, r } : null;
  }).filter(Boolean).sort((a, b) => (a.r.at || 0) - (b.r.at || 0));
  if (!rs.length) return out;
  const fast = rs.filter(x => x.r.s != null && (x.r.w === "k" || x.r.w === "p")).sort((a, b) => a.r.s - b.r.s)[0];
  if (fast) out.push(["La búsqueda más rápida", `${players[fast.r.w]} encontró «${fast.g.title}» en ${fmtT(fast.r.s)}, en ${PLACES[fast.k].name}.`]);
  const exact = rs.filter(x => x.r.ex === "k" || x.r.ex === "p" || x.r.ex === "t");
  if (exact.length) out.push([exact.length > 1 ? "Apuestas clavadas" : "Apuesta clavada", exact.map(x => `${x.r.ex === "t" ? "Los dos" : players[x.r.ex]} en «${x.g.title}»`).join("; ") + "."]);
  let best = { n: 0 }, cur = { w: null, n: 0 };
  rs.forEach(x => {
    if (x.r.w === "k" || x.r.w === "p") { cur = cur.w === x.r.w ? { w: cur.w, n: cur.n + 1 } : { w: x.r.w, n: 1 }; if (cur.n > best.n) best = cur; }
    else cur = { w: null, n: 0 };
  });
  if (best.n >= 3) out.push(["La racha", `${players[best.w]} encadenó ${best.n} victorias seguidas.`]);
  const by = {}; rs.forEach(x => { const o = by[x.k] || (by[x.k] = { k: 0, p: 0 }); o.k += x.r.k || 0; o.p += x.r.p || 0; });
  const diff = Object.keys(by).map(k => ({ k, d: by[k].k - by[k].p, o: by[k] })).sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
  if (diff[0] && Math.abs(diff[0].d) >= 3) out.push(["Territorio conquistado", `${PLACES[diff[0].k].name} fue de ${players[diff[0].d > 0 ? "k" : "p"]}: ${players.k} ${diff[0].o.k}, ${players.p} ${diff[0].o.p}.`]);
  const tight = diff.filter(x => x.d === 0 && x.o.k >= 2)[0];
  if (tight) out.push(["El sitio más reñido", `${PLACES[tight.k].name}: empate a ${tight.o.k}.`]);
  let lead = null, flips = 0, a = 0, b = 0;
  rs.forEach(x => { a += x.r.k || 0; b += x.r.p || 0; const l = a === b ? lead : a > b ? "k" : "p"; if (lead && l !== lead) flips++; lead = l; });
  if (flips) out.push(["Sorpassos", flips === 1 ? "El liderato cambió de manos una vez." : `El liderato cambió de manos ${flips} veces.`]);
  return out;
}
function renderRecap() {
  const t = totals(), played = Object.keys(results).length, over = Date.now() >= END;
  const lead = t.k === t.p ? null : t.k > t.p ? "k" : "p";
  const nSt = PP.filter(k => stamps[k]).length, nMsg = Object.keys(MESSAGES).filter(k => opened[k]).length, nPh = PP.filter(k => PH[k]).length;
  const days = DAYS.filter(d => !d.extra).map(d => {
    const sc = dayScore(d.key), v = betVerdict(d.key), b = bets[d.key];
    const who = !sc.n ? "Sin juegos" : sc.k === sc.p ? `Empate a ${sc.k}` : `${nm(sc.k > sc.p ? "k" : "p")} · ${Math.max(sc.k, sc.p)} a ${Math.min(sc.k, sc.p)}`;
    return `<li><span class="rd-d"><b>${d.num}</b>${d.short}</span><span class="rd-t"><b>${who}</b>${b ? `<span>«${esc(b.text)}»${v ? (v.w === "t" ? " · a medias" : ` · paga ${nm(OTHER[v.w])}${b.paid ? ", saldada" : ""}`) : " · en juego"}</span>` : ""}</span></li>`;
  }).join("");
  const mom = moments();
  const seen = PP.filter(k => stamps[k] || PH[k]);
  const album = seen.map(k => {
    const P = PLACES[k], us = PH[k];
    return `<li class="alb"><p class="alb-n">${esc(P.name)}<span>${stamps[k] ? esc(stamps[k]) : ""}</span></p>
      <div class="tri">${P.photos ? `<figure><img src="${P.photos.old.src}" alt="${esc(P.name)}, foto antigua" loading="lazy"><figcaption>${esc(P.photos.old.year || "Antes")}</figcaption></figure>
        <figure><img src="${P.photos.now.src}" alt="${esc(P.name)} hoy" loading="lazy"><figcaption>Hoy</figcaption></figure>` : ""}
        <figure class="${us ? "me" : "none"}">${us ? `<img src="${us.src}" alt="Vosotros en ${esc(P.name)}" loading="lazy">` : `<span>Sin foto</span>`}<figcaption>Nosotros</figcaption></figure></div></li>`;
  }).join("");
  $("#recap").innerHTML = `<div class="recap-in">
    <div class="arena-bar"><button class="icon-btn" data-rx aria-label="Cerrar el resumen"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><span class="arena-type">${over ? "Así quedó" : "Así va de momento"}</span></div>
    <p class="rc-wien" aria-hidden="true">Wien</p>
    <p class="rc-sub">${nm("k")} y ${nm("p")} · 9 al 12 de octubre de 2026</p>
    ${played ? `<p class="r-head win rc-head">${lead ? (over ? "Gana " : "Manda ") + nm(lead) : "Empate técnico"}</p>
      <div class="sb rc-sb"><span class="sb-p ${lead === "k" ? "lead" : ""}"><span class="sb-n">${t.k}</span><span class="sb-name">${nm("k")}</span></span><span class="sb-vs">contra</span><span class="sb-p ${lead === "p" ? "lead" : ""}"><span class="sb-n">${t.p}</span><span class="sb-name">${nm("p")}</span></span></div>`
      : `<p class="rc-empty">Todavía no hay duelo que contar. Volved aquí cuando hayáis jugado: se va llenando solo.</p>`}
    <ul class="rc-stats"><li><b>${nSt}</b>de ${PP.length} sellos</li><li><b>${played}</b>juegos</li><li><b>${nMsg}</b>mensajes abiertos</li><li><b>${nPh}</b>fotos</li></ul>
    <h5>Día a día</h5><ul class="rc-days">${days}</ul>
    ${mom.length ? `<h5>Mejores momentos</h5><ul class="rc-mom">${mom.map(m => `<li><b>${esc(m[0])}</b><span>${esc(m[1])}</span></li>`).join("")}</ul>` : ""}
    <h5>El álbum: antes, hoy y nosotros</h5>
    ${album ? `<ul class="rc-album">${album}</ul>` : `<p class="rc-empty">Sellad cada sitio y haceos la foto: aquí saldrán los tres tiempos de Viena.</p>`}
    <p class="rc-bye">${over ? "Auf Wiedersehen, Wien. Poned fecha al siguiente." : "Seguid sumando. Esto se cierra el lunes."}</p>
  </div>`;
}
function openRecap() {
  renderRecap(); $("#recap").classList.add("on"); $("#recap").setAttribute("aria-hidden", "false"); $("#recap").scrollTop = 0;
  document.body.style.overflow = "hidden";
  if (Date.now() >= END && Object.keys(results).length) confetti();
}
function closeRecap() { $("#recap").classList.remove("on"); $("#recap").setAttribute("aria-hidden", "true"); if (!current) document.body.style.overflow = ""; idleReload(); }
$("#recap").addEventListener("click", e => { if (e.target.closest("[data-rx]")) closeRecap(); });

/* ---------- Quién eres y clave de pareja ---------- */
function hashCode() { try { return (new URLSearchParams(location.hash.slice(1)).get("c") || "").trim().toLowerCase(); } catch (e) { return ""; } }
function setup(first) {
  openModal(`<p class="m-k">Wien · ${nm("k")} y ${nm("p")}</p><h3 class="m-t">¿De quién es este móvil?</h3>
    <p class="m-p">Cada uno juega desde el suyo y el marcador, los sellos y las fotos se comparten solos.</p>
    <label class="m-l" for="code-in">Clave de pareja</label>
    <input class="m-in" id="code-in" autocapitalize="none" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="la misma en los dos móviles" value="${esc(code || hashCode())}">
    <div class="who"><button class="found-btn f-k" data-who="k">Soy ${nm("k")}</button><button class="found-btn f-p" data-who="p">Soy ${nm("p")}</button></div>
    <p class="m-err" id="setup-err" aria-live="polite"></p>
    <button class="btn ghost" data-who="solo">Usar solo en este móvil, sin compartir</button>`, { lock: first });
  $("#modal-card").onclick = async e => {
    const b = e.target.closest("[data-who]"); if (!b) return;
    const who = b.dataset.who, err = $("#setup-err"), done = () => { $("#modal").dataset.lock = ""; $("#modal-card").onclick = null; closeModal(); };
    if (who === "solo") {
      me = null; code = ""; store.del("wien-me"); store.del("wien-code"); store.set("wien-solo", 1); NET.leave(); net.joined = ""; net.rt = false; net.bad = false;
      done(); renderAll(); return;
    }
    const c = $("#code-in").value.trim().toLowerCase().replace(/\s+/g, "");
    if (!c) { err.textContent = "Falta la clave de pareja."; return; }
    err.textContent = "Comprobando…";
    let ok = null;
    try { const r = await NET.rpc("wien_pull", { p_code: c, p_since: null }); ok = !!(r && r.ok); } catch (x) { ok = null; }
    if (ok === false) { err.textContent = "Esa clave no es. Revisadla: tiene que ser la misma en los dos móviles."; return; }
    me = who; code = c; since = null; net.bad = false; net.twin = false; net.joined = "";
    store.set("wien-me", me); store.set("wien-code", code); store.del("wien-since"); store.del("wien-solo");
    done(); renderAll(); connect();
    toast(ok ? `Hola, ${players[me]}. Todo conectado.` : `Hola, ${players[me]}. Ahora no hay conexión: se sincronizará sola cuando vuelva.`, 3600);
  };
}
function connDialog() {
  if (!me || !code) return setup(false);
  const li = (ok, t) => `<li class="${ok ? "ok" : "no"}">${t}</li>`, n = dirtyCount();
  openModal(`<p class="m-k">Conexión</p><h3 class="m-t">Este móvil es de ${nm(me)}</h3>
    <ul class="diag">${li(net.db === true, net.bad ? "La clave de pareja no es válida" : net.db === true ? "Base de datos: conectada" : "Base de datos: sin conexión ahora")}
      ${li(net.rt, net.rt ? "Tiempo real: conectado" : "Tiempo real: desconectado")}
      ${li(peerOnline(), peerOnline() ? `${nm(peer())} está en línea` : `${nm(peer())} no tiene la app abierta ahora`)}
      ${li(!n, n ? `${n} cambios esperando conexión para subir` : "Todo subido")}</ul>
    <p class="m-p">Clave de pareja: <b>${esc(code)}</b></p>
    <div class="row2"><button class="btn" data-conn="test">Probar ahora</button><button class="btn primary" data-conn="share">Enviar enlace a ${nm(peer())}</button></div>
    <button class="btn ghost" data-conn="change">Cambiar de jugador o de clave</button>`);
  $("#modal-card").onclick = async e => {
    const b = e.target.closest("[data-conn]"); if (!b) return;
    const a = b.dataset.conn;
    if (a === "change") { $("#modal-card").onclick = null; return setup(false); }
    if (a === "test") { b.textContent = "Probando…"; net.joined = ""; await connect(); await pull(true); setTimeout(() => { if ($("#modal").classList.contains("on")) connDialog(); }, 1800); return; }
    const url = location.origin + location.pathname + "#c=" + encodeURIComponent(code);
    const text = `Nuestra app de Viena. Ábrela, di quién eres e instálala. Clave de pareja: ${code}`;
    try { if (navigator.share) await navigator.share({ title: "Wien · Kevin y Pilu", text, url }); else { await navigator.clipboard.writeText(text + " " + url); toast("Enlace copiado"); } } catch (x) {}
  };
}
$("#net").addEventListener("click", connDialog);

/* ---------- Instalar en el móvil ---------- */
let installEvt = null;
const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; renderInstall(); });
addEventListener("appinstalled", () => { installEvt = null; store.set("wien-noinst", 1); renderInstall(); });
function renderInstall() { $("#install").hidden = standalone() || !!store.get("wien-noinst", 0); }
$("#install").addEventListener("click", async e => {
  if (e.target.closest("[data-inst-x]")) { store.set("wien-noinst", 1); return renderInstall(); }
  if (!e.target.closest("[data-inst]")) return;
  if (installEvt) { try { installEvt.prompt(); await installEvt.userChoice; } catch (x) {} installEvt = null; return; }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  openModal(`<p class="m-k">Instalar la app</p><h3 class="m-t">Dos toques y queda en el móvil</h3>
    <ol class="steps">${ios
      ? `<li>Abre esta página en <b>Safari</b>.</li><li>Toca el botón <b>Compartir</b>, el cuadrado con la flecha hacia arriba.</li><li>Elige <b>Añadir a pantalla de inicio</b> y confirma.</li><li>Ábrela desde el icono nuevo y vuelve a decir quién eres y la clave.</li>`
      : `<li>Abre esta página en <b>Chrome</b>.</li><li>Toca el menú de los <b>tres puntos</b>, arriba a la derecha.</li><li>Elige <b>Instalar aplicación</b> o <b>Añadir a pantalla de inicio</b>.</li>`}</ol>
    <p class="m-p">Después se abre a pantalla completa y funciona sin conexión.</p>`);
});

/* ---------- Versión nueva ---------- */
let needReload = false;
function idleReload() {
  if (needReload && !A && !current && !$("#modal").classList.contains("on") && !$("#recap").classList.contains("on")) { needReload = false; location.reload(); }
}
if ("serviceWorker" in navigator && !window.__WIEN_NET__) {
  const had = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register("sw.js").then(reg => {
    document.addEventListener("visibilitychange", () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => {});
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (had) { needReload = true; idleReload(); } });
}

function attachPhotos() {
  const sets = [typeof PHOTO_SET !== "undefined" ? PHOTO_SET : null, typeof PHOTO_SET2 !== "undefined" ? PHOTO_SET2 : null];
  let n = 0;
  sets.forEach(S => { if (!S) return; n++; for (const k in S) if (PLACES[k] && !PLACES[k].photos) { PLACES[k].photos = { now: S[k].now, old: S[k].old }; PLACES[k].zoom = S[k].zoom; } });
  return n;
}

/* ---------- Arranque ---------- */
derive();
attachPhotos();
window.__photosReady = () => {
  if (!attachPhotos()) return;
  renderPlan();
  if (current && !A) { $("#art-slot").innerHTML = artBlock(current.k); }
  if ($("#recap").classList.contains("on")) renderRecap();
};
const st0 = status(); if (st0.today > -1) day = st0.today;
renderHero(); renderPlan(); renderMap(); renderPassport(); renderScore(); renderNet(); renderInstall();
setInterval(() => { renderHero(); if (!current) renderPlan(); }, 30000);
phLoad().then(() => { phReady = true; for (const k in PH) photoChanged(k); syncPhotos(); });
if (!me && !store.get("wien-solo", 0)) setup(true); else connect();
if (store.get("wien-geo", 0) && tripOn()) startGeo();
})();
