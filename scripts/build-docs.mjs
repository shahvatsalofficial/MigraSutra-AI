#!/usr/bin/env node
// Builds the documentation website in documents/MigraSutra-AI from its Markdown files, zero dependencies.
// Scenario terminals and charts come from running the real CLI. Output is deterministic; `--check` fails if stale.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { esc, icon, flow, decision, bars, terminal } from '../documents/site/diagrams.mjs';
import { logo, FAVICON, lifecycle, layers, trust, verdicts, expandContract, coverage } from '../documents/site/figures.mjs';
import { TOOL_VERSION } from '../packages/core/index.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'documents/MigraSutra-AI');
const SITE = 'https://shahvatsalofficial.github.io/MigraSutra-AI/';
const REPO = 'https://github.com/shahvatsalofficial/MigraSutra-AI';
const CLI = path.join(ROOT, 'packages/cli/index.mjs');
const readJ = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const tests = readJ(path.join(OUT, 'evidence/test-results.json'));
const risky = readJ(path.join(OUT, 'evidence/samples/audit-risky.json'));
const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- real CLI runs for the scenarios ----------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-docs-'));
const project = (name, files) => {
  const d = path.join(tmp, name);
  for (const [f, text] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(d, f)), { recursive: true }); fs.writeFileSync(path.join(d, f), text); }
  return d;
};
const run = (cwd, ...args) => spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
const cmd = a => `$ migrasutra ${a}`;
function auditTerm(cwd, extra = []) {
  const r = run(cwd, 'audit', '--root', '.', '--out', 'report', ...extra);
  if (r.status === 2) throw new Error(r.stderr);
  const a = readJ(path.join(cwd, 'report/audit.json'));
  return [cmd(['audit --root . --out report', ...extra].join(' ')), ...r.stdout.trim().split('\n'), '',
    ...(a.scan.findings.length ? [] : ['(no static findings; this is not proof of safety)']), ...a.scan.findings.map(f => `${f.severity.toUpperCase().padEnd(7)}${f.code.padEnd(26)}${f.file}:${f.line}`),
    ...(a.rehearsal ? ['', `rehearsal: ${a.rehearsal.result}`, `app tests: ${a.rehearsal.tests.status}`, `rollback:  ${a.rehearsal.rollback.status}`] : []),
    `exit code: ${r.status}`];
}
const pkg = deps => JSON.stringify({ name: 'shop-api', dependencies: deps }, null, 2) + '\n';
const lock = '{"lockfileVersion":3}\n';
const SCN = {};
SCN.s1 = auditTerm(project('s1', { 'db/migrations/014_cleanup.sql': 'ALTER TABLE orders DROP COLUMN legacy_status;\nDROP TABLE old_carts;\n' }));
SCN.s2 = auditTerm(project('s2', { 'migrations/022_add_region.sql': 'ALTER TABLE customers ADD COLUMN region text NOT NULL;\nCREATE INDEX idx_region ON customers(region);\nALTER TABLE customers RENAME COLUMN mail TO email;\n' }));
SCN.s3 = auditTerm(project('s3', { 'package.json': pkg({ express: '4.21.2' }), 'package-lock.json': lock }), ['--target', 'npm:express@5.0.0']);
SCN.s4 = auditTerm(project('s4', { Dockerfile: 'FROM python\nCOPY . .\n', 'requirements.txt': 'flask>=2\nrequests==2.32.3\n', 'package.json': pkg({ leftpad: 'latest' }) }));
{
  const d = project('s5', { 'package.json': pkg({ express: '4.21.2' }), 'package-lock.json': lock });
  run(d, 'scan', '--root', '.', '--out', 'scan.json');
  fs.writeFileSync(path.join(d, 'package.json'), pkg({ express: '4.21.2', extra: '1.0.0' }));
  const r = run(d, 'plan', '--root', '.', '--scan', 'scan.json', '--target', 'npm:express@5.0.0', '--out', 'plan.json');
  SCN.s5 = [cmd('scan --root . --out scan.json'), 'scan completed: scan.json', '', '# a teammate edits package.json', '', cmd('plan --root . --scan scan.json --target npm:express@5.0.0 --out plan.json'), r.stderr.trim(), `exit code: ${r.status}`];
}
{
  const d = project('s6', { 'migrations/001.sql': 'TRUNCATE TABLE sessions;\n' });
  SCN.s6 = auditTerm(d, ['--fail', 'high']);
  const d2 = project('s7', { 'migrations/001.sql': 'DELETE FROM sessions;\n' });
  run(d2, 'scan', '--root', '.', '--out', 'before.json');
  fs.writeFileSync(path.join(d2, 'migrations/001.sql'), "DELETE FROM sessions WHERE expires_at < now();\n");
  run(d2, 'scan', '--root', '.', '--out', 'after.json');
  run(d2, 'compare', '--before', 'before.json', '--after', 'after.json', '--out', 'diff.json');
  const c = readJ(path.join(d2, 'diff.json'));
  SCN.s7 = [cmd('scan --root . --out before.json'), '# fix: add a WHERE clause', cmd('scan --root . --out after.json'), cmd('compare --before before.json --after after.json --out diff.json'), '', `introduced: ${c.introduced.length}`, `resolved:   ${c.resolved.length}  (${c.resolved.map(x => x.code).join(', ')})`, `unchanged:  ${c.unchanged.length}`, `decision:   ${c.decision}`];
}
SCN.hero = auditTerm(path.join(tmp, 's2'));
fs.rmSync(tmp, { recursive: true, force: true });

