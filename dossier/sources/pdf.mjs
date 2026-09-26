// Fabrique ../dossier-crea.pdf depuis dossier-crea.html (une page 1920 × 1080 par section).
//   node pdf.mjs              # PDF
//   node pdf.mjs --png DIR    # et une image PNG par page dans DIR (pour vérifier)
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
const i = process.argv.indexOf('--png'), pngDir = i > 0 ? process.argv[i + 1] : null
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] })
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
page.on('pageerror', e => console.log('pageerror:', e.message))
page.on('requestfailed', r => console.log('manquant:', r.url()))
await page.goto('file://' + path.join(dir, 'dossier-crea.html'))
await page.waitForFunction(() => window.__ready)
await page.evaluate(() => window.__ready)
await page.waitForTimeout(300)
if (pngDir) {
  fs.mkdirSync(pngDir, { recursive: true })
  const ids = await page.$$eval('section.page', els => els.map((e, k) => (e.id = e.id || 'p' + (k + 1))))
  for (const [k, id] of ids.entries()) await page.locator('#' + id).screenshot({ path: path.join(pngDir, `page-${String(k + 1).padStart(2, '0')}.png`) })
}
const out = path.join(dir, '..', 'dossier-crea.pdf')
await page.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true })
console.log('→', out, (fs.statSync(out).size / 1e6).toFixed(1), 'Mo')
await browser.close()
