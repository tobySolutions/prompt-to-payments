// Turns a folder of slide screenshots into contact sheets of six (2 x 3) for quick review.
// usage: node scripts/sheet.mjs <shotsDir> <outPrefix>
import { chromium } from 'playwright-chromium'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const [dir, out] = process.argv.slice(2)
const files = readdirSync(dir).filter(f => f.endsWith('.png')).sort()
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1350 } })
for (let k = 0; k < files.length; k += 6) {
  const cells = files.slice(k, k + 6).map(f => `<figure><img src="data:image/png;base64,${readFileSync(resolve(dir, f)).toString('base64')}"><figcaption>${f}</figcaption></figure>`).join('')
  await page.setContent(`<style>body{margin:0;display:grid;grid-template-columns:1fr 1fr;font:14px sans-serif}figure{margin:0;position:relative}img{width:800px;height:450px;display:block}figcaption{position:absolute;top:0;left:0;background:#000;color:#fff;padding:2px 6px}</style>${cells}`)
  await page.waitForTimeout(300)
  const p = `${out}-${k / 6 + 1}.png`
  await page.screenshot({ path: p, fullPage: true }); console.log(p)
}
await browser.close()
