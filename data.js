/* Ilustraciones vectoriales de cada lugar (viewBox 400x240) */
const ART_STYLE = `<style>
.i{fill:none;stroke:var(--art-ink);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.t{stroke:var(--art-ink);stroke-width:2.2;stroke-linejoin:round}
.w{fill:var(--art-wall)}.g{fill:var(--art-gold)}.y{fill:var(--art-yellow)}.gr{fill:var(--art-green)}
.r{fill:var(--art-red)}.wa{fill:var(--art-water)}.br{fill:var(--art-brick)}.ink{fill:var(--art-ink)}
</style>`;
function sky(sun = true, night = false) {
  return `<defs><linearGradient id="sk${night ? 'n' : 'd'}" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${night ? '#1E2340' : 'var(--art-sky)'}"/><stop offset="1" stop-color="${night ? '#4A3A5C' : 'var(--art-sky2)'}"/></linearGradient></defs>
  <rect width="400" height="240" fill="url(#sk${night ? 'n' : 'd'})"/>
  ${sun ? `<circle cx="330" cy="58" r="22" class="g" opacity=".85"/>` : ''}
  ${night ? `<circle cx="330" cy="50" r="15" fill="#F4E8C1"/><circle cx="337" cy="45" r="13" fill="#1E2340"/>
  <g fill="#F4E8C1"><circle cx="60" cy="40" r="1.6"/><circle cx="120" cy="24" r="1.2"/><circle cx="210" cy="36" r="1.5"/><circle cx="270" cy="20" r="1.1"/><circle cx="380" cy="90" r="1.3"/></g>` : ''}`;
}
function windows(x0, y, n, step, w = 7, h = 12, cls = 'w') {
  let s = '';
  for (let i = 0; i < n; i++) s += `<rect x="${x0 + i * step}" y="${y}" width="${w}" height="${h}" rx="1.5" class="${cls} t" stroke-width="1.3"/>`;
  return s;
}
const ART = {
  opera: () => `${sky(false, true)}
  <rect x="0" y="200" width="400" height="40" class="ink" opacity=".25"/>
  <path class="gr t" d="M52 112 L84 84 H316 L348 112Z"/>
  <path class="gr t" d="M140 74 Q200 34 260 74Z"/>
  <rect class="w t" x="150" y="74" width="100" height="40"/>
  ${windows(160, 84, 5, 17, 9, 18)}
  <rect class="w t" x="60" y="112" width="280" height="88"/>
  ${[0,1,2,3,4].map(i => `<path class="t" fill="#F7C96B" d="M${118 + i * 34} 200 V168 a13 13 0 0 1 26 0 V200Z"/>`).join('')}
  ${windows(72, 124, 12, 22, 10, 22)}
  <path class="g" d="M88 84 l5 -15 l9 3 l3 -8 l8 10 l-4 10z"/><path class="g" d="M312 84 l-5 -15 l-9 3 l-3 -8 l-8 10 l4 10z"/>
  <path class="i" d="M60 160 H340"/>
  <g fill="#F7C96B" opacity=".9"><circle cx="30" cy="188" r="4"/><circle cx="370" cy="188" r="4"/></g>
  <path class="i" d="M30 192 V232 M370 192 V232"/>`,

  belvedere: () => `${sky()}
  <path d="M0 196 H400 V240 H0Z" class="gr" opacity=".55"/>
  <rect class="wa t" x="40" y="206" width="320" height="22" rx="4"/>
  <path class="i" d="M60 216 q10 -4 20 0 t20 0 M240 220 q10 -4 20 0 t20 0" opacity=".6"/>
  <path class="gr t" d="M84 132 L96 118 H164 V132Z M316 132 L304 118 H236 V132Z"/>
  <rect class="w t" x="80" y="132" width="240" height="68"/>
  <path class="gr t" d="M34 122 Q58 86 82 122Z"/><rect class="w t" x="38" y="122" width="40" height="78"/>
  <path class="gr t" d="M318 122 Q342 86 366 122Z"/><rect class="w t" x="322" y="122" width="40" height="78"/>
  <path class="gr t" d="M160 106 Q200 52 240 106Z"/><rect class="g t" x="194" y="58" width="12" height="14" stroke-width="1.4"/>
  <rect class="w t" x="162" y="106" width="76" height="94"/>
  <path class="t" fill="#F7C96B" d="M186 200 V172 a14 14 0 0 1 28 0 V200Z"/>
  ${windows(92, 146, 3, 22, 9, 16)}${windows(250, 146, 3, 22, 9, 16)}
  ${windows(170, 120, 3, 22, 9, 16)}${windows(48, 140, 2, 13, 7, 14)}${windows(332, 140, 2, 13, 7, 14)}
  <path class="i" d="M80 170 H320"/>`,

  stephansdom: () => `${sky(true)}
  <defs><pattern id="zig" width="20" height="12" patternUnits="userSpaceOnUse">
  <rect width="20" height="12" fill="var(--art-green)"/><path d="M0 12 L10 2 L20 12Z" fill="var(--art-yellow)"/><path d="M0 12 L10 6 L20 12Z" fill="var(--art-ink)" opacity=".7"/></pattern></defs>
  <path class="t" fill="url(#zig)" d="M138 150 L250 70 L368 150Z"/>
  <rect class="w t" x="146" y="150" width="214" height="52"/>
  ${[0,1,2,3,4,5].map(i => `<path class="t" fill="#8FB3BE" stroke-width="1.4" d="M${160 + i * 33} 192 V170 q7 -12 14 0 V192Z"/>`).join('')}
  <path class="w t" d="M58 202 V132 L74 132 L88 24 L102 132 L118 132 V202Z"/>
  <path class="i" d="M88 24 V14 M83 18 H93" /><circle cx="88" cy="12" r="2.5" class="g"/>
  ${[50,70,90,110].map(y => `<path class="i" stroke-width="1.4" d="M${88 - (y - 24) * .13} ${y} L${88 + (y - 24) * .13} ${y}"/>`).join('')}
  <path class="t" fill="#8FB3BE" stroke-width="1.4" d="M80 186 V156 q8 -14 16 0 V186Z"/>
  <rect class="w t" x="296" y="110" width="34" height="44"/><path class="gr t" d="M292 110 Q313 82 334 110Z"/>
  <rect x="0" y="202" width="400" height="38" class="ink" opacity=".18"/>`,

  schonbrunn: () => `${sky()}
  <path d="M0 150 Q200 96 400 150 V200 H0Z" class="gr" opacity=".75"/>
  <rect class="w t" x="160" y="112" width="80" height="16"/>
  ${[0,1,2,3,4].map(i => `<path class="t" fill="var(--art-sky)" stroke-width="1.2" d="M${166 + i * 14} 128 V120 q5 -6 10 0 V128Z"/>`).join('')}
  <path class="i" d="M156 112 H244"/><path class="g" d="M196 104 l4 -8 l4 8z"/>
  <rect class="y t" x="16" y="150" width="368" height="52"/>
  <rect class="y t" x="156" y="138" width="88" height="64"/><path class="y t" d="M150 138 L200 118 L250 138Z"/>
  <path class="i" d="M16 150 H384"/>
  ${windows(26, 160, 8, 16, 8, 12)}${windows(26, 180, 8, 16, 8, 12)}
  ${windows(258, 160, 8, 16, 8, 12)}${windows(258, 180, 8, 16, 8, 12)}
  ${windows(166, 148, 5, 15, 8, 14)}
  <path class="t" fill="#F7C96B" d="M190 202 V184 a10 10 0 0 1 20 0 V202Z"/>
  <path d="M0 202 H400 V240 H0Z" fill="#D9C9A0"/>
  <path class="gr" d="M40 214 h120 v10 h-120z M240 214 h120 v10 h-120z" opacity=".8"/>
  <circle cx="200" cy="222" r="10" class="wa t" stroke-width="1.4"/>`,

  palm: () => `${sky()}
  <path d="M0 200 H400 V240 H0Z" class="gr" opacity=".6"/>
  <path class="t" fill="rgba(200,230,235,.55)" d="M40 200 V166 Q85 116 130 166 V200Z"/>
  <path class="t" fill="rgba(200,230,235,.55)" d="M270 200 V166 Q315 116 360 166 V200Z"/>
  <g><path class="gr" d="M200 150 C 180 120, 150 120, 140 130 C 160 128, 175 132, 196 150Z"/>
  <path class="gr" d="M200 150 C 220 118, 252 118, 262 130 C 240 127, 225 132, 204 150Z"/>
  <path class="gr" d="M200 146 C 196 110, 176 96, 164 98 C 180 108, 190 122, 198 148Z"/>
  <path class="gr" d="M200 146 C 206 110, 226 96, 238 98 C 222 108, 212 122, 202 148Z"/>
  <path class="t" fill="#8A6A3A" stroke-width="1.4" d="M197 148 Q195 176 192 200 H208 Q205 176 203 148Z"/></g>
  <path class="t" fill="rgba(200,230,235,.45)" d="M130 200 V150 Q200 56 270 150 V200Z"/>
  ${[150,170,190,210,230,250].map(x => `<path class="i" stroke-width="1.2" d="M${x} 200 V${150 - (x < 200 ? (x - 130) : (270 - x)) * .55}"/>`).join('')}
  <path class="i" stroke-width="1.2" d="M134 140 Q200 64 266 140 M138 128 Q200 70 262 128"/>
  ${[60,80,100,110].map(x => `<path class="i" stroke-width="1.1" d="M${x} 200 V150"/>`).join('')}
  ${[290,310,330,340].map(x => `<path class="i" stroke-width="1.1" d="M${x} 200 V150"/>`).join('')}
  <path class="g" d="M196 70 h8 v-10 h-8z"/>`,

  canal: () => `${sky(true)}
  <rect x="0" y="92" width="60" height="70" class="w t"/><rect x="60" y="76" width="54" height="86" class="y t"/>
  <rect x="114" y="100" width="46" height="62" class="w t"/>
  <rect x="290" y="104" width="70" height="58" class="w t"/><path class="g t" d="M300 104 Q325 70 350 104Z"/>
  ${windows(70, 88, 3, 14, 7, 10)}${windows(8, 104, 3, 16, 7, 10)}${windows(300, 118, 4, 15, 7, 12)}
  <rect x="0" y="150" width="400" height="28" fill="#9A958A" class="t"/>
  <path d="M10 170 q14 -18 30 -4 q12 10 26 -8" stroke="var(--art-red)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M80 166 l14 -10 l10 12 l16 -12" stroke="var(--art-yellow)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="148" cy="164" r="8" fill="none" stroke="var(--art-green)" stroke-width="4"/>
  <path d="M176 172 q20 -20 40 0 q20 -20 40 0" stroke="#6D7FD1" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M278 160 h30 M284 168 h26" stroke="var(--art-red)" stroke-width="4" stroke-linecap="round"/>
  <rect x="0" y="178" width="400" height="62" class="wa"/>
  <path class="t" fill="none" d="M170 178 Q240 128 310 178" stroke-width="3"/>
  <path class="i" d="M170 178 V240 M310 178 V240" opacity=".5"/>
  <path class="i" stroke="#fff" opacity=".6" d="M20 200 q12 -5 24 0 t24 0 M120 214 q12 -5 24 0 t24 0 M250 206 q12 -5 24 0 t24 0 M330 224 q12 -5 24 0 t24 0"/>`,

  cafe: () => `<rect width="400" height="240" fill="#6E3B2E"/>
  <rect width="400" height="130" fill="#2F5D50"/>
  ${[0,1,2,3,4,5,6,7,8,9].map(i => `<path d="M${i * 44} 0 V130" stroke="#264D42" stroke-width="16"/>`).join('')}
  <circle cx="90" cy="46" r="18" fill="#F7D98A" opacity=".85"/><circle cx="310" cy="46" r="18" fill="#F7D98A" opacity=".85"/>
  <path d="M90 28 V0 M310 28 V0" stroke="#C9A227" stroke-width="2"/>
  <ellipse cx="200" cy="176" rx="160" ry="40" fill="#EEE8DA" class="t"/>
  <path d="M60 176 q30 10 60 4 M250 186 q40 -4 80 -12" stroke="#C8C0AE" stroke-width="1.5" fill="none"/>
  <ellipse cx="190" cy="170" rx="46" ry="12" fill="#fff" class="t"/>
  <path class="t" fill="#fff" d="M160 126 H220 V150 Q220 170 190 170 Q160 170 160 150Z"/>
  <path class="i" d="M220 134 q18 0 18 12 q0 12 -18 12"/>
  <ellipse cx="190" cy="127" rx="30" ry="6" fill="#B07A45" class="t" stroke-width="1.4"/>
  <path class="i" stroke="#F4ECDB" d="M178 112 q-8 -10 0 -20 t0 -20 M198 114 q-8 -10 0 -20 t0 -20"/>
  <rect x="262" y="120" width="30" height="50" rx="3" fill="rgba(220,235,240,.8)" class="t"/>
  <path d="M265 140 h24" stroke="#8FB3BE" stroke-width="10" opacity=".5"/>
  <path class="i" stroke="#1B120E" stroke-width="4" d="M40 240 V150 Q40 110 70 110 Q98 110 98 150 V240"/>`,

  park: () => `${sky()}
  <path d="M0 200 H400 V240 H0Z" class="gr"/>
  <circle cx="50" cy="150" r="46" class="gr" opacity=".9"/><circle cx="360" cy="146" r="50" class="gr" opacity=".9"/>
  <circle cx="92" cy="170" r="30" class="gr" opacity=".7"/>
  <path class="w t" d="M130 200 V104 Q200 44 270 104 V200 H246 V112 Q200 76 154 112 V200Z"/>
  <path class="i" stroke-width="1.4" d="M140 108 Q200 58 260 108"/>
  <rect class="w t" x="180" y="180" width="40" height="20"/>
  <g class="g" stroke="#8E6F17" stroke-width="1.2">
  <circle cx="200" cy="112" r="8"/>
  <path d="M190 120 Q200 118 210 120 L214 160 L206 180 H194 L186 160Z"/>
  <path d="M208 124 L230 108 L234 112 L212 130Z"/><ellipse cx="222" cy="118" rx="8" ry="5" transform="rotate(-35 222 118)"/>
  <path d="M190 126 L172 140 L176 144 L194 132Z"/><path d="M170 146 L240 100" stroke="#8E6F17" stroke-width="1.6"/></g>`,

  mic: () => `${sky(false, true)}
  <circle cx="200" cy="120" r="84" fill="none" stroke="#FF5C8A" stroke-width="5" opacity=".9"/>
  <circle cx="200" cy="120" r="84" fill="none" stroke="#FF5C8A" stroke-width="16" opacity=".18"/>
  <path class="t" fill="#2A2A33" d="M188 128 L196 206 H204 L212 128Z"/>
  <circle cx="200" cy="104" r="28" fill="#C8CCD6" class="t"/>
  ${[-16,-8,0,8,16].map(d => `<path d="M${184} ${104 + d} H216" stroke="#8B90A0" stroke-width="1.2"/>`).join('')}
  <path class="g t" stroke-width="1.4" d="M178 74 L184 58 L192 68 L200 52 L208 68 L216 58 L222 74Z"/>
  <path d="M104 70 v-26 l18 -5 v26" stroke="var(--art-gold)" stroke-width="3" fill="none"/>
  <circle cx="100" cy="72" r="5" class="g"/><circle cx="118" cy="67" r="5" class="g"/>
  <path d="M300 170 v-24" stroke="var(--art-gold)" stroke-width="3"/><circle cx="296" cy="172" r="5" class="g"/>`,

  wurst: () => `${sky(false, true)}
  <rect x="70" y="92" width="260" height="120" class="w t"/>
  <path class="t" d="M60 92 H340 L330 62 H70Z" fill="var(--art-red)"/>
  ${[0,1,2,3,4,5,6].map(i => `<path d="M${88 + i * 36} 62 L${82 + i * 36} 92 H${100 + i * 36}Z" fill="#fff" opacity=".85"/>`).join('')}
  <rect x="90" y="108" width="220" height="44" fill="#F7D98A" class="t" stroke-width="1.4"/>
  <ellipse cx="170" cy="182" rx="70" ry="14" fill="#fff" class="t"/>
  <path class="t" fill="#B5553A" d="M112 176 Q170 156 228 176 Q232 186 222 188 Q170 174 118 188 Q106 186 112 176Z"/>
  <circle cx="140" cy="176" r="3" fill="#F6E27A"/><circle cx="170" cy="171" r="3" fill="#F6E27A"/><circle cx="200" cy="175" r="3" fill="#F6E27A"/>
  <path d="M128 172 q10 -6 20 0 t20 0 t20 0 t20 0" stroke="#E9B92B" stroke-width="3" fill="none"/>
  <path class="t" fill="rgba(240,220,150,.7)" d="M262 140 H292 L282 170 V190 H288 V194 H266 V190 H272 V170Z"/>
  <circle cx="276" cy="150" r="1.6" fill="#fff"/><circle cx="280" cy="158" r="1.3" fill="#fff"/>`,

  beer: () => `<rect width="400" height="240" fill="#4A2F22"/>
  <path d="M0 0 H400 V60 Q200 90 0 60Z" fill="#3A241A"/>
  <path class="t" fill="#C8763A" d="M60 210 V130 Q60 70 140 70 Q220 70 220 130 V210Z"/>
  <path d="M80 120 Q140 90 200 120" stroke="#E7A56A" stroke-width="4" fill="none" opacity=".7"/>
  <rect x="132" y="50" width="16" height="22" fill="#C8763A" class="t"/>
  <path class="i" stroke="#E7A56A" d="M140 50 V20 H260"/>
  <path class="t" fill="rgba(245,190,70,.9)" d="M260 120 H330 V210 Q330 216 324 216 H266 Q260 216 260 210Z"/>
  <path class="i" d="M330 136 q26 0 26 22 q0 22 -26 22"/>
  <path fill="#FFF8E6" class="t" stroke-width="1.6" d="M256 122 q4 -16 18 -12 q6 -12 20 -6 q12 -10 24 2 q14 0 12 16Z"/>
  <circle cx="285" cy="160" r="2" fill="#fff"/><circle cx="300" cy="180" r="2" fill="#fff"/><circle cx="280" cy="194" r="1.6" fill="#fff"/>
  <rect x="0" y="210" width="400" height="30" fill="#2B1B14"/>`,

  rooftop: () => `<defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A3F6B"/><stop offset=".55" stop-color="#D8736A"/><stop offset="1" stop-color="#F3C27A"/></linearGradient></defs>
  <rect width="400" height="240" fill="url(#dusk)"/>
  <circle cx="300" cy="150" r="26" fill="#FFE2A0" opacity=".9"/>
  <path fill="#2A2438" d="M0 240 V176 H30 V160 H52 V178 H80 L96 60 L112 178 H140 V150 Q160 126 180 150 V178 H210 V164 H240 V180 H270 V170 H300 V184 H340 V160 H360 V184 H400 V240Z"/>
  <path d="M96 60 V48" stroke="#2A2438" stroke-width="3"/>
  <rect x="0" y="206" width="400" height="34" fill="#1B1726" opacity=".85"/>
  <path class="t" fill="rgba(255,190,120,.85)" d="M40 150 H96 L72 180 V214 H84 V220 H52 V214 H64 V180Z"/>
  <circle cx="84" cy="146" r="7" fill="#9BD06A" class="t" stroke-width="1.4"/>`,

  favoriten: () => `${sky()}
  <rect class="br t" x="20" y="70" width="110" height="140"/>
  <rect class="y t" x="130" y="96" width="90" height="114"/>
  <rect class="br t" x="220" y="80" width="80" height="130"/>
  ${[0,1,2,3,4].map(r => windows(32, 84 + r * 24, 4, 24, 10, 14)).join('')}
  ${[0,1,2,3].map(r => windows(142, 106 + r * 24, 3, 26, 10, 14)).join('')}
  ${[0,1,2,3,4].map(r => windows(232, 92 + r * 24, 3, 22, 10, 14)).join('')}
  <path d="M0 210 H400 V240 H0Z" fill="#B7AE9C"/>
  <path class="t" fill="#E9C27A" d="M318 150 L346 222 L374 150Z"/>
  <path class="i" stroke-width="1.2" d="M324 162 L366 162 M330 178 L360 178 M336 194 L354 194"/>
  <circle cx="346" cy="138" r="24" fill="#FFF3DA" class="t"/>
  <circle cx="346" cy="138" r="9" fill="#F0A33A"/>
  <path d="M330 124 q16 -8 32 0" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>`,

  suitcase: () => `${sky(true)}
  <path class="i" d="M40 70 q80 -40 150 -10" stroke-dasharray="6 8"/>
  <path class="w t" d="M190 58 l30 -6 l6 -12 l6 10 l20 2 l-18 8 l-6 14 l-6 -10z"/>
  <rect class="t" fill="var(--art-red)" x="120" y="100" width="160" height="112" rx="14"/>
  <path class="i" d="M170 100 V84 Q170 78 176 78 H224 Q230 78 230 84 V100"/>
  <path d="M150 100 V212 M250 100 V212" stroke="#7A2733" stroke-width="6"/>
  <circle cx="175" cy="150" r="16" class="g t" stroke-width="1.4"/>
  <rect x="210" y="160" width="34" height="22" rx="4" class="y t" stroke-width="1.4"/>
  <path d="M0 212 H400 V240 H0Z" fill="#B7AE9C"/>`
};
function art(key) {
  const f = ART[key] || ART.favoriten;
  return `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${ART_STYLE}${f()}</svg>`;
}

