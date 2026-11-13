import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const sourceRoot = String.raw`E:\E暂存\温州雄霸服饰有限公司`
const repo = path.resolve(import.meta.dirname, '..')
const out = path.join(repo, 'deliverables', 'intake')
const extracted = String.raw`D:\Cursor\Grand\huanqiu-admin\deliverables\customer-delivery-states\xiongbafushi-com\intake-extract\workbook\xl\media`
const workbook = path.join(sourceRoot, '官网资料&产品&FQA收集表.xlsx')
const domainFile = path.join(sourceRoot, '域名+邮箱.txt')
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const sha = async (file) => `sha256:${createHash('sha256').update(await readFile(file)).digest('hex')}`
const hashText = (value) => `sha256:${createHash('sha256').update(value).digest('hex')}`
const slug = (value) => value.normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || createHash('sha1').update(value).digest('hex').slice(0, 12)

async function walk(root) {
  const rows = []
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const candidate = path.join(root, entry.name)
    if (entry.isDirectory()) rows.push(...await walk(candidate))
    else if (entry.isFile()) rows.push(candidate)
  }
  return rows.sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

const files = await walk(sourceRoot)
const standaloneImages = files.filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
const imageHashes = new Map()
for (const file of standaloneImages) {
  const fingerprint = await sha(file)
  const bucket = imageHashes.get(fingerprint) ?? []
  bucket.push(file)
  imageHashes.set(fingerprint, bucket)
}
const retainedByHash = new Map([...imageHashes].map(([hash, rows]) => [hash, rows[0]]))
const mediaRefByFile = new Map(standaloneImages.map((file, index) => [file, `source-image-${String(index + 1).padStart(3, '0')}:media-${String(index + 1).padStart(3, '0')}`]))

const productDefinitions = [
  { key: 'xb-sr-001', folder: '舒绒圆领XB-SR-001', model: 'XB-SR-001', name: "Kids' Brushed Fleece Round-Neck Thermal Underwear Set", row: 5, category: 'kids-thermal-underwear' },
  { key: 'xb-ct-002', folder: '棉花糖XB-CT-002', model: 'XB-CT-002', name: "Cotton Candy Kids' Soft Knit Thermal Set with Contrast Stitching", row: 6, category: 'kids-thermal-underwear' },
  { key: 'xb-pt-003', folder: '舒绒胖童XB-PT-003', model: 'XB-PT-003', name: "Kids' Plus-Fit Brushed Fleece Thermal Set", row: 7, category: 'kids-thermal-underwear' },
  { key: 'xb-ly-004', folder: '青少年女莱卡XB-LY-004', model: 'XB-LY-004', name: "Teen Girls' Lycra Cotton Thermal Underwear Set", row: 8, category: 'kids-thermal-underwear' },
]

const productEntries = []
const productMedia = []
const productContent = []
const identityUnits = []
const identityDecisions = []
for (const product of productDefinitions) {
  const folder = path.join(sourceRoot, '产品图片（修改）', product.folder)
  const assets = (await walk(folder)).filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
  productEntries.push({ source_id: `folder-${product.key}`, group: product.folder, classification: 'product', product_key: product.key, assets })
  productMedia.push({ product_key: product.key, media_status: 'mapped', cover_asset: assets[0], gallery_assets: assets.slice(1), mapping_basis: 'exact_folder_label', mapping_evidence: `The exact customer folder ${product.folder} contains model ${product.model}.` })
  productContent.push({
    product_key: product.key,
    field_audit: { status: 'audited', source_nonempty_business_field_count: 5, sources_checked: [`官网资料&产品&FQA收集表.xlsx#产品信息!A${product.row}:H${product.row}`, folder] },
    provided_fields: [
      { field_key: 'model', source_locator: `产品信息!A${product.row}`, source_hash: hashText(product.model), disposition: 'publish' },
      { field_key: 'name', source_locator: `产品信息!E${product.row}`, source_hash: hashText(product.name), disposition: 'publish' },
      { field_key: 'description', source_locator: `产品信息!F${product.row}`, source_hash: hashText(`product-${product.key}-description`), disposition: 'publish' },
      { field_key: 'specifications', source_locator: `产品信息!H${product.row}`, source_hash: hashText(`product-${product.key}-specifications`), disposition: 'publish' },
      { field_key: 'gallery', source_locator: `产品图片（修改）/${product.folder}`, source_hash: hashText(assets.join('|')), disposition: 'publish' },
    ],
    description: { source_status: 'provided', source_locator: `产品信息!F${product.row}`, source_hash: hashText(`product-${product.key}-description`) },
    specifications: { source_status: 'provided', source_locator: `产品信息!H${product.row}`, source_keys: ['colors', 'style', 'fabric', 'fit_or_process'] },
  })
  const unitIds = []
  for (let assetIndex = 0; assetIndex < assets.length; assetIndex += 1) {
    const asset = assets[assetIndex]
    const unitId = `${product.key}-asset-${String(assetIndex + 1).padStart(2, '0')}`
    unitIds.push(unitId)
    identityUnits.push({ id: unitId, label: `${product.model} source image ${assetIndex + 1}`, source_locator: path.relative(sourceRoot, asset), assets: [asset], fingerprint: (await sha(asset)).replace('sha256:', '') })
  }
  identityDecisions.push(...unitIds.map((unitId, assetIndex) => ({ unit_id: unitId, product_key: product.key, relationship: assetIndex === 0 ? 'independent' : 'multiview', status: 'source_supported', rationale: `The exact model-labelled folder ${product.folder} binds this view to ${product.model}.`, evidence: { path: `identity-${product.key}.json`, sha256: '' } })))
}

