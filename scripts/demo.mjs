import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {auditRepository,scanRepository,createPlan,rehearsePlan,releaseGate,renderHtml,renderMarkdown} from '../packages/core/index.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'examples/reports');fs.mkdirSync(out,{recursive:true});
const clean=path.join(root,'fixtures/clean-app'),risky=path.join(root,'fixtures/risky-app');
const cleanScan=scanRepository(clean),riskyScan=scanRepository(risky);
const plan=createPlan(clean,cleanScan,'npm:small-library@2.0.0'),rehearsal=rehearsePlan(clean,plan),gate=releaseGate(plan,rehearsal);
for(const [name,obj] of Object.entries({cleanScan,riskyScan,plan,rehearsal,gate}))fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(obj,null,2)+'\n');
fs.writeFileSync(path.join(out,'risky-audit.md'),renderMarkdown(riskyScan));
fs.writeFileSync(path.join(out,'risky-audit.html'),renderHtml(riskyScan));
for(const [n,r,t] of [['risky',risky,'node:22'],['clean',clean,'npm:small-library@2.0.0']]){const a=auditRepository(r,t);fs.writeFileSync(path.join(out,`audit-${n}.json`),JSON.stringify(a,null,2)+String.fromCharCode(10));fs.writeFileSync(path.join(out,`audit-${n}.md`),renderMarkdown(a));fs.writeFileSync(path.join(out,`audit-${n}.html`),renderHtml(a));}
console.log(JSON.stringify({clean:cleanScan.totals,risky:riskyScan.totals,staticRehearsal:rehearsal.result,releaseGate:gate.decision,testsRun:'no target application tests'},null,2));
