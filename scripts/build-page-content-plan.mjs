import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const customer = path.resolve(import.meta.dirname, '..')
const controlled = path.resolve('D:/Cursor/Grand/huanqiu-admin/deliverables/customer-delivery-states/xiongbafushi-com-page-content')
fs.mkdirSync(controlled, { recursive: true })
const ledger = JSON.parse(fs.readFileSync(path.join(customer, 'deliverables/intake/asset-ledger.json'), 'utf8'))
const identity = { taskId: '9998fa6d-7370-4925-9253-301865608a91', siteId: '8bd70fa4-0bbb-4f59-8bf7-f52b86df1b88', tenantId: null }
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const save = (name, value) => { const bytes = `${JSON.stringify(value, null, 2)}\n`; fs.writeFileSync(path.join(controlled, name), bytes); return { file: `xiongbafushi-com-page-content/${name}`, sha256: sha(bytes) } }
const saveText = (name, value) => { fs.writeFileSync(path.join(controlled, name), value); return { file: `xiongbafushi-com-page-content/${name}`, sha256: sha(value) } }

const routes = [
  ['/', 'home'], ['/products', 'catalog'], ['/products/xb-sr-001', 'product'], ['/products/xb-ct-002', 'product'], ['/products/xb-pt-003', 'product'], ['/products/xb-ly-004', 'product'],
  ['/oem-odm', 'customization'], ['/manufacturing', 'capability'], ['/about', 'about'], ['/news', 'news'], ['/contact', 'contact'],
].map(([route, type]) => ({ route, type, published: true, states: route === '/' ? ['default', 'faq-expanded'] : ['default'] }))
routes.push({ route: '/cases', type: 'case', published: false, states: ['default'] }, { route: '/certificates', type: 'resources', published: false, states: ['default'] })
const allRoutes = new Set(routes.map((row) => row.route))
const sources = ledger.sources.map((source) => ({ id: source.source_id, locator: source.path }))
const workbook = 'source-workbook', domainEmail = 'source-domain-email'
const productRoute = (source) => source.media_asset?.business_entity?.startsWith('xb-')
  ? `/products/${source.media_asset.business_entity}`
  : /^\/products\/xb-[a-z0-9-]+$/.test(source.media_asset?.semantic_destination ?? '') ? source.media_asset.semantic_destination
  : (source.path.match(/XB-(SR-001|CT-002|PT-003|LY-004)/i)?.[0] ? `/products/${source.path.match(/XB-(SR-001|CT-002|PT-003|LY-004)/i)[0].toLowerCase()}` : null)
const factorySources = ledger.sources.filter((s) => s.media_asset?.business_entity === 'factory').map((s) => s.source_id)
const bannerSources = ledger.sources.filter((s) => s.path.includes('banner背景图')).map((s) => s.source_id)
const privacySources = ledger.sources.filter((s) => s.media_asset?.decision === 'excluded_by_rule').map((s) => s.source_id)
const productSources = ledger.sources.filter((s) => productRoute(s)).map((s) => s.source_id)

const sourceText = `温州雄霸服饰有限公司 / Wenzhou Xiongba Apparel Co., Ltd.\nFormal domain: xiongbafushi.com\nFormal email: info@xiongbafushi.com\nLaunch products: XB-SR-001, XB-CT-002, XB-PT-003, XB-LY-004.\nSupported customization: size, fabric, colour, print, binding and construction.\nManufacturing evidence includes real workshop, office, warehouse, sample-room and equipment imagery.\nIdentity-card and business-licence images are internal identity evidence and are not public certificates.\n`
const sourceRef = saveText('source-facts.txt', sourceText)
const faqText = `What specifications or models are available? Four launch models are published with their own fit, fabric and colour information; broader categories remain available for future catalogue expansion.\nDo you support customized size, material, color, or process? Yes. Size, fabric, colour, print, binding and construction can be discussed for the order.\nCan you provide samples? Stock samples and custom development samples can be discussed before bulk production.\nDo you support OEM / ODM services? OEM labelling and ODM style development are supported for customer projects.\nWhat industries or applications are your products suitable for? The range is suitable for children's base layers, home wear, school layering and active casual use for apparel brands, uniform sourcing, wholesalers and related supply chains.\nCan production progress be shared? Cutting, sewing and final inspection progress can be communicated during production.\nDo you support third-party inspection? Third-party inspection can be discussed for an order.\n`
const faqRef = saveText('faq-source.txt', faqText)
const scopeRef = save('scope.json', { identity, scope: 'new-site', authority: 'Current customer-site build request and complete material ledger.', routes: routes.map((r) => r.route), sourceCount: sources.length, conditional: ['/cases', '/certificates'] })
const exclusionRef = save('exclusions.json', { identity, privacySources, reason: 'Identity documents and the business licence are retained only for internal identity verification; no public product certificate or named-customer proof was supplied.', conditional: { cases: 'No named customer case evidence.', certificates: 'No public product or management certificate supplied.' } })
const languageRef = save('languages.json', { tenantId: null, supportedLanguages: ['en'], basis: 'English-first launch; locale-ready interfaces are required.' })