// ---------- figures ----------
const sev = risky.scan.totals;
const total = sev.high + sev.medium + sev.low;
const DIA = {
  pipeline: () => flow([{ t: 'Scan', s: 'read-only inventory', k: 'brand' }, { t: 'Plan', s: 'one reviewed change' }, { t: 'Rehearse', s: 'in a temp folder' }, { t: 'Gate', s: 'conservative verdict', k: 'warn' }, { t: 'Human', s: 'decides', k: 'ok' }], 'From repository to reviewed decision'),
  verdict: () => decision([{ q: 'Any high static finding?', s: 'drop, truncate, bad manifest', on: 'yes', out: 'NO_GO', k: 'bad' }, { q: 'Rehearsal failed?', s: 'manifest edit did not verify', on: 'yes', out: 'NO_GO', k: 'bad' }], 'REVIEW_REQUIRED', 'How the release verdict is decided. There is no automatic GO.', 'warn'),
  sqlscan: () => flow([{ t: 'Read SQL', s: 'max 1 MiB, no links', k: 'brand' }, { t: 'Blank noise', s: 'comments, strings' }, { t: 'Match rules', s: '7 SQL rules' }, { t: 'Line + hash', s: 'stable evidence ID', k: 'ok' }], 'How one SQL file is checked'),
  rehearse: () => flow([{ t: 'Check hash', s: 'file unchanged?', k: 'brand' }, { t: 'Edit copy', s: 'in memory' }, { t: 'Temp file', s: 'write, read back' }, { t: 'Delete', s: 'temp folder' }, { t: 'Report', s: 'source untouched', k: 'ok' }], 'What a static rehearsal really does'),
  ci: () => flow([{ t: 'Pull request', s: 'migration added', k: 'brand' }, { t: 'audit', s: '--fail high' }, { t: 'Exit 1', s: 'blocks the merge', k: 'bad' }, { t: 'Artifact', s: 'HTML, MD, JSON' }, { t: 'Reviewer', s: 'reads and decides', k: 'ok' }], 'MigraSutra in a pipeline'),
  skills: () => flow([{ t: 'Prime', s: 'scopes the upgrade', k: 'brand' }, { t: 'Specialist', s: 'schema, deps, infra' }, { t: 'CLI', s: 'real evidence', k: 'ok' }, { t: 'Arbiter', s: 'release review', k: 'warn' }], 'How the agent skills use the CLI')
};
const BARS = {
  severity: () => bars([{ label: 'High', value: sev.high, total, k: 'bad' }, { label: 'Medium', value: sev.medium, total, k: 'warn' }, { label: 'Low', value: sev.low, total, k: '' }], `Findings in the bundled risky fixture (${total} total), read from the generated audit.json`),
  rules: () => bars([{ label: 'High rules', value: 5, total: 13, k: 'bad' }, { label: 'Medium rules', value: 7, total: 13, k: 'warn' }, { label: 'Low rules', value: 1, total: 13, k: '' }], 'The 13 rules by severity'),
  proof: () => bars([{ label: 'Tests passing', value: tests.pass, total: tests.total, k: 'ok' }, { label: 'Tests skipped (symlinks)', value: tests.skipped, total: tests.total, k: 'warn' }, { label: 'Tests failing', value: tests.fail, total: tests.total, k: 'bad', text: `${tests.fail} / ${tests.total}` }, { label: 'SQL corpus correct', value: 15, total: 16, k: 'ok' }], `Recorded on Node ${tests.environment.node} (${tests.environment.platform}). Reproduce with npm run test:report.`)
};
const HTML = { lifecycle, layers, trust, verdicts, expandContract, coverage };
function directive(l) {
  const m = l.match(/^<!-- (diagram|bars|html|term):(\w+) -->$/);
  if (!m) return null;
  const [, kind, name] = m;
  const v = kind === 'diagram' ? DIA[name] : kind === 'bars' ? BARS[name] : kind === 'html' ? HTML[name] : SCN[name] && (() => terminal(SCN[name], 'terminal: real output, generated at build time'));
  if (!v) throw new Error('unknown directive ' + l);
  return v();
}

