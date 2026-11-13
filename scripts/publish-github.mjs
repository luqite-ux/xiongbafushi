import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
const env={}; for(const line of fs.readFileSync('D:/Cursor/Grand/huanqiu-admin/_migrate-batch/.env','utf8').split(/\r?\n/)){const m=line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);if(m)env[m[1]]=m[2].trim().replace(/^(['"])(.*)\1$/,'$2')}
const token=env.GITHUB_TOKEN; if(!token) throw new Error('Missing company GitHub token')
const headers={Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','User-Agent':'Codex-Xiongba-delivery'}
async function api(url,options={}){const response=await fetch(url,{...options,headers:{...headers,...options.headers}});const body=await response.json().catch(()=>({}));return{response,body}}
const identity=await api('https://api.github.com/user'); if(!identity.response.ok||identity.body.login!=='luqite-ux')throw new Error(`Company token identity failed: HTTP ${identity.response.status}, login=${identity.body.login??'unknown'}`)
let repo=await api('https://api.github.com/repos/luqite-ux/xiongbafushi'); if(repo.response.status===404)repo=await api('https://api.github.com/user/repos',{method:'POST',body:JSON.stringify({name:'xiongbafushi',private:false,description:'Wenzhou Xiongba Apparel B2B website'})}); if(!repo.response.ok||repo.body.owner?.login!=='luqite-ux')throw new Error(`Repository check failed: ${repo.response.status}`)
const remote='https://github.com/luqite-ux/xiongbafushi.git'; const existing=spawnSync('git',['remote','get-url','origin'],{encoding:'utf8'}); spawnSync('git',existing.status===0?['remote','set-url','origin',remote]:['remote','add','origin',remote],{stdio:'inherit'})
const auth=Buffer.from(`x-access-token:${token}`).toString('base64'); const push=spawnSync('git',['-c','credential.helper=','-c',`http.extraHeader=Authorization: Basic ${auth}`,'push','-u','origin','main'],{stdio:'inherit'}); if(push.status!==0)throw new Error(`Git push failed ${push.status}`)
const sha=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).stdout.trim(); const branch=await api('https://api.github.com/repos/luqite-ux/xiongbafushi/branches/main'); if(!branch.response.ok||branch.body.commit?.sha!==sha)throw new Error('Remote SHA mismatch')
console.log(JSON.stringify({result:'PASS',identity:identity.body.login,repository:repo.body.full_name,sha}))