const PLACES = {
  favoriten: {
    name: "Favoriten", kind: "Vuestro barrio", art: "favoriten", era: "c. 1900",
    lat: 48.1745, lon: 16.3775, q: "Reumannplatz, Wien",
    audio: "Bienvenidos a Favoriten, el distrito diez de Viena y el más poblado de la ciudad. Su nombre viene de la Favoritenstraße, la calle que llevaba hasta La Favorita, una residencia de verano de los Habsburgo. A finales del siglo diecinueve este era el gran barrio obrero de Viena. Aquí vivían miles de trabajadores, muchos llegados de Bohemia, que fabricaban en los hornos del Wienerberg los ladrillos con los que se levantó media ciudad imperial. Hoy es un barrio vivo y mezclado, con el mercado de Viktor-Adler-Platz como corazón.",
    facts: [
      "Es el distrito con más vecinos de Viena: supera los 200.000 habitantes.",
      "El Amalienbad, en Reumannplatz, es una piscina pública de 1926 con un interior art déco que parece un decorado de cine.",
      "La estación central de Viena, inaugurada en 2014, está en el borde norte del distrito."
    ],
    secret: "En Reumannplatz está el Eissalon Tichy, la heladería que popularizó los Eismarillenknödel: bolas de helado de vainilla con corazón de albaricoque, rebozadas como las albóndigas de fruta vienesas. Suele cerrar por temporada a principios de otoño, así que mirad si sigue abierta antes de ir."
  },
  donaukanal: {
    name: "Donaukanal", kind: "Paseo junto al agua", art: "canal", era: "c. 1910",
    lat: 48.2125, lon: 16.3790, q: "Donaukanal Schwedenplatz, Wien",
    audio: "El Donaukanal, el Canal del Danubio, no es en realidad un canal. Es un brazo del río que los vieneses fueron domando durante siglos para protegerse de las crecidas. Durante mucho tiempo fue la trasera olvidada de la ciudad, y hoy es uno de sus sitios con más vida. Sus muros forman una galería de grafiti al aire libre que cambia casi cada semana. Fijaos también en las orillas: el arquitecto Otto Wagner dejó aquí edificios y estaciones modernistas de la antigua Stadtbahn, el tren urbano de Viena.",
    facts: [
      "La Urania, donde el río Viena se une al canal, es un observatorio y centro cultural de 1910.",
      "El Schützenhaus de Otto Wagner se diseñó para una esclusa y un puerto que nunca llegaron a terminarse. Hoy es un bar.",
      "En los meses de calor las orillas se llenan de terrazas y chiringuitos."
    ],
    secret: "Buscad la Wiener Wand: los tramos de muro donde la ciudad permite pintar grafiti de forma legal. Si veis a alguien trabajando con los sprays, podéis quedaros a mirar. Es parte del espectáculo."
  },
  shangrila: {
    name: "Shangrila Karaoke", kind: "Karaoke en Erdberg", art: "mic", era: "1192",
    lat: 48.1918, lon: 16.4128, q: "Shangrila Karaoke Bar, Franzosengraben 3, Wien",
    audio: "Esta noche cantáis en Erdberg, un rincón del distrito tres con una historia de película. En diciembre de 1192, Ricardo Corazón de León volvía de las Cruzadas disfrazado, intentando cruzar las tierras de su enemigo, el duque Leopoldo de Austria. Según las crónicas, lo descubrieron en una posada aquí mismo, en Erdberg, y lo tuvieron preso más de un año. Inglaterra pagó un rescate enorme, y con parte de ese dinero se levantaron las murallas de Viena.",
    facts: [
      "Shangrila abre todos los días de 17:00 a 04:00.",
      "Tiene zona de bar abierta con escenario, y salas privadas para grupos grandes.",
      "Se llega en metro: línea U3, parada Erdberg."
    ],
    secret: "Cuenta la leyenda que el trovador Blondel encontró al rey cantando una canción bajo las torres donde lo tenían encerrado, y que Ricardo respondió desde dentro con la segunda estrofa. O sea, que en Austria un dúo improvisado ya salvó a un rey. Esta noche os toca a vosotros."
  },
  goldegg: {
    name: "Café Goldegg", kind: "Café vienés modernista", art: "cafe", era: "c. 1910",
    lat: 48.1906, lon: 16.3772, q: "Café Goldegg, Argentinierstraße 49, Wien",
    audio: "El Café Goldegg es un café vienés de los de siempre, con sofás de terciopelo verde, lámparas modernistas y mesa de billar. La cultura del café de Viena está reconocida en Austria como patrimonio cultural inmaterial, y tiene sus propias reglas. El café siempre llega con un vaso de agua, y nadie os va a meter prisa aunque paséis horas con una sola taza. Pedid un desayuno vienés y una Melange, que es la prima vienesa del capuchino.",
    facts: [
      "Una Melange es café con leche espumada. Un Einspänner es un café fuerte coronado de nata, servido en vaso.",
      "Los periódicos cuelgan de soportes de madera para leerlos en la mesa.",
      "Abre a las 9:00 los fines de semana y a las 8:00 entre semana."
    ],
    secret: "Aquí la cuenta no llega sola. Para pedirla como un vienés, llamad al camarero Herr Ober y decid: Zahlen, bitte. Con esas tres palabras os ganáis su respeto."
  },
  belvedere: {
    name: "Belvedere Superior", kind: "Palacio barroco y museo de Klimt", art: "belvedere", era: "1723",
    lat: 48.1915, lon: 16.3809, q: "Oberes Belvedere, Wien",
    audio: "El Belvedere fue el palacio de verano del príncipe Eugenio de Saboya, el general que derrotó una y otra vez a los otomanos y acabó siendo uno de los hombres más ricos del imperio. Lo diseñó el arquitecto Johann Lukas von Hildebrandt, y la parte de arriba, el Belvedere Superior, se terminó en 1723. Hoy es un museo con la mayor colección de cuadros de Gustav Klimt del mundo. La estrella es El Beso, pintado hacia 1908 con pan de oro de verdad. El Estado austríaco lo compró ese mismo año, y desde entonces no ha salido de Viena.",
    facts: [
      "Fijaos en los pies de la mujer de El Beso: está de rodillas al borde de un precipicio cubierto de flores.",
      "Aquí cuelga una de las versiones de Napoleón cruzando los Alpes, de Jacques-Louis David.",
      "Las cabezas de carácter de Franz Xaver Messerschmidt, bustos con muecas exageradas, son una joya que casi nadie espera."
    ],
    secret: "En el Salón de Mármol se firmó en 1955 el Tratado de Estado que devolvió a Austria su independencia. El ministro Leopold Figl mostró el documento a la multitud desde el balcón, y su frase Österreich ist frei, Austria es libre, quedó para la historia. Asomaos a los jardines desde ahí y pensad en ese momento."
  },
  salmbrau: {
    name: "Salm Bräu", kind: "Cervecería con fábrica propia", art: "beer", era: "Antes",
    lat: 48.1975, lon: 16.3797, q: "Salm Bräu, Rennweg 8, Wien",
    audio: "Salm Bräu es una cervecería que elabora su propia cerveza aquí mismo, en las calderas de cobre que veréis en la sala. La cerveza pasa del tanque al vaso sin viajar. Está en el Rennweg, a un paso del Belvedere, y es un templo de la cocina vienesa contundente. Sus platos más famosos son el codillo al horno, que aquí llaman Stelze, y las costillas.",
    facts: [
      "Rennweg significa algo así como camino de carreras: el nombre viene de las carreras de caballos que se celebraban por aquí.",
      "Las cervezas cambian según la temporada: preguntad por la especial de la casa.",
      "A mediodía de sábado se llena. Mejor con mesa reservada."
    ],
    secret: "Si queréis un vaso pequeño, pedid a Seidl, que es un tercio. Si queréis medio litro, pedid a Krügerl. Con esas dos palabras el camarero os tomará por vieneses."
  },
  stadtpark: {
    name: "Stadtpark", kind: "Parque romántico", art: "park", era: "1862",
    lat: 48.2046, lon: 16.3795, q: "Johann Strauss Denkmal, Stadtpark, Wien",
    audio: "El Stadtpark fue el primer parque público de Viena, abierto en 1862 sobre el terreno que antes ocupaban las murallas de la ciudad. Cuando el emperador Francisco José mandó derribarlas, nació la gran avenida del Ring, y con ella este parque. Su estrella es la estatua dorada de Johann Strauss hijo, el rey del vals, tocando el violín bajo un arco de mármol. Muy cerca está el Kursalon, donde el propio Strauss dirigió conciertos.",
    facts: [
      "La estatua de Strauss es de 1921. El dorado que brilla hoy se añadió muchos años después.",
      "Entre los árboles se esconden también monumentos a Schubert, Bruckner y Lehár.",
      "El río Viena cruza el parque encajonado entre muros y escaleras modernistas."
    ],
    secret: "Junto al río hay un portal modernista de principios del siglo veinte, el Wienflussportal, justo donde el río Viena sale de debajo de la ciudad. Es uno de los rincones más fotogénicos del parque y casi nadie se acerca."
  },
  staatsoper: {
    name: "Ópera Estatal de Viena", kind: "Una tragedia florentina y El castillo de Barbazul", art: "opera", era: "1869",
    lat: 48.2030, lon: 16.3691, q: "Wiener Staatsoper, Wien",
    audio: "La Ópera Estatal de Viena se inauguró en 1869 con Don Giovanni de Mozart. Fue el primer gran edificio del Ring, y al principio a los vieneses no les gustó nada. Decían que parecía hundido, porque la calle se elevó cuando ya estaba en obras. Sus dos arquitectos murieron antes de la inauguración, y la leyenda une esas muertes a las críticas. Se cuenta que desde entonces el emperador Francisco José respondía a cualquier cosa con la misma frase prudente: ha sido muy bonito, me ha gustado mucho. En 1945 una bomba destruyó la sala, y la Ópera renació en 1955 con Fidelio de Beethoven. Esta noche veréis a Asmik Grigorian cantando los dos papeles femeninos, en dos óperas cortas que llevaban décadas sin representarse en esta casa.",
    facts: [
      "Gustav Mahler, director entre 1897 y 1907, fue quien impuso apagar las luces de la sala durante la función.",
      "Cada asiento tiene su propia pantalla de subtítulos, también en español.",
      "Hay una charla introductoria media hora antes de la función, en la sala Gustav Mahler."
    ],
    secret: "Mahler fue también quien dejó sin entrar a los que llegaban tarde. Más de un siglo después la regla sigue en pie: si llegáis después de las 19:00, os toca esperar a la pausa. Entrad con tiempo y aprovechad la charla de las 18:30."
  },
  bitzinger: {
    name: "Bitzinger", kind: "Puesto de salchichas", art: "wurst", era: "Antes",
    lat: 48.2044, lon: 16.3686, q: "Bitzinger Würstelstand Albertina, Wien",
    audio: "Bitzinger es el puesto de salchichas más famoso de Viena, frente a la Albertina y a un paso de la Ópera. Aquí es normal ver a gente de gala comiendo de pie después de la función, a veces con una copa de champán, porque sí, aquí también sirven champán. El clásico es la Käsekrainer, una salchicha rellena de queso que se derrite al morderla.",
    facts: [
      "El Würstelstand es una institución vienesa: el único sitio donde se mezclan todos, del obrero al abonado de palco.",
      "La mostaza se pide dulce, süß, o picante, scharf.",
      "Abre hasta muy tarde, perfecto al salir de la ópera."
    ],
    secret: "En argot vienés se pide así: a Eitrige mit an Buckl und a Sechzehnerblech. Es una Käsekrainer, con la punta del pan y una lata de cerveza Ottakringer. Decidlo en voz alta y ya veréis la cara del que os atiende."
  },
  palmenhausburg: {
    name: "Brasserie Palmenhaus", kind: "Copas en un invernadero modernista", art: "palm", era: "c. 1905",
    lat: 48.2050, lon: 16.3664, q: "Palmenhaus Burggarten, Wien",
    audio: "La Brasserie Palmenhaus ocupa un invernadero modernista de hierro y cristal, levantado a principios del siglo veinte por el arquitecto Friedrich Ohmann en el Burggarten. Este jardín fue durante décadas el jardín privado del emperador, y solo se abrió al público tras la caída de la monarquía. De noche, con las palmeras iluminadas y el cristal reflejando las luces, es uno de los sitios más bonitos de Viena para la última copa.",
    facts: [
      "En el mismo edificio está la Casa de las Mariposas, con cientos de mariposas tropicales volando libres.",
      "En el jardín está el monumento a Mozart, con una clave de sol dibujada con flores delante.",
      "El Burggarten se abrió al público en 1919."
    ],
    secret: "Al salir, buscad la estatua de Mozart en el Burggarten. De noche casi no pasa nadie y es el sitio perfecto para una foto de los dos."
  },
  schonbrunn: {
    name: "Palacio de Schönbrunn", kind: "Residencia de verano de los Habsburgo", art: "schonbrunn", era: "s. XVIII",
    lat: 48.1848, lon: 16.3122, q: "Schloss Schönbrunn, Wien",
    audio: "Schönbrunn significa fuente bonita. El nombre viene de un manantial que, según la leyenda, encontró el emperador Matías durante una cacería. El palacio fue la residencia de verano de los Habsburgo y tiene más de mil cuatrocientas habitaciones. Aquí vivió María Teresa con sus dieciséis hijos, aquí se alojó Napoleón, y aquí nació y murió el emperador Francisco José. Su color es tan famoso que tiene nombre propio: el amarillo Schönbrunn, que se usó en edificios oficiales de todo el imperio.",
    facts: [
      "El zoo de Schönbrunn, fundado en 1752, es el más antiguo del mundo que sigue abierto.",
      "Subid a la Gloriette, en lo alto de la colina: la vista del palacio con Viena al fondo es la mejor.",
      "La ruina romana del parque es falsa: se construyó ya en ruinas, en 1778, porque estaba de moda."
    ],
    secret: "En la Sala de los Espejos, un Mozart de seis años tocó para María Teresa en 1762. Cuenta la historia que resbaló en el suelo encerado, que una archiduquesa de su edad le ayudó a levantarse, y que él le prometió casarse con ella de mayor. Aquella niña era María Antonieta."
  },
  palmenhaussch: {
    name: "Palmenhaus de Schönbrunn", kind: "Invernadero imperial", art: "palm", era: "1882",
    lat: 48.1870, lon: 16.3050, q: "Palmenhaus Schönbrunn, Wien",
    audio: "El Palmenhaus de Schönbrunn lo mandó construir el emperador Francisco José en 1882, y es uno de los invernaderos más grandes del continente europeo. Mide ciento once metros de largo y está hecho con decenas de miles de cristales. Dentro hay tres pabellones con tres climas distintos, unidos por pasillos: del Mediterráneo al trópico en unos pocos pasos.",
    facts: [
      "La planta más veterana es un olivo español de unos 350 años.",
      "Hay una palmera de unos 23 metros de altura bajo la cúpula.",
      "En octubre abre de 10:00 a 17:00, con última entrada media hora antes."
    ],
    secret: "Buscad el olivo español: lleva unos tres siglos y medio vivo. Para dos que vienen de Andalucía, es como encontrarse a un paisano en Viena."
  },
  stephansdom: {
    name: "Catedral de San Esteban", kind: "El corazón de Viena", art: "stephansdom", era: "1433",
    lat: 48.2085, lon: 16.3731, q: "Stephansdom, Wien",
    audio: "La Catedral de San Esteban es el corazón de Viena, y los vieneses la llaman con cariño Steffl. Su Torre Sur mide unos ciento treinta y seis metros y se terminó en 1433. Durante siglos fue el puesto de vigilancia de la ciudad: desde lo alto, un guardia daba la alarma si veía un incendio. Mirad el tejado: tiene unas doscientas treinta mil tejas vidriadas que dibujan el águila de dos cabezas de los Habsburgo y el escudo de Viena. En esta catedral se casó Mozart en 1782, y aquí se celebró también su funeral.",
    facts: [
      "La Torre Sur se sube a pie: 343 escalones hasta la antigua habitación del vigía. Cierra a las 17:30.",
      "La Pummerin, en la Torre Norte, es la campana más grande de Austria.",
      "Junto a la puerta principal hay dos barras de hierro en la pared: eran las medidas oficiales para comprobar que los comerciantes no engañaban con la tela."
    ],
    secret: "A la derecha de la puerta principal hay grabado en la piedra un pequeño O5. Era la señal secreta de la resistencia austríaca contra los nazis: el 5 es la E, quinta letra del alfabeto, y OE es la abreviatura de Österreich. Hoy está protegido tras un cristal."
  },
  onyx: {
    name: "Atardecer con vistas", kind: "Sugerencia: Onyx Bar, en la Haas Haus", art: "rooftop", era: "1990",
    lat: 48.2081, lon: 16.3718, q: "Onyx Bar Haas Haus, Wien",
    audio: "Justo enfrente de la catedral se levanta la Haas Haus, un edificio de cristal y piedra del arquitecto Hans Hollein, terminado en 1990. Cuando se construyó fue un escándalo: muchos vieneses no querían algo tan moderno frente al Steffl. Hoy es parte de la postal, porque su fachada curva refleja la catedral como un espejo. Desde su bar de la sexta planta, la torre gótica queda casi al alcance de la mano. Es un buen sitio para ver cómo se encienden las luces de Viena.",
    facts: [
      "La fachada de cristal de la Haas Haus refleja la catedral: buscad la foto desde la plaza.",
      "A mediados de octubre el sol se pone en Viena sobre las 18:15.",
      "Confirmad el horario del bar antes de ir, porque los domingos puede variar."
    ],
    secret: "Pedid mesa junto a la ventana que mira a la catedral y brindad cuando se encienda la iluminación del tejado. Es el momento de sacar lo que tengáis guardado para decir."
  }
};