// ---------- markdown ----------
const safeHref = u => (/^(https?:|mailto:|#|(?!\w+:)[\w./-]+(#[\w-]*)?$)/i.test(u) ? u : '#');
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (m, c) => { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
  s = esc(s).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => { u = safeHref(u); if (!/^https?:/.test(u) && !u.startsWith('evidence/')) u = u.replace(/\.md(#|$)/, '.html$1'); return `<a href="${u}">${t}</a>`; });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return s.replace(/\u0000(\d+)\u0000/g, (m, i) => '<code>' + esc(codes[i]) + '</code>');
}
function render(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n'), out = [], toc = [];
  const BRK = /^(#{1,4} |```|\||[-*] |\d+\. |> |<!--)/;
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith('```')) { const lang = l.slice(3).trim(), buf = []; i++; while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]); i++; out.push(`<div class="codewrap"${lang && lang !== 'text' ? ` data-lang="${esc(lang)}"` : ''}><pre><code>${esc(buf.join('\n'))}</code></pre></div>`); continue; }
    if (l.startsWith('<!--')) { const d = directive(l.trim()); if (d === null) throw new Error('unsupported comment ' + l); out.push(d); i++; continue; }
    const h = l.match(/^(#{1,4}) (.*)/);
    if (h) { const n = h[1].length, id = slug(h[2]); if (n === 2) toc.push([id, h[2].replace(/`/g, '')]); out.push(n === 1 ? `<h1>${inline(h[2])}</h1>` : `<h${n} id="${id}">${inline(h[2])}<a class="anc" href="#${id}" aria-label="Link to this section">#</a></h${n}>`); i++; continue; }
    if (l.startsWith('|') && /^\|[\s:|-]+\|$/.test(lines[i + 1] ?? '')) { const rows = []; while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]); const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim()); out.push(`<div class="tw" tabindex="0"><table><thead><tr>${cells(rows[0]).map(c => `<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.slice(2).map(r => `<tr>${cells(r).map((c, n) => `<td data-l="${esc(cells(rows[0])[n].replace(/`/g, ''))}"><span>${inline(c)}</span></td>`).join('')}</tr>`).join('')}</tbody></table></div>`); continue; }
    if (/^[-*] /.test(l)) { const it = []; while (i < lines.length && /^[-*] /.test(lines[i])) it.push(lines[i++].slice(2)); out.push(`<ul>${it.map(x => `<li>${inline(x)}</li>`).join('')}</ul>`); continue; }
    if (/^\d+\. /.test(l)) { const it = []; while (i < lines.length && /^\d+\. /.test(lines[i])) it.push(lines[i++].replace(/^\d+\. /, '')); out.push(`<ol>${it.map(x => `<li>${inline(x)}</li>`).join('')}</ol>`); continue; }
    if (l.startsWith('> ')) { const b = []; while (i < lines.length && lines[i].startsWith('> ')) b.push(lines[i++].slice(2)); out.push(`<blockquote><p>${inline(b.join(' '))}</p></blockquote>`); continue; }
    if (!l.trim()) { i++; continue; }
    const p = []; while (i < lines.length && lines[i].trim() && !BRK.test(lines[i])) p.push(lines[i++]); out.push(`<p>${inline(p.join(' '))}</p>`);
  }
  return { html: out.join('\n'), toc };
}

// ---------- site structure ----------
const GROUPS = [
  ['Start here', ['README', '05-user-guide', '08-real-world-scenarios', '09-how-it-works', '01-executive-summary']],
  ['Concepts', ['02-functional-spec', '04-architecture', '03-technical-spec']],
  ['Trust', ['06-security-privacy-legal', '07-independent-audit', 'test-results']],
  ['Help', ['10-faq-and-glossary']]
];
const ORDER = GROUPS.flatMap(g => g[1]);
const found = fs.readdirSync(OUT).filter(f => f.endsWith('.md')).map(f => f.slice(0, -3));
for (const k of found) if (!ORDER.includes(k)) throw new Error('document missing from navigation: ' + k);
const docs = Object.fromEntries(ORDER.map(k => { const raw = fs.readFileSync(path.join(OUT, k + '.md'), 'utf8').replace(/\r\n/g, '\n'); return [k, { out: k + '.html', raw, title: raw.match(/^# (.*)/)[1] }]; }));
const lede = raw => (raw.split('\n').find(l => l && !/^(#|\||`|-|>|<|\d\.)/.test(l)) ?? '').replace(/[*`]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').slice(0, 175);

const assets = Object.fromEntries(['site.css', 'site.js'].map(f => [f, fs.readFileSync(path.join(ROOT, 'documents/site', f), 'utf8').replace(/\r\n/g, '\n')]));
const HASH = createHash('sha256').update(Object.values(assets).join('')).digest('hex').slice(0, 10);
const themeJs = fs.readFileSync(path.join(ROOT, 'documents/site/theme.js'), 'utf8').replace(/\r\n/g, '\n').replace(/^\/\/.*\n/gm, '');
const NAV = [['index.html', 'Home'], ['05-user-guide.html', 'Docs'], ['08-real-world-scenarios.html', 'Scenarios'], ['09-how-it-works.html', 'How it works'], ['07-independent-audit.html', 'Evidence']];
const OWN = new Set(NAV.slice(2).map(n => n[0]));
const WM = '<span class="wm">Migra<b>Sutra</b> AI</span>';
const ld = (title, desc, url) => JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'SoftwareApplication', name: 'MigraSutra AI', applicationCategory: 'DeveloperApplication', operatingSystem: 'Windows, macOS, Linux (Node.js 22+)', softwareVersion: TOOL_VERSION, license: 'https://www.apache.org/licenses/LICENSE-2.0', url: SITE, codeRepository: REPO, author: { '@type': 'Person', name: 'Vatsal Shah' }, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }, { '@type': 'TechArticle', headline: title, description: desc, url }] }).replace(/</g, '\\u003c');

function shell({ file, title, desc, body, landing = false, toc = [] }) {
  const url = SITE + (file === 'index.html' ? '' : file);
  const current = h => file === h || (h === '05-user-guide.html' && !landing && !OWN.has(file));
  const links = NAV.map(([h, t]) => `<a href="${h}"${current(h) ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  const nav = `<header class="nav"><div class="nav-in"><button class="icon-btn" id="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="side">${icon('menu', 20).replace('class="ic"', 'class="ic i-menu"')}${icon('close', 20).replace('class="ic"', 'class="ic i-close"')}</button><a class="brand" href="index.html">${logo(30)}${WM}<small>v${TOOL_VERSION}</small></a><nav class="nav-links" aria-label="Primary">${links}</nav><span class="sp"></span><a class="icon-btn" href="${REPO}" aria-label="GitHub repository">${icon('github', 20)}</a><button class="icon-btn" id="theme-btn" type="button" aria-label="Switch to dark theme" aria-pressed="false">${icon('moon', 20).replace('class="ic"', 'class="ic i-moon"')}${icon('sun', 20).replace('class="ic"', 'class="ic i-sun"')}</button></div></header><div class="scrim"></div>`;
  const side = `<aside class="side" id="side" aria-label="Documentation"><div class="side-top">${links}</div>${GROUPS.map(([g, ks]) => `<h4>${g}</h4>${ks.map(k => `<a href="${docs[k].out}"${file === docs[k].out ? ' aria-current="page"' : ''}>${esc(docs[k].title)}</a>`).join('')}`).join('')}<h4>Samples</h4><a href="evidence/samples/audit-risky.html">Risky app report</a><a href="evidence/samples/audit-clean.html">Clean app report</a><a href="llms.txt">llms.txt</a></aside>`;
  const foot = `<footer class="site"><div class="container"><div class="foot"><div><a class="brand" href="index.html">${logo(28)}${WM}</a><p>Upgrade with evidence. Rehearse before change. Recover with confidence.</p></div><div><h5>Learn</h5><a href="05-user-guide.html">User guide</a><a href="08-real-world-scenarios.html">Scenarios</a><a href="09-how-it-works.html">How it works</a><a href="10-faq-and-glossary.html">FAQ</a></div><div><h5>Trust</h5><a href="07-independent-audit.html">Audit</a><a href="test-results.html">Test results</a><a href="06-security-privacy-legal.html">Security and legal</a></div><div><h5>Project</h5><a href="${REPO}">GitHub</a><a href="https://www.npmjs.com/package/migrasutra">npm</a><a href="${REPO}/releases">Releases</a><a href="${REPO}/issues">Issues</a></div></div><p class="legal">Apache-2.0 &middot; Created by Vatsal Shah &middot; Static analysis only. Nothing here is a deploy approval, certification or legal advice.</p></div></footer>`;
  const tocHtml = toc.length ? `<nav class="toc-r" aria-label="On this page"><strong>On this page</strong>${toc.map(([id, t]) => `<a href="#${id}">${esc(t)}</a>`).join('')}</nav>` : '<div></div>';
  const main = landing ? `<div class="doc">${side}</div><main id="main">${body}</main>` : `<div class="doc">${side}<main class="prose" id="main">${body}</main>${tocHtml}</div>`;
  const full = title.includes('MigraSutra') ? title : `${title} | MigraSutra AI`;
  return `<!doctype html>\n<html lang="en" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(full)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}"><meta name="color-scheme" content="light dark"><meta property="og:type" content="website"><meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta name="twitter:card" content="summary"><meta name="author" content="Vatsal Shah"><meta name="keywords" content="database migration safety, SQL migration linter, dependency upgrade risk, release gate, rollback, expand contract, offline audit CLI, agent skills"><script>${themeJs}</script><link rel="icon" type="image/svg+xml" href="${FAVICON}"><link rel="stylesheet" href="assets/site.css?v=${HASH}"><script type="application/ld+json">${ld(title, desc, url)}</script></head><body${landing ? ' class="landing"' : ''}><a class="skip" href="#main">Skip to content</a>${nav}${main}${foot}<script src="assets/site.js?v=${HASH}" defer></script></body></html>\n`;
}

const files = new Map(Object.entries(assets).map(([f, c]) => ['assets/' + f, c]));
ORDER.forEach((k, i) => {
  const d = docs[k], { html, toc } = render(d.raw), prev = docs[ORDER[i - 1]], next = docs[ORDER[i + 1]];
  const group = GROUPS.find(g => g[1].includes(k))[0];
  const body = `<div class="crumbs"><a href="index.html">Home</a> / ${esc(group)}</div>${html}<div class="pager">${prev ? `<a href="${prev.out}"><small>Previous</small>${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a class="nx" href="${next.out}"><small>Next</small>${esc(next.title)}</a>` : '<span></span>'}</div><div class="edit"><a href="${REPO}/edit/main/documents/MigraSutra-AI/${k}.md">Edit this page on GitHub</a><a href="${REPO}/issues/new">Report a problem</a></div>`;
  files.set(d.out, shell({ file: d.out, title: d.title, desc: lede(d.raw) || d.title, body, toc }));
});

const card = (href, ic, t, p, c = '') => `<a class="card" href="${href}"><div class="ico ${c}">${icon(ic, 24)}</div><h3>${t}</h3><p>${p}</p><span class="more">Read more ${icon('arrow', 16)}</span></a>`;
const section = (eyebrow, h, sub, inner, alt = false) => `<section class="section${alt ? ' alt' : ''}"><div class="container"><span class="eyebrow">${eyebrow}</span><h2>${h}</h2><p class="sub">${sub}</p>${inner}</div></section>`;
const INSTALL = 'npx migrasutra audit --root . --out report';
const landing = `<section class="hero"><div class="container hero-in"><div><span class="badge"><b>v${TOOL_VERSION}</b> Apache-2.0 &middot; zero dependencies &middot; offline</span><h1>Know what your upgrade will break, <span class="grad">before it does.</span></h1><p class="lead">MigraSutra AI reads your repository, flags risky database and dependency changes with file and line, rehearses the change safely, and writes a report a human can approve. No API key. No cloud. Nothing executed.</p><div class="cta"><a class="btn primary" href="05-user-guide.html">Get started ${icon('arrow', 18)}</a><a class="btn" href="08-real-world-scenarios.html">See real scenarios</a></div><div class="install"><code>${INSTALL}</code><button class="copy" type="button" data-copy="${INSTALL}" aria-label="Copy command">${icon('copy', 16)}<span class="lbl">Copy</span></button></div></div><div class="hero-term">${terminal(SCN.hero, 'terminal: real output')}</div></div></section>`
  + `<section class="container"><div class="stats"><div class="stat"><b>${tests.pass}/${tests.total}</b><span>tests passing, ${tests.fail} failing</span></div><div class="stat"><b>13</b><span>deterministic rules</span></div><div class="stat"><b>20</b><span>agent skills</span></div><div class="stat"><b>0</b><span>runtime dependencies</span></div></div></section>`
  + section('How it works', 'Five steps, each leaving evidence', 'Every hop carries a content hash. Change a file halfway and the flow stops.', DIA.pipeline() + lifecycle())
  + section('Real-world scenarios', 'Situations you will recognise', 'Each one shows output produced by the real CLI when this site was built.', `<div class="grid g3">${card('08-real-world-scenarios.html#1-the-friday-cleanup-that-drops-a-column', 'alert', 'The Friday cleanup', 'A column and a table are about to be dropped.', 'bad')}${card('08-real-world-scenarios.html#2-a-new-required-column-on-a-busy-table', 'gauge', 'The required column', 'NOT NULL, a blocking index and a rename.', 'warn')}${card('08-real-world-scenarios.html#3-moving-a-web-framework-to-a-new-major', 'package', 'The major upgrade', 'Rehearse a framework bump without touching source.')}${card('08-real-world-scenarios.html#5-someone-edits-the-code-after-the-scan', 'shield', 'The stale approval', 'The plan is refused because the file changed.', 'ok')}${card('08-real-world-scenarios.html#6-blocking-a-pull-request-in-ci', 'gate', 'The CI gate', 'A truncate blocks the merge with exit code 1.', 'bad')}${card('08-real-world-scenarios.html#7-proving-the-fix-worked', 'check', 'The proven fix', 'Compare before and after, finding by finding.', 'ok')}</div>`, true)
  + section('Verdicts', 'No automatic green light', 'The tool cannot see your test results, so it never says safe.', verdicts() + DIA.verdict())
  + section('Reports', 'One command, three formats', 'JSON for machines, Markdown for pull requests, HTML for people.', BARS.severity() + `<p class="cta"><a class="btn primary" href="evidence/samples/audit-risky.html">Open a sample report ${icon('arrow', 18)}</a><a class="btn" href="evidence/samples/audit-clean.html">Clean app report</a></p>`, true)
  + section('Private by design', 'Your code stays on your machine', 'Files are read, never executed. Nothing is sent anywhere.', trust())
  + section('Proof', 'Evidence you can reproduce', 'Self-assessed, not third-party certified. Run the commands yourself.', BARS.proof() + `<div class="honest"><h3>${icon('alert', 22)} What it does not do</h3><ul><li>It does not run your tests, builds, installs or migrations.</li><li>SQL checks are heuristics, not a dialect parser. Dynamic SQL inside <code>$$</code> bodies is missed.</li><li>Only root-level manifests and common migration folders are read.</li><li>Sandbox execution, codemods and a database restore lab are roadmap items.</li><li>Skills were not verified inside live IDE hosts.</li></ul></div>`, true)
  + section('Documentation', 'Everything in one place', 'Pick the page that matches your role.', `<div class="grid g3">${ORDER.map(k => `<a class="card" href="${docs[k].out}"><h3>${esc(docs[k].title)}</h3><p>${esc(lede(docs[k].raw).slice(0, 110))}</p></a>`).join('')}</div>`)
  + '<section class="section"><div class="container"><div class="band"><h2>Audit your first repository</h2><p>Node.js 22 or newer is all you need.</p><a class="btn" href="05-user-guide.html">Open the user guide</a></div></div></section>';
files.set('index.html', shell({ file: 'index.html', title: 'MigraSutra AI: know what your upgrade will break', desc: 'Offline, read-only migration audit CLI: finds risky SQL and dependency changes, rehearses safely and writes HTML, Markdown and JSON reports.', body: landing, landing: true }));

const urls = ['', ...ORDER.map(k => docs[k].out)];
files.set('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
files.set('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
// llms.txt paths are repo-relative; on the site they are site-relative.
files.set('llms.txt', fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8').replace(/\r\n/g, '\n').replace(/\]\(documents\/MigraSutra-AI\//g, `](${SITE}`).replace(/\]\((README\.md|CHANGELOG\.md|docs\/[^)]+)\)/g, `](${REPO}/blob/main/$1)`));

// Every relative link and #anchor must resolve.
for (const [name, html] of files) {
  if (!name.endsWith('.html')) continue;
  for (const [, href] of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(href)) continue;
    const [p, anchor] = href.split('#'), target = p || name;
    if (!files.has(target) && !fs.existsSync(path.join(OUT, target))) throw new Error(`${name}: broken link ${href}`);
    if (anchor && files.has(target) && !files.get(target).includes(`id="${anchor}"`)) throw new Error(`${name}: missing anchor ${href}`);
  }
}

const check = process.argv.includes('--check'), stale = [];
for (const [name, content] of files) {
  const target = path.join(OUT, name);
  if (check) { if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== content) stale.push(name); }
  else { fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content); }
}
if (stale.length) { console.error('Stale site files (run npm run build:docs): ' + stale.join(', ')); process.exit(1); }
console.log(`${check ? 'checked' : 'built'} ${files.size} site files`);
