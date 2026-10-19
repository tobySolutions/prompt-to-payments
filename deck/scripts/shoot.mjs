// Screenshot every slide of a built deck at its final click state.
// usage: node scripts/shoot.mjs <deckDir> <slideCount> <outDir> [width]
import { chromium } from 'playwright-chromium'
import { createServer } from 'node:http'
import { readFileSync, existsSync, mkdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
const [deck, count, out, width = '1280'] = process.argv.slice(2)
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' }
const server = createServer((req, res) => {
  let p = join('dist', decodeURIComponent(req.url.split('?')[0]))
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html')
  if (!existsSync(p)) { res.writeHead(404); return res.end() }
  res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(readFileSync(p))
}).listen(0)
const port = server.address().port
mkdirSync(out, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: +width, height: Math.round(+width * 9 / 16) } })
const errors = []
page.on('pageerror', e => errors.push(e.message))
for (let i = 1; i <= +count; i++) {
  await page.goto(`http://localhost:${port}/${deck}/#/${i}?clicks=99`)
  await page.waitForTimeout(i === 1 ? 2500 : 1200)
  await page.screenshot({ path: `${out}/${deck}-${String(i).padStart(2, '0')}.png` })
}
console.log(errors.length ? 'PAGE ERRORS:\n' + [...new Set(errors)].join('\n') : 'no page errors')
await browser.close(); server.close()
