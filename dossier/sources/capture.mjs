// Refait les planches (boards.html → ../planches/) et le découpage (frames.html → ../decoupage-12min/).
//   node capture.mjs            # tout
//   node capture.mjs planches   # seulement les planches
//   node capture.mjs decoupage  # seulement le découpage
// Besoin : playwright (local ou global : npm i -g playwright).
import { createRequire } from 'node:module'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

let chromium
try { ({ chromium } = createRequire(import.meta.url)('playwright')) }
catch { ({ chromium } = createRequire(path.join(execSync('npm root -g').toString().trim(), '/'))('playwright')) }

const dir = path.dirname(fileURLToPath(import.meta.url))
const which = process.argv[2]
const base = process.env.OUT || dir   // OUT=/autre/dossier pour ne pas écraser les images validées
const jobs = [
  ['planches', 'boards.html', 'section.frame', id => `planche-${id.slice(1).padStart(2, '0')}.png`, '../planches'],
  ['decoupage', 'frames.html', 'section.frame', id => `plan-${id.slice(1)}.jpg`, '../decoupage-12min'],
].filter(j => !which || j[0] === which)

const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] })
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
page.on('pageerror', e => console.log('pageerror:', e.message))
for (const [name, html, sel, file, out] of jobs) {
  await page.goto('file://' + path.join(dir, html))
  await page.waitForFunction(() => window.__ready, null, { timeout: 15000 })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  const ids = await page.$$eval(sel, els => els.map(e => e.id).filter(Boolean))
  fs.mkdirSync(path.join(base, out), { recursive: true })
  for (const id of ids) {
    const f = file(id)
    await page.locator('#' + id).screenshot({ path: path.join(base, out, f), ...(f.endsWith('.jpg') ? { type: 'jpeg', quality: 90 } : {}) })
  }
  console.log(name, ids.length, 'images →', out)
}
await browser.close()
