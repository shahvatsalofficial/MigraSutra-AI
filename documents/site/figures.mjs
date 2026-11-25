// MigraSutra figures. Colours come from CSS variables, so they follow the light/dark theme.
import { esc, ICONS, icon } from './diagrams.mjs';

Object.assign(ICONS, {
  gauge: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-6"/><circle cx="12" cy="17" r="1.2"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>'
});

let uid = 0;
const TILE = id => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4338ca"/><stop offset="1" stop-color="#0284c7"/></linearGradient></defs><rect width="32" height="32" rx="9" fill="url(#${id})"/><g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 22l6-6 4 4 8-9"/><path d="M19 11h6v6"/></g>`;
export const logo = (size = 30) => `<svg class="logo" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">${TILE('lg' + (++uid))}</svg>`;
export const FAVICON = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${TILE('g')}</svg>`);

const rungs = rows => `<div class="ladder">${rows.map(([c, b, t]) => `<div class="rung ${c}"><b>${esc(b)}</b><span>${esc(t)}</span></div>`).join('')}</div>`;

/** What goes in, what comes out, at each stage. */
export function lifecycle() {
  const cards = [['file', 'scan.json', 'Findings with file, line, rule ID and a SHA-256 of each source.'], ['diff', 'plan.json', 'One field change, its baseline hash, prerequisites and rollback notes.'], ['terminal', 'rehearsal.json', 'Before and after hashes. Tests and rollback are marked as not run.'], ['gate', 'gate.json', 'NO_GO or REVIEW_REQUIRED with every reason listed.']];
  return `<div class="grid g4 arts">${cards.map(([i, t, p]) => `<div class="card"><div class="ico">${icon(i, 24)}</div><h3><code>${t}</code></h3><p>${p}</p></div>`).join('')}</div>`;
}

/** Verdict and evidence labels. */
export function verdicts() {
  return rungs([['r5', 'NO_GO', 'A high-severity static finding exists, or the rehearsal failed. Fix this first.'], ['r4', 'REVIEW_REQUIRED', 'The best possible result. A person must review. Tests and rollback were not run.'], ['r2', 'UNVERIFIED_EXTERNAL', 'Evidence you imported. It is recorded and never raises the verdict.'], ['r3', 'GO_CANDIDATE', 'Reserved for a future policy with verified tests. Not implemented.']]);
}

/** Expand-contract timeline for a safe column change. */
export function expandContract() {
  const s = [['1. Expand', 'Add the new column as nullable. Old code keeps working.'], ['2. Dual write', 'The application writes both old and new columns.'], ['3. Backfill', 'Copy history in small batches. Check the counts.'], ['4. Switch reads', 'Read the new column. Keep the old one for rollback.'], ['5. Contract', 'After a safe window and a tested restore, drop the old column.']];
  return `<ol class="timeline">${s.map(([t, d], i) => `<li class="${i === 4 ? 'last' : ''}"><b>${t}</b><span>${d}</span></li>`).join('')}</ol>`;
}

/** Architecture layers. */
export function layers() {
  const mods = a => `<div class="mods">${a.map(m => `<span>${esc(m)}</span>`).join('')}</div>`;
  return `<div class="layers"><div class="layer b"><h4>Shell</h4><p>Parses arguments, writes report files, sets exit codes.</p>${mods(['packages/cli', 'packages/server (127.0.0.1, token)', 'skills installer'])}</div>`
    + `<div class="layer"><h4>Core</h4><p>Read-only analysis. No network and no process execution.</p>${mods(['scanRepository', 'createPlan', 'rehearsePlan', 'releaseGate', 'compareScans', 'auditRepository', 'Markdown and HTML renderers'])}</div>`
    + `<div class="layer"><h4>Guidance</h4><p>Instructions for AI coding hosts. The CLI runs without them.</p>${mods(['20 skills', 'agents', 'rules', 'policies', 'workflows', 'schemas'])}</div>`
    + `<div class="layer g"><h4>Runtime</h4><p>Node.js 22+ built-ins only. Zero dependencies. No telemetry.</p></div></div>`;
}

/** Trust boundary: what the tool touches and what it never does. */
export function trust() {
  const zone = (c, t, rows) => `<div class="zone ${c}"><h4>${t}</h4><ul>${rows.map(([b, s]) => `<li><b>${b}</b><span>${s}</span></li>`).join('')}</ul></div>`;
  return `<div class="trust">${zone('ok', 'The tool does', [['Read allow-listed files', 'manifests, Dockerfile, SQL migrations'], ['Hash and match', 'deterministic rules, stable evidence IDs'], ['Write reports', 'only where you point --out'], ['Rehearse in a temp folder', 'deleted afterwards']])}${zone('bad', 'The tool never', [['Runs your code', 'no installs, scripts, tests or migrations'], ['Calls the internet', 'no cloud, no telemetry, no keys'], ['Edits your source', 'tests compare bytes before and after'], ['Reads .env files', 'unlisted files are ignored']])}</div>`;
}

/** What is covered per ecosystem. */
export function coverage() {
  const rows = [['SQL migrations', '7 rules', 'rules', 'ok'], ['npm', '3 rules, plan and rehearsal', 'deepest', 'ok'], ['Python requirements', '1 rule', 'rules', 'ok'], ['Dockerfile', '1 rule', 'rules', 'ok'], ['Go, PHP', 'Inventory with counts', 'inventory', 'warn'], ['Java, pyproject, .tool-versions', 'Detected only', 'presence', 'warn'], ['.NET, Rust, Kubernetes, OpenTofu', 'Not read yet', 'roadmap', 'bad']];
  return `<div class="tw"><table><thead><tr><th scope="col">Ecosystem</th><th scope="col">What happens</th><th scope="col">Depth</th></tr></thead><tbody>${rows.map(([a, b, c, k]) => `<tr><td data-l="Ecosystem"><span><strong>${a}</strong></span></td><td data-l="What happens"><span>${b}</span></td><td data-l="Depth"><span class="sev ${k}">${c}</span></td></tr>`).join('')}</tbody></table></div>`;
}