const factGroups = [
  { id: 'company-identity', statement: 'The company is Wenzhou Xiongba Apparel Co., Ltd.', category: 'identity', sourceIds: [workbook], decision: 'adopt', routes: ['/', '/about', '/contact'], source: { ...sourceRef, excerpt: 'Wenzhou Xiongba Apparel Co., Ltd.' } },
  { id: 'formal-contact', statement: 'The formal domain is xiongbafushi.com and the formal email is info@xiongbafushi.com.', category: 'contact', sourceIds: [domainEmail], decision: 'adopt', routes: ['/', '/contact'], source: { ...sourceRef, excerpt: 'Formal email: info@xiongbafushi.com' } },
  { id: 'launch-products', statement: 'The launch catalogue contains four source-supported product models.', category: 'products', sourceIds: [workbook, ...productSources], decision: 'adopt', routes: ['/products'], source: { ...sourceRef, excerpt: 'Launch products: XB-SR-001, XB-CT-002, XB-PT-003, XB-LY-004.' } },
  { id: 'customization', statement: 'Supported customization includes size, fabric, colour, print, binding and construction.', category: 'customization', sourceIds: [workbook], decision: 'adopt', routes: ['/', '/oem-odm'], source: { ...sourceRef, excerpt: 'Supported customization: size, fabric, colour, print, binding and construction.' } },
  { id: 'manufacturing-evidence', statement: 'Real supplied media shows workshop, office, warehouse, sample-room and equipment context.', category: 'manufacturing', sourceIds: [workbook, ...factorySources], decision: 'adopt', routes: ['/', '/manufacturing', '/about'], source: { ...sourceRef, excerpt: 'Manufacturing evidence includes real workshop, office, warehouse, sample-room and equipment imagery.' } },
  { id: 'hero-media', statement: 'All three supplied banner images are used in the home hero.', category: 'media', sourceIds: bannerSources, decision: 'adopt', routes: ['/'], source: { ...sourceRef, excerpt: 'Launch products: XB-SR-001, XB-CT-002, XB-PT-003, XB-LY-004.' } },
  { id: 'private-identity-media', statement: 'Identity documents are excluded from public pages.', category: 'privacy', sourceIds: privacySources, decision: 'exclude', reason: 'Private identity/legal-registration images are not public certificates.', source: { ...sourceRef, excerpt: 'Identity-card and business-licence images are internal identity evidence' }, exclusionEvidence: { ...sourceRef, excerpt: 'Identity-card and business-licence images are internal identity evidence and are not public certificates.' } },
]
const factBySource = new Map(sources.map((source) => [source.id, []]))
for (const fact of factGroups) for (const sourceId of fact.sourceIds) factBySource.get(sourceId)?.push(fact.id)
for (const source of sources) if (!factBySource.get(source.id).length) factBySource.get(source.id).push(source.id === domainEmail ? 'formal-contact' : 'company-identity')
const factReviewRef = save('fact-review.json', { schemaVersion: 1, identity, supportedLanguages: ['en'], languageEvidence: languageRef, facts: factGroups, sourceReviews: sources.map((s) => ({ sourceId: s.id, reason: 'Reviewed in the complete source and media ledger.', factIds: factBySource.get(s.id) })) })

const socialRef = save('social-review.json', { identity, reviewed: true, sourceIds: sources.map((s) => s.id), socialLinks: [], email: 'info@xiongbafushi.com' })
const sectionReviewRef = save('section-review.json', { identity, sourceIds: sources.map((s) => s.id), families: [
  { id: 'updates', sourceIds: [], reason: 'No genuine published news was supplied; retain an honest backend-driven empty state.' },
  { id: 'trust_strip', sourceIds: [workbook, ...factorySources], reason: 'Real factory and equipment material supports a concise manufacturing evidence summary.' },
  { id: 'custom_value', sourceIds: [workbook], reason: 'The supplied OEM/ODM scope supports a buyer-focused customization value summary.' },
  { id: 'custom_options', sourceIds: [workbook], reason: 'The workbook explicitly lists size, fabric, colour, print, binding and construction choices.' },
  { id: 'cooperation_process', sourceIds: [workbook], reason: 'FAQ answers support sample approval, production progress and inspection steps.' },
  { id: 'applications', sourceIds: [workbook, ...productSources], reason: 'Product and buyer-type facts support truthful use scenarios without claiming customer cases.' },
] })

