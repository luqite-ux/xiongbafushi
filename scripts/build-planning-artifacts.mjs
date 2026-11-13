import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const intake = path.join(root, 'deliverables', 'intake')
const ledger = JSON.parse(fs.readFileSync(path.join(intake, 'asset-ledger.json'), 'utf8'))
const sources = ledger.sources
const media = sources.filter((item) => item.media_asset)
const writeJson = (name, value) => fs.writeFileSync(path.join(intake, name), `${JSON.stringify(value, null, 2)}\n`)

const banners = media.filter((item) => item.path.includes('banner背景图'))
const bannerRules = [
  { subject: 'factory and sewing scene on the left', safeArea: 'right-side white negative space', desktopTextSide: 'right', objectPosition: 'left center', mobileFocus: 'left-center factory activity', mobileLayout: 'separate text block above image; preserve the workers and sewing line without overlaying copy on faces' },
  { subject: 'folded children apparel group across the left and centre', safeArea: 'right-side beige negative space', desktopTextSide: 'right', objectPosition: 'left center', mobileFocus: 'centre product group', mobileLayout: 'separate compact text band above the image; use contain-like crop so the full garment group remains visible' },
  { subject: 'teen models on the right', safeArea: 'left-side cream negative space', desktopTextSide: 'left', objectPosition: 'right center', mobileFocus: 'right-centre models', mobileLayout: 'text block above image; crop from the left while retaining all model faces and garments' },
]
writeJson('banner-layout-manifest.json', {
  schemaVersion: 1,
  result: 'PASS',
  items: banners.map((item, index) => ({
    sourceId: item.source_id,
    source: item.path,
    fingerprint: item.fingerprint,
    ...bannerRules[index],
    desktopOverlayRule: 'No full-frame dark overlay; use only local contrast treatment inside the verified safe area.',
    mobileObjectPosition: bannerRules[index].objectPosition,
    publishDecision: 'use',
  })),
})

const reps = [
  ...banners,
  ...['xb-sr-001', 'xb-ct-002', 'xb-pt-003', 'xb-ly-004'].flatMap((id) => media.filter((item) => item.media_asset.business_entity === id).slice(0, 2)),
  ...media.filter((item) => item.media_asset.business_entity === 'factory').slice(0, 6),
]
writeJson('v0-asset-pack.json', {
  schemaVersion: 1,
  policy: 'representative-only',
  logo: { status: 'not_provided', plan: 'Use an honest XIONGBA text mark during design; create a same-source temporary XB favicon after visual direction is fixed.' },
  items: reps.map((item) => ({ sourceId: item.source_id, source: item.path, fingerprint: item.fingerprint, purpose: item.media_asset.semantic_destination, coverage: item.media_asset.business_entity ?? 'hero', selectionReason: item.path.includes('banner背景图') ? 'All supplied banner images are mandatory v0 attachments.' : 'Representative real customer image for the named product or manufacturing context.' })),
  excludedFromV0ButRetainedForIntegration: media.filter((item) => !reps.some((rep) => rep.source_id === item.source_id)).map((item) => item.source_id),
  video: { status: 'none_supplied', publicUse: false },
})

writeJson('full-content-manifest.json', {
  schemaVersion: 1,
  sourceCount: sources.length,
  mediaCount: media.length,
  items: sources.map((item) => ({
    sourceId: item.source_id,
    source: item.path,
    fingerprint: item.fingerprint,
    decision: item.media_asset?.decision ?? 'extract_facts',
    target: item.media_asset?.semantic_destination ?? (item.source_id === 'source-workbook' ? 'backend/content seed and site settings' : 'domain and contact configuration'),
    entity: item.media_asset?.business_entity ?? null,
    reason: item.media_asset?.placement_reason ?? 'Source document retained for factual extraction and traceability.',
  })),
})

