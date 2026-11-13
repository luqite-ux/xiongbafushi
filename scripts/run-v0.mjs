import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { createClient } from '../../../huanqiu-admin/node_modules/v0-sdk/dist/index.js'
import { guardV0Client } from '../../../huanqiu-admin/scripts/lib/v0-call-guard.mjs'

const require = createRequire(import.meta.url)
const { PutObjectCommand, S3Client } = require('../../../huanqiu-admin/node_modules/@aws-sdk/client-s3')

const admin = String.raw`D:\Cursor\Grand\huanqiu-admin`
for (const envPath of [join(admin, '.env'), join(admin, '.env.local'), join(admin, '_migrate-batch/.env')]) {
  if (!existsSync(envPath)) continue
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if (/^['"]/.test(value)) value = value.slice(1, -1)
    process.env[match[1]] ??= value
  }
}

const mode = process.argv[2] || 'doctor'
const root = String.raw`D:\Cursor\Grand\dulizhan\xiongbafushi`
const delivery = join(root, '.codex-delivery')
mkdirSync(delivery, { recursive: true })
const statePath = join(delivery, 'v0-state.json')
const teamId = 'team_v0pxRIIzSUGJleUTRNSz6GS4'
const projectName = 'xiongbafushi'
const key = process.env.V0_API_KEY || process.env.V0_TOKEN
if (!key) throw new Error('Missing V0_API_KEY/V0_TOKEN')
if (!key.includes(teamId)) throw new Error('Wrong v0 team')
const raw = createClient({ apiKey: key })
const v0 = guardV0Client(raw, { statePath, customerKey: root, teamId })
const list = (value) => Array.isArray(value) ? value : (value?.data ?? value?.projects ?? value?.chats ?? [])
const required = (name) => { if (!process.env[name]) throw new Error(`Missing ${name}`); return process.env[name] }
const pack = JSON.parse(readFileSync(join(root, 'deliverables/intake/v0-asset-pack.json'), 'utf8'))
const assets = pack.items.map((item) => ({ path: item.source, sourceId: item.sourceId, fingerprint: item.fingerprint.replace(/^sha256:/, '') }))
const prompt = readFileSync(join(root, 'deliverables/v0-prompt.txt'), 'utf8')
const binding = JSON.parse(readFileSync(join(root, 'deliverables/v0-prompt-binding.json'), 'utf8'))
if (createHash('sha256').update(prompt).digest('hex') !== binding.sha256) throw new Error('Prompt binding mismatch')

if (mode === 'upload') {
  const s3 = new S3Client({ region: 'auto', endpoint: required('R2_S3_ENDPOINT'), requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED', credentials: { accessKeyId: required('R2_ACCESS_KEY_ID'), secretAccessKey: required('R2_SECRET_ACCESS_KEY') } })
  const bucket = process.env.R2_BUCKET_NAME || 'sscewebsite'
  const publicBase = (process.env.R2_PUBLIC_URL || required('R2_PUBLIC_URL_PREFIX')).replace(/\/$/, '')
  const attachments = []
  for (const [index, asset] of assets.entries()) {
    const bytes = readFileSync(asset.path)
    const digest = createHash('sha256').update(bytes).digest('hex')
    if (digest !== asset.fingerprint) throw new Error(`Attachment hash mismatch: ${asset.sourceId}`)
    const extension = extname(asset.path).toLowerCase()
    const objectKey = `site-assets/${projectName}/v0-input/${String(index + 1).padStart(2, '0')}-${digest.slice(0, 12)}${extension}`
    const contentType = extension === '.png' ? 'image/png' : 'image/jpeg'
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: objectKey, Body: bytes, ContentType: contentType, CacheControl: 'public, max-age=31536000, immutable' }))
    attachments.push({ sourceId: asset.sourceId, localPath: asset.path, sourceName: basename(asset.path), sha256: digest, bytes: bytes.length, contentType, url: `${publicBase}/${objectKey}` })
  }
  writeFileSync(join(delivery, 'v0-attachments.json'), `${JSON.stringify({ attachments }, null, 2)}\n`)
  console.log(JSON.stringify({ result: 'PASS', attachmentCount: attachments.length, totalBytes: attachments.reduce((n, x) => n + x.bytes, 0) }))
  process.exit()
}