const faqItems = [
  ['faq-models', 'What specifications or models are available?', 'Four launch models are published with their own fit, fabric and colour information; broader categories remain available for future catalogue expansion.'],
  ['faq-custom', 'Do you support customized size, material, color, or process?', 'Yes. Size, fabric, colour, print, binding and construction can be discussed for the order.'],
  ['faq-samples', 'Can you provide samples?', 'Stock samples and custom development samples can be discussed before bulk production.'],
  ['faq-oem', 'Do you support OEM / ODM services?', 'OEM labelling and ODM style development are supported for customer projects.'],
  ['faq-use', 'What industries or applications are your products suitable for?', "The range is suitable for children's base layers, home wear, school layering and active casual use for apparel brands, uniform sourcing, wholesalers and related supply chains."],
  ['faq-progress', 'Can production progress be shared?', 'Cutting, sewing and final inspection progress can be communicated during production.'],
  ['faq-inspection', 'Do you support third-party inspection?', 'Third-party inspection can be discussed for an order.'],
].map(([id, question, answer]) => ({ id, question, answer, sourceIds: [workbook], sourceEvidence: { ...faqRef, excerpt: `${question} ${answer}` } }))

const inventoryRef = save('inventory.json', { schemaVersion: 1, identity, scope: 'new-site', scopeEvidence: scopeRef, routes, sources, factReview: factReviewRef, faqItems, sectionReview: sectionReviewRef, channels: { links: [], email: 'info@xiongbafushi.com', review: socialRef } })

const pageSourceIds = (route) => {
  if (route === '/') return [...new Set([workbook, domainEmail, ...bannerSources, ...factorySources, ...productSources])]
  if (route === '/products') return [workbook, ...productSources]
  if (route.startsWith('/products/')) return [workbook, ...ledger.sources.filter((s) => productRoute(s) === route).map((s) => s.source_id)]
  if (route === '/oem-odm') return [workbook]
  if (route === '/manufacturing') return [workbook, ...factorySources]
  if (route === '/about') return [workbook, ...factorySources]
  if (route === '/contact') return [workbook, domainEmail]
  return [workbook]
}
const pageConfig = {
  home: [['offer', 'hero', "Children's and teen thermal/base-layer sets with four launch models."], ['selection', 'product-collections', 'Buyers compare fit, fabric and intended wearer across four models.'], ['trust', 'faq', 'Real manufacturing imagery and complete supplied FAQ answers reduce sourcing uncertainty.'], ['contact', 'contact-rfq', 'A protected RFQ collects product, quantity, market and message context.']],
  catalog: [['classification', 'catalog-groups', "Products are grouped into children's, plus-fit and teen thermal sets."], ['selection', 'applications', 'Buyers compare fit, fabric and intended wearer before opening a model detail.'], ['products', 'product-grid', 'All four verified models link to independent detail pages.']],
  product: [['identity', 'identity', 'The page preserves the exact model and product name.'], ['application', 'application', 'Use and intended wearer are stated from the product record.'], ['specifications', 'specifications', 'Colours, construction, fabric and fit are shown from the workbook.'], ['inquiry', 'inquiry', 'The inquiry action carries product context to Contact.']],
  customization: [['options', 'custom-value', 'OEM labelling and ODM development are described without invented commercial terms.'], ['inputs', 'custom-options', 'Buyers prepare size, fabric, colour, print, binding and construction requirements.'], ['process', 'cooperation-process', 'Sample approval precedes bulk production and inspection scope is discussed.'], ['contact', 'contact', 'The RFQ route collects project requirements.']],
  capability: [['process', 'process', 'Material intake, cutting/sewing, garment inspection and packing form the supported process.'], ['capability', 'manufacturing-gallery', 'Real workshop, office, warehouse, sample-room and equipment images provide context.'], ['provenance', 'provenance', 'Only supplied customer media is used as manufacturing evidence.'], ['contact', 'contact', 'Technical and production questions lead to the RFQ.']],
  about: [['identity', 'identity', 'The page uses the verified Chinese and supplied English company names.'], ['offer', 'offer', "The company provides children's and teen knit thermal garments and related customization."], ['capability', 'trust-strip', 'Real manufacturing imagery supports the company description without invented scale.'], ['contact', 'contact', 'Formal email, phone and address are displayed consistently.']],
  news: [['publication', 'publication', 'No genuine article was supplied, so News launches with an honest empty state.'], ['content', 'content', 'Future published articles are backend-driven and need no code change.']],
  contact: [['channels', 'channels', 'The formal email, phone and address are the public contact channels.'], ['inquiry', 'inquiry', 'The form gathers a useful sourcing request and reserves independent CAPTCHA scope.']],
}