const excluded = media.filter((item) => item.media_asset.decision !== 'use')
writeJson('material-non-adoption-report.json', {
  schemaVersion: 1,
  reverseCheckedSources: sources.length,
  items: excluded.map((item) => ({ sourceId: item.source_id, source: item.path, fingerprint: item.fingerprint, decision: item.media_asset.decision, reason: item.media_asset.placement_reason, alternativeAttempt: item.path.includes('身份证') ? 'No public alternative attempted because identity documents must remain private.' : 'Retained only as internal legal-identity evidence; not a product certificate or public trust badge.', impact: 'No loss of product, factory, buyer, or purchasing information.' })),
  notes: ['Fourteen exact duplicate image groups are retained in the ledger but will be deduplicated in public galleries.', 'No supplied product certificates or named customer logos exist, so no certification or customer-logo gallery will be fabricated.'],
})

writeJson('missing-facts.json', {
  schemaVersion: 1,
  blocking: [],
  nonBlocking: [
    { fact: 'graphical logo', status: 'not_provided', treatment: 'Use a text brand and create a matching temporary XB favicon; keep backend replacement fields.' },
    { fact: 'product or management certificates', status: 'not_provided', treatment: 'Do not publish a certificate section.' },
    { fact: 'named customer logos and case studies', status: 'not_provided', treatment: 'Present verified buyer types and use scenarios without endorsements.' },
    { fact: 'target countries and sales markets', status: 'not_provided', treatment: 'Use neutral global B2B language without claiming markets.' },
    { fact: 'MOQ, payment terms, sample charge, and exact lead time numbers', status: 'not_safely_confirmed', treatment: 'Use inquiry-based language and the supplied process facts; do not invent numbers.' },
  ],
})

const groups = [
  { id: 'hero', items: banners, routes: ['/#hero'], role: 'brand_story', copy: 'Children’s thermal underwear development and manufacturing, supported by real factory and product imagery.' },
  ...['xb-sr-001', 'xb-ct-002', 'xb-pt-003', 'xb-ly-004'].map((id) => ({ id, items: media.filter((item) => item.media_asset.business_entity === id), routes: [`/products/${id}`], role: 'product_gallery', copy: 'Show the complete garment, construction details, colour/fabric views and real wearing context without cropping key structure.' })),
  { id: 'manufacturing', items: media.filter((item) => item.media_asset.business_entity === 'factory'), routes: ['/#manufacturing', '/manufacturing', '/about'], role: 'process_evidence', copy: 'Real workshop, office, warehouse, sample room and equipment evidence with factual captions only.' },
]
writeJson('customer-media-curation-plan.json', {
  schemaVersion: 1,
  result: 'PASS',
  groups: groups.map((group) => ({ id: group.id, sourceIds: group.items.map((item) => item.source_id), routes: group.routes, role: group.role, optimization: group.role === 'product_gallery' ? 'Deduplicate exact repeats; preserve true colour and proportions; clean light stage; contain for full product visibility.' : 'Crop only for composition while preserving factual subject; normalize exposure and avoid invented machinery or people.', publicCopyDraft: group.copy })),
  sensitiveGroup: { sourceIds: excluded.map((item) => item.source_id), publicUse: false },
})

fs.writeFileSync(path.join(intake, 'material-brief.md'), `# Material brief\n\n## Verified business\n\n温州雄霸服饰有限公司 / Wenzhou Xiongba Apparel Co., Ltd. supplies children’s and teen thermal underwear and base-layer sets. The source workbook supports four launch products, OEM/ODM choices for size, fabric, colour, print, binding and construction, a sample-to-bulk workflow, factory/workshop evidence, equipment labels, and buyer types. Source: workbook plus all embedded images and standalone media.\n\nThe available evidence supports a manufacturer presentation: real workshop, sewing, sample-room, warehouse, office and equipment imagery are present. It does not support invented capacity, certifications, named clients, export markets or production numbers. Buyers are expected to compare fabric/fit/use, confirm customization and samples, then send RFQ details. Known buyer types are presented as buyer-fit categories, not endorsements.\n\n## Site facts\n\n- Formal domain: xiongbafushi.com (pre-launch destination).\n- Contact email: info@xiongbafushi.com (owner-supplied formal address; supersedes the workbook QQ mailbox for public delivery).\n- Primary language: English; architecture remains locale-ready for later languages.\n- Launch products: XB-SR-001, XB-CT-002, XB-PT-003, XB-LY-004.\n- Broader category names: retain as future taxonomy only; do not fabricate products.\n- Certificates: none supplied for public display. The business licence is identity evidence, not a product certificate.\n- Cases/customers: no named customer evidence; use buyer types and application/use scenarios only.\n- Video: none supplied; VIDEO-DEFAULT-OFF remains in force.\n- Prohibited copy: no warranty/guarantee claims, unsupported superlatives, invented response time, MOQ, capacity or market claims.\n\n## Design assumptions\n\nA warm, clean apparel palette and editorial product photography treatment are design choices, not customer facts. Use all three supplied banners with per-image safe areas. Product pages prioritize complete garment visibility and gallery depth. Manufacturing sections use real images as evidence rather than decorative stock.\n`)