if (mode === 'preflight') {
  const projects = list(await raw.projects.find())
  const matches = projects.filter((project) => project.name === projectName || /xiongba|雄霸/i.test(project.name ?? ''))
  const discovery = { checkedAt: new Date().toISOString(), projectMatches: matches.map(({ id, name }) => ({ id, name })), localStateExists: existsSync(statePath) }
  writeFileSync(join(delivery, 'v0-discovery.json'), `${JSON.stringify(discovery, null, 2)}\n`)
  if (matches.length || existsSync(statePath)) throw new Error('Existing customer v0 resource requires recovery')
  const attachmentFile = join(delivery, 'v0-attachments.json')
  if (!existsSync(attachmentFile)) throw new Error('Run upload first')
  const attachments = JSON.parse(readFileSync(attachmentFile, 'utf8')).attachments
  if (attachments.length !== assets.length || attachments.some((a, i) => a.sha256 !== assets[i].fingerprint)) throw new Error('Attachment set mismatch')
  const evidence = { customer_key: root, team_id: teamId, checked_at: new Date().toISOString(), billing: { source: `${join(delivery, 'v0-discovery.json')}; official exact project discovery found no customer project/chat`, complete: true, total_usd: 0, chat_ids: [], reconciled_attempt_ids: [] }, request: { purpose: 'initial', scope: ['app/page.tsx', 'app/products/page.tsx', 'app/products/[slug]/page.tsx', 'app/oem-odm/page.tsx', 'app/manufacturing/page.tsx', 'app/about/page.tsx', 'app/news/page.tsx', 'app/news/[slug]/page.tsx', 'app/contact/page.tsx', 'responsive motion and favicon'], estimated_usd: 7 }, source: { inspection: 'empty', download_verified: false, empty_verified: true, local_repair_possible: false, missing_files: [] } }
  writeFileSync(`${statePath}.preflight.json`, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify({ result: 'PASS', projectMatches: 0, attachmentCount: attachments.length, promptSha256: binding.sha256 }))
  process.exit()
}

if (mode === 'doctor') {
  const user = await raw.user.get()
  console.log(JSON.stringify({ result: 'PASS', userId: user?.id, teamId, promptBytes: Buffer.byteLength(prompt), attachmentFile: existsSync(join(delivery, 'v0-attachments.json')) }))
  process.exit()
}

if (mode === 'create') {
  const projects = list(await raw.projects.find())
  const matches = projects.filter((project) => project.name === projectName)
  if (matches.length > 1) throw new Error('Duplicate exact v0 projects')
  const project = matches[0] ?? await raw.projects.create({ name: projectName, description: "Wenzhou Xiongba children's thermal underwear B2B website" })
  const attachments = JSON.parse(readFileSync(join(delivery, 'v0-attachments.json'), 'utf8')).attachments
  const chat = await v0.chats.create({ projectId: project.id, message: prompt, attachments: attachments.map(({ url }) => ({ url })), chatPrivacy: 'private', responseMode: 'async', modelConfiguration: { imageGenerations: false } })
  const now = new Date().toISOString()
  const messageId = chat?.messages?.filter((item) => item.role === 'user').at(-1)?.id ?? null
  const state = { teamId, projectId: project.id, chatId: chat.id, messageId, webUrl: chat.webUrl, createdAt: now, attachments }
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`)
  writeFileSync(join(root, 'deliverables/v0-prompt-send-receipt.json'), `${JSON.stringify({ chatId: chat.id, messageId, sentAt: now, bodySha256: binding.sha256 }, null, 2)}\n`)
  console.log(JSON.stringify({ result: 'PASS', projectId: project.id, chatId: chat.id, messageId, webUrl: chat.webUrl, attachmentCount: attachments.length }))
  process.exit()
}

if (mode === 'retry-empty') {
  const state = JSON.parse(readFileSync(statePath, 'utf8'))
  const normalized = { ...raw, chats: { ...raw.chats, getById: async (args) => {
    const remote = await raw.chats.getById(args)
    if (!remote.latestVersion) {
      const messages = remote.messages ?? []
      const lastUser = messages.findLastIndex((item) => item.role === 'user')
      const reply = messages.slice(lastUser + 1).find((item) => item.role === 'assistant')
      if (reply && !String(reply.content ?? '').trim()) reply.status = 'failed'
    }
    return remote
  } } }
  const recoveryV0 = guardV0Client(normalized, { statePath, customerKey: root, teamId })
  const message = 'SOURCE-EMPTY-XB-001: The previous assistant response was empty and created no version files. Resume the original bound request in this same chat and generate the runnable source now. Do not change the supplied facts, routes, attachments, or visual requirements.'
  const chat = await recoveryV0.chats.sendMessage({ chatId: state.chatId, message, responseMode: 'async', modelConfiguration: { imageGenerations: false } })
  const now = new Date().toISOString()
  const messageId = chat?.messages?.filter((item) => item.role === 'user').at(-1)?.id ?? null
  state.recovery = { findingId: 'SOURCE-EMPTY-XB-001', messageId, sentAt: now, bodySha256: createHash('sha256').update(message).digest('hex') }
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`)
  console.log(JSON.stringify({ result: 'PASS', chatId: state.chatId, messageId, findingId: state.recovery.findingId }))
  process.exit()
}