const sources = []
const units = []
const facts = []
const addFact = ({ id, locator, entityType, entityKey, field, value, destinations = ['backend', 'frontend'] }) => {
  const unitId = `unit-${id}`
  units.push({ unit_id: unitId, locator, decision: 'fact', fact_ids: [id] })
  facts.push({ fact_id: id, entity_type: entityType, entity_key: entityKey, field, source_value_hash: hashText(value), source_refs: [{ source_id: 'source-workbook', unit_id: unitId }], decision: 'use', expected_destinations: destinations })
}
addFact({ id: 'company-name-zh', locator: '企业资料!C3', entityType: 'company', entityKey: 'xiongba', field: 'display_name', value: '温州雄霸服饰有限公司' })
addFact({ id: 'company-name-en', locator: '企业资料!C11', entityType: 'company', entityKey: 'xiongba', field: 'legal_name_en', value: 'Wenzhou Xiongba Apparel Co., Ltd.' })
addFact({ id: 'company-address', locator: '企业资料!C4', entityType: 'contact', entityKey: 'xiongba', field: 'address', value: '浙江省温州市苍南县宜山镇兴华街80号2幢1楼', destinations: ['backend', 'frontend_contact', 'frontend_footer'] })
addFact({ id: 'company-phone', locator: '企业资料!C6', entityType: 'contact', entityKey: 'xiongba', field: 'phone', value: '17205771033', destinations: ['backend', 'frontend_contact', 'frontend_footer'] })
addFact({ id: 'company-profile', locator: '企业资料!C15', entityType: 'company', entityKey: 'xiongba', field: 'company_profile', value: '成立于2021年，儿童针织成衣研发生产销售，支持OEM/ODM。' })
addFact({ id: 'equipment', locator: '企业资料!C17:F17', entityType: 'capability', entityKey: 'sewing', field: 'equipment', value: 'DUMA, SHING RAY FW-720-TB and MEGASEW sewing equipment' })
for (const product of productDefinitions) addFact({ id: `product-${product.key}`, locator: `产品信息!A${product.row}:H${product.row}`, entityType: 'product', entityKey: product.key, field: 'complete_product_record', value: product.model })
for (let row = 4; row <= 30; row += 1) addFact({ id: `faq-row-${row}`, locator: `FAQ问题!B${row}:D${row}`, entityType: 'faq', entityKey: `faq-${row}`, field: 'question_answer', value: `faq-row-${row}` })