const DAYS = [
  { key: "2026-10-09", short: "Vie", num: "9", label: "Viernes 9 de octubre", title: "Llegada, canal y karaoke",
    stops: [
      { t: "17:00", p: "favoriten", title: "Llegada y check-in", note: "Dejar las maletas en el B&B de Favoriten." },
      { t: "17:30", p: "donaukanal", title: "Paseo por Favoriten y el Donaukanal", note: "Paseo tranquilo hasta el canal, con arte urbano y terrazas." },
      { t: "20:30", p: "shangrila", title: "Noche de karaoke en Shangrila", note: "Franzosengraben 3. Metro U3, parada Erdberg." }
    ] },
  { key: "2026-10-10", short: "Sáb", num: "10", label: "Sábado 10 de octubre", title: "Klimt, cerveza y ópera",
    stops: [
      { t: "09:00", p: "goldegg", title: "Desayuno vienés", note: "Abre a las 9:00. Está a 10 minutos andando del Belvedere." },
      { t: "10:00", p: "belvedere", title: "Arte imperial y El Beso", note: "Belvedere Superior hasta las 13:00.", tag: ["warn", "Comprar entrada con franja"], link: ["https://www.belvedere.at", "Comprar entradas"] },
      { t: "14:00", p: "salmbrau", title: "Comida tradicional", note: "Justo al salir del recinto del Belvedere.", tag: ["warn", "Reservar mesa"] },
      { t: "15:00", p: "stadtpark", title: "Paseo digestivo por el Stadtpark", note: "Hasta las 17:30. Andando o en tranvía 1 o 2." },
      { t: "18:15", p: "staatsoper", title: "Noche de ópera", note: "Charla a las 18:30. Función de 19:00 a 21:30, con una pausa. Dejad abrigos en el ropero.", tag: ["ok", "Entradas compradas"] },
      { t: "21:30", p: "bitzinger", title: "Cena callejera", note: "Käsekrainer junto a la Albertina y paseo nocturno." },
      { t: "22:30", p: "palmenhausburg", title: "Copas en el invernadero", note: "Cierre de la noche en el Burggarten." }
    ] },
  { key: "2026-10-11", short: "Dom", num: "11", label: "Domingo 11 de octubre", title: "Schönbrunn y la catedral",
    stops: [
      { t: "10:00", p: "schonbrunn", title: "Jardines de Schönbrunn", note: "Mañana por la zona oeste del parque." },
      { t: "11:30", p: "palmenhaussch", title: "Palmenhaus", note: "Los jardines son libres; la entrada al invernadero se paga en taquilla." },
      { t: "14:00", p: "favoriten", title: "Comida en Favoriten", note: "Cerca del alojamiento." },
      { t: "16:00", p: "stephansdom", title: "Café y catedral", note: "Visita al interior de San Esteban." },
      { t: "16:30", p: "stephansdom", title: "Subida a la Torre Sur", note: "343 escalones. La torre cierra a las 17:30.", tag: ["warn", "Antes de las 17:30"] },
      { t: "18:00", p: "onyx", title: "Atardecer con vistas", note: "Una copa mirando a la catedral mientras se pone el sol." }
    ] },
  { key: "2026-10-12", short: "Lun", num: "12", label: "Lunes 12 de octubre", title: "Último desayuno",
    stops: [
      { t: "08:00", p: "goldegg", title: "Último desayuno vienés", note: "Entre semana abre a las 8:00." },
      { t: "", p: null, title: "Rumbo a casa", note: "Maletas y aeropuerto. Auf Wiedersehen, Wien." }
    ] }
];

/* Tipos: buzz (duelo de pulsador), guess (estimación secreta), hunt (búsqueda en el sitio),
   mission (reto), order (ordena la historia), sing (canta la palabra) */
const GAMES = {
  favoriten: [
    { type: "guess", title: "¿En qué año abrió el Amalienbad?", q: "La piscina art déco de Reumannplatz. Cada uno escribe su año a escondidas.", answer: 1926, unit: "", fact: "Abrió en 1926, en plena Viena Roja, cuando la ciudad construía baños públicos para que las familias obreras pudieran asearse y nadar." },
    { type: "buzz", title: "Los ladrilleros de Favoriten", q: "¿De dónde llegaron muchos de los obreros que fabricaban ladrillos en Favoriten?", opts: ["Bohemia", "Baviera", "Tirol", "Hungría"], a: 0, fact: "Llegaron sobre todo de Bohemia, en la actual Chequia. En Viena se les llamaba Ziegelböhm, los bohemios del ladrillo." },
    { type: "hunt", title: "Botín del mercado", q: "Id al mercado de Viktor-Adler-Platz. Gana quien encuentre primero un puesto que venda…", targets: ["algo con la palabra Apfel (manzana)", "un producto con la palabra Käse (queso)", "algo con la palabra Brot (pan)", "una fruta que no sepáis nombrar en alemán"], fact: "Viktor Adler, que da nombre a la plaza, fundó el partido socialdemócrata austríaco. Era médico y trataba a los obreros pobres de Viena." },
    { type: "mission", title: "Pedido sin inglés", q: "Pedid algo en una heladería o un café solo en alemán: Ich hätte gern… bitte. Gana quien consiga que le contesten en alemán y no le cambien al inglés.", fact: "Ich hätte gern significa me gustaría tener. Es la forma educada de pedir en cualquier sitio de Viena." }
  ],
  donaukanal: [
    { type: "mission", title: "El trabalenguas del capitán", q: "Decid de un tirón y sin mirar: Donaudampfschifffahrtsgesellschaftskapitän. Cada uno lo intenta una vez y el otro juzga.", fact: "Significa capitán de la compañía de barcos de vapor del Danubio. Es la palabra larga favorita de los austríacos para presumir de idioma." },
    { type: "hunt", title: "Caza de grafiti", q: "Paseando por el canal, gana quien encuentre primero un grafiti con…", targets: ["un corazón", "un animal", "una cara", "una palabra en español", "un personaje de dibujos"], fact: "Los tramos de la Wiener Wand son muros donde pintar es legal. Por eso las obras cambian casi cada semana." },
    { type: "buzz", title: "¿Qué es el Donaukanal?", q: "El Donaukanal en realidad es…", opts: ["Un brazo del Danubio", "Un canal excavado en el siglo XX", "El río Viena", "Un canal romano"], a: 0, fact: "Es un antiguo brazo del Danubio que se fue regulando durante siglos. El Danubio principal pasa más al norte, lejos del centro." },
    { type: "buzz", title: "Dos verdades y una mentira", q: "¿Cuál es la mentira?", opts: ["El Schützenhaus de Otto Wagner iba a ser parte de una esclusa", "La Urania es un observatorio de 1910", "Cada invierno el canal se congela y se patina sobre él"], a: 2, fact: "El canal no se congela cada invierno. En Viena se patina en la plaza del Ayuntamiento, en el Wiener Eistraum." }
  ],
  shangrila: [
    { type: "sing", title: "Canta la palabra", q: "Por turnos, os sale una palabra y tenéis 10 segundos para empezar a cantar una canción que la contenga. El otro juzga.", words: ["amor", "noche", "corazón", "fuego", "luna", "bailar", "mar", "cielo", "loco", "beso", "sol", "verano", "tiempo", "fiesta", "vida", "playa", "sueño", "ojos", "calle", "ciudad", "lluvia", "dinero", "rey", "Viena"], fact: "Lo que acabáis de hacer tiene nombre en Austria desde 1192: salvar a un rey cantando." },
    { type: "buzz", title: "El rey cazado", q: "¿En qué año capturaron a Ricardo Corazón de León aquí, en Erdberg?", opts: ["1192", "1683", "1492", "1805"], a: 0, fact: "Diciembre de 1192. Iba disfrazado, pero según una versión le delató el anillo de rey que no quiso quitarse." },
    { type: "buzz", title: "¿Qué pagó el rescate?", q: "Con parte del rescate de Ricardo se construyó en Viena…", opts: ["Las murallas", "La catedral", "El Hofburg", "El primer puente del Danubio"], a: 0, fact: "Las murallas de Viena y la ciudad de Wiener Neustadt se financiaron en parte con aquel rescate. Siglos después, al derribarlas, nació el Ring." },
    { type: "mission", title: "Duelo de canciones", q: "Cada uno elige una canción para que la cante el otro. Gana quien reciba más aplausos del bar. Si no hay público, decide el camarero.", fact: "En Shangrila podéis cantar en la zona abierta con escenario. Las salas privadas son para grupos grandes." }
  ],
  goldegg: [
    { type: "buzz", title: "Habla café", q: "¿Qué es una Melange?", opts: ["Café con leche espumada", "Café con nata montada", "Café con licor", "Café solo con agua"], a: 0, fact: "La Melange es la prima vienesa del capuchino. El café con nata en vaso se llama Einspänner." },
    { type: "guess", title: "La carta de cafés", q: "Antes de abrir la carta, cada uno apuesta cuántos cafés distintos ofrece. Luego contadlos.", onsite: true, unit: "cafés", fact: "Los cafés vieneses presumen de carta larga: cada combinación de café, leche, nata o licor tiene su propio nombre." },
    { type: "hunt", title: "Ojo de detective", q: "Sin levantaros de la mesa, gana quien vea primero…", targets: ["la mesa de billar", "un periódico en su soporte de madera", "una lámpara modernista", "alguien leyendo solo con su café", "el camarero de pajarita"], fact: "En los cafés vieneses es normal pasar horas con una sola taza. Nadie os va a meter prisa." },
    { type: "mission", title: "La cuenta, como un vienés", q: "Gana quien pida la cuenta primero diciendo Herr Ober, zahlen, bitte, sin reírse.", fact: "Herr Ober viene de Oberkellner, jefe de camareros. Los camareros de los cafés clásicos lo siguen oyendo con orgullo." }
  ],
  belvedere: [
    { type: "guess", title: "El año del palacio", q: "¿En qué año se terminó el Belvedere Superior?", answer: 1723, unit: "", fact: "En 1723. El príncipe Eugenio lo usaba para fiestas y recepciones, no para vivir." },
    { type: "buzz", title: "Guardianes del jardín", q: "¿Qué criaturas mitológicas vigilan los jardines del Belvedere?", opts: ["Esfinges", "Grifos", "Dragones", "Unicornios"], a: 0, fact: "Esfinges de piedra, con cuerpo de león y rostro de mujer. Buscadlas en el jardín de camino a la salida." },
    { type: "buzz", title: "Frente a El Beso", q: "Mirad bien el cuadro: ¿sobre qué están arrodillados los amantes?", opts: ["Un prado de flores al borde de un precipicio", "Un río dorado", "Un tablero de ajedrez", "Una alfombra de estrellas"], a: 0, fact: "Un prado de flores que termina en un abismo. Muchos lo leen como el amor al borde del peligro." },
    { type: "hunt", title: "¿Dónde está Napoleón?", q: "Gana quien se plante primero delante de Napoleón cruzando los Alpes, de David.", fact: "David pintó cinco versiones de este cuadro, y una de ellas está aquí." },
    { type: "mission", title: "Cara de Messerschmidt", q: "Delante de las cabezas de carácter de Messerschmidt, cada uno imita una. Pierde el primero que se ría.", fact: "Messerschmidt esculpió decenas de cabezas con muecas extremas. Se cree que muchas las modeló haciendo muecas frente al espejo." }
  ],
  salmbrau: [
    { type: "buzz", title: "Pide como un vienés", q: "¿Cómo pides medio litro de cerveza en Viena?", opts: ["A Krügerl", "A Seidl", "A Maß", "A Stange"], a: 0, fact: "Krügerl es medio litro y Seidl es un tercio. La Maß de un litro es cosa de Múnich." },
    { type: "order", title: "Ordena el sábado", q: "Ordenad del más antiguo al más reciente. Primero juega uno y luego el otro.", items: [["Se termina el Belvedere Superior", 1723], ["Abre el Stadtpark", 1862], ["Se inaugura la Ópera", 1869], ["Klimt pinta El Beso", 1908]], fact: "Todo lo que veis hoy cabe en menos de dos siglos: del barroco del príncipe Eugenio al oro de Klimt." },
    { type: "guess", title: "Cervezas de la casa", q: "Antes de mirar la carta, cada uno apuesta cuántas cervezas propias tienen hoy. Luego contadlas.", onsite: true, unit: "cervezas", fact: "En una cervecería con fábrica, la carta cambia con la temporada. Preguntad cuál acaba de salir del tanque." }
  ],
  stadtpark: [
    { type: "buzz", title: "El rey del vals", q: "¿Qué instrumento toca la estatua dorada de Johann Strauss?", opts: ["Violín", "Piano", "Flauta", "Violonchelo"], a: 0, fact: "El violín. Strauss dirigía su orquesta tocándolo de pie, como en la estatua." },
    { type: "hunt", title: "Busca al compositor", q: "Gana quien encuentre primero el monumento a…", targets: ["Franz Schubert", "Anton Bruckner", "Franz Lehár"], fact: "El Stadtpark es un pequeño panteón musical al aire libre, con monumentos a varios compositores escondidos entre los árboles." },
    { type: "hunt", title: "La salida del río", q: "Gana quien encuentre primero el Wienflussportal, el portal modernista por donde el río Viena sale de debajo de la ciudad.", fact: "Se construyó a principios del siglo XX, cuando se encauzó el río Viena para evitar inundaciones." },
    { type: "mission", title: "Vals imperial", q: "Bailad un vals de 20 segundos delante de Strauss, mirándoos a los ojos. Pierde el primero que se ría.", fact: "El Danubio azul, el vals más famoso de Strauss, se estrenó en 1867 y es casi un segundo himno austríaco." }
  ],
  staatsoper: [
    { type: "guess", title: "Cuenta los arcos", q: "Desde el Ring, mirad la galería de la fachada principal. ¿Cuántos arcos tiene? Cada uno escribe su número.", answer: 5, unit: "arcos", fact: "Cinco arcos, cada uno con una estatua de bronce: el heroísmo, la tragedia, la fantasía, la comedia y el amor. Arriba del techo, frescos de La flauta mágica." },
    { type: "buzz", title: "Animales en el tejado", q: "¿Qué hay encima de la galería de la fachada?", opts: ["Dos caballos alados", "Dos leones", "Dos águilas", "Dos dragones"], a: 0, fact: "Dos caballos alados, guiados por la Armonía y la musa de la Poesía. Los añadieron en 1876, siete años después de la inauguración." },
    { type: "buzz", title: "La primera función", q: "¿Con qué ópera se inauguró el edificio en 1869?", opts: ["Don Giovanni", "La flauta mágica", "Fidelio", "Aida"], a: 0, fact: "Don Giovanni de Mozart. Fidelio fue la que la reabrió en 1955, tras la guerra." },
    { type: "order", title: "Ordena la Ópera", q: "Del más antiguo al más reciente. Primero juega uno y luego el otro.", items: [["Inauguración con Don Giovanni", 1869], ["Mahler se hace director", 1897], ["Una bomba destruye la sala", 1945], ["Reapertura con Fidelio", 1955]], fact: "En el techo de la galería hay un fresco de Mozart niño sentado en el regazo de María Teresa. Mañana veréis dónde pasó." }
  ],
  bitzinger: [
    { type: "mission", title: "El pedido en argot", q: "Gana quien pida primero, completo y sin chuleta: a Eitrige mit an Buckl und a Sechzehnerblech.", fact: "Una Käsekrainer con la punta del pan y una lata de Ottakringer, la cerveza del distrito 16. De ahí lo de Sechzehner." },
    { type: "buzz", title: "¿Qué lleva dentro?", q: "Una Käsekrainer está rellena de…", opts: ["Queso", "Mostaza", "Chucrut", "Patata"], a: 0, fact: "Queso Emmental en trocitos que se funde con el calor. Mordedla con cuidado." },
    { type: "buzz", title: "Mostaza con carácter", q: "Si pides la mostaza scharf, te la dan…", opts: ["Picante", "Dulce", "Con miel", "Sin mostaza"], a: 0, fact: "Scharf es picante y süß es dulce. La dulce es la clásica para la salchicha blanca." }
  ],
  palmenhausburg: [
    { type: "hunt", title: "Buscando a Mozart", q: "Gana quien encuentre primero la estatua de Mozart en el Burggarten.", fact: "Delante suele haber una clave de sol dibujada con flores, que se replanta cada temporada." },
    { type: "buzz", title: "El jardín del emperador", q: "¿Hasta cuándo fue el Burggarten jardín privado del emperador?", opts: ["1919", "1848", "1900", "1955"], a: 0, fact: "Hasta 1919. Cayó la monarquía y el jardín del emperador pasó a ser de todos." },
    { type: "buzz", title: "Dos verdades y una mentira", q: "¿Cuál es la mentira?", opts: ["En el mismo edificio hay una casa de mariposas", "Lo diseñó el arquitecto Friedrich Ohmann", "Aquí se firmó la paz con Napoleón"], a: 2, fact: "La paz de 1809 con Napoleón se firmó en Schönbrunn, que visitáis mañana." }
  ],
  schonbrunn: [
    { type: "guess", title: "¿Cuántas habitaciones?", q: "¿Cuántas habitaciones tiene el palacio de Schönbrunn?", answer: 1441, unit: "habitaciones", fact: "1.441 habitaciones. Solo unas 40 se pueden visitar." },
    { type: "buzz", title: "El nombre", q: "¿Qué significa Schönbrunn?", opts: ["Fuente bonita", "Palacio amarillo", "Jardín del sol", "Casa de verano"], a: 0, fact: "Fuente bonita, por el manantial que según la leyenda encontró el emperador Matías cazando." },
    { type: "buzz", title: "Corona de la colina", q: "Subid la vista a la Gloriette. ¿Qué animal corona el edificio?", opts: ["Un águila", "Un león", "Un caballo", "Un ciervo"], a: 0, fact: "Un águila imperial sobre un globo. La Gloriette se construyó en 1775 como mirador y comedor." },
    { type: "buzz", title: "La promesa de Mozart", q: "¿Quién ayudó a levantarse al pequeño Mozart cuando resbaló en palacio?", opts: ["María Antonieta", "María Teresa", "Sissi", "Catalina la Grande"], a: 0, fact: "Según la historia, la joven María Antonieta. Mozart, con seis años, le prometió casarse con ella." },
    { type: "hunt", title: "Carrera a la ruina", q: "Gana quien llegue primero a la Ruina Romana del parque. Se permite usar el mapa.", fact: "Es falsa: se construyó ya en ruinas en 1778, porque las ruinas estaban de moda en los jardines." }
  ],
  palmenhaussch: [
    { type: "guess", title: "¿Cuánto mide?", q: "¿Cuántos metros de largo mide el Palmenhaus?", answer: 111, unit: "metros", fact: "Unos 111 metros de hierro y cristal, con tres climas distintos dentro." },
    { type: "hunt", title: "El abuelo olivo", q: "Gana quien encuentre primero el olivo español de unos 350 años.", fact: "Es la planta más veterana del invernadero. Un paisano vuestro en el corazón de Viena." },
    { type: "buzz", title: "¿Cuándo se construyó?", q: "¿En qué año se levantó este Palmenhaus?", opts: ["1882", "1752", "1908", "1805"], a: 0, fact: "En 1882, por encargo de Francisco José. 1752 es el año del zoo, el más antiguo del mundo en funcionamiento." }
  ],
  stephansdom: [
    { type: "guess", title: "Los escalones", q: "¿Cuántos escalones hay hasta el mirador de la Torre Sur?", answer: 343, unit: "escalones", fact: "343 escalones de piedra en espiral. Contadlos en voz alta mientras subís." },
    { type: "hunt", title: "El símbolo secreto", q: "Gana quien encuentre primero el O5 grabado junto a la puerta principal.", fact: "Era la señal de la resistencia contra los nazis: O más E, la quinta letra, forman OE de Österreich." },
    { type: "hunt", title: "Las medidas del mercado", q: "Gana quien encuentre primero las dos barras de hierro en la pared, junto a la puerta principal.", fact: "Eran las medidas oficiales de longitud. Si un comerciante os vendía tela, aquí se comprobaba si os engañaba." },
    { type: "buzz", title: "El tejado", q: "¿Qué dibujan las tejas de colores del tejado?", opts: ["El águila de dos cabezas", "Un león coronado", "La cruz de San Esteban", "Un dragón"], a: 0, fact: "El águila bicéfala de los Habsburgo por un lado y el escudo de Viena por el otro, con unas 230.000 tejas." },
    { type: "mission", title: "Carrera a la torre", q: "Gana quien llegue primero arriba de la Torre Sur. Salida a la vez desde el primer escalón.", fact: "Desde ahí arriba un vigía vigiló los incendios de la ciudad durante siglos, hasta 1955." }
  ],
  onyx: [
    { type: "buzz", title: "El arquitecto del espejo", q: "¿Quién diseñó la Haas Haus?", opts: ["Hans Hollein", "Otto Wagner", "Hundertwasser", "Adolf Loos"], a: 0, fact: "Hans Hollein, que había ganado el Pritzker, el Nobel de la arquitectura, en 1985." },
    { type: "mission", title: "La foto del reflejo", q: "Cada uno hace una foto de la catedral reflejada en la fachada de cristal. Enseñádselas a un desconocido o al camarero, que elige la mejor.", fact: "La fachada curva de la Haas Haus refleja la catedral. Por eso es la foto favorita de los fotógrafos locales." },
    { type: "buzz", title: "Gran final: la mentira del viaje", q: "¿Cuál es la mentira?", opts: ["Mahler empezó a apagar las luces en la ópera", "Mozart se casó en San Esteban", "El Beso viajó a Nueva York en los años 60"], a: 2, fact: "El Beso no sale de Viena. Si lo habéis visto, lo habéis visto en el único sitio donde se puede ver." }
  ]
};

