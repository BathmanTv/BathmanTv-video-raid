// Vashnik le Malveillant — strat express (§9 du script).
// Chaque propriété visuelle est une fonction pure du temps t (secondes) : window.renderFrame(t)
// peut rendre n'importe quelle image isolément. Le temps est calé sur la voix off
// (vo/out/data.js : début et fin de chaque phrase, enveloppe de la voix).
'use strict'
const TL = window.TL, L = TL.lines, DUR = TL.duration
window.DURATION = DUR
const NS = 'http://www.w3.org/2000/svg'
const stage = document.getElementById('stage')

// ─── outils ───────────────────────────────────────────────────────────────
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x))
const lerp = (a, b, p) => a + (b - a) * p
const E = {
  lin: t => t,
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
  io: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  back: t => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2) },
}
const tw = (t, t0, d, e = E.out) => e(clamp((t - t0) / d))
const win = (t, a, b, f = 0.3) => Math.min(tw(t, a, f), 1 - tw(t, b - f, f, E.in))   // apparaît en a, disparaît en b
function h(tag, o = {}, parent) {
  const el = document.createElement(tag)
  if (o.cls) el.className = o.cls
  if (o.css) el.style.cssText = o.css
  if (o.html != null) el.innerHTML = o.html
  if (o.text != null) el.textContent = o.text
  if (o.src) el.src = o.src
  if (parent) parent.appendChild(el)
  return el
}
function sv(tag, a = {}, parent) {
  const el = document.createElementNS(NS, tag)
  for (const k in a) el.setAttribute(k, a[k])
  if (parent) parent.appendChild(el)
  return el
}
const O = (el, v) => { el.style.opacity = v }
const T = (el, v) => { el.style.transform = v }
const V = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden' }
const SA = (el, k, v) => el.setAttribute(k, v)

// temps de la voix
const plain = s => s.replace(/\{\w:([^}]*)\}/g, '$1')
const st = i => L[i].start
const en = i => L[i].end
function at(i, needle, off = 0) {                 // instant (estimé) où un mot est prononcé
  const p = plain(L[i].text), k = p.indexOf(needle)
  if (k < 0) throw new Error(`« ${needle} » absent de la phrase ${i}`)
  return st(i) + (en(i) - st(i)) * (k / p.length) + off
}
function env(t) {                                  // amplitude de la voix, 0 → 1
  const f = t * 30, i = Math.floor(f), a = window.ENV[i] || 0, b = window.ENV[i + 1] || 0
  return a + (b - a) * (f - i)
}
const mk = s => s.replace(/\{(\w):([^}]*)\}/g, '<span class="$1">$2</span>')

// fontaines
const FC = { S: '#8E1B2E', O: '#6B3FA0', F: '#D1701F' }
const FT = { S: '#E0566D', O: '#B08AE8', F: '#E8893A' }
const FN = { S: 'SANG', O: 'OMBRE', F: 'FLAMME' }
const ANG = { S: -150, O: -30, F: 90 }
const PAIR = { SO: -90, OF: 30, FS: 150 }
const rad = d => (d * Math.PI) / 180
const polar = (r, a) => [Math.cos(rad(a)) * r, Math.sin(rad(a)) * r]

// bornes des plans
const XF = 0.35
const B = {
  hook: st(1) - 0.6, map: st(2) - 0.4, det: st(9) - 0.6, inf: st(13) - 0.6, fang: st(17) - 0.8,
  froth: st(18) - 0.6, bile: st(19) - 0.6, tum: st(20) - 0.7, out: st(22) - 0.9,
}