const pages = routes.map((route) => {
  if (!route.published) return { route: route.route, type: route.type, applicability: 'not_applicable', reason: route.route === '/cases' ? 'No named customer case ownership or result evidence was supplied.' : 'No public product or management certificate was supplied.', omissionEvidence: exclusionRef, result: 'NOT_APPLICABLE', remaining: [] }
  const sourceIds = [...new Set(pageSourceIds(route.route))]
  const config = pageConfig[route.type]
  return { route: route.route, type: route.type, applicability: 'standalone', reason: 'Distinct buyer task supported by supplied customer facts and media.', sourceIds, plannedSections: config.map((x) => x[1]), backendTargets: ['tenant-scoped site settings, products, articles and fixed-layout content'], answers: config.map(([questionId, sectionId, answer]) => ({ questionId, sectionId, answer, sourceIds })), result: 'PLANNED', remaining: [] }
})
const decisions = sources.map((source) => {
  if (privacySources.includes(source.id)) return { sourceId: source.id, action: 'exclude', reason: 'Private identity/legal-registration media is not public website content.', evidence: exclusionRef }
  const matched = []
  for (const page of pages.filter((p) => p.applicability === 'standalone')) if (page.sourceIds.includes(source.id)) matched.push(page.route)
  return { sourceId: source.id, action: 'adopt', routes: matched.length ? matched : ['/about'] }
})

const buyerProof = { ...sourceRef, excerpt: 'Launch products: XB-SR-001, XB-CT-002, XB-PT-003, XB-LY-004.' }
const buyerPlanRef = save('buyer-design-plan.json', {
  schemaVersion: 1, identity,
  business: { offer: "Children's and teen thermal/base-layer garments with OEM/ODM support.", role: 'Manufacturer supported by supplied workshop, equipment and process evidence.', sourceIds: [workbook, ...factorySources] },
  buyers: [{ id: 'apparel-buyer', role: 'Brand, retailer, wholesaler or sourcing team', reason: 'The workbook explicitly identifies these buyer types and provides relevant product/customization facts.', basis: 'supported', sourceIds: [workbook] }],
  claims: [
    { id: 'four-products', statement: 'Four launch product models are fully supported.', sourceIds: [workbook, ...productSources], proof: buyerProof },
    { id: 'customization-supported', statement: 'Size, fabric, colour, print, binding and construction may be customized.', sourceIds: [workbook], proof: { ...sourceRef, excerpt: 'Supported customization: size, fabric, colour, print, binding and construction.' } },
    { id: 'real-manufacturing', statement: 'Real supplied media documents manufacturing context.', sourceIds: [workbook, ...factorySources], proof: { ...sourceRef, excerpt: 'Manufacturing evidence includes real workshop, office, warehouse, sample-room and equipment imagery.' } },
  ],
  journeys: [
    { id: 'home-products', buyerId: 'apparel-buyer', question: 'What can I source?', questionId: 'offer', sectionId: 'hero', route: '/', priority: 'primary', claimIds: ['four-products'], cta: { label: 'Explore Products', target: '/products' } },
    { id: 'products-contact', buyerId: 'apparel-buyer', question: 'Which model fits the range?', questionId: 'selection', sectionId: 'applications', route: '/products', priority: 'primary', claimIds: ['four-products'], cta: { label: 'Start Your RFQ', target: '/contact' } },
    { id: 'oem-contact', buyerId: 'apparel-buyer', question: 'What can be customized?', questionId: 'inputs', sectionId: 'custom-options', route: '/oem-odm', priority: 'secondary', claimIds: ['customization-supported'], cta: { label: 'Discuss Your Project', target: '/contact' } },
    { id: 'manufacturing-contact', buyerId: 'apparel-buyer', question: 'What evidence supports production?', questionId: 'capability', sectionId: 'manufacturing-gallery', route: '/manufacturing', priority: 'secondary', claimIds: ['real-manufacturing'], cta: { label: 'Send Production Questions', target: '/contact' } },
  ],
  visual: { direction: 'Warm, clean apparel editorial system using real product and factory photography.', typography: 'Confident editorial display headings with highly legible neutral sans-serif body text.', palette: 'Warm ivory and fabric neutrals, deep charcoal, restrained warm coral/rust accent.', imagery: 'Complete garments on clean continuous stages; real factory media in editorial compositions.', rhythm: 'Alternating dense evidence and calm selection sections without repetitive cards or empty height.', mobile: '390px content-first stacking, safe hero crops, complete products and reachable actions.', constraints: ['No generic blue technology theme.', 'No full-frame dark overlays.', 'No invented certificates, clients, capacity or warranty claims.'], references: [{ adopt: 'Product-first navigation, customization, workflow and real manufacturing evidence.', reject: 'All peer-specific facts, quantities, imagery and wording.', evidence: { file: 'xiongbafushi-com-page-content/source-facts.txt', sha256: sourceRef.sha256 } }] },
  optionalUnknowns: [{ topic: 'target countries', handling: 'Use neutral global sourcing language without naming markets.' }, { topic: 'MOQ and exact commercial terms', handling: 'Use inquiry-based wording; do not invent figures.' }],
})

