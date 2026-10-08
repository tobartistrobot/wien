/* Wien · Kevin y Pilu. Guarda la app en el móvil para que funcione sin conexión. */
const VERSION = "wien-7315b7b4f2";
const ASSETS = [
  "data.js?v=ca80477e48",
  "photos.js?v=1a8e333086",
  "photos2.js?v=50073513e3",
  "app.js?v=36a6937275",
  "vendor/supabase.js?v=59d39487c3",
  "manifest.webmanifest?v=50ec9afab6",
  "fonts/jost-latin-400-normal.woff2",
  "fonts/jost-latin-500-normal.woff2",
  "fonts/jost-latin-600-normal.woff2",
  "fonts/poiret-one-latin-400-normal.woff2",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    // La página siempre se baja fresca; lo demás lleva su versión en la URL y se reutiliza si ya estaba.
    await cache.put("./", await fetch("./", { cache: "reload" }));
    await Promise.all(ASSETS.map(async url => {
      const old = await caches.match(url);
      if (old) return cache.put(url, old);
      const res = await fetch(url, { cache: "reload" });
      if (!res.ok) throw new Error("No se pudo guardar " + url);
      return cache.put(url, res);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION && k !== "wien-voz") await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    if (req.mode === "navigate") return (await cache.match("./")) || fetch(req);
    return (await cache.match(req)) || (await cache.match(req, { ignoreSearch: true })) || fetch(req);
  })());
});
