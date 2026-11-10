#!/usr/bin/env node
/** Copyright 2026 Vatsal Shah. Apache-2.0. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {auditRepository,TOOL_VERSION,scanRepository,createPlan,rehearsePlan,releaseGate,compareScans,renderHtml,renderMarkdown} from '../core/index.mjs';
import {startServer} from '../server/index.mjs';

export const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const skillHostPaths={claude:'.claude/skills',cursor:'.cursor/skills',codex:'.agents/skills',gemini:'.gemini/skills',copilot:'.github/skills',generic:'.agents/skills'};
export function parseArgs(argv){const opts={_:[]};for(let i=0;i<argv.length;i++){const t=argv[i];if(t.startsWith('--')){const key=t.slice(2);if(!/^[a-z][a-z-]*$/.test(key))throw new Error('Invalid option');if(i+1>=argv.length||argv[i+1].startsWith('--'))throw new Error(`Missing value for ${t}`);opts[key]=argv[++i];}else opts._.push(t);}return opts;}
export function installSkills(host,target,source=projectRoot){
  if(!skillHostPaths[host])throw new Error('Unsupported IDE host');
  const root=fs.realpathSync(target);
  if(!fs.statSync(root).isDirectory())throw new Error('Target is not a directory');
  const base=path.join(root,skillHostPaths[host]);
  const sourceSkills=path.join(source,'skills');
  const names=fs.readdirSync(sourceSkills).filter(n=>fs.existsSync(path.join(sourceSkills,n,'SKILL.md')));
  // Never overwrite prior skill installations; refuse symbolic-link segments.
  let current=root;
  for(const part of skillHostPaths[host].split('/')){
    current=path.join(current,part);
    if(fs.existsSync(current)&&fs.lstatSync(current).isSymbolicLink())throw new Error('Refusing symlinked install location');
  }
  for(const name of names){if(fs.existsSync(path.join(base,name)))throw new Error(`Skill already exists: ${name}`);}
  fs.mkdirSync(base,{recursive:true});
  for(const name of names)fs.cpSync(path.join(sourceSkills,name),path.join(base,name),{recursive:true,errorOnExist:true,force:false});
  return {host,installed:names.length,relativePath:skillHostPaths[host],note:'Files copied; IDE-native discovery and execution must be validated independently'};
}
function readJson(p){const s=fs.statSync(p);if(s.size>2*1024*1024)throw new Error('Input too large');return JSON.parse(fs.readFileSync(p,'utf8'));}
export function help(){return `MigraSutra AI — safe migration intelligence \n\nCommands:\n  doctor\n  scan     --root PATH --out FILE [--format json|md|html]\n  plan     --root PATH --scan FILE --target npm:pkg@1.2.3 --out FILE\n  plan     --root PATH --scan FILE --target node:22 --out FILE\n  rehearse --root PATH --plan FILE --out FILE\n  gate     --plan FILE --rehearsal FILE --out FILE [--evidence FILE]\n  compare  --before FILE --after FILE --out FILE\n  render   --input FILE --out FILE --format md|html\n  skills   --host claude|cursor|codex|gemini|copilot|generic --root PATH\n  serve    --report FILE --port 8787   (requires MIGRASUTRA_SERVER_TOKEN)\n\nStatic analysis and rehearsal do not execute project scripts or alter repository files.\n`;}
function save(p,obj,format='json'){
  if(!p)throw new Error('--out is required');
  const content=format==='json'?JSON.stringify(obj,null,2)+'\n':format==='md'?renderMarkdown(obj):format==='html'?renderHtml(obj):null;
  if(content===null)throw new Error('Unsupported output format');
  fs.mkdirSync(path.dirname(path.resolve(p)),{recursive:true});
  fs.writeFileSync(p,content,{mode:0o600});
}
export async function run(argv=process.argv.slice(2)){
  const [cmd,...rest]=argv;
  if(['version','--version','-v'].includes(cmd)){console.log(TOOL_VERSION);return 0;}
  if(!cmd||['help','--help','-h'].includes(cmd)){console.log(help());return 0;}
  const o=parseArgs(rest);
  if(cmd==='doctor'){console.log(JSON.stringify({product:'MigraSutra AI',version:TOOL_VERSION,node:process.version,platform:process.platform,architecture:os.arch(),offline:true,sourceCodeExecution:false,implemented:['scan','audit-md-html','plan','rehearse-static','gate-review','compare','render','skills-install','localhost-report-api'],planned:['live-codemods','DB-rehearsal','container-test-runner','multi-tenant-server']},null,2));return 0;}
  if(cmd==='skills'){console.log(JSON.stringify(installSkills(o.host,o.root ?? '.'),null,2));return 0;}
  if(cmd==='serve'){await startServer({reportPath:o.report,port:Number(o.port??8787),token:process.env.MIGRASUTRA_SERVER_TOKEN});return 0;}
  if(cmd==='audit'){
    if(!o.out)throw new Error('--out DIR is required');
    const a=auditRepository(o.root??'.',o.target??null);
    fs.mkdirSync(o.out,{recursive:true});
    save(path.join(o.out,'audit.json'),a,'json');save(path.join(o.out,'audit.md'),a,'md');save(path.join(o.out,'audit.html'),a,'html');
    console.log(`audit completed: ${o.out} (audit.json, audit.md, audit.html)`);console.log(`Verdict: ${a.summary.verdict} (high ${a.summary.high}, medium ${a.summary.medium}, low ${a.summary.low})`);
    return o.fail==='high'&&a.summary.high>0?1:0;
  }
  let result;
  if(cmd==='scan')result=scanRepository(o.root??'.');
  else if(cmd==='plan')result=createPlan(o.root??'.',readJson(o.scan),o.target);
  else if(cmd==='rehearse')result=rehearsePlan(o.root??'.',readJson(o.plan));
  else if(cmd==='gate')result=releaseGate(readJson(o.plan),readJson(o.rehearsal),o.evidence?readJson(o.evidence):null);
  else if(cmd==='compare')result=compareScans(readJson(o.before),readJson(o.after));
  else if(cmd==='render')result=readJson(o.input);
  else throw new Error(`Unknown command: ${cmd}`);
  save(o.out,result,o.format??(cmd==='render'?'md':'json'));
  console.log(`${cmd} completed: ${o.out}`);
  if(cmd==='gate')console.log(`Release recommendation: ${result.decision}`);
  return 0;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))run().then(code=>process.exitCode=code).catch(error=>{console.error('MigraSutra:',error.message);process.exitCode=2;});