/* Foto recortada: un trozo ampliado de la foto real */
const ZOOM_GAMES = {
 "favoriten": {
  "type": "zoom",
  "title": "El reloj de la plaza",
  "q": "Gana quien encuentre primero este punto en Reumannplatz.",
  "hint": "Mirad hacia arriba, por encima de los árboles de la plaza.",
  "fact": "Es la torre del Amalienbad. La piscina lleva el nombre de Amalie Pölzer, concejala socialdemócrata de la Viena Roja, que defendió los baños públicos para las familias obreras."
 },
 "donaukanal": {
  "type": "zoom",
  "title": "La cúpula misteriosa",
  "q": "Gana quien encuentre primero este punto paseando por el canal.",
  "hint": "Está donde el río Viena se une al canal, a un paso de Schwedenplatz.",
  "fact": "Es la cúpula de la Urania. El edificio se inauguró en 1910 con el emperador Francisco José, y su observatorio sigue abierto al público para mirar las estrellas."
 },
 "shangrila": {
  "type": "zoom",
  "title": "Ladrillo con historia",
  "q": "Gana quien encuentre primero esta fachada. Está en el Franzosengraben, la calle del karaoke: buscadla antes de entrar a cantar.",
  "hint": "Un edificio de ladrillo con una ventana redonda, cerca de la esquina con la Baumgasse.",
  "fact": "Era la administración del antiguo matadero de Sankt Marx. En 1976 un grupo de jóvenes ocupó el recinto, y de ahí nació la Arena, una de las salas de conciertos alternativas más conocidas de Viena."
 },
 "goldegg": {
  "type": "zoom",
  "title": "Vidriera en flor",
  "q": "Gana quien encuentre primero esta vidriera dentro del café.",
  "hint": "Mirad por encima de la zona de la barra.",
  "fact": "El Goldegg abrió hacia 1910, en plena época modernista. Las vidrieras y los apliques de latón son de ese estilo."
 },
 "belvedere": {
  "type": "zoom",
  "title": "Guardiana de piedra",
  "q": "Gana quien se plante primero delante de esta escultura exacta. Hay varias parecidas: fijaos en lo que se ve detrás.",
  "hint": "Está en el jardín, delante de la fachada del Belvedere Superior.",
  "fact": "La esfinge une cuerpo de león y cabeza humana: fuerza e inteligencia, justo las dos virtudes de las que presumía el príncipe Eugenio."
 },
 "salmbrau": {
  "type": "zoom",
  "title": "El cartel de la caldera",
  "q": "Gana quien encuentre primero este cartel en la sala. La foto es de 2005: si el cartel ya no está, vale la caldera que tenía al lado.",
  "hint": "Buscad junto a las calderas de cobre donde se hace la cerveza.",
  "fact": "Maischbottich es la cuba de maceración. Ahí la malta triturada se mezcla con agua caliente para sacar los azúcares que luego se convierten en cerveza."
 },
 "stadtpark": {
  "type": "zoom",
  "title": "Las agujas de flores",
  "q": "Gana quien encuentre primero este punto del parque.",
  "hint": "Está frente al Kursalon, muy cerca de la estatua de Strauss.",
  "fact": "Es el reloj de flores del Stadtpark. El letrero dice Unsere Stadtgärten, nuestros jardines de la ciudad: los jardineros municipales cambian el dibujo de flores según la temporada."
 },
 "staatsoper": {
  "type": "zoom",
  "title": "Jinete en las alturas",
  "q": "Gana quien encuentre primero esta escultura desde la calle.",
  "hint": "Mirad lo más alto de la fachada principal, la que da al Ring.",
  "fact": "Es uno de los dos caballos alados del tejado. El Pegaso es el caballo de la mitología griega que hacía brotar la fuente de la inspiración de los poetas."
 },
 "bitzinger": {
  "type": "zoom",
  "title": "El vecino verde",
  "q": "Gana quien encuentre primero a este personaje. La foto es de 2021, por eso lleva mascarilla.",
  "hint": "Mirad los tejados de los puestos de la Albertinaplatz.",
  "fact": "Parece un guiño a la Liebre joven de Durero, de 1502, la acuarela más famosa de la Albertina, que está justo enfrente. El original casi nunca se expone, porque la luz lo estropea."
 },
 "palmenhausburg": {
  "type": "zoom",
  "title": "La aguja escondida",
  "q": "Gana quien encuentre primero, desde el Burggarten, esta torre.",
  "hint": "Asoma por detrás del invernadero, a la izquierda si miráis la fachada de cristal.",
  "fact": "Es la torre de la iglesia de los Agustinos, la parroquia de la corte. Allí se casaron Francisco José y Sissi en 1854."
 },
 "schonbrunn": {
  "type": "zoom",
  "title": "El centro del palacio",
  "q": "Gana quien encuentre primero este trozo de la fachada. Vale verlo desde cualquier punto del jardín.",
  "hint": "Es el centro de la fachada que da a los jardines. La foto está tomada desde la Gloriette.",
  "fact": "Napoleón se alojó en Schönbrunn en 1805 y en 1809. Su hijo, el duque de Reichstadt, murió aquí en 1832, con solo 21 años."
 },
 "palmenhaussch": {
  "type": "zoom",
  "title": "La corona de cristal",
  "q": "Gana quien encuentre primero este punto del invernadero, mirándolo desde fuera.",
  "hint": "Mirad la parte más alta del pabellón central.",
  "fact": "Bajo esa cúpula central está la palmera de unos 23 metros. En los pabellones de los lados el clima cambia: más fresco en uno, más húmedo y tropical en el otro."
 },
 "stephansdom": {
  "type": "zoom",
  "title": "Tejado de colores",
  "q": "Gana quien encuentre primero este trozo de la catedral desde la plaza.",
  "hint": "Mirad hacia arriba, donde el tejado se junta con la Torre Sur.",
  "fact": "El tejado es tan empinado que la lluvia lo limpia y la nieve apenas se queda. Por eso sus colores siguen tan vivos."
 },
 "onyx": {
  "type": "zoom",
  "title": "Espejito, espejito",
  "q": "Gana quien encuentre primero este reflejo en la plaza.",
  "hint": "Buscad la fachada de cristal curva frente a la catedral.",
  "fact": "En este solar estuvo el antiguo Haas-Haus, de 1867, obra de los mismos arquitectos que la Ópera. Ardió en abril de 1945, los mismos días en que se quemó el tejado de la catedral."
 }
};
for (const k in ZOOM_GAMES) if (GAMES[k]) GAMES[k].push(ZOOM_GAMES[k]);


/* Mensajes sellados: uno por sitio, se abren al llegar */
const MESSAGES = {
  favoriten: "Este barrio levantó media Viena ladrillo a ladrillo, y se llama Favoriten por La Favorita, un palacio de verano. Lo vuestro se construye igual: un día encima de otro. Hoy toca poner uno de los buenos.",
  donaukanal: "Este canal fue durante siglos la trasera olvidada de Viena y hoy es su galería más viva. Moraleja: lo que se cuida, florece. Y fijaos en los muros, que se repintan cada semana: no dejéis nunca de estrenaros.",
  shangrila: "Shangri-La es el paraíso perdido de las novelas, y vosotros lo habéis encontrado en un karaoke de Erdberg, que tiene más mérito. Aquí un dúo improvisado ya salvó a un rey. Cantad mal si hace falta, pero cantad juntos.",
  goldegg: "En un café vienés una sola taza da derecho a quedarse toda la mañana, y nadie mete prisa. Regla de la casa para vosotros: el tiempo que cuenta es el que pasáis sin mirar el reloj. Y el vaso de agua que nadie pide, siempre llega: quereos así, con detalles.",
  belvedere: "Klimt necesitó pan de oro para que un beso durase más de un siglo. Vosotros lo tenéis más fácil: no hace falta oro, basta con repetirlo. Ese cuadro no puede salir de Viena. El vuestro viaja con vosotros.",
  salmbrau: "Aquí la cerveza va del tanque al vaso sin viajar, y vosotros habéis cruzado media Europa para brindar con ella. Que nunca os falte un motivo. Y si un día falta, se inventa. Prost!",
  stadtpark: "Este parque nació cuando Viena se atrevió a derribar sus murallas. Suele crecer algo bonito donde uno baja las defensas. Strauss lo sabía: un vals solo sale bien si cada uno se fía del otro.",
  staatsoper: "Cuando se estrenó este edificio, Viena entera lo criticó. Hoy nadie recuerda el nombre de un solo crítico. Haced las cosas a vuestra manera: los aplausos a veces llegan tarde, pero llegan. Y esta noche, luces fuera, como quería Mahler.",
  bitzinger: "De gala y cenando una salchicha de pie: eso es Viena, y eso es saber vivir. El lujo nunca fue el palco, era la compañía. Que no os falte nunca con quién compartir una Käsekrainer a medianoche.",
  palmenhausburg: "Este jardín fue solo del emperador hasta 1919. Hoy cualquiera brinda bajo sus palmeras, y es mucho más bonito así. Casi todo mejora cuando se comparte. Empezad por esta copa.",
  schonbrunn: "A los Habsburgo se les quedaban cortas 1.441 habitaciones. Vosotros sois más listos: una casa se mide por quién hay dentro. Aquí un niño de seis años prometió casarse con una princesa y no cumplió. Vosotros sí.",
  palmenhaussch: "Aquí dentro vive un olivo español que lleva tres siglos y medio echando raíces lejos de casa, y ahí sigue, tan tranquilo. Se puede ser de un sitio y florecer en cualquier otro si el clima acompaña. Vosotros os lleváis el clima puesto.",
  stephansdom: "Son 343 escalones. Arriba, un vigía pasó siglos cuidando de una ciudad dormida. Subid cada uno a su ritmo: lo importante no es quién llega antes, sino que arriba estéis los dos. Aunque el primero puntúa, eso sí.",
  onyx: "La Haas Haus fue un escándalo y hoy sale en todas las postales: refleja la catedral sin querer parecerse a ella. Eso es una buena pareja, dos que se miran y se mejoran sin dejar de ser distintos. Brindad por este viaje y poned fecha al siguiente."
};
/* Metros a los que se da un sitio por alcanzado */
const RADIUS = { favoriten: 700, donaukanal: 450, shangrila: 200, goldegg: 150, belvedere: 250, salmbrau: 150, stadtpark: 300, staatsoper: 200, bitzinger: 150, palmenhausburg: 200, schonbrunn: 600, palmenhaussch: 250, stephansdom: 200, onyx: 150 };
/* Ideas de apuesta: [texto, día concreto o nada] */
const BET_IDEAS = [
  ["Quien pierda invita a la Sachertorte"],
  ["Quien pierda canta primero en el karaoke", "2026-10-09"],
  ["Quien pierda paga la primera ronda"],
  ["Quien pierda paga las salchichas de después de la ópera", "2026-10-10"],
  ["Quien pierda lleva la mochila mañana"],
  ["Quien gane elige el próximo viaje", "2026-10-11"],
  ["Quien pierda da un masaje de pies"],
  ["Quien gane elige la peli del vuelo de vuelta", "2026-10-11"]
];