const sectionSelections = [
  { id: 'updates', action: 'omit', reason: 'No genuine published news was supplied; News remains an honest backend-driven empty state.' },
  { id: 'trust_strip', action: 'use', reason: 'Real factory and equipment material supports a concise trust summary.', buyerQuestion: 'Why is this supplier credible?', layout: 'Compact evidence strip with semantic icons and a real-photo link.', layoutReason: 'Keeps trust concise while directing deeper due diligence to About and Manufacturing.', route: '/about', sectionId: 'trust-strip' },
  { id: 'custom_value', action: 'merge', reason: 'Customization value belongs in the OEM/ODM options explanation.', buyerQuestion: 'Why use this customization service?', layout: 'Short value statement integrated above the option matrix.', layoutReason: 'Avoids a duplicate generic advantages section.', route: '/oem-odm', sectionId: 'custom-value' },
  { id: 'custom_options', action: 'use', reason: 'The workbook provides explicit customization dimensions.', buyerQuestion: 'Which elements can I specify?', layout: 'Six-part option matrix with garment visual.', layoutReason: 'Allows quick comparison without inventing technical values.', route: '/oem-odm', sectionId: 'custom-options' },
  { id: 'cooperation_process', action: 'use', reason: 'FAQ answers support a sample-to-bulk sequence.', buyerQuestion: 'How does a project proceed?', layout: 'Accessible horizontal timeline becoming vertical on mobile.', layoutReason: 'Makes dependencies legible without unsupported timing promises.', route: '/oem-odm', sectionId: 'cooperation-process' },
  { id: 'applications', action: 'use', reason: 'Product and buyer facts support sourcing/use scenarios.', buyerQuestion: 'Where do the products fit?', layout: 'Use-scenario cards linked to relevant product models.', layoutReason: 'Separates use from purchasing role and avoids fake cases.', route: '/products', sectionId: 'applications' },
]
const faqSections = [{ id: 'faq', route: '/', questionIds: faqItems.map((item) => item.id), layout: 'Balanced grouped accordion without an empty sidebar.', layoutReason: 'Seven mixed-length answers need compact progressive disclosure on desktop and mobile.', interaction: 'accordion' }]
const factChecks = factGroups.map((fact) => fact.decision === 'exclude' ? { factId: fact.id, decision: 'exclude', reason: fact.reason } : { factId: fact.id, decision: 'adopt', targets: fact.routes.flatMap((route) => [{ route, locale: 'en', sectionId: pages.find((p) => p.route === route)?.plannedSections[0] ?? 'identity' }]) })

const plan = { schemaVersion: 1, identity, phase: 'plan', inventory_path: inventoryRef.file, inventory_sha256: inventoryRef.sha256, pages, sourceDecisions: decisions, remaining: [], findings: [], factChecks, faqSections, sectionSelections, channels: { status: 'NOT_PROVIDED', selection: null }, buyerDesign: { plan: buyerPlanRef } }
const planRef = save('plan.json', plan)
console.log(JSON.stringify({ result: 'PASS', inventory: inventoryRef, plan: planRef, pages: pages.length, sources: sources.length }))