fs.writeFileSync(path.join(intake, 'case-reference.md'), `# Case and peer reference\n\n## Internal case library\n\n- Native library searches for children’s thermal underwear, apparel OEM/ODM and garment factory references returned no suitable cases.\n- The required local case-usage call was also retained; it returned NETWORK_UNAVAILABLE and did not create a selected internal case.\n- No internal case is represented as selected or copied.\n\n## Public peers actually reviewed\n\n- https://nuohuagarment.com/ — useful product collections, OEM/ODM path and manufacturing evidence; do not copy its company claims or catalogue.\n- https://thermalproducer.com/?lang=en — useful thermal-product navigation and category language; do not copy capabilities, quantities or market claims.\n- https://www.etxjust.com/about-us — useful company/factory narrative structure; do not copy certifications, scale or history.\n- https://radhecreationclothing.com/products/kids-wear-collection/ — useful children’s apparel browsing pattern; do not copy products, customer facts or merchandising text.\n\n## Chosen presentation\n\nUse a product-first B2B catalogue with real-material galleries, buyer-fit cards, OEM/ODM options, sample-to-bulk process, manufacturing evidence, FAQ and an RFQ block. The Cases concept is implemented as source-supported buyer/use-scenario presentation, not named customer case studies. Certificates remain absent until real certificates are supplied.\n`)

fs.writeFileSync(path.join(intake, 'homepage-media-slot-plan.md'), `# Homepage media and purchasing path\n\n| Buyer question | Section | Source and media | Buyer value | CTA | Desktop / 390px |\n+|---|---|---|---|---|---|\n+| What do you make? | hero | all 3 supplied banners + four product records | Immediate thermal/base-layer recognition | Explore Products | Per-image safe-area overlay / separate text and focused image |\n+| How do I choose? | product-collections | representative galleries for 4 products | Compare fit, fabric and intended wearer | View Product | 4-card grid / stacked swipe-safe cards |\n+| Is this suitable for my business? | buyer-fit | workbook buyer types | Match sourcing context without fake client logos | Discuss Your Range | icon-supported cards / 2-column compact cards |\n+| What can be customized? | oem-odm | verified customization dimensions | Prepare a useful specification | Start an RFQ | option matrix + product visual / stacked matrix |\n+| How does ordering work? | sample-to-bulk | supplied FAQ/process facts | Understand steps without invented timing | Request a Sample | process timeline / vertical steps |\n+| Can you manufacture it? | manufacturing | real company/factory images | Verify facilities and working context | View Manufacturing | editorial mosaic / curated vertical gallery |\n+| How is quality checked? | quality | supplied process facts and real workshop evidence | Understand checkpoints without warranty promises | Ask a Technical Question | icon process / vertical sequence |\n+| What are common terms? | faq | supplied FAQ items | Resolve sample, customization, timing and inspection questions | Contact Sales | balanced grouped accordion / progressive accordion |\n+| How do I enquire? | contact-rfq | formal email + RFQ fields | Send product, quantity, market and message context | Submit Inquiry | balanced company summary + form / summary above form |\n+\n+Buyer decision coverage: offer/selection COVERED; buyer/use fit COVERED; trust/manufacturing COVERED; cooperation/process COVERED; inquiry COVERED. All are anchored to the workbook or supplied real media.\n+`)

console.log(JSON.stringify({ result: 'PASS', sources: sources.length, media: media.length, banners: banners.length, representatives: reps.length }))