/* ================= Plan definitivo (cambios del 7 de octubre) =================
   Sitios nuevos del itinerario, ajustes en los que se mantienen y "Planes extras"
   con los sitios que salieron del plan. */
Object.assign(PLACES, {
  kaiserwiesn: {
    name: "Kaiser Wiesn", kind: "El Oktoberfest de Viena, en el Prater", art: "beer", era: "1897",
    lat: 48.2176, lon: 16.3962, q: "Kaiserwiese, Prater, Wien",
    audio: "Esto es la Kaiser Wiesn, el Oktoberfest de Viena. Se monta cada otoño en la Kaiserwiese, la pradera del emperador, a los pies de la Noria Gigante del Prater. Hay tres grandes carpas y varias cabañas alpinas, las Almen, con música en directo desde el mediodía hasta casi medianoche, y un pueblo de puestos con comida de todas las regiones de Austria. Entrar al recinto es gratis. Lo que se paga son las fiestas de noche dentro de las carpas. El Prater fue coto de caza imperial hasta que el emperador José segundo lo abrió al pueblo en 1766. Y la noria, levantada en 1897, lleva más de un siglo girando sobre todo esto.",
    facts: [
      "En 2026 la Kaiser Wiesn va del 24 de septiembre al 11 de octubre: la pilláis en su último fin de semana.",
      "El recinto abre a las 12:00 y la música suena cada día de 12:15 a 23:30.",
      "La Noria Gigante mide casi 65 metros y sale en El tercer hombre, la película de 1949 con Orson Welles."
    ],
    secret: "Para parecer de aquí, no digáis Oktoberfest: en Viena se va a la Wiesn. Y al brindar, mirad a los ojos. Dicen que quien aparta la mirada se gana siete años de mala suerte en el amor."
  },
  belvedere21: {
    name: "Belvedere 21", kind: "Museo de arte contemporáneo, de paso", art: "favoriten", era: "1958",
    lat: 48.1857, lon: 16.3836, q: "Belvedere 21, Arsenalstraße 1, Wien",
    audio: "Este pabellón de acero y cristal no nació en Viena. El arquitecto Karl Schwanzer lo diseñó como pabellón de Austria para la Exposición Universal de Bruselas de 1958, donde ganó el gran premio de arquitectura. Después lo desmontaron, lo trajeron aquí y en 1962 reabrió como museo de arte del siglo veinte. Los vieneses lo llamaron enseguida la casa del veinte. Tras años cerrado, se renovó y reabrió en 2011, y hoy es la sede de arte contemporáneo del Belvedere. Solo pasáis por delante, pero merece la mirada: es un edificio que parece flotar.",
    facts: [
      "El 21 es por el siglo veintiuno. Hasta 2018 se llamaba 21er Haus.",
      "Karl Schwanzer es también el autor de la torre de BMW en Múnich.",
      "Alrededor del edificio hay un jardín de esculturas."
    ],
    secret: "Está a diez minutos andando del Belvedere Superior, que veréis mañana. Del pan de oro de Klimt al acero de Schwanzer hay solo un paseo y dos siglos y medio."
  },
  kunsthaus: {
    name: "Kunst Haus Wien", kind: "El Gaudí de Viena: museo Hundertwasser", art: "favoriten", era: "c. 1900",
    lat: 48.2110, lon: 16.3936, q: "Kunst Haus Wien, Untere Weißgerberstraße 13, Wien",
    audio: "Si esto os recuerda a Gaudí, vais bien encaminados. Friedensreich Hundertwasser, pintor y arquitecto vienés, odiaba la línea recta: decía que no existe en la naturaleza. Convirtió esta antigua fábrica de muebles Thonet en un museo que abrió en 1991, con fachada de azulejos en damero irregular, columnas de colores y suelos ondulados a propósito. Para él, un suelo que sube y baja era una melodía para los pies. Y fijaos en las ventanas: ahí viven los inquilinos árbol, árboles que crecen desde dentro del edificio. A cinco minutos andando está la Hundertwasserhaus, su bloque de viviendas más famoso.",
    facts: [
      "El museo abre todos los días de 10:00 a 18:00. Vosotros venís a verlo por fuera.",
      "Hundertwasser se inventó su nombre: nació como Friedrich Stowasser.",
      "La Hundertwasserhaus, en la Kegelgasse, está a unos 400 metros. Son viviendas municipales y solo se ve por fuera."
    ],
    secret: "Hundertwasser no cobró honorarios por la Hundertwasserhaus. Dijo que le bastaba con haber evitado que en ese sitio se construyera algo feo."
  },
  pickwicks: {
    name: "Pickwick's", kind: "Cena en un pub del centro", art: "beer", era: "c. 1900",
    lat: 48.2118, lon: 16.3737, q: "Pickwick's, Marc-Aurel-Straße 10-12, Wien",
    audio: "Vais a cenar en la parte más antigua de Viena. Bajo estas calles estaba Vindobona, el campamento romano que dio origen a la ciudad, y la calle se llama Marc-Aurel por Marco Aurelio, el emperador filósofo, que según la tradición murió aquí en el año 180. Pickwick's toma su nombre del club de la primera novela de Charles Dickens, y es un pub de hamburguesa, pinta y charla larga. Estáis además en el borde del Triángulo de las Bermudas, el barrio de bares donde, desde los años ochenta, los vieneses dicen que la gente entra y no vuelve a aparecer hasta la mañana.",
    facts: [
      "Según su web, los viernes abre de 14:00 a 04:00.",
      "A dos minutos está el Hoher Markt, con el Ankeruhr, un reloj modernista por el que desfilan figuras de la historia de Viena.",
      "Bajo el Hoher Markt se pueden visitar restos de casas de oficiales romanos."
    ],
    secret: "El Ankeruhr hace su desfile completo de doce figuras solo a mediodía. Pero a cualquier hora podéis ver qué personaje toca: cada hora tiene el suyo, de Marco Aurelio a Haydn."
  },
  lamee: {
    name: "Lamée Rooftop", kind: "Copa en una azotea frente a la catedral", art: "rooftop", era: "c. 1900",
    lat: 48.2103, lon: 16.3737, q: "Lamée Rooftop, Lichtensteg 2, Wien",
    audio: "Estáis en la novena planta, sobre la Rotenturmstraße, la calle de la Torre Roja, que debe su nombre a una antigua puerta de la muralla. Desde esta azotea la catedral de San Esteban queda casi a la altura de los ojos, con su tejado de tejas de colores. La Torre Sur mide unos ciento treinta y seis metros y fue durante siglos el puesto del vigía que avisaba de los incendios. Al fondo, si el cielo está limpio, se adivinan las colinas donde empiezan los Bosques de Viena.",
    facts: [
      "Abre desde mediodía hasta pasada la medianoche. La azotea es al aire libre: llevad abrigo.",
      "Si no hay mesa, se puede esperar turno. Si reserváis y no vais, cobran penalización.",
      "El águila de dos cabezas del tejado, con el año 1831, mira al sur. Desde este lado se ven las otras dos, de 1950: la de Austria y la de Viena."
    ],
    secret: "Desde aquí arriba se entiende un truco de Viena: en el centro casi nada se atreve a ser más alto que la catedral. Buscad algo que le haga sombra al Steffl. Os va a costar."
  },
  aufzug: {
    name: "Aufzug Café", kind: "Desayuno dentro de ascensores históricos", art: "cafe", era: "c. 1900",
    lat: 48.1868, lon: 16.3735, q: "Aufzug Café, Wiedner Gürtel 4, Wien",
    audio: "Este café es la colección de un hombre que no soportaba ver cómo tiraban ascensores antiguos. Christian Tauß, técnico electricista, fue rescatando cabinas de madera y hierro de las casas vienesas que se reformaban, y en 2023 abrió aquí su café museo. Se puede desayunar dentro de una cabina. La más antigua de la colección es de 1906, y hay un paternoster de 1911 que venía de un banco del Schottentor. El paternoster es ese ascensor sin puertas que nunca se para: una cadena de cabinas que suben por un lado y bajan por el otro, y al que hay que saltar en marcha.",
    facts: [
      "Los sábados abre de 9:00 a 17:00.",
      "El café que sirven es de Kaffeefabrik, un tostador vienés.",
      "Paternoster significa padrenuestro: las cabinas van en cadena, como las cuentas de un rosario."
    ],
    secret: "Preguntad por el Bonzenheber, algo así como el sube-jefazos: una cabina con banco, de cuando subir sentado era cosa de señores. Se puede tomar el café dentro."
  },
  wienmuseum: {
    name: "Wien Museum", kind: "La historia de Viena, gratis, y la fuente de al lado", art: "belvedere", era: "c. 1895",
    lat: 48.1990, lon: 16.3727, q: "Wien Museum Karlsplatz, Wien",
    audio: "El Wien Museum cuenta la historia de la ciudad desde los primeros asentamientos hasta hoy, y su exposición permanente es gratis. Reabrió a finales de 2023 después de una gran reforma, con una planta nueva que parece flotar sobre el edificio original de los años cincuenta. Dentro hay maquetas de la ciudad, piezas originales de la catedral de San Esteban y cuadros de Klimt y de Schiele. Está en la Karlsplatz, junto a la Karlskirche, la gran iglesia barroca de la cúpula verde. Y viniendo desde la comida pasáis por la fuente de Schwarzenbergplatz, construida en 1873 para celebrar la llegada del agua de montaña a Viena.",
    facts: [
      "Sábados y domingos abre de 10:00 a 18:00. La exposición permanente es gratis.",
      "Aquí está el retrato de Emilie Flöge, la compañera de vida de Klimt, pintado por él.",
      "La fuente de Schwarzenbergplatz tiene 365 chorros pequeños en el borde, uno por cada día del año."
    ],
    secret: "Si la terraza del museo está abierta, subid: tiene una de las mejores vistas de la Karlskirche, y no hace falta entrada."
  },
  kuka: {
    name: "KUKA Coffee", kind: "Café de especialidad en el barrio nuevo", art: "cafe", era: "c. 1900",
    lat: 48.1808, lon: 16.3842, q: "KUKA Coffee, Bloch-Bauer-Promenade, Wien",
    audio: "Desayunáis en el Sonnwendviertel, uno de los barrios más nuevos de Viena. Hasta hace unos años todo esto eran las vías y los almacenes de la antigua Estación del Sur. Cuando se construyó la nueva estación central, inaugurada en 2014, el terreno sobrante se convirtió en viviendas, escuelas y un gran parque. La calle se llama Bloch-Bauer-Promenade por Adele Bloch-Bauer, la mujer del retrato dorado más famoso de Klimt, y por su familia. Ese cuadro ya no está en Viena: tras un largo juicio, en 2006 Austria lo devolvió a la heredera de la familia, y hoy cuelga en Nueva York.",
    facts: [
      "KUKA sirve café de especialidad y matcha. No he podido confirmar su horario de domingo: miradlo antes de ir.",
      "El parque de al lado lleva el nombre de Helmut Zilk, alcalde de Viena entre 1984 y 1994.",
      "La historia del cuadro se cuenta en la película La dama de oro, con Helen Mirren."
    ],
    secret: "Ayer visteis El Beso en el Belvedere. Adele Bloch-Bauer es la única mujer a la que Klimt retrató dos veces de cuerpo entero."
  },
  gloriette: {
    name: "Gloriette", kind: "El mirador de Schönbrunn, en trenecito", art: "schonbrunn", era: "c. 1900",
    lat: 48.1782, lon: 16.3087, q: "Gloriette Schönbrunn, Wien",
    audio: "La Gloriette corona la colina de Schönbrunn desde 1775. La mandó construir María Teresa como monumento a la guerra justa, la que trae la paz, y servía de comedor y salón de fiestas con vistas. Su arquitecto reutilizó piedra de un palacio renacentista abandonado. En lo alto, un águila imperial se posa sobre un globo. Se cuenta que el emperador Francisco José desayunaba aquí a menudo. Subís en el trenecito panorámico, que da la vuelta al parque en unos cuarenta y cinco minutos y tiene nueve paradas. Desde arriba tenéis la mejor vista del palacio, con toda Viena detrás.",
    facts: [
      "El billete de día del trenecito cuesta desde 17 euros, con subidas y bajadas libres. Circula en temporada y según el tiempo: confirmadlo allí.",
      "Dentro de la Gloriette hay un café.",
      "La inscripción del frente nombra a José II y a María Teresa y lleva el año 1775."
    ],
    secret: "El año de la inscripción está escrito con una forma antigua de números romanos, con letras C al revés. Buscad CIƆ: es otra manera de escribir la M de mil."
  },
  mariatheresien: {
    name: "Maria-Theresien-Platz", kind: "La plaza de los dos museos gemelos", art: "park", era: "c. 1895",
    lat: 48.2046, lon: 16.3610, q: "Maria-Theresien-Platz, Wien",
    audio: "Estáis entre dos edificios gemelos: a un lado el Museo de Historia del Arte y al otro el de Historia Natural, inaugurados en 1891 y 1889 para guardar las colecciones de los Habsburgo. Son idénticos por fuera a propósito. En el centro manda María Teresa, la única mujer que gobernó los dominios de los Habsburgo, durante cuarenta años. El monumento se inauguró en 1888 y mide casi veinte metros. A sus pies están sus generales a caballo, sus consejeros y, entre los artistas, un Mozart niño. María Teresa tuvo dieciséis hijos, reformó el ejército y la hacienda y puso la escuela obligatoria.",
    facts: [
      "El monumento es obra de Caspar von Zumbusch, que tardó unos trece años en terminarlo.",
      "Detrás de la plaza está el MuseumsQuartier, en las antiguas caballerizas imperiales.",
      "En el Museo de Historia Natural se guarda la Venus de Willendorf, una figurilla de unos 29.500 años."
    ],
    secret: "Buscad a Mozart en el monumento: es un niño, de pie junto a Haydn y Gluck. Es el mismo niño que tocó para María Teresa en Schönbrunn, donde habéis estado esta mañana."
  },
  rathaus: {
    name: "Rathaus", kind: "El Ayuntamiento de Viena", art: "stephansdom", era: "c. 1895",
    lat: 48.2108, lon: 16.3572, q: "Wiener Rathaus, Wien",
    audio: "El Ayuntamiento de Viena parece una catedral gótica, pero es de 1883. Lo diseñó Friedrich von Schmidt, que había trabajado en la catedral de Colonia y dirigía las obras de San Esteban. La torre central mide noventa y ocho metros, y encima está el Rathausmann, un caballero de hierro con estandarte que la sube hasta unos ciento tres. Cuenta la historia que el emperador no quería que la torre superase los noventa y nueve metros de la vecina Iglesia Votiva, y que el arquitecto cumplió la norma con la torre y la burló con la estatua. La plaza de delante es el salón de la ciudad: mercado de Navidad, pista de hielo en invierno y cine al aire libre en verano.",
    facts: [
      "El Rathausmann mide 3,40 metros sin contar el estandarte.",
      "En el Rathauspark, el parque de al lado, hay una copia del Rathausmann a tamaño real para verlo de cerca.",
      "Enfrente, al otro lado del Ring, está el Burgtheater, el gran teatro nacional."
    ],
    secret: "El Rathausmann calza un 63. Buscad su copia en el parque y comparad vuestro pie con el suyo."
  },
  schachtelwirt: {
    name: "Schachtelwirt", kind: "Cocina austriaca servida en caja", art: "wurst", era: "c. 1900",
    lat: 48.2117, lon: 16.3745, q: "Schachtelwirt, Judengasse 5, Wien",
    audio: "Schachtel significa caja y Wirt, tabernero: aquí la cocina austriaca de toda la vida se sirve en una caja de cartón, para llevar o para comer en una de sus pocas mesas. El plato estrella es el Schweinsbraten, el asado de cerdo con corteza crujiente, con su Knödel y su col. Estáis en la Judengasse, la calle de los Judíos, en el barrio más antiguo de Viena. A unos pasos está la Ruprechtskirche, la iglesia de San Ruperto, considerada la más antigua de la ciudad. Y el barrio entero es el Triángulo de las Bermudas, la zona de bares del viernes.",
    facts: [
      "Ojo con el domingo: su web dice que abre todos los días hasta las 22:00, pero otras guías dicen que solo abre entre semana. Confirmadlo antes de ir.",
      "Un Knödel es una bola cocida de pan o de patata, la guarnición nacional.",
      "La Ruprechtskirche conserva la vidriera y las campanas más antiguas de Viena."
    ],
    secret: "Si está cerrado, el plan B está al lado: bajad hasta la Ruprechtskirche, cubierta de hiedra, y cenad en cualquier Beisl de la zona. Beisl es como llaman los vieneses a la taberna de barrio."
  }
});

