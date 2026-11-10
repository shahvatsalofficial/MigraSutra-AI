// Runs the real test suite and records the observed result as shareable evidence.
// Output: documents/MigraSutra-AI/evidence/test-results.json and documents/MigraSutra-AI/test-results.md. Nothing is hand-written.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'documents/MigraSutra-AI/evidence');
const files = fs.readdirSync(path.join(root, 'tests')).filter(f => f.endsWith('.test.mjs')).map(f => path.join('tests', f));
const started = Date.now();
const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...files], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const durationMs = Date.now() - started;
const cases = [];
for (const line of r.stdout.split(/\r?\n/)) {
  const m = line.match(/^(not ok|ok) \d+ - (.*?)(?: # (SKIP|skip)\b.*)?$/);
  if (m) cases.push({ name: m[2].replace(/\s+\(\d+(?:\.\d+)?ms\)$/, ''), status: m[3] ? 'skipped' : m[1] === 'ok' ? 'pass' : 'fail' });
}
const count = s => cases.filter(c => c.status === s).length;
const git = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' });
const result = {
  schema: 'migrasutra.test-evidence/v1',
  command: 'node --test tests/*.test.mjs',
  exitCode: r.status,
  total: cases.length, pass: count('pass'), fail: count('fail'), skipped: count('skipped'),
  durationMs,
  environment: { node: process.version, platform: process.platform, arch: os.arch(), commit: git.status === 0 ? git.stdout.trim() : 'uncommitted' },
  skippedReason: 'Symlink tests skip when the host forbids symlink creation (Windows without Developer Mode); they run on Linux and macOS CI.',
  cases
};
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'test-results.json'), JSON.stringify(result, null, 2) + '\n');
const md = [
  '# Test results (observed)', '',
  `Command: \`${result.command}\``, '',
  `| Total | Pass | Fail | Skipped | Exit code |`, `| --- | --- | --- | --- | --- |`,
  `| ${result.total} | ${result.pass} | ${result.fail} | ${result.skipped} | ${result.exitCode} |`, '',
  `Environment: Node ${result.environment.node}, ${result.environment.platform}/${result.environment.arch}, commit \`${result.environment.commit}\`.`, '',
  `Skips: ${result.skippedReason}`, '',
  'Regenerate with `npm run test:report`. This file is machine-written from the real run; it is not edited by hand.', '',
  '## Cases', '', ...cases.map(c => `- ${c.status === 'pass' ? 'PASS' : c.status === 'fail' ? '**FAIL**' : 'SKIP'} — ${c.name.replace(/[|<>]/g, ' ')}`), ''
].join('\n');
fs.writeFileSync(path.join(root, 'documents/MigraSutra-AI/test-results.md'), md);
console.log(`tests ${result.total} pass ${result.pass} fail ${result.fail} skipped ${result.skipped}`);
process.exitCode = r.status === 0 && result.fail === 0 && result.total > 0 ? 0 : 1;