// ─── composants ───────────────────────────────────────────────────────────
function studio(root, hx = 30) {
  h('div', { cls: 'studio', css: `--hx:${hx}%` }, root)
  h('div', { cls: 'dots' }, root)
}
function Presenter(parent, x0 = -300, y0 = 250, sc = 0.909) {
  const w = h('div', { cls: 'presenter' }, parent)
  h('img', { src: 'assets/img/gideon.png' }, w)
  // yeux, gemme du front, gemme du torse : ils s'allument avec la voix (le casque n'a pas de bouche)
  const G = [[754, 407, 64], [906, 411, 64], [835, 346, 52], [846, 813, 90]].map(([x, y, r]) =>
    h('div', { cls: 'glow', css: `left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px` }, w))
  return {
    render(t, dx = 0, op = 1) {
      const b = Math.sin((t * 2 * Math.PI) / 4.4)
      T(w, `translate(${x0 + dx}px,${y0 + 3 * b}px) scale(${sc * (1 + 0.005 * b)})`)
      O(w, op)
      const a = env(t)
      G.forEach((g, i) => {
        O(g, i < 2 ? 0.12 + 0.88 * a : i === 2 ? 0.08 + 0.6 * a : 0.05 + 0.45 * a)
        T(g, `scale(${0.8 + 0.35 * a})`)
      })
    },
  }
}
function Lower(parent) {
  const el = h('div', { cls: 'lower', html: '<div class="bar"></div><div class="txt"><div class="n">GIDEON</div><div class="r">COACH DE RAID</div></div>' }, parent)
  const wv = h('div', { cls: 'wave' }, el)
  const bars = Array.from({ length: 16 }, () => h('i', {}, wv))
  return {
    render(t, op = 1) {
      O(el, op); T(el, `translateX(${(1 - op) * -40}px)`)
      bars.forEach((b, k) => { b.style.height = 6 + 34 * env(t - k * 0.02) * (0.55 + 0.45 * Math.abs(Math.sin(k * 1.7 + 0.3))) + 'px' })
    },
  }
}
function TV(parent, x, y, w, hh, head, right = '') {
  const el = h('div', { cls: 'tv', css: `left:${x}px;top:${y}px;width:${w}px;height:${hh}px` }, parent)
  const hd = h('div', { cls: 'head', html: `<span class="live"></span><span class="l">${head}</span><span class="r">${right}</span>` }, el)
  const body = h('div', { cls: 'body' }, el)
  return { el, hd, body, set(label, r, bg, fg) { hd.querySelector('.l').textContent = label; hd.querySelector('.r').textContent = r; hd.style.background = bg; hd.style.color = fg } }
}
const fields = (parent, css, items) => h('div', { cls: 'fields', css, html: items.map(([k, v, c]) => `<div style="border-top-color:${c || 'var(--cyan)'}"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('') }, parent)
const spell = (parent, css, fr, en2, v, col) => h('div', { cls: 'spell', css: `${css};${col ? `--bc:${col}88;--nc:${col}` : ''}`, html: `<div class="n">${fr}<span>(${en2})</span></div><div class="v">${v}</div>` }, parent)
function rise(parent, css, text, cls = 't') {                  // titre qui monte ligne par ligne
  const el = h('div', { cls: `abs ${cls}`, css }, parent)
  const inner = h('span', { text }, h('span', { cls: 'rise' }, el))
  return { el, render(p) { T(inner, `translateY(${(1 - p) * 110}%)`) } }
}
function blob(parent, f, r, x, y) {                            // un venin (vignettes)
  const g = sv('g', {}, parent)
  sv('circle', { r, fill: FT[f], stroke: '#fff', 'stroke-width': 3 }, g)
  sv('circle', { cx: -r * 0.3, cy: -r * 0.3, r: r * 0.28, fill: '#fff', opacity: 0.45 }, g)
  const set = (px, py, s = 1, op = 1) => { SA(g, 'transform', `translate(${px} ${py}) scale(${s})`); SA(g, 'opacity', op) }
  set(x, y)
  return { g, set }
}

// ─── plan de salle vu de dessus : trois tiers, trois fontaines, la Cavité ───
let roomId = 0
function Room(parent) {
  const id = 'r' + roomId++
  const wrap = h('div', { cls: 'abs' }, parent)
  const svg = sv('svg', { viewBox: '-130 -130 260 260', width: '100%', height: '100%', style: 'position:absolute;left:0;top:0;overflow:visible' }, wrap)
  const defs = sv('defs', {}, svg)
  for (const f of 'SOF') {
    const g = sv('radialGradient', { id: `g${f}${id}` }, defs)
    sv('stop', { offset: 0, 'stop-color': '#fff', 'stop-opacity': 0.9 }, g)
    sv('stop', { offset: 0.35, 'stop-color': FT[f] }, g)
    sv('stop', { offset: 1, 'stop-color': FC[f] }, g)
  }
  const cg = sv('radialGradient', { id: `cav${id}` }, defs)
  sv('stop', { offset: 0, 'stop-color': '#1a0d10' }, cg); sv('stop', { offset: 0.7, 'stop-color': '#07040a' }, cg); sv('stop', { offset: 1, 'stop-color': '#2a1a08' }, cg)
  sv('circle', { r: 106, fill: '#070918', stroke: 'rgba(169,180,199,.35)', 'stroke-width': 1.2 }, svg)
  const sect = {}, glow = {}, core = {}, label = {}, drain = {}
  for (const f of 'SOF') {
    const [x0, y0] = polar(100, ANG[f] - 60), [x1, y1] = polar(100, ANG[f] + 60)
    sect[f] = sv('path', { d: `M0 0L${x0} ${y0}A100 100 0 0 1 ${x1} ${y1}Z`, fill: FC[f], 'fill-opacity': 0.17, stroke: '#04050F', 'stroke-width': 1.5 }, svg)
  }
  for (const a of [-90, 30, 150]) { const [x, y] = polar(100, a); sv('line', { x1: 0, y1: 0, x2: x, y2: y, stroke: 'rgba(237,233,225,.18)', 'stroke-width': 0.6, 'stroke-dasharray': '2 2' }, svg) }
  for (const f of 'SOF') drain[f] = sv('path', { fill: 'none', stroke: FT[f], 'stroke-width': 2.4, 'stroke-dasharray': '3 2.5', opacity: 0 }, svg)
  for (const f of 'SOF') {
    const [x, y] = polar(74, ANG[f])
    glow[f] = sv('circle', { cx: x, cy: y, r: 20, fill: FT[f], 'fill-opacity': 0.18, stroke: FT[f], 'stroke-width': 0.8, opacity: 0 }, svg)
    core[f] = sv('circle', { cx: x, cy: y, r: 11, fill: `url(#g${f}${id})`, stroke: '#EDE9E1', 'stroke-opacity': 0.7, 'stroke-width': 0.8 }, svg)
    const [lx, ly] = polar(74 + (f === 'F' ? -25 : 21), ANG[f])
    label[f] = sv('text', { x: lx, y: ly + 3.2, 'text-anchor': 'middle', 'font-family': 'Barlow Condensed', 'font-weight': 700, 'font-size': 9, 'letter-spacing': 0.6, fill: FT[f] }, svg)
    label[f].textContent = FN[f]
  }
  const cavPulse = sv('circle', { r: 19, fill: 'none', stroke: '#D19A45', 'stroke-width': 1.2, opacity: 0 }, svg)
  const cavFlash = sv('circle', { r: 24, fill: '#D19A45', opacity: 0 }, svg)
  sv('circle', { r: 14, fill: `url(#cav${id})`, stroke: '#D19A45', 'stroke-width': 1.2, 'stroke-dasharray': '2.5 1.8' }, svg)
  sv('circle', { r: 19, fill: 'none', stroke: '#D19A45', 'stroke-opacity': 0.35, 'stroke-width': 0.6 }, svg)
  const cavLabel = sv('text', { y: 29, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-weight': 600, 'font-size': 4.2, 'letter-spacing': 0.8, fill: '#D19A45', opacity: 0 }, svg)
  cavLabel.textContent = 'CAVITÉ MALVEILLANTE'
  const gT = sv('g', {}, svg), gM = sv('g', {}, svg), gR = sv('g', {}, svg), gV = sv('g', {}, svg)
  const bossW = 46 * 1058 / 1090
  const shadow = sv('ellipse', { rx: 12, ry: 3.5, fill: '#000', opacity: 0 }, svg)
  const boss = sv('image', { href: 'assets/img/vashnik.png', width: bossW, height: 46, opacity: 0 }, svg)
  const venins = Array.from({ length: 4 }, () => {
    const g = sv('g', { opacity: 0 }, gV)
    const ring = sv('circle', { r: 10.5, fill: 'none', stroke: '#D19A45', 'stroke-width': 1.4, opacity: 0 }, g)
    const c = sv('circle', { r: 7, stroke: '#fff', 'stroke-width': 0.9 }, g)
    const tx = sv('text', { y: 16, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-weight': 600, 'font-size': 4.2, fill: '#EDE9E1' }, g)
    const trail = sv('line', { stroke: '#EDE9E1', 'stroke-opacity': 0.5, 'stroke-width': 1.1, 'stroke-dasharray': '1 2' }, gV)
    return { g, ring, c, tx, trail }
  })
  const tumors = [[-50, -62], [-50, 30], [40, -62], [60, 52], [-18, 76]].map(([x, y]) => {
    const g = sv('g', { opacity: 0 }, gT)
    let p = ''
    for (let i = 0; i < 16; i++) { const rr = i % 2 ? 3 : 6.2; p += `${i ? 'L' : 'M'}${Math.cos((i * Math.PI) / 8) * rr} ${Math.sin((i * Math.PI) / 8) * rr}` }
    sv('path', { d: p + 'Z', fill: '#2a1a08', stroke: '#D19A45', 'stroke-width': 1 }, g)
    const x2 = sv('path', { d: 'M-6 -6L6 6M6 -6L-6 6', stroke: '#7ADBFA', 'stroke-width': 1.8, opacity: 0 }, g)
    return { g, x, y, x2 }
  })
  const marked = Array.from({ length: 3 }, () => {
    const g = sv('g', { opacity: 0 }, gM)
    const lines = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => ({ dx, dy, l: sv('line', { stroke: '#7ADBFA', 'stroke-opacity': 0.45, 'stroke-width': 4, 'stroke-linecap': 'round' }, g) }))
    const dot = sv('circle', { r: 3.6, fill: '#EDE9E1', stroke: '#7ADBFA', 'stroke-width': 1.2 }, g)
    return { g, lines, dot }
  })
  const raid = Array.from({ length: 8 }, () => sv('circle', { r: 2.6, fill: '#EDE9E1', stroke: '#04050F', 'stroke-width': 0.6, opacity: 0 }, gR))
  const R = {
    wrap, sect, glow, core, label, drain, cavPulse, cavFlash, cavLabel, tumors, marked, raid,
    place(cx, cy, r) { const s = r * 2.6; wrap.style.cssText = `left:${cx - s / 2}px;top:${cy - s / 2}px;width:${s}px;height:${s}px` },
    fountain: f => polar(74, ANG[f]),
    setBoss(x, y, op) { SA(boss, 'x', x - bossW / 2); SA(boss, 'y', y - 36); SA(boss, 'opacity', op); SA(shadow, 'cx', x); SA(shadow, 'cy', y + 9); SA(shadow, 'opacity', op * 0.45) },
    setDrain(f, bx, by, op, t) {
      const [x, y] = polar(74, ANG[f])
      SA(drain[f], 'd', `M${x} ${y}Q${(x + bx) / 2 + (-by) * 0.15} ${(y + by) / 2} ${bx} ${by - 6}`)
      SA(drain[f], 'opacity', op); SA(drain[f], 'stroke-dashoffset', -t * 12)
    },
    setVenin(k, o) {
      const v = venins[k]
      SA(v.g, 'opacity', o.op); SA(v.trail, 'opacity', o.op)
      if (o.op <= 0) return
      const [fx, fy] = polar(74, ANG[o.f]), ex = fx * 0.2, ey = fy * 0.2
      const x = lerp(fx, ex, o.p), y = lerp(fy, ey, o.p)
      SA(v.g, 'transform', `translate(${x} ${y})`)
      SA(v.c, 'fill', FT[o.f]); SA(v.ring, 'opacity', o.hard || 0)
      SA(v.trail, 'x1', fx); SA(v.trail, 'y1', fy); SA(v.trail, 'x2', x); SA(v.trail, 'y2', y)
      v.tx.textContent = o.label || ''
    },
    setMarked(k, x, y, len, op) {
      const m = marked[k]
      SA(m.g, 'opacity', op); SA(m.dot, 'cx', x); SA(m.dot, 'cy', y)
      m.lines.forEach(({ dx, dy, l }) => { SA(l, 'x1', x); SA(l, 'y1', y); SA(l, 'x2', x + dx * len); SA(l, 'y2', y + dy * len) })
    },
  }
  return R
}

// ─── scènes ───────────────────────────────────────────────────────────────
const SCENES = []
function scene(name, t0, t1, build) {
  const root = h('div', { cls: 'scene' }, stage)
  SCENES.push({ name, t0, t1, root, ...build(root) })
}

// 01 · carton d'intro — Gideon au diner
scene('intro', 0, B.hook, root => {
  const img = h('img', { src: 'assets/img/diner.png', css: 'position:absolute;right:0;top:-40px;height:1160px;transform-origin:70% 50%' }, root)
  h('div', { cls: 'abs', css: 'left:0;top:0;width:1300px;height:1080px;background:linear-gradient(90deg,var(--night) 38%,rgba(4,5,15,.6) 70%,transparent)' }, root)
  const kick = h('div', { cls: 'abs m c', css: 'left:110px;top:250px;font-size:20px', text: 'GUIDE DE BOSS · THE VENOMOUS ABYSS' }, root)
  const t1 = rise(root, 'left:110px;top:290px;font-size:210px;color:#fff;text-shadow:0 0 60px rgba(63,184,255,.3)', 'Vashnik')
  const t2 = rise(root, 'left:110px;top:495px;font-size:78px;color:var(--muted)', 'le Malveillant')
  const pills = h('div', { cls: 'abs', css: 'left:110px;top:610px;display:flex;gap:12px', html: '<span class="pill myth">MYTHIQUE</span><span class="pill">STRAT EXPRESS · 3 MIN</span>' }, root)
  const route = h('div', { cls: 'abs', css: 'left:110px;top:690px;font:400 28px var(--body);color:#E3E8F2', text: '3ᵉ ou 5ᵉ boss selon votre route' }, root)
  const chipRow = h('div', { cls: 'abs', css: 'left:110px;bottom:90px;display:flex;gap:12px' }, root)
  const chips = ['Phase unique', '2 tanks · 4 heals · 14 DPS', 'Héroïsme au pull'].map(c => h('span', { cls: 'chip', text: c }, chipRow))
  return {
    render(t) {
      T(img, `scale(${1.08 - 0.08 * tw(t, 0, B.hook, E.lin)})`)
      O(kick, tw(t, 0.3, 0.5)); t1.render(tw(t, 0.5, 0.8)); t2.render(tw(t, 0.85, 0.7))
      O(pills, tw(t, 1.3, 0.5)); O(route, tw(t, 1.6, 0.5))
      chips.forEach((c, i) => { const p = tw(t, 2.0 + i * 0.18, 0.5, E.back); O(c, clamp(p)); T(c, `translateY(${(1 - p) * 20}px)`) })
    },
  }
})

// 02 · l'accroche, face cam
scene('hook', B.hook, B.map, root => {
  studio(root)
  const P = Presenter(root)
  const tv = TV(root, 1000, 200, 840, 472, 'Le combat', 'EN BREF')
  const rows = ['Une seule phase', '2 tanks · 4 heals · 14 DPS', 'Héroïsme au pull'].map((s, i) =>
    h('div', { cls: 'abs', css: `left:44px;top:${40 + i * 74}px;font:500 40px var(--body);display:flex;align-items:center;gap:18px`, html: `<span style="width:14px;height:14px;transform:rotate(45deg);background:var(--gem);display:inline-block"></span>${s}` }, tv.body))
  const big = h('div', { cls: 'abs', css: 'left:44px;right:44px;top:282px;padding:26px 30px;border:3px solid var(--cyan);display:flex;align-items:center;gap:26px', html: '<svg viewBox="0 0 24 24" width="84" height="84"><path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" fill="none" stroke="#7ADBFA" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="t c" style="font-size:78px">Tenir une rotation</span>' }, tv.body)
  const low = Lower(root)
  return {
    render(t) {
      P.render(t)
      const p = tw(t, B.hook + 0.15, 0.6); O(tv.el, p); T(tv.el, `translateX(${(1 - p) * 80}px)`)
      rows.forEach((r, i) => { const q = tw(t, st(1) + 0.2 + i * 0.55, 0.45); O(r, q); T(r, `translateX(${(1 - q) * 30}px)`) })
      const b = tw(t, at(1, 'tenir') - 0.1, 0.5, E.back); O(big, clamp(b)); T(big, `scale(${0.9 + 0.1 * b})`)
      low.render(t, tw(t, B.hook + 0.4, 0.5))
    },
  }
})

// 03 · la salle → Absorption → rotation → les venins (un seul plan de salle qui vit)
scene('map', B.map, B.det, root => {
  studio(root, 34)
  const P = Presenter(root)
  const low = Lower(root)
  const tv = TV(root, 1000, 200, 840, 560, 'La salle', 'VUE DE DESSUS')
  const R = Room(root)
  const RX = 1200, RW = 640
  const legend = h('div', { cls: 'panel', css: `left:${RX}px;top:190px;width:${RW}px;padding:30px 34px`, html:
    `${'SOF'.split('').map(f => `<div style="display:flex;align-items:center;gap:18px;margin:6px 0 16px"><span style="width:22px;height:22px;border-radius:50%;background:${FT[f]};box-shadow:0 0 16px ${FT[f]}"></span><span class="t" style="font-size:46px;color:${FT[f]}">${{ S: 'Sang', O: 'Ombre', F: 'Flamme' }[f]}</span></div>`).join('')}
     <div class="cav" style="margin-top:22px;padding-top:22px;border-top:1px solid rgba(169,180,199,.25);font:500 30px/1.35 var(--body)"><span class="d">Cavité malveillante</span><br><span style="color:var(--marble)">le point de défaite du combat</span></div>` }, root)
  const legCav = legend.querySelector('.cav')
  const energy = h('div', { cls: 'panel', css: `left:${RX}px;top:190px;width:${RW}px;padding:28px 32px`, html:
    `<div class="m" style="font-size:14px;color:var(--muted)">ÉNERGIE DE VASHNIK</div>
     <div style="margin-top:12px;height:22px;border:1px solid rgba(122,219,250,.6);padding:3px"><div class="bar" style="height:100%;width:0;background:linear-gradient(90deg,#1F3FA8,#7ADBFA)"></div></div>
     <div style="display:flex;justify-content:space-between;margin-top:10px;font:600 20px var(--mono)"><span class="pct c">0 %</span><span class="abs2 c">Absorption <span class="en">(Imbibe)</span></span></div>
     <div class="rule" style="font:500 32px/1.35 var(--body);margin-top:26px">Il boit aux <span class="c">deux fontaines les plus proches</span> de sa position.</div>` }, root)
  const eBar = energy.querySelector('.bar'), ePct = energy.querySelector('.pct'), eAbs = energy.querySelector('.abs2'), eRule = energy.querySelector('.rule')
  const rot = h('div', { cls: 'panel', css: `left:${RX}px;top:190px;width:${RW}px;padding:28px 32px`, html:
    `<div class="m" style="font-size:14px;color:var(--muted)">ROTATION PAR DÉFAUT</div>
     ${[['S', 'O'], ['O', 'F'], ['F', 'S']].map(([a, b]) => `<div class="pair" style="margin-top:16px;padding:12px 18px;border-left:4px solid transparent;font:700 44px var(--title);text-transform:uppercase"><span style="color:${FT[a]}">${FN[a]}</span> <span style="color:var(--muted)">+</span> <span style="color:${FT[b]}">${FN[b]}</span></div>`).join('')}
     <div style="margin-top:22px;font:500 28px/1.35 var(--body);color:var(--cyan)">Une seule nouvelle fontaine par cycle.</div>` }, root)
  const pairs = [...rot.querySelectorAll('.pair')]
  const vapor = h('span', { cls: 'chip', css: `position:absolute;left:${RX}px;top:640px;border-color:var(--gold);color:var(--gold)` }, root)
  const block = h('div', { cls: 'block', css: `--c:var(--gold);left:${RX}px;top:190px;width:${RW}px;font-size:34px`, html: '<div class="k">SI UN VENIN ATTEINT LE CENTRE</div><div class="l1">1 venin → survivable</div><div class="l2">2 venins → <span class="t" style="font-size:46px">WIPE</span></div>' }, root)
  const bl1 = block.querySelector('.l1'), bl2 = block.querySelector('.l2')
  const sp1 = spell(root, `left:${RX}px;top:440px;width:${RW}px`, 'Explosion malveillante', 'Malignant Burst', '<b>1 666 813</b> Nature sur tout le raid<br>puis <b>333 363</b> / 3 s pendant <b>30 s</b>, cumulable', '#D19A45')
  const sp2 = spell(root, `left:${RX}px;top:650px;width:${RW}px`, 'Venin durci', 'Hardened Venom', 'Après <b>60 s</b> : insensible aux contrôles,<br><b>+50 %</b> vitesse de déplacement')
  const stamp = h('div', { cls: 'stamp', css: 'left:0;width:1200px;top:430px;text-align:center', text: 'WIPE' }, root)
  const surv = h('div', { cls: 'abs m d', css: 'font-size:22px;left:0;width:1200px;top:392px;text-align:center', text: 'SURVIVABLE' }, root)

  // chronologie du boss
  const tIn = at(4, 'Vashnik') - 0.3, tDrink1 = at(4, 'boit') - 0.2
  const tMove1 = st(5) + 1.3, tMove2 = st(5) + 3.3
  const drinks = [[tDrink1, 'SO'], [tMove1 + 1.0, 'OF'], [tMove2 + 1.0, 'FS']]
  function bossPose(t) {
    if (t < tIn) return null
    if (t < tMove1) { const p = tw(t, tIn, 1.4, E.io); return [PAIR.SO, lerp(140, 50, p)] }
    if (t < tMove2) return [lerp(PAIR.SO, PAIR.OF, tw(t, tMove1, 1.0, E.io)), 50]
    return [lerp(PAIR.OF, PAIR.FS, tw(t, tMove2, 1.0, E.io)), 50]
  }
  const arr1 = at(7, 'atteint') + 0.5, arr2 = at(7, 'Deux') + 0.3
  const v3a = st(8) + 0.2, v3h = at(8, 'insensible')

  return {
    render(t) {
      const ex = tw(t, st(3) - 0.25, 0.95, E.io)                      // l'encart devient le plan plein écran
      P.render(t, -700 * ex, 1 - ex); low.render(t, (1 - ex) * tw(t, B.map + 0.3, 0.5))
      O(tv.el, (1 - ex) * tw(t, B.map, 0.5)); T(tv.el, `scale(${1 + 0.1 * ex})`)
      R.place(lerp(1420, 600, ex), lerp(480, 530, ex), lerp(205, 360, ex))
      O(R.wrap, tw(t, B.map + 0.15, 0.6))
      // les trois fontaines s'allument quand elles sont nommées
      const named = { S: at(2, 'Sang'), O: at(2, 'Ombre'), F: at(2, 'Flamme') }
      const pose = bossPose(t)
      let pair = ''
      for (const [td, p] of drinks) if (t >= td) pair = p
      for (const f of 'SOF') {
        const hi = 1 - tw(t, named[f] + 0.35, 0.7, E.lin)
        const intro = t >= named[f] - 0.05 ? hi : 0
        const drinking = pair.includes(f) ? 0.85 + 0.15 * Math.sin(t * 5) : 0
        SA(R.glow[f], 'opacity', Math.max(intro, drinking))
        SA(R.sect[f], 'fill-opacity', 0.17 + 0.17 * Math.max(intro, pair.includes(f) ? 1 : 0))
        SA(R.core[f], 'transform', `translate(${R.fountain(f)[0]} ${R.fountain(f)[1]}) scale(${1 + 0.35 * intro * (1 - hi * 0.3)}) translate(${-R.fountain(f)[0]} ${-R.fountain(f)[1]})`)
      }
      // la Cavité
      const cp = tw(t, at(3, 'Cavité') - 0.1, 1.2, E.out)
      SA(R.cavPulse, 'r', 19 + 26 * cp); SA(R.cavPulse, 'opacity', t > at(3, 'Cavité') - 0.1 ? 1 - cp : 0)
      SA(R.cavLabel, 'opacity', tw(t, at(3, 'Cavité'), 0.4))
      // le boss boit
      if (pose) {
        const [bx, by] = polar(pose[1], pose[0])
        R.setBoss(bx, by, tw(t, tIn, 0.4))
        for (const f of 'SOF') {
          const d = drinks.filter(([td, p]) => t >= td && p.includes(f)).pop()
          const op = d ? tw(t, d[0], 0.3) * (1 - tw(t, d[0] + 2.2, 0.5)) : 0
          R.setDrain(f, bx, by, op, t)
        }
      } else R.setBoss(0, -140, 0)
      // panneaux de droite
      const pL = win(t, st(3) - 0.2, st(4) - 0.3), pE = win(t, st(4) - 0.3, st(5) - 0.4), pR = win(t, st(5) - 0.4, st(6) - 0.5), pV = tw(t, st(6) - 0.5, 0.4)
      O(legend, pL); T(legend, `translateX(${(1 - pL) * 40}px)`); O(legCav, tw(t, at(3, 'Cavité'), 0.4))
      O(energy, pE); T(energy, `translateX(${(1 - pE) * 40}px)`)
      const fill = tw(t, st(4), 2.0, E.io)
      eBar.style.width = fill * 100 + '%'; ePct.textContent = Math.round(fill * 100) + ' %'
      O(eAbs, tw(t, at(4, 'Absorption'), 0.3)); O(eRule, tw(t, at(4, 'boit') - 0.3, 0.4))
      O(rot, pR); T(rot, `translateX(${(1 - pR) * 40}px)`)
      pairs.forEach((el, i) => {
        const on = i === ['SO', 'OF', 'FS'].indexOf(pair)
        el.style.borderLeftColor = on ? 'var(--cyan)' : 'transparent'; el.style.background = on ? 'rgba(122,219,250,.08)' : 'transparent'; O(el, on ? 1 : 0.45)
      })
      const piles = drinks.filter(([td]) => t >= td).length
      vapor.textContent = `Vapeur toxique · ${piles} pile${piles > 1 ? 's' : ''} · permanente`
      O(vapor, pR * (piles ? 1 : 0))
      // les venins rampent vers la Cavité
      O(block, pV); O(bl1, tw(t, at(7, 'atteint') - 0.2, 0.4)); O(bl2, tw(t, at(7, 'Deux') - 0.1, 0.4))
      O(sp1, tw(t, at(7, 'survivable'), 0.5)); O(sp2, tw(t, at(8, 'soixante'), 0.5))
      const s1 = st(6) + 0.3, s2 = st(6) + 0.8
      R.setVenin(0, { f: 'S', p: tw(t, s1, arr1 - s1, E.lin), op: t < s1 ? 0 : (1 - tw(t, arr1, 0.25)) * tw(t, s1, 0.3) })
      R.setVenin(1, { f: 'F', p: tw(t, s2, arr2 - s2, E.lin), op: t < s2 ? 0 : (1 - tw(t, arr2, 0.25)) * tw(t, s2, 0.3) })
      const k3 = clamp((t - v3a) / (v3h - v3a))
      const p3 = t < v3h ? 0.4 * k3 : 0.4 + 0.45 * tw(t, v3h, 2.2, E.in)
      R.setVenin(2, { f: 'S', p: p3, op: t < v3a ? 0 : tw(t, v3a, 0.3), hard: tw(t, v3h, 0.3), label: t < v3h ? Math.round(60 * k3) + ' s' : 'DURCI' })
      R.setVenin(3, { f: 'O', p: 0, op: 0 })
      const flash = Math.max(t > arr1 ? 1 - tw(t, arr1, 0.6) : 0, t > arr2 ? 1 - tw(t, arr2, 0.9) : 0)
      SA(R.cavFlash, 'opacity', flash * 0.8); SA(R.cavFlash, 'r', 24 + 20 * (1 - flash))
      O(surv, win(t, arr1, arr2 - 0.1, 0.2))
      const sp = tw(t, arr2, 0.35, E.back); O(stamp, clamp(sp) * (1 - tw(t, st(8) - 0.4, 0.4))); T(stamp, `scale(${1.4 - 0.4 * sp}) rotate(-6deg)`)
    },
  }
})

// 04 · les trois venins : face cam + vignette dans l'encart
scene('detail', B.det, B.inf, root => {
  studio(root)
  const P = Presenter(root)
  const low = Lower(root)
  const tv = TV(root, 1000, 200, 840, 420, 'Venin coagulant', 'VIGNETTE')
  const svg = sv('svg', { width: 840, height: 420, style: 'position:absolute;left:0;top:0' }, tv.body)
  const bg = sv('rect', { width: 840, height: 420, fill: '#0A0C22' }, svg)
  // Sang : il se divise
  const gS = sv('g', {}, svg)
  const big = blob(gS, 'S', 70, 420, 200)
  const mid = [blob(gS, 'S', 42, 420, 200), blob(gS, 'S', 42, 420, 200)]
  const small = [0, 1, 2, 3].map(() => blob(gS, 'S', 24, 420, 200))
  const cl = sv('text', { x: 420, y: 385, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': 18, 'letter-spacing': 3, fill: '#A9B4C7' }, gS); cl.textContent = 'CAILLOTS'
  // Ombre : cinq, sous un voile qui vaut toute leur vie
  const gO = sv('g', {}, svg)
  const raidDots = Array.from({ length: 8 }, (_, i) => sv('circle', { cx: 70 + (i % 2) * 34, cy: 130 + Math.floor(i / 2) * 44, r: 10, fill: '#EDE9E1' }, gO))
  const rl = sv('text', { x: 87, y: 355, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': 15, fill: '#A9B4C7' }, gO); rl.textContent = 'RAID'
  const shadows = [0, 1, 2, 3, 4].map(i => {
    const x = 300 + (i % 3) * 190 + (i > 2 ? 95 : 0), y = i > 2 ? 290 : 150
    const pud = sv('circle', { cx: x, cy: y, r: 46, fill: '#6B3FA0', 'fill-opacity': 0.4, stroke: '#B08AE8', 'stroke-width': 2, opacity: 0 }, gO)
    const b = blob(gO, 'O', 30, x, y)
    const sh = sv('rect', { x: x - 42, y: y - 58, width: 84, height: 8, fill: '#7ADBFA' }, gO)
    const hp = sv('rect', { x: x - 42, y: y - 47, width: 84, height: 8, fill: '#B08AE8' }, gO)
    return { x, y, pud, b, sh, hp }
  })
  const ok = sv('text', { x: 560, y: 400, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': 16, 'letter-spacing': 2, fill: '#7ADBFA' }, gO); ok.textContent = '✓ LES FLAQUES TOMBENT LOIN DU RAID'
  // Flamme : on contrôle le premier, on tue le second
  const gF = sv('g', {}, svg)
  const fl = [[250, 190], [590, 190]].map(([x, y], k) => {
    const aura = sv('circle', { cx: x, cy: y, r: 60, fill: 'none', stroke: '#E8893A', 'stroke-width': 3 }, gF)
    const stun = sv('circle', { cx: x, cy: y, r: 82, fill: 'none', stroke: '#7ADBFA', 'stroke-width': 4, 'stroke-dasharray': '10 8', opacity: 0 }, gF)
    const b = blob(gF, 'F', 58, x, y)
    const hpBg = sv('rect', { x: x - 70, y: y + 88, width: 140, height: 12, fill: 'none', stroke: '#E8893A' }, gF)
    const hp = sv('rect', { x: x - 70, y: y + 88, width: 140, height: 12, fill: '#E8893A' }, gF)
    const boom = sv('circle', { cx: x, cy: y, r: 60, fill: '#E8893A', opacity: 0 }, gF)
    const lab = sv('text', { x, y: y + 132, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-weight': 600, 'font-size': 17, 'letter-spacing': 2, fill: k ? '#E8893A' : '#7ADBFA' }, gF)
    return { x, y, aura, stun, b, hpBg, hp, boom, lab }
  })
  // chut : la règle qu'on ne discute pas
  const chut = h('img', { src: 'assets/img/chut.png', css: 'position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:50% 28%' }, tv.body)
  const ban = h('div', { cls: 'abs t d', css: 'left:0;right:0;bottom:0;padding:16px 0;text-align:center;font-size:52px;background:rgba(4,5,15,.86);border-top:3px solid var(--gold)', text: 'Jamais les deux ensemble' }, tv.body)
  const F = [
    fields(root, 'left:1000px;top:644px;width:840px', [['Contrôles', '<span class="s">Robustesse sanguine</span> : insensible', 'var(--sang-t)'], ['À sa mort', 'Il se divise en caillots', 'var(--sang-t)']]),
    fields(root, 'left:1000px;top:644px;width:840px', [['Couche miasmatique', 'Absorption = <span class="c">100 % des PV</span>', 'var(--ombre-t)'], ['Éjection ombreuse', '<span class="c">541 714</span> Ombre dans <span class="c">3 m</span>', 'var(--ombre-t)']]),
    fields(root, 'left:1000px;top:644px;width:840px', [['Présence brûlante', '<span class="c">37 503</span> Feu / 3 s tant qu’il vit', 'var(--flamme-t)'], ['Afflux caustique', 'À sa mort : <span class="c">100 009</span> Feu, cumulable', 'var(--flamme-t)']]),
  ]
  const sw1 = st(10) - 0.5, sw2 = st(11) - 0.5, tChut = at(12, 'Jamais') - 0.1
  const tSplit = at(9, 'divise') - 0.1, tKill = at(9, 'Tuez')
  const tShield = at(10, 'deux fois') - 0.2
  const tCtl = at(12, 'contrôle') - 0.1, tKill2 = at(12, 'tue le second')
  return {
    render(t) {
      P.render(t); low.render(t, tw(t, B.det + 0.3, 0.5))
      const p = tw(t, B.det + 0.1, 0.6); O(tv.el, p); T(tv.el, `translateX(${(1 - p) * 80}px)`)
      const phase = t < sw1 ? 0 : t < sw2 ? 1 : 2
      tv.set(['Venin coagulant', 'Venin embrumé', 'Venin brûlant'][phase], ['SANG', 'OMBRE', 'FLAMME'][phase],
        [`linear-gradient(90deg,${FC.S},#5a0f1c)`, `linear-gradient(90deg,${FC.O},#3d2260)`, `linear-gradient(90deg,${FC.F},#8a4610)`][phase], '#fff')
      SA(gS, 'opacity', phase === 0 ? 1 : 0); SA(gO, 'opacity', phase === 1 ? 1 : 0); SA(gF, 'opacity', phase === 2 ? 1 : 0)
      F.forEach((f, i) => { const q = i === phase ? tw(t, [B.det + 0.5, sw1, sw2][i], 0.4) : 0; O(f, q); T(f, `translateY(${(1 - q) * 14}px)`) })
      // Sang
      const s1 = tw(t, tSplit, 0.5, E.back), s2 = tw(t, tSplit + 0.9, 0.5, E.back)
      big.set(420, 200, t < tSplit ? tw(t, B.det + 0.3, 0.5, E.back) : Math.max(0, 1 - s1 * 1.5), 1)
      mid.forEach((m, k) => m.set(420 + (k ? 1 : -1) * 110 * s1, 200, t < tSplit ? 0 : (t < tSplit + 0.9 ? clamp(s1) : Math.max(0, 1 - s2 * 1.5)), 1))
      small.forEach((m, k) => {
        const dx = [-230, -80, 80, 230][k], dy = [-50, 60, -60, 50][k]
        const die = tw(t, tKill + k * 0.3, 0.3, E.in)
        m.set(420 + dx * s2, 200 + dy * s2, t < tSplit + 0.9 ? 0 : clamp(s2) * (1 - die), 1)
      })
      SA(cl, 'opacity', tw(t, tSplit + 1.1, 0.4))
      // Ombre
      shadows.forEach((s, k) => {
        const pop = tw(t, sw1 + 0.5 + k * 0.15, 0.4, E.back)
        const shl = 1 - tw(t, tShield + k * 0.12, 0.5, E.lin), hpl = 1 - tw(t, tShield + 0.9 + k * 0.12, 0.5, E.lin)
        const dead = hpl <= 0
        s.b.set(s.x, s.y, dead ? 0 : Math.max(0.01, pop), 1)
        SA(s.sh, 'width', 84 * shl); SA(s.hp, 'width', 84 * hpl); SA(s.sh, 'opacity', dead ? 0 : clamp(pop)); SA(s.hp, 'opacity', dead ? 0 : clamp(pop))
        SA(s.pud, 'opacity', tw(t, tShield + 1.4 + k * 0.12, 0.4))
      })
      SA(ok, 'opacity', tw(t, tShield + 1.9, 0.4))
      // Flamme
      fl.forEach((f, k) => {
        const pulse = (t * 1.2 + k * 0.5) % 1
        const alive = k === 1 ? t < tKill2 + 0.9 : t < tChut + 0.6
        SA(f.aura, 'r', 60 + 40 * pulse); SA(f.aura, 'opacity', alive ? (1 - pulse) * 0.8 : 0)
        const hp = k === 1 ? 1 - tw(t, tKill2, 0.9, E.lin) : 1
        f.b.set(f.x, f.y, alive ? tw(t, sw2 + 0.4 + k * 0.2, 0.4, E.back) : 0, 1)
        SA(f.hp, 'width', 140 * hp); SA(f.hp, 'opacity', alive ? 1 : 0); SA(f.hpBg, 'opacity', alive ? 1 : 0)
        const bt = tw(t, tKill2 + 0.9, 0.6)
        SA(f.boom, 'opacity', k === 1 && t > tKill2 + 0.9 ? (1 - bt) * 0.7 : 0); SA(f.boom, 'r', 60 + 90 * bt)
        SA(f.stun, 'opacity', k === 0 ? tw(t, tCtl, 0.3) : 0); SA(f.stun, 'transform', `rotate(${t * 40} ${f.x} ${f.y})`)
        f.lab.textContent = k === 0 ? (t > tCtl ? '① CONTRÔLÉ' : '') : t > tKill2 ? '② ON LE TUE' : ''
      })
      O(chut, tw(t, tChut, 0.3)); O(ban, tw(t, tChut + 0.1, 0.3)); T(ban, `translateY(${(1 - tw(t, tChut + 0.1, 0.4)) * 100}%)`)
    },
  }
})

// 05 · les infections : trois directions
scene('infect', B.inf, B.fang, root => {
  studio(root, 50)
  const P = (x, y, c = '#EDE9E1') => sv('circle', { cx: x, cy: y, r: 10, fill: c })
  const cols = [
    ['S', 'Siphonnante', 'Siphoning Infection', 'On se rapproche : il faut des corps dans le cercle.', 'Soins reçus −100 %<br>Mythique : saignement ≈ ×5'],
    ['O', 'Stygienne', 'Stygian Infection', 'On s’écarte. Cercle de 3,5 m : personne dedans.', 'Explosion stygienne : 583 385 Ombre'],
    ['F', 'Explosive', 'Exploding Infection', 'On étale les dissipations. Jamais sur un raid bas.', 'Dissipation → 233 354 Feu sur le raid<br>Mythique : +1 pile toutes les 1,5 s'],
  ].map(([f, name, en2, rule, note], k) => {
    const el = h('div', { cls: 'panel', css: `left:${80 + k * 600}px;top:150px;width:560px;height:700px;padding:28px 30px;border-top:4px solid ${FT[f]}`, html:
      `<div class="t" style="font-size:44px;color:${FT[f]}">${name}</div><div class="en" style="font-size:20px">(${en2})</div>
       <div class="box" style="height:320px;margin-top:18px;background:#070918;border-radius:6px;position:relative"></div>
       <div style="font:500 29px/1.35 var(--body);margin-top:22px;color:${FT[f]}">${rule}</div>
       <div class="m" style="font-size:14px;color:var(--muted);margin-top:14px;line-height:1.6">${note}</div>` }, root)
    const s = sv('svg', { width: 500, height: 320, style: 'position:absolute;left:0;top:0' }, el.querySelector('.box'))
    return { el, s }
  })
  // Sang : les corps viennent dans le cercle
  const sS = cols[0].s
  sv('circle', { cx: 250, cy: 160, r: 110, fill: '#8E1B2E', 'fill-opacity': 0.25, stroke: '#E0566D', 'stroke-width': 3 }, sS)
  sS.appendChild(P(250, 160, '#E0566D')); sv('circle', { cx: 250, cy: 160, r: 18, fill: 'none', stroke: '#fff', 'stroke-width': 3 }, sS)
  const allies = [[-60, -50], [60, -40], [-70, 40], [70, 45], [0, 80], [-20, -70], [40, -90]].map(([x, y]) => ({ x, y, el: sS.appendChild(P(0, 0)) }))
  const sip = allies.slice(0, 4).map(() => sv('line', { stroke: '#E0566D', 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }, sS))
  // Ombre : les marqués s'écartent
  const sO = cols[1].s
  ;[[250, 120], [230, 150], [270, 150]].forEach(([x, y]) => sO.appendChild(P(x, y)))
  const spread = [[110, 90], [390, 90], [250, 255]].map(([x, y]) => ({ x, y, ring: sv('circle', { r: 62, fill: '#6B3FA0', 'fill-opacity': 0.22, stroke: '#B08AE8', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, sO), dot: sO.appendChild(P(0, 0, '#B08AE8')), lab: sv('text', { 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': 15, fill: '#B08AE8' }, sO) }))
  // Flamme : une dissipation à la fois
  const sF = cols[2].s
  sv('line', { x1: 40, y1: 170, x2: 460, y2: 170, stroke: 'rgba(169,180,199,.5)', 'stroke-width': 3 }, sF)
  const hdr = sv('text', { x: 40, y: 110, 'font-family': 'JetBrains Mono', 'font-size': 16, fill: '#A9B4C7' }, sF); hdr.textContent = 'DISSIPATIONS DANS LE TEMPS →'
  const disp = [90, 250, 410].map((x, i) => { const g = sv('g', { opacity: 0 }, sF); sv('rect', { x: x - 34, y: 136, width: 68, height: 68, rx: 8, fill: '#D1701F', 'fill-opacity': 0.3, stroke: '#E8893A', 'stroke-width': 3 }, g); const tx = sv('text', { x, y: 182, 'text-anchor': 'middle', 'font-family': 'Barlow Condensed', 'font-weight': 700, 'font-size': 34, fill: '#fff' }, g); tx.textContent = i + 1; return g })
  const low2 = sv('text', { x: 40, y: 262, 'font-family': 'JetBrains Mono', 'font-size': 16, fill: '#D19A45', opacity: 0 }, sF); low2.textContent = 'JAMAIS SUR UN RAID BAS'
  const tS = at(14, 'rapproche'), tO = at(15, 'écarte'), tF = at(16, 'étale'), tLow = at(16, 'jamais')
  return {
    render(t) {
      cols.forEach((c, k) => {
        const p = tw(t, B.inf + 0.2 + k * 0.2, 0.5, E.out)
        const act = [st(14) - 0.2, st(15) - 0.2, st(16) - 0.2]
        const focus = t < act[0] ? -1 : t < act[1] ? 0 : t < act[2] ? 1 : t < en(16) + 1.2 ? 2 : -1
        O(c.el, p * (focus === -1 || focus === k ? 1 : 0.4)); T(c.el, `translateY(${(1 - p) * 40}px) scale(${focus === k ? 1.02 : 1})`)
      })
      const a = tw(t, tS - 0.2, 1.3, E.io)
      allies.forEach((al, i) => { const r0 = 1.9, r1 = 1.0, k = lerp(r0, r1, a); SA(al.el, 'cx', 250 + al.x * k); SA(al.el, 'cy', 160 + al.y * k) })
      sip.forEach((l, i) => { const al = allies[i], k = lerp(1.9, 1.0, a); SA(l, 'x1', 250 + al.x * k); SA(l, 'y1', 160 + al.y * k); SA(l, 'x2', 250); SA(l, 'y2', 160); SA(l, 'opacity', tw(t, tS + 1.1, 0.3) * (0.6 + 0.4 * Math.sin(t * 6 + i))) })
      const b = tw(t, tO - 0.2, 1.3, E.io)
      spread.forEach(s => {
        const x = lerp(250, s.x, b), y = lerp(160, s.y, b), r = 62 * tw(t, tO + 0.9, 0.5, E.back)
        SA(s.dot, 'cx', x); SA(s.dot, 'cy', y); SA(s.ring, 'cx', x); SA(s.ring, 'cy', y); SA(s.ring, 'r', Math.max(0.1, r)); SA(s.ring, 'opacity', r > 1 ? 1 : 0)
        SA(s.lab, 'x', x); SA(s.lab, 'y', y - 70); s.lab.textContent = r > 50 ? '3,5 m' : ''
      })
      disp.forEach((g, i) => SA(g, 'opacity', tw(t, tF - 0.2 + i * 0.6, 0.3)))
      SA(low2, 'opacity', tw(t, tLow, 0.4))
    },
  }
})

// 06 · réflexes de fond ① : Crochets dégoulinants, côté tanks
scene('fangs', B.fang, B.froth, root => {
  studio(root, 70)
  const orc = h('img', { src: 'assets/img/ingenieur.png', css: 'position:absolute;left:1130px;top:150px;height:900px;filter:drop-shadow(0 30px 60px rgba(0,0,0,.6))' }, root)
  const tag = h('span', { cls: 'chip', css: 'position:absolute;left:1180px;top:130px', text: 'Côté tanks' }, root)
  const list = h('div', { cls: 'abs', css: 'left:80px;top:170px;display:flex;flex-direction:column;gap:14px', html: ['Crochets dégoulinants', 'Écume pestilentielle', 'Catalyseur malveillant'].map((s, i) => `<div class="it" style="display:flex;align-items:center;gap:18px"><span class="t num" style="width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;border:1px solid rgba(169,180,199,.4);color:var(--muted)">${i + 1}</span><span class="t" style="font-size:40px">${s}</span></div>`).join('') }, root)
  const items = [...list.querySelectorAll('.it')]
  const title = rise(root, 'left:80px;top:430px;font-size:104px;color:var(--cyan)', 'Crochets dégoulinants')
  const sub = h('div', { cls: 'abs', css: 'left:80px;top:540px;font:400 30px/1.6 var(--body);width:960px', html: '<span class="en">(Dripping Fangs)</span> · <span class="c">2 083 514</span> Physique, puis un saignement<br>et surtout <span class="d">+200 % de dégâts physiques subis</span>' }, root)
  const swap = h('div', { cls: 'abs t', css: 'left:80px;top:700px;font-size:70px;padding:12px 26px;border:3px solid var(--cyan)', text: 'Swap à chaque cast' }, root)
  const shield = '<svg viewBox="0 0 24 24" width="56" height="56"><path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5z" fill="#58A6FF"/></svg>'
  const tk = [0, 1].map(i => h('div', { cls: 'abs', css: 'top:716px;text-align:center', html: `${shield}<div class="m" style="font-size:14px;color:var(--muted)">TANK ${i + 1}</div>` }, root))
  const tL = at(17, 'Les tanks') - 0.2, tSw = at(17, 'swap') - 0.1
  return {
    render(t) {
      items.forEach((it, i) => { const p = tw(t, B.fang + 0.3 + i * 0.25, 0.4); O(it, p * (t > tL ? (i ? 0.35 : 1) : 1)); T(it, `translateX(${(1 - p) * -30}px)`); it.querySelector('.num').style.background = t > tL && !i ? 'var(--cyan)' : 'transparent'; it.querySelector('.num').style.color = t > tL && !i ? 'var(--night)' : 'var(--muted)' })
      const o = tw(t, tL, 0.7); O(orc, o); T(orc, `translateX(${(1 - o) * 200}px)`); O(tag, tw(t, tL + 0.4, 0.4))
      title.render(tw(t, tL + 0.1, 0.6)); O(sub, tw(t, tL + 0.5, 0.5))
      const s = tw(t, tSw, 0.4, E.back); O(swap, clamp(s)); T(swap, `scale(${0.85 + 0.15 * s})`)
      const k = tw(t, tSw + 0.6, 0.9, E.io)
      tk.forEach((el, i) => { const x = 840 + (i ? 1 : -1) * 90 * (1 - 2 * k); el.style.left = x + 'px'; T(el, `translateY(${Math.sin(k * Math.PI) * (i ? 26 : -26)}px)`); O(el, tw(t, tSw + 0.2, 0.3)) })
    },
  }
})

// 07 · réflexes de fond ② : Écume pestilentielle
scene('froth', B.froth, B.bile, root => {
  studio(root, 30)
  const pn = h('div', { cls: 'panel', css: 'left:80px;top:150px;width:820px;height:700px' }, root)
  const s = sv('svg', { width: 820, height: 700, style: 'position:absolute;left:0;top:0' }, pn)
  const CX = 410, CY = 350
  const waves = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => ({ dx, dy, l: sv('line', { x1: CX, y1: CY, stroke: '#7ADBFA', 'stroke-opacity': 0.4, 'stroke-width': 44, 'stroke-linecap': 'round' }, s) }))
  const axes = [[1, 0], [0, 1]].map(([dx, dy]) => sv('line', { x1: CX - dx * 330, y1: CY - dy * 330, x2: CX + dx * 330, y2: CY + dy * 330, stroke: 'rgba(122,219,250,.35)', 'stroke-width': 2, 'stroke-dasharray': '8 8' }, s))
  const mk2 = sv('circle', { r: 16, fill: '#EDE9E1', stroke: '#7ADBFA', 'stroke-width': 5 }, s)
  const pl = [[200, 0, 150, -140], [-190, 0, -160, 150], [0, 200, 160, 150], [0, -190, -150, -150], [240, 0, 190, 170], [0, 240, -180, -130]].map(([x0, y0, x1, y1]) => ({ x0, y0, x1, y1, c: sv('circle', { r: 12, fill: '#EDE9E1' }, s) }))
  const lab = sv('text', { x: CX + 150, y: CY - 175, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': 16, fill: '#7ADBFA', opacity: 0 }, s); lab.textContent = '✓ ENTRE LES AXES'
  const title = rise(root, 'left:980px;top:170px;font-size:92px;color:var(--cyan)', 'Écume pestilentielle')
  const sub = h('div', { cls: 'abs en', css: 'left:980px;top:270px;font-size:26px', text: '(Plague Froth) · quatre vagues en croix' }, root)
  const rules = ['Les marqués <span class="c">s’écartent du raid</span>', 'Tout le monde <span class="c">entre les axes</span>', 'Marqué : <span class="c">on ne bouge pas</span>'].map((r, i) => h('div', { cls: 'abs', css: `left:980px;top:${340 + i * 58}px;font:500 34px var(--body)`, html: `${i + 1} · ${r}` }, root))
  const sp = spell(root, 'left:980px;top:560px;width:860px', 'Vague de peste', 'Plague Wave', '<b>666 725</b> peste · Mythique : <b>détruit les tumeurs</b>')
  const tMk = at(18, 'marqués') - 0.2, tAx = at(18, 'entre les axes') - 0.3, tW = en(18) + 0.1
  return {
    render(t) {
      const a = tw(t, tAx, 1.1, E.io)
      pl.forEach(p => { SA(p.c, 'cx', CX + lerp(p.x0, p.x1, a)); SA(p.c, 'cy', CY + lerp(p.y0, p.y1, a)) })
      const m = tw(t, tMk, 0.9, E.io)
      SA(mk2, 'cx', CX + lerp(-60, 0, m)); SA(mk2, 'cy', CY + lerp(40, 0, m))
      const w = tw(t, tW, 0.7, E.out)
      waves.forEach(({ dx, dy, l }) => { SA(l, 'x2', CX + dx * 330 * w); SA(l, 'y2', CY + dy * 330 * w); SA(l, 'opacity', t > tW ? 1 - 0.4 * tw(t, tW + 0.9, 0.6) : 0) })
      axes.forEach(x => SA(x, 'opacity', tw(t, tAx - 0.4, 0.4)))
      SA(lab, 'opacity', tw(t, tAx + 1.0, 0.4))
      title.render(tw(t, B.froth + 0.2, 0.6)); O(sub, tw(t, B.froth + 0.5, 0.4))
      rules.forEach((r, i) => O(r, tw(t, [tMk, tAx, tAx + 1.2][i], 0.4)))
      O(sp, tw(t, tW - 0.4, 0.5))
    },
  }
})

// 08 · réflexes de fond ③ : Catalyseur malveillant — chaque impact de bile encaissé
scene('bile', B.bile, B.tum, root => {
  studio(root, 30)
  const pn = h('div', { cls: 'panel', css: 'left:80px;top:150px;width:820px;height:700px' }, root)
  const s = sv('svg', { width: 820, height: 700, style: 'position:absolute;left:0;top:0' }, pn)
  const CX = 410, CY = 360
  sv('circle', { cx: CX, cy: CY, r: 40, fill: '#07040a', stroke: '#D19A45', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, s)
  const cvl = sv('text', { x: CX, y: CY + 70, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': 14, fill: '#D19A45' }, s); cvl.textContent = 'CAVITÉ'
  const orb = sv('circle', { cx: CX, cy: CY, r: 22, fill: '#7ADBFA', opacity: 0 }, s)
  const burst = sv('circle', { cx: CX, cy: CY, r: 30, fill: 'none', stroke: '#7ADBFA', 'stroke-width': 4, opacity: 0 }, s)
  const imp = [[-250, -170], [30, -250], [260, -140], [240, 170], [-40, 250], [-270, 150]].map(([x, y]) => {
    const c = sv('circle', { cx: CX + x, cy: CY + y, r: 62, fill: '#D19A45', 'fill-opacity': 0.14, stroke: '#D19A45', 'stroke-width': 3, 'stroke-dasharray': '8 6', opacity: 0 }, s)
    const p = sv('circle', { r: 12, fill: '#EDE9E1', opacity: 0 }, s)
    const ok = sv('text', { x: CX + x, y: CY + y - 74, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-weight': 700, 'font-size': 22, fill: '#7ADBFA', opacity: 0 }, s); ok.textContent = '✓'
    return { x, y, c, p, ok }
  })
  const title = rise(root, 'left:980px;top:170px;font-size:92px;color:var(--cyan)', 'Catalyseur malveillant')
  const sub = h('div', { cls: 'abs en', css: 'left:980px;top:270px;font-size:26px', text: '(Malignant Catalyst) · la bile catalytique' }, root)
  const r1 = h('div', { cls: 'abs', css: 'left:980px;top:340px;font:500 34px/1.4 var(--body);width:860px', html: 'Chaque impact doit être <span class="c">encaissé par au moins un joueur</span>.' }, root)
  const r2 = h('div', { cls: 'abs', css: 'left:980px;top:450px;font:500 34px/1.4 var(--body);width:860px', html: 'On <span class="c">s’étale</span> pour tout couvrir.' }, root)
  const r3 = h('div', { cls: 'block', css: '--c:var(--gold);left:980px;top:560px;width:860px;font-size:28px', html: 'Un impact sans personne : c’est tout le raid qui paie.' }, root)
  const chip = h('span', { cls: 'chip', css: 'position:absolute;left:980px;top:700px', text: 'Rayon de la bile : 6 m' }, root)
  const tOrb = B.bile + 0.5, tBoom = at(19, 'impact') - 0.1, tSpread = at(19, 'On s’étale') - 0.2
  return {
    render(t) {
      const o = tw(t, tOrb, 0.6)
      SA(orb, 'opacity', t < tBoom ? o : 0); SA(orb, 'r', 16 + 6 * Math.sin(t * 8)); SA(orb, 'cy', CY - 60 * o)
      const b = tw(t, tBoom, 0.6); SA(burst, 'opacity', t > tBoom ? 1 - b : 0); SA(burst, 'r', 30 + 260 * b); SA(burst, 'cy', CY - 60)
      imp.forEach((m, i) => {
        SA(m.c, 'opacity', tw(t, tBoom + 0.2 + i * 0.1, 0.3))
        const k = tw(t, tSpread + i * 0.12, 1.0, E.io)
        SA(m.p, 'cx', CX + lerp(m.x * 0.25, m.x, k)); SA(m.p, 'cy', CY + lerp(m.y * 0.25 + 90, m.y, k)); SA(m.p, 'opacity', tw(t, tBoom + 0.4, 0.4))
        SA(m.ok, 'opacity', tw(t, tSpread + 1.0 + i * 0.12, 0.3))
        SA(m.c, 'stroke', k >= 1 ? '#7ADBFA' : '#D19A45'); SA(m.c, 'fill', k >= 1 ? '#7ADBFA' : '#D19A45')
      })
      title.render(tw(t, B.bile + 0.2, 0.6)); O(sub, tw(t, B.bile + 0.5, 0.4))
      O(r1, tw(t, at(19, 'chaque') - 0.2, 0.4)); O(r2, tw(t, tSpread, 0.4)); O(r3, tw(t, tSpread + 0.8, 0.4)); O(chip, tw(t, tBoom + 0.5, 0.4))
    },
  }
})

// 09 · Mythique : les tumeurs, détruites par les vagues d'Écume
scene('tumors', B.tum, B.out, root => {
  studio(root, 34)
  const R = Room(root)
  R.place(600, 530, 360)
  const block = h('div', { cls: 'block', css: '--c:var(--gold);left:1200px;top:190px;width:640px;font-size:32px', html: '<div class="k">MYTHIQUE</div>Tumeurs non détruites = Malveillance cumulable = wipe à retardement' }, root)
  const sp = spell(root, 'left:1200px;top:430px;width:640px', 'Malveillance', 'Malignance', '<b>666 725</b> Nature sur le raid, puis <b>208 352</b> / 2 s pendant <b>1 min</b>, cumulable', '#D19A45')
  const pn = h('div', { cls: 'panel', css: 'left:1200px;top:640px;width:640px;padding:24px 30px;font:500 28px/1.45 var(--body)', html: 'Les vagues d’<span class="c">Écume pestilentielle</span> <span class="c">détruisent les tumeurs</span> : les marqués <span class="c">orientent</span> leurs vagues.' }, root)
  const MK = [[-50, -14, 64], [40, -28, 42], [-18, 40, 44]]
  const RAID = [[70, 0], [82, 18], [66, -2], [-78, 55], [-82, 38], [20, 60], [90, -30], [-70, 70]]
  // quelle vague détruit quelle tumeur
  const KILL = [[0, 0], [0, 1], [1, 2], [2, 4]]
  const tApp = at(20, 'tumeurs') - 0.2, tMal = at(20, 'Malveillance') - 0.2, tMk = st(21) + 0.2, tWave = at(21, 'détruisent') - 0.1
  return {
    render(t) {
      O(R.wrap, tw(t, B.tum, 0.5))
      for (const f of 'SOF') { SA(R.glow[f], 'opacity', 0); SA(R.cavLabel, 'opacity', 1) }
      R.setBoss(0, 0, 0)
      for (const f of 'SOF') SA(R.drain[f], 'opacity', 0)
      R.tumors.forEach((tm, i) => {
        const p = tw(t, tApp + i * 0.2, 0.4, E.back)
        const kill = KILL.find(([, ti]) => ti === i)
        const kt = kill ? tWave + 0.35 + kill[0] * 0.5 + (i % 2) * 0.2 : Infinity
        const gone = tw(t, kt + 0.5, 0.4)
        SA(tm.g, 'transform', `translate(${tm.x} ${tm.y}) scale(${Math.max(0.01, p)})`); SA(tm.g, 'opacity', clamp(p) * (1 - gone * 0.75))
        SA(tm.x2, 'opacity', tw(t, kt, 0.2))
      })
      MK.forEach(([x, y, l], k) => R.setMarked(k, x, y, l * tw(t, tWave + k * 0.5, 0.6), tw(t, tMk + k * 0.2, 0.3)))
      R.raid.forEach((c, i) => { SA(c, 'cx', RAID[i][0]); SA(c, 'cy', RAID[i][1]); SA(c, 'opacity', tw(t, B.tum + 0.3, 0.4)) })
      O(block, tw(t, tMal - 0.3, 0.4)); T(block, `translateX(${(1 - tw(t, tMal - 0.3, 0.4)) * 40}px)`)
      O(sp, tw(t, tMal + 0.3, 0.4)); O(pn, tw(t, tWave - 0.2, 0.4))
    },
  }
})

// 10 · carton de fin — Gideon au diner
scene('outro', B.out, DUR + 1, root => {
  const img = h('img', { src: 'assets/img/diner.png', css: 'position:absolute;right:0;top:-40px;height:1160px;transform-origin:70% 50%' }, root)
  h('div', { cls: 'abs', css: 'left:0;top:0;width:1300px;height:1080px;background:linear-gradient(90deg,var(--night) 38%,rgba(4,5,15,.6) 70%,transparent)' }, root)
  const lines = [['Tuez les adds,', 'Tuez'], ['tournez les fontaines,', 'tournez'], ['lisez les infections.', 'lisez']].map(([s, k], i) => ({ r: rise(root, `left:110px;top:${300 + i * 92}px;font-size:84px;color:#fff`, s), k }))
  const last = rise(root, 'left:110px;top:590px;font-size:84px;color:var(--cyan)', 'Et Vashnik tombe.')
  const sign = h('div', { cls: 'abs', css: 'left:110px;bottom:90px;display:flex;gap:14px;align-items:center', html: '<span class="t" style="font-size:40px">GIDEON</span><span class="m" style="font-size:14px;color:var(--muted)">COACH DE RAID</span>' }, root)
  const black = h('div', { cls: 'fill', css: 'background:#000;opacity:0' }, root)
  return {
    render(t) {
      T(img, `scale(${1.0 + 0.05 * tw(t, B.out, DUR - B.out, E.lin)})`)
      lines.forEach(l => l.r.render(tw(t, at(22, l.k) - 0.15, 0.5)))
      last.render(tw(t, at(22, 'Et Vashnik') - 0.15, 0.5)); O(sign, tw(t, en(22) + 0.4, 0.6))
      O(black, tw(t, DUR - 1.2, 1.2, E.lin))
    },
  }
})

// ─── habillage permanent : chapitre, badge, sous-titres ───────────────────
const CHAP = [
  [B.hook, '01 · Le principe', t => (t < B.map ? 'Face cam' : t < st(4) - 0.3 ? 'La salle' : t < st(5) - 0.4 ? 'Absorption' : 'Rotation')],
  [st(6) - 0.7, '02 · Les venins', () => 'Vers le centre'],
  [B.det, '03 · Les trois venins', t => (t < st(10) - 0.5 ? 'Sang' : t < st(11) - 0.5 ? 'Ombre' : 'Flamme')],
  [B.inf, '04 · Les infections', () => 'Trois directions'],
  [B.fang, '05 · Réflexes de fond', t => (t < B.froth ? 'Côté tanks' : 'Tout le monde')],
  [B.tum, '06 · Mythique', () => 'Les tumeurs'],
]
const hud = h('div', { cls: 'fill', css: 'z-index:50;pointer-events:none' }, stage)
const chap = h('div', { cls: 'chapter' }, hud)
const badge = h('div', { cls: 'badge', html: '<span class="pill">VASHNIK</span><span class="pill myth">MYTHIQUE</span>' }, hud)
const scrim = h('div', { cls: 'scrim' }, hud)
const cap = h('div', { cls: 'caption' }, hud)
let chapKey = ''
// sous-titres : chaque phrase est découpée en morceaux lisibles, calés au prorata des caractères
const CAPS = []
L.forEach((l, i) => {
  if (i === 0 || i === L.length - 1) return                     // les cartons d'intro et de fin portent déjà le texte
  const words = []
  let space = true                                              // un mot collé au précédent (« opposés}. ») reste collé
  l.text.replace(/\{(\w):([^}]*)\}|([^{]+)/g, (m, c, inner, rest) => {
    (inner || rest).split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) { space = true; return } words.push({ w, c, glue: !space }); space = false })
    return m
  })
  const chunks = []; let cur = []
  const len = a => a.reduce((n, x) => n + x.w.length + 1, 0)
  words.forEach((w, k) => {
    cur.push(w)
    const n = len(cur), stop = /[.?!]$/.test(w.w), colon = /[:;]$/.test(w.w), comma = /,$/.test(w.w)
    const nextIsPunct = k + 1 < words.length && /^[:;!?»]+$/.test(words[k + 1].w)   // « : » ne commence jamais un sous-titre
    if (!nextIsPunct && ((stop && n > 16) || (colon && n > 30) || (comma && n > 44) || k === words.length - 1)) { chunks.push(cur); cur = []; return }
    if (n > 80) {                                                // trop long pour une ligne : on coupe à la dernière ponctuation
      let j = -1
      for (let q = cur.length - 2; q >= 1; q--) if (/[,:;]$/.test(cur[q].w)) { j = q; break }
      if (j >= 0) { chunks.push(cur.slice(0, j + 1)); cur = cur.slice(j + 1) } else { chunks.push(cur); cur = [] }
    }
  })
  const total = chunks.reduce((n, c) => n + len(c), 0)
  let t0 = l.start
  chunks.forEach((c, k) => {
    const d = ((l.end - l.start) * len(c)) / total
    const runs = []                                              // mots consécutifs de même couleur → un seul <span>
    c.forEach((x, k) => { const r = runs[runs.length - 1]; if (r && r.c === x.c) r.w.push((x.glue ? '' : ' ') + x.w); else runs.push({ c: x.c, w: [x.w], sp: k > 0 && !x.glue }) })
    const html = runs.map(r => (r.sp ? ' ' : '') + (r.c ? `<span class="${r.c}">${r.w.join('')}</span>` : r.w.join(''))).join('')
    CAPS.push({ a: t0, b: k === chunks.length - 1 ? l.end + 0.35 : t0 + d, html })
    t0 += d
  })
})
let capKey = -1
function renderHud(t) {
  const on = t >= B.hook && t < B.out
  const c = CHAP.filter(([t0]) => t >= t0).pop()
  O(chap, on ? tw(t, B.hook, 0.4) * (1 - tw(t, B.out - 0.3, 0.3)) : 0); O(badge, parseFloat(chap.style.opacity))
  if (c) {
    const idx = CHAP.indexOf(c), key = c[1] + '|' + c[2](t)
    if (key !== chapKey) {
      chapKey = key
      chap.innerHTML = `<div class="dia"></div><div class="a">${c[1]}</div><div class="sep"></div><div class="b">${c[2](t)}</div><div class="prog">${CHAP.map((_, i) => `<i class="${i <= idx ? 'on' : ''}"></i>`).join('')}</div>`
    }
  }
  const k = CAPS.findIndex(x => t >= x.a && t < x.b)
  if (k !== capKey) { capKey = k; cap.innerHTML = k >= 0 ? CAPS[k].html : '' }
  O(scrim, on ? 1 : 0)
}

window.renderFrame = t => {
  for (const s of SCENES) {
    const vis = t >= s.t0 && t < s.t1 + XF
    s.root.style.display = vis ? 'block' : 'none'
    if (!vis) continue
    O(s.root, s.t0 === 0 ? 1 : tw(t, s.t0, XF, E.lin))
    s.render(t)
  }
  renderHud(t)
}
window.__ready = (async () => {
  await document.fonts.ready
  await Promise.all([...document.images].map(i => (i.complete ? null : i.decode().catch(() => null))))
  window.renderFrame(0)
  return true
})()

// aperçu dans le navigateur : espace = lecture/pause, ←/→ = image par image
if (!location.search.includes('render')) {
  const fit = () => { const s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = `scale(${s})` }
  addEventListener('resize', fit); fit()
  const au = new Audio('out/final.wav'); let t = 0, playing = false, last = 0
  addEventListener('keydown', e => {
    if (e.code === 'Space') { playing = !playing; if (playing) { au.currentTime = t; au.play() } else au.pause() }
    if (e.code === 'ArrowRight') t += 1 / 30
    if (e.code === 'ArrowLeft') t = Math.max(0, t - 1 / 30)
    window.renderFrame(t)
  })
  const loop = now => { if (playing) { t = au.currentTime || t + (now - last) / 1000 } last = now; window.renderFrame(t); requestAnimationFrame(loop) }
  requestAnimationFrame(loop)
}