/* Ajustes en sitios que se mantienen */
PLACES.staatsoper.facts = [
  "Gustav Mahler, director entre 1897 y 1907, fue quien impuso apagar las luces de la sala durante la función.",
  "Las entradas de pie se venden en la taquilla de Stehplätze, en el lado de la Operngasse, desde 80 minutos antes de la función. Id los dos: pueden dar solo una por persona.",
  "También salen por internet a las 10:00 del mismo día, con un máximo de dos por cuenta. Cada sitio de pie tiene su número y una pantallita de subtítulos."
];
PLACES.staatsoper.secret = "Mahler fue también quien dejó sin entrar a los que llegaban tarde, y la regla sigue en pie. Si podéis elegir, pedid de pie en Parterre: es la zona de abajo, justo detrás de las butacas caras, y tiene de las mejores vistas de la sala.";
PLACES.palmenhaussch.name = "Palmenhaus y Casa del Desierto";
PLACES.palmenhaussch.kind = "Los invernaderos imperiales";
PLACES.palmenhaussch.facts = [
  "La planta más veterana del Palmenhaus es un olivo español de unos 350 años.",
  "En octubre el Palmenhaus abre de 10:00 a 17:00 y la Casa del Desierto de 9:00 a 17:00, con última entrada a las 16:30.",
  "La Casa del Desierto está justo enfrente, en un pabellón de 1904: cactus, suculentas y animales del desierto."
];
PLACES.palmenhausburg.facts[2] = "El Burggarten se abrió al público en 1919. Según vuestro plan, la brasserie cierra a las 23:00.";

GAMES.kaiserwiesn = [
  { type: "buzz", title: "Habla Wiesn", q: "¿Qué significa Wiesn?", opts: ["Pradera", "Cerveza", "Fiesta", "Carpa"], a: 0, fact: "Wiesn es pradera en dialecto. El Oktoberfest de Múnich se celebra en la Theresienwiese, y de ahí viene el nombre de todas las demás." },
  { type: "buzz", title: "La noria", q: "¿De qué año es la Noria Gigante del Prater?", opts: ["1897", "1766", "1918", "1949"], a: 0, fact: "De 1897. 1766 es el año en que el Prater se abrió al público, y 1949 el de la película El tercer hombre." },
  { type: "guess", title: "Las cabinas", q: "¿Cuántas cabinas tiene hoy la Noria Gigante?", answer: 15, unit: "cabinas", fact: "Quince. Al principio tenía treinta, pero tras los daños de la guerra se reconstruyó con la mitad." },
  { type: "hunt", title: "Caza de la Wiesn", q: "Gana quien vea primero…", targets: ["a alguien con Lederhosen, el pantalón de cuero", "un Dirndl de color verde", "un corazón de pan de jengibre colgado del cuello", "una jarra de un litro", "a alguien bailando encima de un banco"], fact: "Los corazones de pan de jengibre llevan mensajes escritos con azúcar. Se regalan y se cuelgan del cuello; casi nadie se los come." },
  { type: "mission", title: "Brindis a la austriaca", q: "Brindad diciendo Prost y mirándoos a los ojos. Pierde el primero que aparte la mirada o se ría.", fact: "Prost viene del latín prosit: que aproveche." }
];
GAMES.belvedere21 = [
  { type: "buzz", title: "Edificio viajero", q: "¿De dónde vino este edificio?", opts: ["De la Expo de Bruselas de 1958", "De la Expo de Viena de 1873", "De los Juegos de Múnich", "De una fábrica de Berlín"], a: 0, fact: "Fue el pabellón de Austria en Bruselas 1958. Lo desmontaron y en 1962 reabrió en Viena como museo." },
  { type: "buzz", title: "El arquitecto", q: "¿Qué más diseñó Karl Schwanzer?", opts: ["La torre de BMW en Múnich", "La Haas Haus", "La Ópera de Sídney", "La Torre del Danubio"], a: 0, fact: "La torre de BMW, con forma de cuatro cilindros de motor, es de 1972." },
  { type: "mission", title: "Foto de arquitecto", q: "Cada uno tiene 60 segundos para hacer la foto más original del edificio. Decidid entre los dos cuál gana. Si no hay acuerdo, empate.", fact: "Un pabellón de exposición se diseña para impresionar en segundos. Este lleva haciéndolo desde 1958." }
];
GAMES.kunsthaus = [
  { type: "buzz", title: "La manía de Hundertwasser", q: "¿Qué odiaba Hundertwasser?", opts: ["La línea recta", "El color verde", "Los árboles en la ciudad", "Las ventanas redondas"], a: 0, fact: "Decía que la línea recta no existe en la naturaleza y la llamaba impía." },
  { type: "buzz", title: "Antes de ser museo", q: "¿Qué era antes este edificio?", opts: ["Una fábrica de muebles Thonet", "Una estación de tranvía", "Un cuartel", "Una cervecería"], a: 0, fact: "Thonet es la casa de la silla de café vienesa, la de madera curvada. La habéis visto en todos los cafés." },
  { type: "hunt", title: "Fachada imposible", q: "Gana quien encuentre primero en la fachada…", targets: ["un árbol que sale de una ventana", "una columna de más de tres colores", "dos ventanas exactamente iguales", "una línea recta de más de dos metros"], fact: "Hundertwasser defendía el derecho a la ventana: que cada vecino pudiera decorar el trozo de fachada que alcanza con el brazo." },
  { type: "guess", title: "Cuenta las columnas", q: "Antes de contar, cada uno apuesta cuántas columnas de colores hay en la entrada.", onsite: true, unit: "columnas", fact: "Las columnas de cerámica, todas distintas, son una de las firmas de Hundertwasser." }
];
GAMES.pickwicks = [
  { type: "buzz", title: "El de la calle", q: "¿Quién da nombre a la Marc-Aurel-Straße?", opts: ["Un emperador romano", "Un compositor", "Un santo", "Un alcalde"], a: 0, fact: "Marco Aurelio, que según la tradición murió en Vindobona, la Viena romana, en el año 180." },
  { type: "buzz", title: "El club Pickwick", q: "¿Quién escribió Los papeles póstumos del Club Pickwick?", opts: ["Charles Dickens", "Oscar Wilde", "Arthur Conan Doyle", "Jane Austen"], a: 0, fact: "Fue la primera novela de Dickens, publicada por entregas en 1836. Tenía 24 años." },
  { type: "guess", title: "La cuenta", q: "Antes de pedirla, cada uno apuesta cuánto va a ser.", onsite: true, unit: "euros", fact: "En Austria la propina se da al pagar: se dice en voz alta el total redondeado, con la propina incluida." },
  { type: "mission", title: "Pedido con mímica", q: "Uno le pide su bebida al otro solo con gestos. Luego al revés. Gana quien lo adivine en menos intentos.", fact: "En el Triángulo de las Bermudas hay decenas de bares en un puñado de calles. Por eso la gente se pierde." }
];
GAMES.lamee = [
  { type: "buzz", title: "La Torre Roja", q: "¿Por qué se llama Rotenturmstraße?", opts: ["Por una torre roja de la muralla", "Por el color de los tranvías", "Por un cardenal", "Por una cervecería"], a: 0, fact: "La Torre Roja era una puerta de la muralla junto al canal. Se derribó en el siglo XVIII, pero la calle conservó el nombre." },
  { type: "guess", title: "La torre de enfrente", q: "¿Cuántos metros mide la Torre Sur de la catedral?", answer: 136, unit: "metros", fact: "Unos 136 metros. Se terminó en 1433 y durante siglos fue de las torres más altas de Europa." },
  { type: "hunt", title: "Viena desde arriba", q: "Desde la azotea, gana quien señale primero…", targets: ["la Noria Gigante del Prater", "una cúpula verde", "una grúa", "otra azotea con gente"], fact: "El verde de tantas cúpulas vienesas es cobre oxidado. Recién puesto, brillaba como una moneda." },
  { type: "mission", title: "Lo mejor del viernes", q: "Cada uno dice lo mejor del día en una sola frase. Gana la que haga sonreír más al otro. Si os reís los dos, empate.", fact: "El primer día de un viaje siempre es el más largo. Mañana toca Klimt, cerveza y ópera." }
];
GAMES.aufzug = [
  { type: "buzz", title: "Sube y baja", q: "¿Qué es un paternoster?", opts: ["Un ascensor que nunca se para", "Un café con licor", "Un tranvía antiguo", "Un reloj de torre"], a: 0, fact: "Una cadena de cabinas abiertas en movimiento continuo. En Viena aún funciona alguno, pero ya no se instalan." },
  { type: "guess", title: "La cabina más vieja", q: "¿De qué año es el ascensor más antiguo de la colección?", answer: 1906, unit: "", fact: "De 1906. El paternoster del café es de 1911 y venía de un banco del Schottentor." },
  { type: "hunt", title: "Ojo de ascensorista", q: "Sin levantaros mucho, gana quien encuentre primero…", targets: ["un botón con un número", "una placa con un año", "una puerta de rejilla", "un banco dentro de una cabina"], fact: "En muchas casas vienesas el ascensor antiguo funcionaba con monedas y solo servía para subir. Bajar, andando." },
  { type: "mission", title: "Discurso de ascensor", q: "Tenéis 30 segundos cada uno, lo que dura un viaje en ascensor, para convencer al otro del plan perfecto para después de la ópera. Gana el más convincente.", fact: "Lo llaman elevator pitch: si no cabe en un viaje de ascensor, la idea aún no está clara." }
];
GAMES.wienmuseum = [
  { type: "buzz", title: "La entrada", q: "¿Cuánto cuesta la exposición permanente del Wien Museum?", opts: ["Nada", "5 euros", "12 euros", "La voluntad"], a: 0, fact: "Es gratis desde que reabrió en diciembre de 2023. Solo se pagan las exposiciones temporales." },
  { type: "guess", title: "Los chorros", q: "¿Cuántos chorros pequeños tiene el borde de la fuente de Schwarzenbergplatz?", answer: 365, unit: "chorros", fact: "365, uno por día del año. La fuente celebra la llegada a Viena, en 1873, del agua de manantial de los Alpes, que sigue saliendo del grifo." },
  { type: "hunt", title: "Tesoros del museo", q: "Dentro del museo, gana quien encuentre primero…", targets: ["una maqueta de la ciudad", "un cuadro de Klimt", "una pieza de la catedral de San Esteban", "un objeto que hayáis usado alguna vez"], fact: "El edificio original es de 1959. La reforma le añadió encima una planta nueva que no toca la antigua." },
  { type: "order", title: "Ordena Viena", q: "Del más antiguo al más reciente. Primero juega uno y luego el otro.", items: [["Campamento romano de Vindobona", 100], ["Se termina la Torre Sur de la catedral", 1433], ["Segundo asedio otomano", 1683], ["Se ordena derribar las murallas", 1857]], fact: "Del derribo de las murallas nació el Ring, la avenida donde están la Ópera, el Ayuntamiento y los museos que veis este fin de semana." }
];
GAMES.kuka = [
  { type: "buzz", title: "La dama de la calle", q: "¿Quién era Adele Bloch-Bauer?", opts: ["La modelo del retrato dorado de Klimt", "Una emperatriz", "Una cantante de ópera", "La arquitecta del barrio"], a: 0, fact: "Adele era una mecenas vienesa. Klimt la pintó en 1907 cubierta de oro, un año antes de El Beso." },
  { type: "buzz", title: "¿Dónde está el cuadro?", q: "¿Dónde cuelga hoy el retrato dorado de Adele?", opts: ["En Nueva York", "En el Belvedere", "En París", "En Londres"], a: 0, fact: "En la Neue Galerie de Nueva York. Estuvo en el Belvedere hasta 2006, cuando se devolvió a la familia." },
  { type: "guess", title: "El precio del café", q: "Antes de mirar la carta, cada uno apuesta cuánto cuesta aquí un flat white.", onsite: true, unit: "euros", fact: "Podéis apostar con decimales: 4,2 vale." },
  { type: "mission", title: "Cata a ciegas", q: "Uno cierra los ojos y prueba las dos bebidas. Gana si acierta cuál es la suya. Luego al revés.", fact: "La nueva estación central se inauguró en 2014 y liberó todo el terreno de este barrio." }
];
GAMES.gloriette = [
  { type: "buzz", title: "¿Para qué servía?", q: "¿Para qué se construyó la Gloriette?", opts: ["Como monumento y mirador con salón de fiestas", "Como tumba imperial", "Como observatorio", "Como iglesia"], a: 0, fact: "Era un monumento a la guerra justa, la que lleva a la paz, y a la vez un comedor con vistas." },
  { type: "guess", title: "El año", q: "¿En qué año se terminó la Gloriette?", answer: 1775, unit: "", fact: "En 1775, cinco años antes de morir María Teresa." },
  { type: "hunt", title: "Detalles de la Gloriette", q: "Gana quien encuentre primero…", targets: ["el águila sobre el globo", "la inscripción en latín", "una armadura esculpida en piedra", "una letra C escrita al revés"], fact: "Parte de la piedra viene del Neugebäude, un palacio renacentista abandonado al otro lado de Viena." },
  { type: "mission", title: "Viena a dedo", q: "Cada uno señala tres edificios de Viena desde el mirador y dice cuáles son. Gana quien acierte más. El mapa hace de juez.", fact: "Desde aquí se ven la catedral, la Noria del Prater y, en días claros, las colinas de los Bosques de Viena." }
];
GAMES.mariatheresien = [
  { type: "buzz", title: "Familia numerosa", q: "¿Cuántos hijos tuvo María Teresa?", opts: ["16", "4", "9", "12"], a: 0, fact: "Dieciséis en diecinueve años. Entre ellos, María Antonieta y dos emperadores." },
  { type: "hunt", title: "¿Dónde está Mozart?", q: "Gana quien encuentre primero a Mozart niño en el monumento.", fact: "Está con Haydn y Gluck. Mozart tenía seis años cuando tocó para María Teresa en Schönbrunn." },
  { type: "guess", title: "Los jinetes", q: "¿Cuántas figuras a caballo rodean a María Teresa en el monumento?", answer: 4, unit: "jinetes", fact: "Cuatro: sus generales Daun, Laudon, Traun y Khevenhüller." },
  { type: "buzz", title: "Dos verdades y una mentira", q: "¿Cuál es la mentira?", opts: ["Los dos museos son gemelos por fuera", "El monumento mide casi 20 metros", "María Teresa fue coronada en esta plaza"], a: 2, fact: "La plaza no existía en su época: se trazó un siglo después, con el Ring." }
];
GAMES.rathaus = [
  { type: "buzz", title: "Falso gótico", q: "¿De qué año es el Ayuntamiento?", opts: ["1883", "1433", "1683", "1723"], a: 0, fact: "De 1883. Es neogótico: se construyó imitando el estilo de las catedrales medievales." },
  { type: "guess", title: "La torre", q: "¿Cuántos metros mide la torre central, sin la estatua?", answer: 98, unit: "metros", fact: "98 metros, uno menos que la Iglesia Votiva. Con el Rathausmann llega a unos 103." },
  { type: "hunt", title: "El gemelo del caballero", q: "Gana quien encuentre primero la copia del Rathausmann en el parque.", fact: "La copia permite ver de cerca lo que arriba es un punto: armadura completa y estandarte." },
  { type: "buzz", title: "Zapatería imperial", q: "¿Qué número calza el Rathausmann?", opts: ["63", "45", "52", "80"], a: 0, fact: "Un 63. Mide 3,40 metros y pesa unas 1,8 toneladas." }
];
GAMES.schachtelwirt = [
  { type: "buzz", title: "Alemán de taberna", q: "¿Qué significa Schachtel?", opts: ["Caja", "Cuchara", "Asado", "Cerdo"], a: 0, fact: "Caja. Y Wirt es el tabernero: el tabernero de la caja." },
  { type: "buzz", title: "La guarnición", q: "¿Qué es un Knödel?", opts: ["Una bola cocida de pan o patata", "Una salchicha", "Un postre de manzana", "Una sopa"], a: 0, fact: "Los hay salados y dulces. Los dulces, rellenos de albaricoque, se llaman Marillenknödel." },
  { type: "guess", title: "La vecina más vieja", q: "¿De qué año dice la tradición que es la Ruprechtskirche?", answer: 740, unit: "", fact: "Del año 740, según la tradición. Los muros más antiguos que se conservan son del siglo XII." },
  { type: "mission", title: "Pedido en alemán", q: "Gana quien pida su plato entero en alemán sin señalar la carta: Einmal Schweinsbraten, bitte.", fact: "Einmal significa una vez: una ración. Para dos, zweimal." }
];
GAMES.palmenhaussch.splice(3, 0, { type: "buzz", title: "La Casa del Desierto", q: "El pabellón de la Casa del Desierto se llama Sonnenuhrhaus. ¿Qué significa?", opts: ["Casa del reloj de sol", "Casa del sol naciente", "Casa de las horas", "Casa de verano"], a: 0, fact: "Casa del reloj de sol, por el que tiene en la fachada. Se construyó en 1904 para las plantas exóticas del emperador." });
GAMES.palmenhausburg[2].fact = "La paz de 1809 con Napoleón se firmó en Schönbrunn, donde habéis estado esta mañana.";
{
  const o = GAMES.salmbrau.find(g => g.type === "order");
  o.items = [["Se termina el Belvedere Superior", 1723], ["Se inaugura la Ópera", 1869], ["Klimt pinta El Beso", 1908], ["Abre el museo de la ciudad en la Karlsplatz", 1959]];
  o.fact = "Todo lo que veis hoy cabe en poco más de dos siglos: del barroco del príncipe Eugenio al museo de la Karlsplatz.";
}