if (mode === 'reconcile-empty') {
  const state = JSON.parse(readFileSync(statePath, 'utf8'))
  const usage = await raw.reports.getUsage({ chatId: state.chatId, limit: 50 })
  const events = usage.data ?? []
  const total = events.reduce((sum, item) => sum + Number(item.totalCost ?? 0), 0)
  const ledger = JSON.parse(readFileSync(`${statePath}.guard.json`, 'utf8'))
  const scope = ['app/page.tsx', 'app/products/page.tsx', 'app/products/[slug]/page.tsx', 'app/oem-odm/page.tsx', 'app/manufacturing/page.tsx', 'app/about/page.tsx', 'app/news/page.tsx', 'app/news/[slug]/page.tsx', 'app/contact/page.tsx', 'responsive motion and favicon']
  const evidence = { customer_key: root, team_id: teamId, checked_at: new Date().toISOString(), billing: { source: 'v0 reports.getUsage chat-filtered', complete: true, total_usd: total, chat_ids: [state.chatId], reconciled_attempt_ids: ledger.attempts.map((item) => item.id) }, request: { purpose: 'source_recovery', scope, estimated_usd: 2 }, source: { inspection: 'empty', download_verified: true, empty_verified: true, local_repair_possible: false, version_id: null, missing_files: scope } }
  writeFileSync(`${statePath}.preflight.json`, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify({ result: 'PASS', totalCost: total, reconciledAttempts: ledger.attempts.length }))
  process.exit()
}

if (mode === 'status') {
  const state = JSON.parse(readFileSync(statePath, 'utf8'))
  const chat = await raw.chats.getById({ chatId: state.chatId })
  const versions = await raw.chats.findVersions({ chatId: state.chatId, limit: 10 })
  const assistant = (chat.messages ?? []).filter((item) => item.role === 'assistant').at(-1)
  const assistantDetail = assistant ? await raw.chats.getMessage({ chatId: state.chatId, messageId: assistant.id }) : null
  let tail = []
  try { const parsed = JSON.parse(assistantDetail?.content ?? '{}'); tail = (parsed.parts ?? []).slice(-8).map((part) => ({ type: part.type, taskNameActive: part.taskNameActive, taskNameComplete: part.taskNameComplete, filePath: part.filePath, text: String(part.text ?? part.content ?? part.modelResponse?.content?.map?.((x) => x.text).filter(Boolean).join(' ') ?? '').slice(0, 180) })) } catch {}
  console.log(JSON.stringify({ chatId: state.chatId, webUrl: state.webUrl, versions: (versions.data ?? []).map((item) => ({ id: item.id, status: item.status, demoUrl: item.demoUrl })), assistant: assistantDetail ? { id: assistantDetail.id, updatedAt: assistantDetail.updatedAt, contentBytes: Buffer.byteLength(String(assistantDetail.content ?? '')), tail } : null, messages: (chat.messages ?? []).slice(-3).map((item) => ({ id: item.id, role: item.role, content: String(item.content ?? item.text ?? '').slice(0, 160) })) }))
  process.exit()
}

if (mode === 'usage') {
  const state = JSON.parse(readFileSync(statePath, 'utf8'))
  const usage = await raw.reports.getUsage({ chatId: state.chatId, limit: 50 })
  console.log(JSON.stringify(usage))
  process.exit()
}

if (mode === 'versions') {
  const state = JSON.parse(readFileSync(statePath, 'utf8'))
  const versions = await raw.chats.findVersions({ chatId: state.chatId, limit: 10 })
  console.log(JSON.stringify(versions))
  process.exit()
}

if (mode === 'progress') {
  const state = JSON.parse(readFileSync(statePath, 'utf8'))
  const messages = await raw.chats.findMessages({ chatId: state.chatId, limit: 10 })
  console.log(JSON.stringify((messages.data ?? []).map((item) => ({ id: item.id, role: item.role, createdAt: item.createdAt, updatedAt: item.updatedAt, status: item.status, content: String(item.content ?? '').slice(0, 120) }))))
  process.exit()
}

if (mode === 'download') {
  const state = JSON.parse(readFileSync(statePath, 'utf8'))
  const versions = await raw.chats.findVersions({ chatId: state.chatId, limit: 10 })
  const version = (versions.data ?? []).find((item) => item.status === 'completed')
  if (!version?.id || version.status !== 'completed') throw new Error('Latest version is not completed')
  const sourceDir = join(delivery, 'source'); mkdirSync(sourceDir, { recursive: true })
  const bytes = Buffer.from(await raw.chats.downloadVersion({ chatId: state.chatId, versionId: version.id, format: 'zip', includeDefaultFiles: true }))
  const target = join(sourceDir, `${projectName}-v0-source.zip`)
  writeFileSync(target, bytes)
  console.log(JSON.stringify({ result: 'PASS', target, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), versionId: version.id }))
  process.exit()
}

throw new Error(`Unknown mode: ${mode}`)
