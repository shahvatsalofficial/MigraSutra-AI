// Dependency-free Markdown -> HTML builder for documents/MigraSutra-AI. `--check` fails if HTML is stale.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'documents/MigraSutra-AI');
const check = process.argv.includes('--check');
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const safeHref = h => (/^(https?:|mailto:|#|[\w./-]+\.(md|html|json)(#[\w-]*)?$)/i.test(h) ? h.replace(/\.md(#|$)/, '.html$1') : '#');
const inline = s => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, h) => `<a href="${esc(safeHref(h.replace(/&amp;/g, '&')))}">${t}</a>`);
const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');

export function mdToHtml(md) {
  const out = [], toc = [];
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      const buf = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++; out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`); continue;
    }
    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) { const n = h[1].length, id = slug(h[2]); if (n >= 2 && n <= 3) toc.push([n, id, h[2].replace(/`/g, '')]); out.push(`<h${n} id="${id}">${inline(h[2])}</h${n}>`); i++; continue; }
    if (/^\|.*\|\s*$/.test(l) && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1] ?? '')) {
      const cells = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const head = cells(l); i += 2; const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) rows.push(cells(lines[i++]));
      out.push(`<div class="tw"><table><thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`); continue;
    }
    if (/^\s*[-*]\s+/.test(l) || /^\s*\d+\.\s+/.test(l)) {
      const ord = /^\s*\d+\./.test(l), items = [];
      while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) items.push(lines[i++].replace(/^\s*(?:[-*]|\d+\.)\s+/, ''));
      out.push(`<${ord ? 'ol' : 'ul'}>${items.map(x => `<li>${inline(x)}</li>`).join('')}</${ord ? 'ol' : 'ul'}>`); continue;
    }
    if (/^>\s?/.test(l)) { const buf = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, '')); out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`); continue; }
    if (/^---+\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (!l.trim()) { i++; continue; }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|\||\s*[-*]\s|\s*\d+\.\s|>|---+\s*$)/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return { html: out.join('\n'), toc };
}

const CSS = `:root{--bg:#f6f8fb;--fg:#0f172a;--mut:#475569;--card:#fff;--bd:#d9e1ec;--ac:#3538cd;--code:#eef2f7}@media(prefers-color-scheme:dark){:root{--bg:#0b1220;--fg:#e6edf7;--mut:#9fb0c7;--card:#121b2e;--bd:#25324a;--ac:#a4bcfd;--code:#1a2540}}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.7 system-ui,-apple-system,Segoe UI,sans-serif}a{color:var(--ac)}.layout{display:grid;grid-template-columns:260px minmax(0,1fr);max-width:1240px;margin:0 auto}nav{position:sticky;top:0;align-self:start;height:100vh;overflow:auto;padding:24px 16px;border-right:1px solid var(--bd)}nav b{display:block;margin-bottom:8px}nav a{display:block;padding:4px 8px;border-radius:6px;text-decoration:none;color:var(--mut);font-size:.92rem}nav a[aria-current]{background:var(--card);color:var(--fg);font-weight:600}nav .sub a{padding-left:20px;font-size:.84rem}main{padding:32px 28px 80px;min-width:0}h1{font-size:2rem;line-height:1.2}h2{margin-top:2.2em;border-bottom:1px solid var(--bd);padding-bottom:.25em}h3{margin-top:1.6em}code{background:var(--code);padding:.1em .35em;border-radius:5px;font:.88em ui-monospace,Consolas,monospace}pre{background:var(--code);padding:14px;border-radius:10px;overflow:auto}pre code{background:none;padding:0}.tw{overflow-x:auto}table{border-collapse:collapse;width:100%;background:var(--card);font-size:.92rem}th,td{border:1px solid var(--bd);padding:8px 10px;text-align:left;vertical-align:top}th{background:var(--code)}blockquote{margin:1em 0;padding:8px 16px;border-left:4px solid var(--ac);background:var(--card);border-radius:0 8px 8px 0}footer{color:var(--mut);font-size:.85rem;margin-top:48px}:focus-visible{outline:3px solid var(--ac);outline-offset:2px}.skip{position:absolute;left:-999px}.skip:focus{left:8px;top:8px;background:var(--card);padding:6px}@media(max-width:820px){.layout{display:block}nav{position:static;height:auto;border-right:0;border-bottom:1px solid var(--bd)}main{padding:20px 16px 60px}}@media print{nav{display:none}.layout{display:block}}`;

export function build() {
  const mds = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort((a, b) => (a === 'README.md' ? -1 : b === 'README.md' ? 1 : a.localeCompare(b)));
  const titles = Object.fromEntries(mds.map(f => [f, (fs.readFileSync(path.join(dir, f), 'utf8').match(/^#\s+(.*)$/m) ?? [, f])[1].replace(/`/g, '')]));
  const stale = [];
  for (const f of mds) {
    const { html, toc } = mdToHtml(fs.readFileSync(path.join(dir, f), 'utf8'));
    const nav = mds.map(m => `<a href="${m.replace(/\.md$/, '.html')}"${m === f ? ' aria-current="page"' : ''}>${esc(titles[m])}</a>` + (m === f ? `<div class="sub">${toc.filter(t => t[0] === 2).map(t => `<a href="#${t[1]}">${esc(t[2])}</a>`).join('')}</div>` : '')).join('');
    const page = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>${esc(titles[f])} · MigraSutra AI</title><meta name="description" content="MigraSutra AI documentation: evidence-first, offline, read-only migration auditing."><style>${CSS}</style></head><body><a class="skip" href="#content">Skip to content</a><div class="layout"><nav aria-label="Documentation"><b>MigraSutra AI</b>${nav}<p><a href="https://github.com/shahvatsalofficial/MigraSutra-AI">GitHub</a> · <a href="https://www.npmjs.com/package/migrasutra">npm</a></p></nav><main id="content">${html}<footer>Apache-2.0 · Created by Vatsal Shah · Generated from <code>${esc(f)}</code>. Static analysis only; this documentation makes no deploy-safety guarantee.</footer></main></div></body></html>\n`;
    const target = path.join(dir, f.replace(/\.md$/, '.html'));
    if (check) { if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== page) stale.push(path.basename(target)); }
    else fs.writeFileSync(target, page);
  }
  return { count: mds.length, stale };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { count, stale } = build();
  if (stale.length) { console.error('Stale docs HTML (run npm run build:docs): ' + stale.join(', ')); process.exit(1); }
  console.log(`${check ? 'checked' : 'built'} ${count} documents`);
}