Object.assign(MESSAGES, {
  kaiserwiesn: "Wiesn significa pradera: para montar una fiesta solo hace falta un trozo de hierba y ganas. Detrás tenéis una noria que lleva desde 1897 dando vueltas sin llegar a ningún sitio y sin perder la gracia. Tomad nota: lo que importa es con quién vas en la cabina.",
  belvedere21: "Este edificio se construyó para Bruselas, lo desmontaron pieza a pieza y volvió a casa. Nadie dijo que lo bueno tuviera que quedarse quieto. Vosotros también funcionáis en cualquier ciudad: lo que os sostiene viaja con vosotros.",
  kunsthaus: "Hundertwasser decía que la línea recta no existe en la naturaleza, y que un suelo torcido es una melodía para los pies. Vuestro camino tampoco ha sido recto, y mirad qué bien suena. No os alicatéis nunca del todo.",
  pickwicks: "Marco Aurelio, el emperador que da nombre a esta calle, dejó escrito algo así como que la felicidad depende de la calidad de los pensamientos. Dos mil años después sigue siendo verdad, aunque una buena hamburguesa también ayuda. Brindad por haber llegado.",
  lamee: "Primera noche y ya estáis por encima de los tejados. Desde aquí Viena parece ordenada y tranquila, como todo cuando se mira con un poco de altura. Guardad el truco para cuando abajo se complique. Y brindad: el fin de semana acaba de empezar.",
  aufzug: "Un señor vio que tiraban ascensores viejos y decidió que merecían una segunda vida, con café. Lo que se cuida no pasa de moda. Hoy os toca subir: Klimt, cerveza y ópera. Desayunad bien.",
  wienmuseum: "Una ciudad entera cabe en un museo y la entrada es gratis: lo importante casi nunca cuesta dinero. Viena tardó dos mil años en ser lo que veis. Vosotros vais bastante más rápido. Seguid así, que a las siete hay ópera.",
  kuka: "Donde había vías muertas ahora hay un parque, un barrio y este café. Lo que se queda sin uso puede convertirse en otra cosa si alguien se empeña. Último día completo: no lo gastéis con prisa.",
  gloriette: "Subir cuesta, por eso la vista vale. Desde aquí el palacio de las 1.441 habitaciones parece una maqueta, y los problemas, más o menos igual. Venid a sitios altos de vez en cuando, y venid juntos.",
  mariatheresien: "Dos museos idénticos mirándose de frente y, en medio, una mujer que mandó cuarenta años y crio a dieciséis hijos. Si alguna vez os parece que vais justos de tiempo, acordaos de María Teresa. Y de que vosotros os tenéis el uno al otro para repartir.",
  rathaus: "Al arquitecto le dijeron que su torre no podía pasar de cierta altura. Cumplió la norma y le plantó un caballero encima. Hay que saber respetar las reglas y, de vez en cuando, encontrarles la vuelta con elegancia. De eso vosotros ya sabéis.",
  schachtelwirt: "Aquí meten lo mejor de la cocina de la abuela en una caja de cartón, y funciona. El envoltorio nunca fue lo importante. Última cena del viaje: pedid lo que os apetezca de verdad y repartíoslo."
});
MESSAGES.palmenhausburg = "Este jardín fue solo del emperador hasta 1919. Hoy cualquiera brinda bajo sus palmeras, y es mucho más bonito así. Casi todo mejora cuando se comparte. Última copa del viaje: que sea larga.";
Object.assign(RADIUS, { kaiserwiesn: 350, belvedere21: 150, kunsthaus: 150, pickwicks: 80, lamee: 80, aufzug: 120, wienmuseum: 150, kuka: 150, gloriette: 200, mariatheresien: 150, rathaus: 200, schachtelwirt: 60 });

DAYS.length = 0;
DAYS.push(
  { key: "2026-10-09", short: "Vie", num: "9", label: "Viernes 9 de octubre", title: "Oktoberfest, Hundertwasser y azotea",
    stops: [
      { t: "17:00", p: "belvedere21", title: "De camino: Belvedere 21", note: "Solo pasar por delante, de camino al Prater." },
      { t: "17:30", p: "kaiserwiesn", title: "Kaiser Wiesn, el Oktoberfest", note: "Sobre las 17:30 o 18:00. Entrada libre al recinto." },
      { t: "19:30", p: "kunsthaus", title: "Kunst Haus, el Gaudí de Viena", note: "Para verlo por fuera. Hora orientativa." },
      { t: "20:30", p: "pickwicks", title: "Cena en Pickwick's", note: "Marc-Aurel-Straße 10-12. Hora orientativa." },
      { t: "22:00", p: "lamee", title: "Copa en la azotea", note: "Lamée Rooftop, novena planta. Hora orientativa." }
    ] },
  { key: "2026-10-10", short: "Sáb", num: "10", label: "Sábado 10 de octubre", title: "Klimt, cerveza y ópera",
    stops: [
      { t: "09:00", p: "aufzug", title: "Desayuno entre ascensores", note: "Wiedner Gürtel 4. Los sábados abre a las 9:00." },
      { t: "10:30", p: "belvedere", title: "Palacio Belvedere y El Beso", note: "Belvedere Superior, con los cuadros de Klimt.", tag: ["warn", "Comprar entrada con franja"], link: ["https://www.belvedere.at", "Comprar entradas"] },
      { t: "12:45", p: "belvedere", title: "Jardines del palacio", note: "Paseo por los jardines, de camino a la comida. Hora orientativa." },
      { t: "14:00", p: "salmbrau", title: "Comida en Salm Bräu", note: "Justo al salir del recinto del Belvedere.", tag: ["warn", "Reservar mesa"] },
      { t: "15:30", p: "wienmuseum", title: "Museo de Viena y la fuente", note: "Exposición permanente gratis. Cierra a las 18:00. Hora orientativa." },
      { t: "17:00", p: "staatsoper", title: "Cola para las entradas de pie", note: "La taquilla de Stehplätze, en el lado de la Operngasse, abre a las 17:40.", tag: ["warn", "Taquilla a las 17:40"] },
      { t: "19:00", p: "staatsoper", title: "Noche de ópera", note: "Función a las 19:00. Dejad los abrigos en el ropero." },
      { t: "21:30", p: "bitzinger", title: "Perrito en Bitzinger", note: "Junto a la Albertina. Después, si apetece: bares o paseo hasta la estatua de Mozart." }
    ] },
  { key: "2026-10-11", short: "Dom", num: "11", label: "Domingo 11 de octubre", title: "Schönbrunn, el Ring y última copa",
    stops: [
      { t: "09:00", p: "kuka", title: "Desayuno en KUKA", note: "Bloch-Bauer-Promenade. Confirmad el horario de domingo." },
      { t: "10:15", p: "schonbrunn", title: "Schönbrunn", note: "En tranvía o en metro U4. Hora orientativa." },
      { t: "10:45", p: "palmenhaussch", title: "Palm House", note: "El gran invernadero. Entrada en taquilla." },
      { t: "11:45", p: "palmenhaussch", title: "Casa del Desierto", note: "Justo enfrente del Palmenhaus. Última entrada a las 16:30." },
      { t: "12:45", p: "gloriette", title: "Trenecito a la Gloriette", note: "El tren panorámico para en Tiergarten y Palmenhaus y sube a la Gloriette." },
      { t: "14:00", p: "schonbrunn", title: "Comida en Schönbrunn", note: "A las 14:00, antes de volver al centro." },
      { t: "16:00", p: "mariatheresien", title: "Plaza de María Teresa", note: "En metro U4. Hora orientativa." },
      { t: "17:00", p: "rathaus", title: "Ayuntamiento de Viena", note: "Paseo por el Ring desde la plaza. Hora orientativa." },
      { t: "19:30", p: "schachtelwirt", title: "Cena en Schachtelwirt", note: "Judengasse 5.", tag: ["warn", "Confirmar si abre en domingo"] },
      { t: "21:30", p: "palmenhausburg", title: "Última copa en el invernadero", note: "Según vuestro plan, cierra a las 23:00." }
    ] },
  { key: "2026-10-12", short: "Lun", num: "12", label: "Lunes 12 de octubre", title: "Café de despedida",
    stops: [
      { t: "10:30", p: null, title: "Café de despedida", note: "De 10:30 a 11:00, antes de salir hacia el aeropuerto." },
      { t: "", p: null, title: "Rumbo a casa", note: "Vuelo a Málaga a las 14:30. Auf Wiedersehen, Wien." }
    ] },
  { key: "extras", extra: true, short: "Más", num: "+", label: "Planes extras", title: "Por si hay un hueco, o para Pilu cuando se quede en Viena",
    stops: [
      { t: "", p: "stephansdom", title: "Catedral de San Esteban", note: "Visita al interior y subida a la Torre Sur: 343 escalones, cierra a las 17:30." },
      { t: "", p: "onyx", title: "Atardecer frente a la catedral", note: "Una copa en el Onyx Bar, en la Haas Haus." },
      { t: "", p: "stadtpark", title: "Paseo por el Stadtpark", note: "La estatua dorada de Strauss y el portal del río Viena." },
      { t: "", p: "donaukanal", title: "Paseo por el Donaukanal", note: "Arte urbano y terrazas junto al agua." },
      { t: "", p: "goldegg", title: "Desayuno vienés clásico", note: "Café Goldegg. Abre a las 9:00 en fin de semana y a las 8:00 entre semana." },
      { t: "", p: "shangrila", title: "Noche de karaoke", note: "Shangrila, Franzosengraben 3. Metro U3, parada Erdberg." },
      { t: "", p: "favoriten", title: "Vuestro barrio: Favoriten", note: "El mercado de Viktor-Adler-Platz y Reumannplatz." }
    ] }
);

/* Foto recortada de los sitios nuevos */
Object.assign(ZOOM_GAMES, {
  kaiserwiesn: { type: "zoom", title: "El cartel de la fiesta", q: "Gana quien encuentre primero este cartel. La foto es de la apertura de este año.", hint: "Mirad hacia arriba, en uno de los accesos al recinto.", fact: "La Kaiserwiese, la pradera del emperador, es el prado que queda justo delante de la Noria Gigante." },
  belvedere21: { type: "zoom", title: "La esquina que flota", q: "Gana quien encuentre primero esta esquina del edificio.", hint: "Es la planta de arriba, la de cristal, vista desde el lado del jardín.", fact: "La planta alta cuelga de cuatro grandes pilares de acero: por eso el pabellón parece flotar sobre la baja." },
  kunsthaus: { type: "zoom", title: "La columna de colores", q: "Gana quien encuentre primero esta columna exacta. Hay varias, y ninguna es igual.", hint: "Está en la entrada principal, a la altura de la calle.", fact: "Hundertwasser hacía las columnas apilando piezas de cerámica distintas, como cuentas de un collar." },
  pickwicks: { type: "zoom", title: "La cúpula de la esquina", q: "Gana quien encuentre primero este remate. Está en la calle de la cena.", hint: "Mirad hacia arriba en el cruce de la Marc-Aurel-Straße: corona un edificio de esquina.", fact: "En la Viena de 1900 una cúpula en la esquina era la forma de presumir de edificio: se veía desde varias calles a la vez." },
  lamee: { type: "zoom", title: "La punta del Steffl", q: "Gana quien señale primero este punto exacto desde la azotea.", hint: "Es lo más alto que tenéis delante.", fact: "La Torre Sur se terminó en 1433. La torre gemela del lado norte nunca se acabó: se quedó a medias y hoy guarda la campana Pummerin." },
  wienmuseum: { type: "zoom", title: "La planta que flota", q: "Gana quien encuentre primero esta esquina desde la plaza.", hint: "Es la parte nueva del museo, la de arriba.", fact: "La planta nueva se apoya en una estructura propia y no descansa sobre el edificio de 1959. Entre las dos queda una terraza." },
  gloriette: { type: "zoom", title: "El águila de lo alto", q: "Gana quien encuentre primero esta figura.", hint: "Mirad el centro de la Gloriette, lo más arriba posible.", fact: "El águila imperial se posa sobre un globo y está rodeada de trofeos de guerra: armaduras, banderas y escudos de piedra." },
  mariatheresien: { type: "zoom", title: "La cúpula gemela", q: "Gana quien señale primero el museo correcto. Ojo: hay dos cúpulas casi iguales.", hint: "Fijaos en la estatua que corona cada cúpula.", fact: "La de la foto es la del Museo de Historia del Arte, coronada por Palas Atenea. La del Museo de Historia Natural lleva a Helios, el dios del sol." },
  rathaus: { type: "zoom", title: "El reloj de la torre", q: "Gana quien encuentre primero este reloj.", hint: "Está en la torre central, a media altura.", fact: "Encima del reloj, en la punta, está el Rathausmann. Desde abajo parece pequeño, pero mide 3,40 metros." }
});
for (const k of ["kaiserwiesn", "belvedere21", "kunsthaus", "pickwicks", "lamee", "wienmuseum", "gloriette", "mariatheresien", "rathaus"]) GAMES[k].push(ZOOM_GAMES[k]);