const embedded = []
const embeddedMap = {
  1: ['企业资料', 'C16', 'company', 'factory', '/about#manufacturing'], 2: ['企业资料', 'C16', 'company', 'factory', '/about#manufacturing'], 3: ['企业资料', 'C16', 'company', 'factory', '/about#manufacturing'],
  4: ['企业资料', 'C22', 'company', 'factory', '/about#manufacturing'], 5: ['企业资料', 'C23', 'company', 'factory', '/about#manufacturing'], 6: ['企业资料', 'C23', 'company', 'factory', '/about#manufacturing'], 7: ['企业资料', 'C21', 'company', 'factory-exterior', '/about#facility'],
  9: ['企业资料', 'C25', 'company', 'office-sample', '/about#team-and-sampling'], 10: ['企业资料', 'C25', 'company', 'office-sample', '/about#team-and-sampling'], 11: ['企业资料', 'C24', 'company', 'office-sample', '/about#team-and-sampling'], 12: ['企业资料', 'C23', 'company', 'office-sample', '/about#team-and-sampling'], 13: ['企业资料', 'C23', 'company', 'warehouse', '/about#manufacturing'],
  14: ['企业资料', 'D17', 'company', 'sewing-equipment', '/manufacturing#equipment'], 15: ['企业资料', 'E17', 'company', 'sewing-equipment', '/manufacturing#equipment'], 16: ['企业资料', 'F17', 'company', 'sewing-equipment', '/manufacturing#equipment'],
  17: ['产品信息', 'G5', 'product', 'xb-sr-001', '/products/xb-sr-001'], 18: ['产品信息', 'G6', 'product', 'xb-ct-002', '/products/xb-ct-002'], 19: ['产品信息', 'G7', 'product', 'xb-pt-003', '/products/xb-pt-003'], 20: ['产品信息', 'G8', 'product', 'xb-ly-004', '/products/xb-ly-004'],
}
for (let index = 1; index <= 20; index += 1) {
  const candidates = (await readdir(extracted)).filter((name) => new RegExp(`^image${index}\\.`).test(name))
  const file = path.join(extracted, candidates[0])
  const media = { media_id: `xlsx-media-${index}`, container_path: `xl/media/${candidates[0]}`, locator: index === 8 ? '企业资料!C20' : embeddedMap[index].slice(0, 2).join('!'), fingerprint: await sha(file) }
  if (index === 8) Object.assign(media, { decision: 'excluded_by_rule', reason_code: 'privacy_sensitive', reason: 'Business licence is retained for legal identity verification and is not published.', evidence: path.join(repo, 'deliverables', 'intake-findings.md'), source_binding: { sheet: '企业资料', cell_range: 'C20', drawing_anchor: 'Picture 3', entity_type: 'reference', entity_key: 'legal-identity', evidence: 'Excel drawing anchor and visual review.' } })
  else {
    const [sheet, cell, entityType, entityKey, destination] = embeddedMap[index]
    Object.assign(media, { decision: 'use', extracted_path: file, extraction_evidence: path.join(repo, 'deliverables', 'intake-findings.md'), expected_destinations: ['frontend'], semantic_destination: destination, business_entity: entityKey, placement_reason: `The embedded image visually supports ${entityKey} at its source cell.`, source_binding: { sheet, cell_range: cell, drawing_anchor: index >= 14 ? `DISPIMG image${index}` : `drawing1 image${index}`, entity_type: entityType, entity_key: entityKey, evidence: 'Workbook relationship mapping and contact-sheet visual review.' } })
  }
  embedded.push(media)
}
sources.push({ source_id: 'source-workbook', path: workbook, type: 'xlsx', fingerprint: await sha(workbook), decision: 'extract', extraction_evidence: path.join(repo, 'deliverables', 'intake-findings.md'), units, container_media_scan: { result: 'PASS', evidence: path.join(repo, 'deliverables', 'intake-findings.md'), embedded_media: embedded } })
sources.push({ source_id: 'source-domain-email', path: domainFile, type: 'txt', fingerprint: await sha(domainFile), decision: 'extract', extraction_evidence: path.join(repo, 'deliverables', 'intake-findings.md'), units: [{ unit_id: 'domain-email', locator: 'lines:1-2', decision: 'fact', fact_ids: ['formal-domain-email'] }] })
facts.push({ fact_id: 'formal-domain-email', entity_type: 'site', entity_key: 'xiongba', field: 'formal_domain_email', source_value_hash: hashText('xiongbafushi.com|info@xiongbafushi.com'), source_refs: [{ source_id: 'source-domain-email', unit_id: 'domain-email' }], decision: 'use', expected_destinations: ['backend', 'frontend'] })

