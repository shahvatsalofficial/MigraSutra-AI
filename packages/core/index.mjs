/**
 * MigraSutra deterministic analysis core.
 * No external network calls, no arbitrary code execution, no source-file writes.
 * Copyright 2026 Vatsal Shah. Apache-2.0.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

const SCHEMA_SCAN = 'migrasutra.scan/v1';
const SCHEMA_PLAN = 'migrasutra.plan/v1';
const SCHEMA_REHEARSAL = 'migrasutra.rehearsal/v1';
const excludedDirs = new Set(['.git', 'node_modules', '.venv', 'venv', 'vendor', 'dist', 'build', '.next', '.turbo', 'coverage', '.terraform', '.migrasutra']);
export const sha256 = x => crypto.createHash('sha256').update(x).digest('hex');
export const evidenceId = (...parts) => `MS-${sha256(parts.map(x => String(x)).join('|')).slice(0, 12)}`;
export const toPosix = x => x.split(path.sep).join('/');
export const safeSummary = s => String(s).slice(0, 280).replace(/([A-Za-z0-9_]*?(?:TOKEN|PASSWORD|SECRET|KEY)[A-Za-z0-9_]*)\s*[:=]\s*[^\s,;]+/ig, '$1=[REDACTED]');
export const validDependencyName = s => /^(?:@[a-zA-Z0-9._-]+\/)?[a-zA-Z0-9._-]+$/.test(s) && s.length < 200;
export const validVersion = s => /^[0-9]+(?:\.[0-9]+){0,2}(?:-[0-9A-Za-z.-]+)?$/.test(s) && s.length < 100;
export function ensureRoot(root) {
  const p = fs.realpathSync(root);
  if (!fs.statSync(p).isDirectory()) throw new Error('Root must be a directory');
  return p;
}
export function within(root, file) {
  const rel = path.relative(root, file);
  return rel === '' || (rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel));
}
export function safeRead(root, relative, maxBytes = 1024 * 1024) {
  const p = path.resolve(root, relative);
  if (!within(root, p)) throw new Error('Path escapes repository root');
  let cur = root;
  for (const part of path.relative(root, p).split(path.sep)) {
    cur = path.join(cur, part);
    if (fs.lstatSync(cur).isSymbolicLink()) throw new Error('Refusing symbolic link');
  }
  const stat = fs.statSync(p);
  if (!stat.isFile() || stat.size > maxBytes) throw new Error('Unsupported or oversized file');
  return fs.readFileSync(p, 'utf8');
}
function safeFiles(root) {
  const files = [];
  const rootNames = ['package.json', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'npm-shrinkwrap.json', 'requirements.txt', 'pyproject.toml', 'go.mod', 'pom.xml', 'build.gradle', 'build.gradle.kts', 'composer.json', 'Dockerfile', '.tool-versions'];
  for (const name of rootNames) if (fs.existsSync(path.join(root, name))) files.push(name);
  const sqlDirectories = ['migrations', 'db/migrations', 'prisma/migrations', 'database/migrations'];
  for (const dir of sqlDirectories) {
    // Reject symlinked ancestor directories before traversing any entries.
    let ancestor = root;
    let unsafe = false;
    for (const part of dir.split('/')) {
      ancestor = path.join(ancestor, part);
      if (!fs.existsSync(ancestor)) break;
      if (fs.lstatSync(ancestor).isSymbolicLink()) { unsafe = true; break; }
    }
    if (unsafe) continue;
    const p = path.join(root, dir);
    if (!fs.existsSync(p)) continue;
    const walk = (where, depth = 0) => {
      if (depth > 5 || files.length >= 150) return;
      for (const entry of fs.readdirSync(where, { withFileTypes: true })) {
        if (files.length >= 150) break;
        if (entry.isSymbolicLink() || excludedDirs.has(entry.name)) continue;
        const full = path.join(where, entry.name);
        if (entry.isDirectory()) walk(full, depth + 1);
        else if (entry.isFile() && entry.name.toLowerCase().endsWith('.sql')) files.push(toPosix(path.relative(root, full)));
      }
    };
    if (fs.lstatSync(p).isDirectory() && !fs.lstatSync(p).isSymbolicLink()) walk(p);
  }
  return [...new Set(files)].sort();
}
function issue(code, severity, file, line, description, fileHash, details = {}) {
  return { id: evidenceId(code, file, line, details.subject ?? ''), code, severity, file, line, description, evidence: { type: 'static', sourceHash: fileHash, verifiedBy: 'deterministic-rule', execution: 'not-run' }, ...details };
}
function sqlStatements(text) {
  // Best-effort line-aware static detector; not a dialect-complete SQL parser.
  const commentsRemoved = text.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' ')).replace(/--[^\n]*/g, '');
  const stringsRemoved = commentsRemoved.replace(/'(?:''|[^'])*'/g, m => m.replace(/[^\n]/g, ' '));
  return stringsRemoved.split(';').map(s => s.trim()).filter(Boolean);
}
function scanSql(text, file, hash) {
  const results = [];
  const sanitized = text.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' ')).replace(/--[^\n]*/g, '').replace(/'(?:''|[^'])*'/g, m => m.replace(/[^\n]/g, ' '));
  const patterns = [
    ['SQL_DROP_TABLE', /\bDROP\s+TABLE\b/gi, 'high', 'Potentially destructive DROP TABLE statement'],
    ['SQL_DROP_COLUMN', /\bALTER\s+TABLE\b[\s\S]{0,250}?\bDROP\s+(?:COLUMN\s+)?[a-zA-Z_]/gi, 'high', 'Potentially destructive column removal'],
    ['SQL_TRUNCATE', /\bTRUNCATE\s+(?:TABLE\s+)?[\w"`\[]/gi, 'high', 'Potentially destructive TRUNCATE statement'],
    ['SQL_NOT_NULL_NO_DEFAULT', /\bADD\s+(?:COLUMN\s+)?(?!CONSTRAINT\b)[\w"`]+\s+[\w()]+[^;,]*?\bNOT\s+NULL\b(?![^;,]*\bDEFAULT\b)/gi, 'medium', 'NOT NULL column added without DEFAULT; fails or locks on populated tables (use expand-contract)'],
    ['SQL_RENAME', /\bRENAME\s+(?:COLUMN|TO|TABLE)\b/gi, 'medium', 'Rename breaks mixed-version readers; use expand-contract'],
    ['SQL_INDEX_NOT_CONCURRENT', /\bCREATE\s+(?:UNIQUE\s+)?INDEX\s+(?!CONCURRENTLY\b)/gi, 'low', 'CREATE INDEX may block writes on PostgreSQL; consider CONCURRENTLY (engine-specific)']
  ];
  for (const [code, re, level, description] of patterns) {
    for (const m of sanitized.matchAll(re)) {
      const line = sanitized.slice(0, m.index).split('\n').length;
      results.push(issue(code, level, file, line, description, hash));
    }
  }
  // Basic single-statement guard; complex SQL requires a proper dialect-specific parser.
  let offset = 0;
  for (const raw of sanitized.split(';')) {
    if (/\bDELETE\s+FROM\b/i.test(raw) && !/\bWHERE\b/i.test(raw)) {
      const pos = offset + raw.search(/\bDELETE\s+FROM\b/i);
      results.push(issue('SQL_DELETE_UNSCOPED', 'high', file, sanitized.slice(0, pos).split('\n').length, 'DELETE statement without WHERE detected by heuristic; manual SQL review required', hash));
    }
    offset += raw.length + 1;
  }
  return results;
}
export function scanRepository(rootArg) {
  const root = ensureRoot(rootArg);
  const files = safeFiles(root);
  const findings = [], sources = [], inventory = [];
  let packageInfo = null;
  for (const file of files) {
    let content;
    try { content = safeRead(root, file); }
    catch (error) {
      findings.push(issue('SOURCE_NOT_READ', 'medium', file, 1, 'Source could not be safely read: ' + safeSummary(error.message), 'unavailable'));
      continue;
    }
    const hash = sha256(content);
    sources.push({ path: file, sha256: hash, bytes: Buffer.byteLength(content) });
    if (file === 'package.json') {
      try {
        const pkg = JSON.parse(content);
        const sections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
        packageInfo = { name: typeof pkg.name === 'string' ? safeSummary(pkg.name) : '(unnamed)', packageManager: typeof pkg.packageManager === 'string' ? safeSummary(pkg.packageManager) : 'unspecified', dependencies: {} };
        for (const section of sections) {
          const deps = pkg[section] && typeof pkg[section] === 'object' && !Array.isArray(pkg[section]) ? pkg[section] : {};
          packageInfo.dependencies[section] = Object.keys(deps).length;
          for (const [dep, version] of Object.entries(deps)) {
            if (typeof version !== 'string') continue;
            if (/^(?:\*|latest|next|file:|git\+|https?:|github:)/i.test(version.trim())) {
              findings.push(issue('NPM_NONREPRODUCIBLE', 'medium', file, 1, 'Dependency source/version may be unstable or nonregistry; verify reproducibility', hash, { subject: validDependencyName(dep) ? dep : '[unusual dependency name]', section }));
            }
          }
        }
        inventory.push({ ecosystem: 'npm', file, counts: packageInfo.dependencies });
        if ((packageInfo.dependencies.dependencies + packageInfo.dependencies.devDependencies) > 0 && !files.some(x => ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'npm-shrinkwrap.json'].includes(x))) {
          findings.push(issue('NPM_NO_LOCKFILE', 'medium', file, 1, 'Dependency manifest has packages but no recognized root lockfile; reproducibility needs review', hash));
        }
      } catch {
        findings.push(issue('MANIFEST_PARSE', 'high', file, 1, 'Invalid JSON package manifest', hash));
      }
    }
    if (file === 'requirements.txt') {
      let count = 0;
      for (const [ix, line] of content.split(/\r?\n/).entries()) {
        const s = line.trim();
        if (!s || s.startsWith('#') || s.startsWith('-')) continue;
        count++;
        if (!/^[-_.a-zA-Z0-9]+(?:\[[^\]]+\])?==[^=]+(?:\s*#.*)?$/.test(s))
          findings.push(issue('PYTHON_UNPINNED', 'medium', file, ix + 1, 'Python dependency is not pinned to an exact version by the basic static rule', hash));
      }
      inventory.push({ ecosystem: 'python', file, counts: { requirements: count } });
    }
    if (path.posix.basename(file).toLowerCase().endsWith('.sql')) {
      inventory.push({ ecosystem: 'sql', file, counts: { lines: content.split(/\r?\n/).length } });
      findings.push(...scanSql(content, file, hash));
    }
    if (file === 'Dockerfile') {
      for (const [index, line] of content.split(/\r?\n/).entries()) {
        const m = line.match(/^\s*FROM\s+(?:--platform=\S+\s+)?(\S+)/i);
        if (m && !m[1].includes('@sha256:') && (!m[1].includes(':') || /:latest$/i.test(m[1]))) {
          findings.push(issue('DOCKER_UNPINNED_BASE', 'medium', file, index + 1, 'Docker base image is not digest pinned; review repeatability', hash));
        }
      }
      inventory.push({ ecosystem: 'containers', file, counts: { dockerfiles: 1 } });
    }
    if (file === 'go.mod') inventory.push({ ecosystem: 'go', file, counts: { requires: (content.match(/^s*(?:requires+)?[w.-/]+.[w.-/]+s+vd[^s]*/gm) || []).length } });
    else if (file === 'composer.json') { try { const c = JSON.parse(content); inventory.push({ ecosystem: 'php', file, counts: { require: Object.keys(c.require ?? {}).length, requireDev: Object.keys(c['require-dev'] ?? {}).length } }); } catch { findings.push(issue('MANIFEST_PARSE', 'high', file, 1, 'Invalid JSON composer manifest', hash)); } }
    else if (file === 'pom.xml' || file.startsWith('build.gradle') || file === 'pyproject.toml' || file === '.tool-versions') inventory.push({ ecosystem: file === 'pom.xml' || file.startsWith('build.gradle') ? 'jvm' : file === 'pyproject.toml' ? 'python' : 'tool-versions', file, counts: { parsed: false } });
  }
  findings.sort((a,b) => a.file.localeCompare(b.file) || a.line - b.line || a.code.localeCompare(b.code));
  const totals = { high: findings.filter(x=>x.severity==='high').length, medium: findings.filter(x=>x.severity==='medium').length, low: findings.filter(x=>x.severity==='low').length };
  return { schema: SCHEMA_SCAN, createdAt: new Date().toISOString(), mode: 'offline-static-read-only', scope: {root:'.', filesRead:sources.length, filesConsidered: files.length}, sourceFiles:sources, inventory, findings, totals, limitations:['No dependency versions were resolved online','No test commands, scripts, codemods, or database migrations were executed','Static SQL patterns are heuristics, not dialect-complete parsing','Static analysis cannot prove runtime compatibility or rollback safety'] };
}
export function parseTarget(spec) {
  if (typeof spec !== 'string') throw new Error('Missing --target');
  if (spec.startsWith('npm:')) {
    const rest = spec.slice(4), at = rest.lastIndexOf('@');
    if (at < 1) throw new Error('Expected target npm:package@version');
    const name = rest.slice(0,at), version=rest.slice(at+1);
    if (!validDependencyName(name) || !validVersion(version)) throw new Error('Invalid npm package or pinned target version');
    return {kind:'npm',name,version};
  }
  if (spec.startsWith('node:')) {
    const version=spec.slice(5);
    if (!validVersion(version)) throw new Error('Invalid Node engine target');
    return {kind:'node-engine',version};
  }
  throw new Error('Only npm:package@version and node:version are supported in the starter');
}
export function createPlan(rootArg, scan, targetText) {
  const root=ensureRoot(rootArg), target=parseTarget(targetText);
  if (scan?.schema!==SCHEMA_SCAN) throw new Error('Expected MigraSutra scan document');
  const pkgSource=scan.sourceFiles.find(x=>x.path==='package.json');
  if (!pkgSource) throw new Error('No safe package.json source found; npm and Node plans require it');
  const current= safeRead(root,'package.json');
  if(sha256(current)!==pkgSource.sha256) throw new Error('Scan is stale: package.json changed');
  let pkg;
  try{pkg=JSON.parse(current)}catch{throw new Error('Invalid package.json for plan');}
  let prior=null, section='engines';
  if (target.kind==='npm') {
    section = ['dependencies','devDependencies','optionalDependencies','peerDependencies'].find(k=>pkg[k]&&Object.prototype.hasOwnProperty.call(pkg[k],target.name));
    if(!section)throw new Error('Target package is not declared; no implicit dependency injection');
    prior=String(pkg[section][target.name]);
    // Some package managers permit credential-bearing URL dependencies.
    // Never copy such values into portable evidence artifacts.
    if (/(:\/\/|(?:token|secret|password)\s*[=:])/i.test(prior)) throw new Error('Unsafe or credential-bearing dependency source; manual review required');
  } else {
    prior = typeof pkg.engines?.node === 'string' ? pkg.engines.node : null;
  }
  const action={kind:'package-json-field-update',file:'package.json',section,key:target.kind==='npm'?target.name:'node',from:prior,to:target.version};
  const staticHigh=scan.findings.filter(f=>f.severity==='high');
  const planId=evidenceId(SCHEMA_PLAN,pkgSource.sha256,JSON.stringify(target));
  return {schema:SCHEMA_PLAN,planId,createdAt:new Date().toISOString(),mode:'proposal-only',target,baseline:{path:'package.json',sha256:pkgSource.sha256},actions:[action],sourceScan:{schema:scan.schema,sourceFiles:scan.sourceFiles.length,highFindings:staticHigh.map(x=>x.id)},risk:{staticHighFindings:staticHigh.length,prerequisites:['Check vendor-supported upgrade path and version release notes','Confirm supported runtime and dependency graph','Preserve verified source-control commit and backups','Run applicable tests in a reviewed isolated environment','Approve rollback and forward-fix playbook']},verification:['Install dependencies inside an isolated approved sandbox; not run by starter','Run unit, integration, contract, performance and migration-specific tests; not run by starter','Check compatibility and deployment/rollback with human reviewers'],rollback:{automatic:false,strategy:'Restore original manifest from version control or verified backup, then restore the lockfile and reinstall in an isolated environment; database rollback needs its own tested recovery procedure'},decision:'REVIEW_REQUIRED',notes:['Version specified by user; no online release compatibility checked','Plan generation does not modify repository or execute tools']};
}
export function rehearsePlan(rootArg, plan) {
  const root=ensureRoot(rootArg);
  if(plan?.schema!==SCHEMA_PLAN)throw new Error('Expected MigraSutra plan');
  const source=safeRead(root,'package.json');
  if(sha256(source)!==plan.baseline?.sha256)throw new Error('Rehearsal refused: source changed since plan');
  const action=plan.actions?.[0];
  // A plan loaded from disk is untrusted: enforce the original target contract.
  if(!plan.target || (plan.target.kind==='npm' && (action?.key!==plan.target.name || action?.to!==plan.target.version)) || (plan.target.kind==='node-engine' && (action?.key!=='node' || action?.to!==plan.target.version)))throw new Error('Plan action does not match approved target');
  if(action?.kind!=='package-json-field-update'||action.file!=='package.json')throw new Error('Unsupported action');
  const pkg=JSON.parse(source);
  if(action.section==='engines'){
    if(String(pkg.engines?.node ?? '')!==String(action.from ?? ''))throw new Error('Plan baseline field differs');
    pkg.engines={...pkg.engines,node:action.to};
  }else{
    if(!['dependencies','devDependencies','optionalDependencies','peerDependencies'].includes(action.section) || !Object.prototype.hasOwnProperty.call(pkg[action.section] ?? {},action.key))throw new Error('Target field disappeared');
    if(String(pkg[action.section][action.key])!==String(action.from))throw new Error('Plan baseline field differs');
    pkg[action.section] = {...pkg[action.section], [action.key]:action.to};
  }
  const changed=JSON.stringify(pkg,null,2)+'\n';
  const tempRoot=fs.mkdtempSync(path.join(os.tmpdir(),'migrasutra-rehearsal-'));
  let verified=false;
  try{
    const p=path.join(tempRoot,'package.json');
    fs.writeFileSync(p,changed,{mode:0o600});
    const roundtrip=JSON.parse(fs.readFileSync(p,'utf8'));
    verified= action.section==='engines' ? roundtrip.engines.node===action.to : roundtrip[action.section][action.key]===action.to;
  }finally{fs.rmSync(tempRoot,{recursive:true,force:true});}
  if(!verified)throw new Error('Static rehearsal transformation failed');
  return {schema:SCHEMA_REHEARSAL,createdAt:new Date().toISOString(),planId:plan.planId,kind:'isolated-static-manifest-rehearsal',result:'STATIC_CHANGE_VERIFIED',source: {path:'package.json',sha256:sha256(source)},transformed:{path:'package.json',sha256:sha256(changed)},change:{section:action.section,key:action.key,from:action.from,to:action.to},tests:{status:'NOT_RUN',reason:'Starter intentionally never runs package installs, builds, tests or migration scripts'},externalEffects:{network:false,sourceRepositoryWritten:false,shellExecution:false},rollback:{status:'DOCUMENTED_NOT_TESTED',action:'Restore original package.json and associated lockfile from verified source-control reference; validate separately'} };
}
export function releaseGate(plan,rehearsal,importedEvidence=null){
  if(plan?.schema!==SCHEMA_PLAN||rehearsal?.schema!==SCHEMA_REHEARSAL)throw new Error('Need plan and rehearsal');
  if(plan.planId!==rehearsal.planId)throw new Error('Plan/rehearsal mismatch');
  const reasons=[];
  if(plan.risk?.staticHighFindings>0) reasons.push('High-severity static findings remain; separate remediation and review needed');
  if(rehearsal.result!=='STATIC_CHANGE_VERIFIED')reasons.push('Static rehearsal did not verify');
  reasons.push('Required build, unit, integration and migration-specific tests have not been executed by MigraSutra');
  reasons.push('Rollback strategy has not been independently rehearsed');
  if(importedEvidence)reasons.push('Imported evidence is external and not independently attested by this starter');
  return {schema:'migrasutra.gate/v1',createdAt:new Date().toISOString(),planId:plan.planId,decision:plan.risk?.staticHighFindings>0||rehearsal.result!=='STATIC_CHANGE_VERIFIED'?'NO_GO':'REVIEW_REQUIRED',observed:{staticRehearsal:rehearsal.result,importedEvidence:importedEvidence?'UNVERIFIED_EXTERNAL':'NONE',automaticTests:'NOT_RUN',rollbackTest:'NOT_RUN'},reasons,humanApprovalRequired:true};
}
export function compareScans(before,after){
  if(before?.schema!==SCHEMA_SCAN||after?.schema!==SCHEMA_SCAN)throw new Error('Expected scan documents');
  const a=new Set(before.findings.map(x=>x.id)),b=new Set(after.findings.map(x=>x.id));
  return {schema:'migrasutra.compare/v1',createdAt:new Date().toISOString(),introduced:after.findings.filter(x=>!a.has(x.id)),resolved:before.findings.filter(x=>!b.has(x.id)),unchanged:after.findings.filter(x=>a.has(x.id)),decision:after.findings.some(x=>x.severity==='high'&&!a.has(x.id))?'REGRESSION':'REVIEW'};
}
export const SCHEMA_AUDIT='migrasutra.audit/v1';
export const TOOL_VERSION='0.2.0';
const SEV_ORDER={high:0,medium:1,low:2};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mdCell=s=>String(s??'').replace(/[|\r\n]/g,' ').replace(/`/g,"'");
/** Compare dotted numeric versions; returns -1, 0 or 1. Pre-release tags sort before the release. */
export function compareVersions(a,b){
  if(!validVersion(String(a))||!validVersion(String(b)))throw new Error('Invalid version');
  const split=v=>{const [core,pre]=v.split(/-(.+)/);return [core.split('.').map(Number),pre];};
  const [x,xp]=split(a),[y,yp]=split(b);
  for(let i=0;i<3;i++){const d=(x[i]??0)-(y[i]??0);if(d)return d<0?-1:1;}
  if(xp===yp)return 0;if(!xp)return 1;if(!yp)return -1;return xp<yp?-1:1;
}
/** Run scan -> optional plan -> rehearsal -> gate as one evidence bundle. Read-only on the repository. */
export function auditRepository(rootArg,targetText=null){
  const scan=scanRepository(rootArg);
  const audit={schema:SCHEMA_AUDIT,toolVersion:TOOL_VERSION,createdAt:new Date().toISOString(),scan,plan:null,rehearsal:null,gate:null,notes:[]};
  if(targetText){
    try{
      audit.plan=createPlan(rootArg,scan,targetText);
      audit.rehearsal=rehearsePlan(rootArg,audit.plan);
      audit.gate=releaseGate(audit.plan,audit.rehearsal);
    }catch(error){audit.notes.push('Plan/rehearsal not produced: '+safeSummary(error.message));}
  }else audit.notes.push('No --target given: scan only. Pass --target npm:pkg@x.y.z or node:NN to add plan, rehearsal and gate.');
  const t=scan.totals;
  audit.summary={verdict:audit.gate?.decision??(t.high>0?'NO_GO':'REVIEW_REQUIRED'),high:t.high,medium:t.medium,low:t.low,filesRead:scan.scope.filesRead,testsExecuted:0};
  return audit;
}
export function renderMarkdown(doc){
  const L=[`# MigraSutra — ${doc.schema}`,``,`Generated: ${doc.createdAt??'unknown'}`,``];
  if(doc.schema===SCHEMA_AUDIT){
    const s=doc.summary;
    L.length=0;
    L.push(`# MigraSutra Audit Report`,``,`Generated: ${doc.createdAt} · tool ${doc.toolVersion} · mode: offline, static, read-only`,``,`## Verdict: \`${s.verdict}\``,``,`| Severity | Count |`,`| --- | --- |`,`| High | ${s.high} |`,`| Medium | ${s.medium} |`,`| Low | ${s.low} |`,``,`Files read: ${s.filesRead} · Target-app tests executed: **${s.testsExecuted}** (MigraSutra never runs them; the verdict is never a deploy approval).`,``);
    L.push(renderMarkdown(doc.scan).split('\n').slice(4).join('\n'));
    for(const k of ['plan','rehearsal','gate'])if(doc[k])L.push(`---`,``,`### ${k[0].toUpperCase()+k.slice(1)}`,``,renderMarkdown(doc[k]).split('\n').slice(4).join('\n'));
    if(doc.notes.length)L.push(`## Notes`,...doc.notes.map(x=>`- ${x}`),``);
    return L.join('\n')+'\n';
  }
  if(doc.schema===SCHEMA_SCAN){
    const f=[...doc.findings].sort((a,b)=>SEV_ORDER[a.severity]-SEV_ORDER[b.severity]);
    L.push(`**Mode:** static only · no migration scripts executed`,``,`## Inventory`,...(doc.inventory.length?doc.inventory.map(x=>`- ${x.ecosystem}: \`${x.file}\``):['- (none detected)']),``,`## Findings (${doc.findings.length})`,``);
    if(f.length)L.push(`| Severity | Rule | Location | Description | Evidence |`,`| --- | --- | --- | --- | --- |`,...f.map(x=>`| ${x.severity.toUpperCase()} | ${x.code} | \`${mdCell(x.file)}:${x.line}\` | ${mdCell(x.description)} | ${x.id} |`));else L.push('No findings from the implemented static rules (this is not proof of safety).');
    L.push(``,`## Not performed`,...doc.limitations.map(x=>`- ${x}`),``);
  }
  else if(doc.schema===SCHEMA_PLAN){L.push(`**Target:** ${doc.target.kind} ${doc.target.name??'engine'} → ${doc.target.version}`,``,`**Decision:** ${doc.decision}`,``,`## Action`,...doc.actions.map(a=>`- ${a.file}: ${a.section}.${a.key} from ${a.from??'(unset)'} to ${a.to}`),``,`## Prerequisites`,...doc.risk.prerequisites.map(x=>`- ${x}`),``,`## Rollback`,doc.rollback.strategy,``);}
  else if(doc.schema===SCHEMA_REHEARSAL){L.push(`**Static rehearsal:** ${doc.result}`,``,`- Source unchanged: ${!doc.externalEffects.sourceRepositoryWritten}`,`- Tests: ${doc.tests.status}`,`- Rollback: ${doc.rollback.status}`,``,`## Change`,`- ${doc.change.section}.${doc.change.key}: ${doc.change.from??'(unset)'} → ${doc.change.to}`,``);}
  else if(doc.schema==='migrasutra.gate/v1')L.push(`**Decision:** ${doc.decision}`,``,...doc.reasons.map(x=>`- ${x}`),``);
  else if(doc.schema==='migrasutra.compare/v1')L.push(`- Introduced: ${doc.introduced.length}`,`- Resolved: ${doc.resolved.length}`,`- Unchanged: ${doc.unchanged.length}`,`- Decision: ${doc.decision}`,``);
  return L.join('\n')+'\n';
}
const CSS=`:root{--bg:#f6f8fb;--fg:#0f172a;--mut:#475569;--card:#fff;--bd:#d9e1ec;--hi:#b42318;--hib:#fee4e2;--me:#93370d;--meb:#fef0c7;--lo:#175cd3;--lob:#d1e9ff;--ok:#067647;--okb:#dcfae6;--ac:#3538cd}@media(prefers-color-scheme:dark){:root{--bg:#0b1220;--fg:#e6edf7;--mut:#9fb0c7;--card:#121b2e;--bd:#25324a;--hi:#fda29b;--hib:#55160c;--me:#fec84b;--meb:#4e2a05;--lo:#84caff;--lob:#0b3a6b;--ok:#6ce9a6;--okb:#053321;--ac:#a4bcfd}}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,-apple-system,Segoe UI,sans-serif}main{max-width:1040px;margin:0 auto;padding:24px 16px 64px}h1{font-size:1.7rem;margin:.2em 0}h2{font-size:1.2rem;margin:1.8em 0 .6em;border-bottom:1px solid var(--bd);padding-bottom:.3em}.sub{color:var(--mut);font-size:.9rem}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:16px 0}.card{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:14px}.card b{display:block;font-size:1.8rem}.badge{display:inline-block;padding:1px 10px;border-radius:99px;font-size:.78rem;font-weight:700;letter-spacing:.03em}.high{color:var(--hi);background:var(--hib)}.medium{color:var(--me);background:var(--meb)}.low{color:var(--lo);background:var(--lob)}.ok{color:var(--ok);background:var(--okb)}.verdict{font-size:1.1rem;padding:4px 14px}table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--bd);border-radius:12px;overflow:hidden;font-size:.9rem}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--bd);vertical-align:top;overflow-wrap:anywhere}th{background:var(--bg);color:var(--mut);font-size:.78rem;text-transform:uppercase}code{font:0.85em ui-monospace,Consolas,monospace}.tw{overflow-x:auto}ul{padding-left:1.2em}.warn{border-left:4px solid var(--ac);background:var(--card);padding:10px 14px;border-radius:8px}:focus-visible{outline:3px solid var(--ac);outline-offset:2px}`;
const sevBadge=s=>`<span class="badge ${esc(s)}">${esc(String(s).toUpperCase())}</span>`;
function htmlScan(d){
  const f=[...d.findings].sort((a,b)=>SEV_ORDER[a.severity]-SEV_ORDER[b.severity]);
  return `<h2>Inventory</h2><ul>${d.inventory.length?d.inventory.map(x=>`<li>${esc(x.ecosystem)}: <code>${esc(x.file)}</code></li>`).join(''):'<li>(none detected)</li>'}</ul><h2>Findings (${f.length})</h2>${f.length?`<div class="tw"><table><thead><tr><th>Severity</th><th>Rule</th><th>Location</th><th>Description</th><th>Evidence</th></tr></thead><tbody>${f.map(x=>`<tr><td>${sevBadge(x.severity)}</td><td><code>${esc(x.code)}</code></td><td><code>${esc(x.file)}:${esc(x.line)}</code></td><td>${esc(x.description)}</td><td><code>${esc(x.id)}</code></td></tr>`).join('')}</tbody></table></div>`:'<p>No findings from the implemented static rules. This is not proof of safety.</p>'}<h2>Not performed</h2><ul>${d.limitations.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
}
export function renderHtml(doc){
  let body;
  const title=doc.schema===SCHEMA_AUDIT?'Audit Report':'Evidence Report';
  if(doc.schema===SCHEMA_AUDIT){
    const s=doc.summary,cls=s.verdict==='NO_GO'?'high':'medium';
    body=`<p>Verdict <span class="badge verdict ${cls}">${esc(s.verdict)}</span></p><div class="cards"><div class="card"><span class="sub">High</span><b>${s.high}</b></div><div class="card"><span class="sub">Medium</span><b>${s.medium}</b></div><div class="card"><span class="sub">Low</span><b>${s.low}</b></div><div class="card"><span class="sub">Files read</span><b>${s.filesRead}</b></div><div class="card"><span class="sub">App tests executed</span><b>${s.testsExecuted}</b></div></div><p class="warn">MigraSutra is offline, static and read-only. It never runs target-application tests, so the verdict is a review signal, never a deploy approval.</p>${htmlScan(doc.scan)}`;
    if(doc.plan)body+=`<h2>Plan</h2><p>${esc(doc.plan.target.kind)} ${esc(doc.plan.target.name??'engine')} → <code>${esc(doc.plan.target.version)}</code> · decision ${esc(doc.plan.decision)}</p><ul>${doc.plan.actions.map(a=>`<li><code>${esc(a.file)}</code> ${esc(a.section)}.${esc(a.key)}: ${esc(a.from??'(unset)')} → ${esc(a.to)}</li>`).join('')}</ul><p><b>Prerequisites</b></p><ul>${doc.plan.risk.prerequisites.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
    if(doc.rehearsal)body+=`<h2>Static rehearsal</h2><p><span class="badge ok">${esc(doc.rehearsal.result)}</span> tests: <b>${esc(doc.rehearsal.tests.status)}</b> · rollback: <b>${esc(doc.rehearsal.rollback.status)}</b> · source repo written: <b>${doc.rehearsal.externalEffects.sourceRepositoryWritten}</b></p>`;
    if(doc.gate)body+=`<h2>Release gate</h2><p>${esc(doc.gate.decision)} · human approval required</p><ul>${doc.gate.reasons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
    if(doc.notes.length)body+=`<h2>Notes</h2><ul>${doc.notes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  }else if(doc.schema===SCHEMA_SCAN)body=`<div class="cards"><div class="card"><span class="sub">High</span><b>${doc.totals.high}</b></div><div class="card"><span class="sub">Medium</span><b>${doc.totals.medium}</b></div><div class="card"><span class="sub">Low</span><b>${doc.totals.low}</b></div></div>`+htmlScan(doc);
  else body=`<pre>${esc(renderMarkdown(doc))}</pre>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>MigraSutra ${title}</title><style>${CSS}</style></head><body><main><p class="sub">MigraSutra AI · Upgrade with Evidence</p><h1>${title}</h1><p class="sub">Generated ${esc(doc.createdAt??'unknown')} · schema <code>${esc(doc.schema)}</code></p>${body}</main></body></html>`;
}
