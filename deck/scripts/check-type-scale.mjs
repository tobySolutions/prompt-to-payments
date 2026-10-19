// Fails if a font size is set anywhere except the token file.
// Allowed: var(--fs-*) tokens, .fs-* classes, and the token definitions in styles/index.css.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const roots = ['components', 'layouts', 'styles', 'setup']
const files = [...readdirSync('.').filter(f => f.endsWith('.md') && /^(slides|backup)/.test(f))]
const walk = d => { try { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p) } } catch {} }
roots.forEach(walk)

const bad = []
const rawSize = /font-size\s*:\s*([^;"'}]+)/g
const okSize = v => /^(var\(--fs-[\w-]+\)|inherit)(\s*!important)?$/.test(v.trim())
const unoSize = /\b(?:text-(?:xs|sm|base|lg|[2-9]?xl)|text-\[\d)/g
for (const f of files) {
  if (!['.vue', '.css', '.md', '.html', '.ts'].includes(extname(f))) continue
  if (f === join('styles', 'index.css')) continue
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(rawSize)) if (!okSize(m[1])) bad.push(`${f}:${i + 1}  ${m[0].trim()}`)
    if (extname(f) !== '.css') for (const m of line.matchAll(unoSize)) bad.push(`${f}:${i + 1}  ${m[0]} (use .fs-* classes)`)
  })
}
if (bad.length) {
  console.error(`Raw font sizes found. Use the --fs-* tokens in styles/index.css:\n${bad.join('\n')}`)
  process.exit(1)
}
console.log(`Type scale check passed (${files.length} files).`)
