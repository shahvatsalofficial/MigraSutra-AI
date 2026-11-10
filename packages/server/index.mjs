/** Localhost read-only evidence server. No remote binding. Apache-2.0. */
import http from 'node:http';
import fs from 'node:fs';
import crypto from 'node:crypto';
export function authorized(a,b){if(!a||!b)return false;const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y);}
export async function startServer({reportPath,port=8787,token}){
  if(!token||token.length<16)throw new Error('Set MIGRASUTRA_SERVER_TOKEN (16+ chars)');
  if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid TCP port');
  if(!reportPath)throw new Error('A report path is required');
  const reportStat=fs.statSync(reportPath);
  if(!reportStat.isFile()||reportStat.size>2*1024*1024)throw new Error('Invalid report file');
  const report=JSON.parse(fs.readFileSync(reportPath,'utf8'));
  const server=http.createServer((req,res)=>{
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
    if(req.method!=='GET'){res.writeHead(405);res.end('Method Not Allowed');return;}
    const auth=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):'';
    if(!authorized(auth,token)){res.writeHead(401,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'unauthorized'}));return;}
    if(req.url==='/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({status:'ok',localOnly:true}));return;}
    if(req.url==='/report'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(report));return;}
    res.writeHead(404);res.end('Not Found');
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
  console.log(`MigraSutra local read-only server listening at http://127.0.0.1:${port}`);
  return server;
}
