import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const tenantId = '102601ac-906a-4fc3-9050-0005d104d38c'
const adminRoot = 'D:/Cursor/Grand/huanqiu-admin'

for (const name of ['.env.local', '.env']) {
  const file = path.join(adminRoot, name)
  if (!fs.existsSync(file)) continue
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match || process.env[match[1].trim()]) continue
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error('Supabase service configuration is unavailable')

const db = createClient(url, key, { auth: { persistSession: false } })
const checked = async (request, label) => {
  const { data, error } = await request
  if (error) throw new Error(`${label}: ${error.message}`)
  return data
}

const coverByModel = {
  'XB-SR-001': 'https://pub-c7a22068052144a5805830c30d280128.r2.dev/tenants/xiongbafushi/products/xb-sr-001/6fe4f7d351ece99ca30b73e3.jpg',
  'XB-PT-003': 'https://pub-c7a22068052144a5805830c30d280128.r2.dev/tenants/xiongbafushi/products/xb-pt-003/5b024edd17d0517c377fb104.jpg',
}

const products = await checked(
  db.from('products').select('id,model,image_url,extra_data').eq('tenant_id', tenantId).in('model', Object.keys(coverByModel)),
  'read products',
)
if (products.length !== 2) throw new Error(`Expected 2 products, found ${products.length}`)

for (const product of products) {
  const cover = coverByModel[product.model]
  const images = Array.isArray(product.extra_data?.images) ? product.extra_data.images : []
  if (!images.includes(cover)) throw new Error(`${product.model}: selected cover is not in its verified gallery`)
  const nextImages = [cover, ...images.filter((image) => image !== cover)]
  await checked(
    db.from('products').update({
      image_url: cover,
      extra_data: { ...product.extra_data, images: nextImages },
    }).eq('tenant_id', tenantId).eq('id', product.id),
    `update ${product.model}`,
  )
}

const operator = await checked(
  db.from('admin_users').select('id').eq('tenant_id', tenantId).eq('is_active', true).order('created_at').limit(1).single(),
  'read content operator',
)
const draft = await checked(
  db.from('site_content_drafts').select('revision,definition_version,content').eq('tenant_id', tenantId).single(),
  'read content draft',
)
const faqItems = draft.content?.pages?.home?.modules?.faq?.values?.items
if (!Array.isArray(faqItems)) throw new Error('FAQ content is unavailable')

const replacements = {
  products: 'The current catalogue has four thermal underwear sets for children and teens. Each product page shows the intended wearer, fabric, fit and available product views.',
  details: 'Yes. Product pages include full-garment, model and construction-detail views to help you compare each style before sending an inquiry.',
}
for (const [id, answer] of Object.entries(replacements)) {
  const item = faqItems.find((entry) => entry.id === id)
  if (!item) throw new Error(`Missing FAQ item: ${id}`)
  item.answer = { ...(item.answer || {}), en: answer }
}

const saved = await checked(
  db.rpc('save_site_content_draft', {
    p_tenant_id: tenantId,
    p_expected_revision: draft.revision,
    p_definition_version: draft.definition_version,
    p_content: draft.content,
    p_user_id: operator.id,
  }),
  'save content draft',
)
const revision = typeof saved === 'string' ? saved : saved?.revision
if (!revision) throw new Error('Content save did not return a revision')
const versionId = await checked(
  db.rpc('publish_site_content_draft', {
    p_tenant_id: tenantId,
    p_expected_revision: revision,
    p_user_id: operator.id,
  }),
  'publish content draft',
)

const readback = await checked(
  db.from('products').select('model,image_url').eq('tenant_id', tenantId).in('model', Object.keys(coverByModel)).order('model'),
  'read back products',
)
for (const row of readback) {
  if (row.image_url !== coverByModel[row.model]) throw new Error(`${row.model}: cover readback mismatch`)
}

console.log(JSON.stringify({ result: 'PASS', productCovers: readback, publishedVersionId: versionId }))
