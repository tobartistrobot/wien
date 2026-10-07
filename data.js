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