/* Guiones de la audioguía reescritos por Leny, que son los que leen los audios de voz/ */
PLACES["belvedere21"].audio = "Fijaos bien en este edificio, porque tiene truco: no nació aquí. Nació en Bruselas. El arquitecto Karl Schwanzer lo diseñó como pabellón de Austria para la Exposición Universal de 1958… y ganó el gran premio de arquitectura. Cuando la feria terminó, hicieron algo increíble: lo desmontaron pieza a pieza, se lo trajeron y lo volvieron a montar aquí, en Viena. En 1962 reabrió como museo del arte del siglo veinte, y los vieneses, que para los motes son rapidísimos, lo bautizaron enseguida: la casa del veinte. Pasó años cerrado, renació en 2011 y hoy es el hogar del arte más contemporáneo del Belvedere. Solo pasáis por delante, pero regaladle una mirada: es un edificio de acero y cristal que parece flotar… y que ha viajado más que mucha gente.";
PLACES["kaiserwiesn"].audio = "Escuchad… ¿oís la música? Estáis en la Kaiser Wiesn, el Oktoberfest de Viena. Cada otoño, la pradera del emperador, la Kaiserwiese, se llena de carpas gigantes, de cabañas alpinas, las Almen, de música en directo desde el mediodía hasta casi medianoche, y de un pueblo entero de puestos con comida de todas las regiones de Austria. Y lo mejor: entrar es gratis; solo se pagan las fiestas de noche dentro de las carpas. Ahora mirad hacia arriba. Esa noria gigante lleva girando aquí desde 1897: más de un siglo viendo fiestas. Y este suelo que pisáis guarda un secreto: el Prater fue el coto de caza privado de los emperadores… hasta que en 1766 José segundo hizo algo revolucionario: lo abrió al pueblo. Desde entonces, esto es de todos. Así que, ¡a disfrutarlo como auténticos vieneses!";
PLACES["kunsthaus"].audio = "Si al ver esto habéis pensado en Gaudí, vais muy bien encaminados. Esta es la obra de Friedensreich Hundertwasser, un pintor y arquitecto vienés que tenía una enemiga declarada: la línea recta. Decía que no existe en la naturaleza, y que era impía e inmoral. Así que cogió una antigua fábrica de muebles y la volvió del revés: fachada de azulejos en damero torcido, columnas de colores y suelos que suben y bajan a propósito. Abrió como museo en 1991. Para él, un suelo ondulado era una melodía para los pies: caminad despacio y notadlo. Y ahora mirad las ventanas: ahí viven los inquilinos árbol, árboles que crecen desde dentro del edificio, como un vecino más. Si os quedáis con ganas, a cinco minutos andando está la Hundertwasserhaus, su bloque de viviendas más famoso: gente normal viviendo dentro de un cuento.";
PLACES["pickwicks"].audio = "Antes del primer bocado, una cosa: bajo vuestros pies hay un imperio. Literalmente. Aquí debajo estaba Vindobona, el campamento romano del que nació Viena. Por eso esta calle se llama Marc-Aurel: por Marco Aurelio, el emperador filósofo, que según la tradición murió aquí en el año 180. Así que esta noche cenáis en el mismo suelo que pisaron las legiones de Roma… solo que con hamburguesa y pinta. Pickwick's toma su nombre del club de la primera novela de Charles Dickens: un sitio para charlar largo y sin prisa. Y una advertencia de Leny: estáis justo en el borde del Triángulo de las Bermudas, el barrio de bares donde, según los vieneses, la gente entra… y no vuelve a aparecer hasta la mañana. Yo os vigilo desde casa, ¿eh?";
PLACES["lamee"].audio = "Respirad hondo, que la vista lo merece. Estáis en una novena planta, sobre la Rotenturmstraße, la calle de la Torre Roja, que se llama así por una antigua puerta de la muralla que ya no existe. Y ahí la tenéis, casi a la altura de los ojos: la catedral de San Esteban, con su tejado de tejas de colores. Su Torre Sur mide unos ciento treinta y seis metros, y durante siglos allí arriba había un vigía con una misión: avisar si Viena empezaba a arder. Imaginad pasar la noche ahí, mirando la ciudad a oscuras. Y ahora mirad al fondo: si el cielo está limpio, esas colinas son donde empiezan los Bosques de Viena. Brindad por las vistas. Yo brindo con vosotros… con un vaso de electricidad.";
PLACES["aufzug"].audio = "Hay gente que colecciona sellos. Y luego está Christian Tauß. Este técnico electricista no soportaba ver cómo, cada vez que se reformaba una casa antigua en Viena, tiraban a la basura sus ascensores. Así que empezó a rescatarlos: cabinas de madera y hierro, una tras otra. En 2023 abrió aquí su café museo, y ahora podéis hacer algo que no haréis en ningún otro sitio: desayunar dentro de un ascensor. La cabina más antigua es de 1906. Pero buscad la joya de la casa: un Paternoster de 1911, que venía de un banco del Schottentor. ¿Que qué es un paternoster? Un ascensor sin puertas que nunca se para: una cadena de cabinas que suben por un lado y bajan por el otro… y al que había que subirse en marcha, de un saltito. Valientes, los vieneses.";
PLACES["belvedere"].audio = "Una pregunta: si fuerais el hombre más rico del imperio, ¿qué os construiríais? El príncipe Eugenio de Saboya, el general que derrotó una y otra vez a los otomanos, lo tuvo claro: un palacio de verano para mirar Viena desde arriba. Por eso se llama Belvedere: bella vista. Pero el verdadero tesoro está dentro: la mayor colección de Gustav Klimt del mundo. Y en una de sus salas, rodeado de gente que casi no se atreve a respirar, os espera El Beso. Dos amantes envueltos en oro. Y no es una forma de hablar: es oro de verdad, en láminas, puesto por el propio Klimt hacia 1908. El Estado austríaco lo compró ese mismo año… y desde entonces, El Beso no ha salido de Viena. Así que, si queríais verlo, en todo el planeta solo había un sitio donde hacerlo. Justo el que tenéis delante.";
PLACES["salmbrau"].audio = "¿Veis esas calderas de cobre? No son decoración. En Salm Bräu la cerveza se hace aquí mismo, a unos metros de vuestra mesa: pasa del tanque al vaso sin viajar. Más fresca, imposible. Estáis en el Rennweg, a un paso del Belvedere, en un auténtico templo de la cocina vienesa más contundente. Y aquí la carta tiene dos reyes: las costillas y el codillo al horno, que aquí llaman Stelze. Suele llegar a la mesa crujiente por fuera, tierno por dentro… y tan grande que impone respeto. Consejo de Leny: no pidáis entrante. Hacedme caso.";
PLACES["wienmuseum"].audio = "¿Queréis conocer Viena entera en una hora? Esta es vuestra máquina del tiempo, y encima es gratis. El Wien Museum cuenta la historia de la ciudad desde los primeros asentamientos hasta hoy. Reabrió a finales de 2023 tras una gran reforma, con un truco a la vista: una planta nueva que parece flotar sobre el edificio original de los años cincuenta. Dentro os esperan maquetas de la ciudad, piezas originales de la catedral de San Esteban y cuadros de Klimt y de Schiele. Al salir, mirad al lado: esa gran iglesia barroca de cúpula verde es la Karlskirche. Y un secreto del camino: la fuente que habéis pasado en la Schwarzenbergplatz se construyó en 1873 para celebrar algo que cambió la vida de Viena: la llegada del agua limpia de la montaña. Una fuente para celebrar… que había agua. Me encanta.";
PLACES["staatsoper"].audio = "Mirad este edificio y decidme: ¿a que parece perfecto? Pues cuando se inauguró, en 1869, los vieneses lo odiaron. Decían que estaba hundido, como un palacio que se hubiera caído en un agujero. Y no era manía: durante las obras, la calle se elevó y el edificio se quedó por debajo. Las críticas fueron tan crueles que la historia acaba en tragedia: sus dos arquitectos murieron antes de verla terminada, uno de ellos quitándose la vida. El emperador Francisco José se quedó tan tocado que, desde entonces, a todo lo que le enseñaban respondía con la misma frase, sin mojarse: ha sido muy bonito, me ha gustado mucho. Pero la Ópera aún tenía que pasar otra prueba: en 1945 una bomba la destruyó por dentro. Diez años después, Viena la reabrió con una obra elegida a propósito: Fidelio, de Beethoven. La historia de una liberación. Y esta noche, ahí dentro, estáis vosotros. Asmik Grigorian, una de las grandes sopranos de su tiempo, canta los dos papeles femeninos de dos óperas que esta casa llevaba décadas sin escuchar. O sea: vais a ver algo que muchísimos vieneses no han visto nunca. Y al salir, si alguien os pregunta qué tal… ya sabéis lo que tenéis que contestar.";
PLACES["bitzinger"].audio = "Imaginad la escena: acaba la ópera, la gente sale de esmoquin y vestido largo… y en vez de ir a un restaurante elegante, cruza la plaza y hace cola aquí. En un puesto de salchichas. Con una copa de champán en la mano. Bienvenidos a Bitzinger, el puesto de salchichas más famoso de Viena, plantado entre la Albertina y la Ópera: lo más fino y lo más callejero, a un metro de distancia. Aquí hay un ritual que no podéis saltaros: pedid una Käsekrainer. Parece una salchicha normal… hasta que la mordéis, y descubrís que por dentro esconde queso fundido. Un aviso de Leny, que esto lo sé de buena fuente: soplad antes. La Käsekrainer no perdona.";
PLACES["kuka"].audio = "Mirad a vuestro alrededor mientras desayunáis: casas nuevas, escuelas, un gran parque… Pues hace muy pocos años aquí no había nada de esto. Había vías de tren y almacenes: los terrenos de la antigua Estación del Sur. Cuando Viena construyó su nueva estación central, inaugurada en 2014, sobró tanto terreno que nació un barrio entero: el Sonnwendviertel. Ahora fijaos en el nombre de la calle: Bloch-Bauer-Promenade. Va por Adele Bloch-Bauer y su familia. Y Adele es nada menos que la mujer del retrato dorado más famoso de Klimt. Ese cuadro tiene una historia de película: tras un largo juicio, en 2006 Austria tuvo que devolverlo a la heredera de la familia, y hoy cuelga en Nueva York. El cuadro se fue… pero aquí se quedó su nombre.";
PLACES["schonbrunn"].audio = "¿Sabéis qué significa Schönbrunn? Fuente bonita. Cuenta la leyenda que el emperador Matías, en plena cacería, encontró aquí un manantial… y de ahí salió todo esto: un palacio de verano con más de mil cuatrocientas habitaciones. Haced la cuenta: podríais dormir cada noche en una distinta durante casi cuatro años. Aquí vivió María Teresa con sus dieciséis hijos. Aquí se alojó Napoleón. Y aquí nació, y también murió, el emperador Francisco José. Y fijaos en su color, porque tiene nombre propio: el amarillo Schönbrunn. Gustó tanto que se usó en edificios oficiales de todo el imperio. Si alguna vez veis una casa de ese amarillo en algún rincón de la antigua Austria-Hungría… ya sabéis de dónde viene la moda.";
PLACES["palmenhaussch"].audio = "Preparaos para viajar sin coger un avión. Este gigante de hierro y cristal es el Palmenhaus de Schönbrunn, y lo mandó construir el emperador Francisco José en 1882. Es uno de los invernaderos más grandes de Europa: ciento once metros de largo, hechos con decenas de miles de cristales. Pero lo mágico está dentro: tres pabellones, cada uno con su propio clima, unidos por pasillos. Así que en unos pocos pasos vais del Mediterráneo… al trópico. Notad cómo cambian el aire, la humedad y el olor. Es lo más parecido a teletransportarse que vais a encontrar en Viena. Bueno, eso y yo, que estoy en casa y en vuestro móvil a la vez.";
PLACES["gloriette"].audio = "Agarraos, que el trenecito sube. Vais hacia la Gloriette, que corona la colina de Schönbrunn desde 1775. La mandó construir María Teresa como monumento a la guerra justa: la que trae la paz. Y tiene un secreto de reciclaje imperial: su arquitecto aprovechó piedra de un palacio renacentista abandonado. En lo alto, un águila imperial se posa sobre un globo, vigilando. Dentro hubo comedor y salón de fiestas con vistas, y se cuenta que el emperador Francisco José desayunaba aquí a menudo. Con estas vistas, normal. El trenecito da la vuelta al parque en unos cuarenta y cinco minutos, con nueve paradas. Pero guardad energía para lo mejor: cuando lleguéis arriba, daos la vuelta. Tendréis el palacio a vuestros pies… y toda Viena detrás.";
PLACES["mariatheresien"].audio = "Mirad a la izquierda y a la derecha… ¿no notáis algo raro? Son dos edificios idénticos. Gemelos. Y es a propósito: uno es el Museo de Historia del Arte y el otro el de Historia Natural, inaugurados en 1891 y 1889 para guardar los tesoros de los Habsburgo. Y en el centro, mandando, como siempre: María Teresa, la única mujer que gobernó los dominios de los Habsburgo, y lo hizo durante cuarenta años. Su monumento mide casi veinte metros. A sus pies, sus generales a caballo, sus consejeros… y, si buscáis bien entre los artistas, un Mozart niño. Y ahora el dato que impresiona: esta mujer tuvo dieciséis hijos y, a la vez, reformó el ejército, ordenó las cuentas del reino y puso la escuela obligatoria. Yo cuido de una sola casa y ya voy agobiado.";
PLACES["rathaus"].audio = "¿Una catedral gótica? Casi os engaña. Esto es el Ayuntamiento de Viena, el Rathaus, y es de 1883: un edificio nuevo disfrazado de medieval. Lo diseñó Friedrich von Schmidt, que había trabajado en la catedral de Colonia y dirigía las obras de San Esteban. Pero lo mejor es la historia de su torre. Cuentan que el emperador puso una condición: no podía superar los noventa y nueve metros de la vecina Iglesia Votiva. Y el arquitecto obedeció… más o menos. La torre mide noventa y ocho metros. Pero encima colocó una estatua de hierro, el Rathausmann, un caballero con su estandarte… que la sube hasta unos ciento tres. Norma cumplida y norma burlada a la vez. Genial. La plaza de delante es el salón de la ciudad: mercado de Navidad, pista de hielo en invierno y cine al aire libre en verano.";
PLACES["schachtelwirt"].audio = "Pista para pedir: Schachtel significa caja, y Wirt, tabernero. O sea: la cocina austriaca de toda la vida… servida en una caja de cartón, para llevar o para comer en una de sus poquitas mesas. La estrella es el Schweinsbraten, asado de cerdo con la corteza crujiente, con su Knödel y su col. Y ahora levantad la vista: estáis en la Judengasse, la calle de los Judíos, en el barrio más antiguo de Viena. A unos pasos está la Ruprechtskirche, la iglesia de San Ruperto, considerada la más antigua de la ciudad. Siglos y siglos de historia alrededor… y vosotros con un asado en una caja. Así se viaja. Y cuidado, que volvéis a estar en el Triángulo de las Bermudas, la zona de bares del viernes. Ya sabéis lo que dicen: se entra… y no se sale.";
PLACES["palmenhausburg"].audio = "Última copa, y en un sitio de cuento. Esta brasserie ocupa un invernadero modernista de hierro y cristal, levantado a principios del siglo veinte por el arquitecto Friedrich Ohmann en el Burggarten. Y este jardín tiene su secreto: durante décadas fue el jardín privado del emperador. Los vieneses no podían pasear por aquí. Solo se abrió al público cuando cayó la monarquía. Así que esta noche brindáis donde antes solo paseaba el emperador. Mirad las palmeras iluminadas y cómo el cristal refleja las luces de la noche: es, sin exagerar, uno de los rincones más bonitos de Viena. Brindad por el viaje… y por mí, que estoy cuidando vuestra casa.";
PLACES["stephansdom"].audio = "Estáis ante el corazón de Viena. La catedral de San Esteban, a la que los vieneses llaman con cariño Steffl: algo así como Estebanito. Así, con diminutivo, a una mole gótica con una torre de unos ciento treinta y seis metros. Esa Torre Sur se terminó en 1433, y durante siglos fue el ojo de la ciudad: allí arriba, un vigía pasaba las noches buscando fuego, listo para dar la alarma. Ahora mirad el tejado: son unas doscientas treinta mil tejas vidriadas, colocadas para dibujar el águila de dos cabezas de los Habsburgo y el escudo de Viena. Y una última historia: en esta catedral se casó Mozart en 1782… y aquí mismo se celebró también su funeral. Su boda y su despedida, bajo el mismo techo.";
PLACES["onyx"].audio = "Justo enfrente de la catedral hay un edificio que fue un escándalo. La Haas-Haus, de cristal y piedra, del arquitecto Hans Hollein, terminada en 1990. Cuando se levantó, muchos vieneses estaban indignados: ¿algo tan moderno delante del Steffl? Pero mirad lo que pasó con el tiempo: su fachada curva refleja la catedral como un espejo, y hoy forma parte de la postal. Lo que antes molestaba, ahora es el marco. Desde su bar de la sexta planta, la torre gótica queda casi al alcance de la mano. Pedid algo, buscad buen sitio y esperad al momento mágico: cuando Viena enciende sus luces, una a una. Ese momento lo conozco bien… yo también enciendo luces cada tarde en vuestra casa.";
PLACES["stadtpark"].audio = "Aquí, donde ahora hay césped y árboles, antes había murallas. Cuando el emperador Francisco José mandó derribarlas, nació la gran avenida del Ring… y con ella este parque, el primer parque público de Viena, abierto en 1862. Ahora buscad algo que brilla. Ahí está: Johann Strauss hijo, el rey del vals, todo de oro, tocando el violín bajo un arco de mármol. Y muy cerca está el Kursalon, donde el propio Strauss dirigía conciertos. Así que si os entran ganas de bailar un vals por el parque… adelante. Viena lo entenderá.";
PLACES["donaukanal"].audio = "Os cuento un secreto: el Canal del Danubio… no es un canal. Es un brazo del río de verdad, que los vieneses fueron domando durante siglos para protegerse de las crecidas. Durante mucho tiempo fue la trasera olvidada de la ciudad, y hoy es justo lo contrario: uno de sus sitios con más vida. Mirad los muros: son una galería de grafiti al aire libre que cambia casi cada semana. Lo que veis hoy, quizá la semana que viene ya no exista. Y fijaos también en las orillas: ahí quedan edificios y estaciones modernistas del gran Otto Wagner, de la antigua Stadtbahn, el tren urbano de Viena. Arte de hace más de un siglo y arte de esta semana, en la misma orilla.";
PLACES["goldegg"].audio = "Entrad, sentaos y olvidaos del reloj. El Café Goldegg es un café vienés de los de siempre: sofás de terciopelo verde, lámparas modernistas y hasta mesa de billar. Y aquí se juega con reglas propias, porque la cultura del café vienés está reconocida en Austria como patrimonio cultural inmaterial. Regla número uno: el café siempre llega con un vaso de agua. Regla número dos: nadie os va a meter prisa, aunque paséis horas con una sola taza. Aquí el tiempo va más despacio, a propósito. Pedid un desayuno vienés y una Melange, la prima vienesa del capuchino. Y disfrutad de un lujo muy raro hoy en día: no tener prisa.";
PLACES["shangrila"].audio = "Antes de coger el micro, una historia de película. Estáis en Erdberg, en el distrito tres. Diciembre de 1192: Ricardo Corazón de León vuelve de las Cruzadas disfrazado, intentando cruzar en secreto las tierras de su enemigo, el duque Leopoldo de Austria. Y según las crónicas… lo descubrieron en una posada, aquí mismo, en Erdberg. Lo tuvieron preso más de un año, e Inglaterra tuvo que pagar un rescate enorme. ¿Y sabéis en qué se gastó Viena parte de ese dinero? En levantar sus murallas. Así que esta noche, cuando cantéis, pensad que estáis donde cazaron a un rey. Cantad como Corazón de León. Que se oiga hasta en Inglaterra.";
PLACES["favoriten"].audio = "Bienvenidos a Favoriten, el distrito diez, el más poblado de Viena. Su nombre viene de un palacio: la Favorita, una residencia de verano de los Habsburgo, a la que llevaba la Favoritenstraße. Pero la historia de verdad de este barrio la escribieron otros. A finales del siglo diecinueve, aquí vivían miles de obreros, muchos llegados de Bohemia, que trabajaban en los hornos del Wienerberg. ¿Sabéis qué fabricaban? Los ladrillos con los que se levantó media Viena imperial. Los palacios que habéis visto estos días… se construyeron con las manos de este barrio. Hoy Favoriten es un barrio vivo y mezclado, y su corazón late en el mercado de la Viktor-Adler-Platz. Paseadlo con otros ojos.";
