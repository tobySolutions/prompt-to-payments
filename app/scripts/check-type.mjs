// Fails if a font size is set anywhere except the token block in app/globals.css.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
const files = []
const walk = d => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p) } }
;['app', 'lib'].forEach(walk)
const bad = []
for (const f of files.filter(f => ['.css', '.tsx', '.ts'].includes(extname(f)))) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (/^\s*--fs-/.test(line)) return
    for (const m of line.matchAll(/font-?size\s*:\s*([^;,}]+)/gi)) if (!/var\(--fs-/.test(m[1])) bad.push(`${f}:${i + 1}  ${m[0].trim()}`)
  })
}
if (bad.length) { console.error('Raw font sizes found. Use the --fs-* tokens:\n' + bad.join('\n')); process.exit(1) }
console.log(`Type scale check passed (${files.length} files).`)