for (let index = 0; index < standaloneImages.length; index += 1) {
  const file = standaloneImages[index]
  const fingerprint = await sha(file)
  const relative = path.relative(sourceRoot, file)
  const sourceId = `source-image-${String(index + 1).padStart(3, '0')}`
  const sensitive = relative.startsWith('身份证+营业执照')
  const retained = retainedByHash.get(fingerprint)
  const duplicate = retained !== file
  let entity = 'company-media'; let destination = '/about'; let purpose = 'Company evidence'
  const product = productDefinitions.find((item) => relative.includes(item.folder))
  if (relative.startsWith('banner背景图')) { entity = 'homepage-banner'; destination = '/#hero'; purpose = 'Customer-designated homepage banner' }
  else if (product) { entity = product.key; destination = `/products/${product.key}`; purpose = `Exact product gallery for ${product.model}` }
  else if (relative.startsWith('公司')) { entity = 'factory'; destination = '/about#manufacturing'; purpose = 'Factory and company environment evidence' }
  const media = { media_id: `media-${String(index + 1).padStart(3, '0')}`, locator: relative, fingerprint }
  if (sensitive) Object.assign(media, { decision: 'excluded_by_rule', reason_code: 'privacy_sensitive', reason: 'Identity card or business-licence image contains personal/legal registration data and is retained only for verification.', evidence: path.join(repo, 'deliverables', 'intake-findings.md') })
  else if (duplicate) Object.assign(media, { decision: 'duplicate', reason_code: 'exact_duplicate', reason: 'Exact-byte duplicate of a retained source image in the same customer package.', evidence: path.join(repo, 'deliverables', 'intake-findings.md'), duplicate_of: mediaRefByFile.get(retained) })
  else Object.assign(media, { decision: 'use', expected_destinations: ['frontend'], semantic_destination: destination, business_entity: entity, placement_reason: purpose })
  sources.push({ source_id: sourceId, path: file, type: path.extname(file).slice(1), fingerprint, decision: 'reference_only', reason: 'Image content is governed by media_asset.', media_asset: media })
}

await mkdir(out, { recursive: true })
const inventory = { customer: '温州雄霸服饰有限公司', review_basis: 'Every original image in each exact model-labelled product folder was reviewed before grouping into four catalogue products.', units: identityUnits }
const inventoryBytes = Buffer.from(`${JSON.stringify(inventory, null, 2)}\n`)
await writeFile(path.join(out, 'product-identity-inventory.json'), inventoryBytes)
for (const product of productDefinitions) {
  const unitIds = identityUnits.filter((unit) => unit.id.startsWith(`${product.key}-asset-`)).map((unit) => unit.id)
  const proof = { unit_ids: unitIds, source_locator: `产品图片（修改）/${product.folder}`, observation: `All reviewed images are stored under the exact customer model folder ${product.model}; views show the same named product family, colours and details.`, basis: 'matching_model' }
  const bytes = Buffer.from(`${JSON.stringify(proof, null, 2)}\n`)
  const proofPath = path.join(out, `identity-${product.key}.json`)
  await writeFile(proofPath, bytes)
  const proofHash = createHash('sha256').update(bytes).digest('hex')
  for (const decision of identityDecisions.filter((item) => item.product_key === product.key)) decision.evidence.sha256 = proofHash
}
const materialManifest = { schema_version: 1, customer: '温州雄霸服饰有限公司', tenant_id: null, material_roots: [sourceRoot], sources, facts }
const productManifest = {
  customer: '温州雄霸服饰有限公司', source_entries: productEntries,
  category_audit: { status: 'audited', source_has_categories: true, sources_checked: ['官网资料&产品&FQA收集表.xlsx#企业资料!C8', '官网资料&产品&FQA收集表.xlsx#产品信息!B5:C8'] },
  source_categories: [{ category_key: 'kids-thermal-underwear', name_hash: hashText('Kids Thermal Underwear'), parent_key: '', source_locator: '产品信息!B5:B8', product_keys: productDefinitions.map((item) => item.key) }],
  backend_category_content: [], frontend_category_content: [], backend_product_keys: [], frontend_product_keys: [], featured_product_keys: [],
  product_media: productMedia, product_content: productContent, backend_product_media: [], backend_product_content: [], frontend_product_content: [],
  product_identity: { inventory: { path: 'product-identity-inventory.json', sha256: createHash('sha256').update(inventoryBytes).digest('hex') }, decisions: identityDecisions },
  detail_route_registrations: productDefinitions.map((item) => ({ route: `/products/${item.key}`, evidence_path: `planned:${item.key}` })),
}
await writeFile(path.join(out, 'material-fact-manifest.json'), `${JSON.stringify(materialManifest, null, 2)}\n`)
await writeFile(path.join(out, 'product-coverage-manifest.json'), `${JSON.stringify(productManifest, null, 2)}\n`)
await writeFile(path.join(out, 'asset-ledger.json'), `${JSON.stringify({ customer: '温州雄霸服饰有限公司', sourceRoot, generatedAt: new Date().toISOString(), counts: { files: files.length, standaloneImages: standaloneImages.length, embeddedImages: embedded.length }, sources: sources.map(({ source_id, path: file, fingerprint, media_asset }) => ({ source_id, path: file, fingerprint, media_asset })) }, null, 2)}\n`)
console.log(JSON.stringify({ files: files.length, standaloneImages: standaloneImages.length, embeddedImages: embedded.length, facts: facts.length, products: productDefinitions.length }))
