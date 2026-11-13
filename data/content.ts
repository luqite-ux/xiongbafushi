import { defaultLocale, type Locale } from '@/lib/site'

export type HeroSlide = {
  id: string
  image: string
  imageAlt: string
  eyebrow: string
  headline: string
  body: string
  cta: { label: string; href: string }
  copySide: 'left' | 'right'
  imagePosition: string
  localScrim?: boolean
}

export type CustomizationDimension = {
  key: string
  label: string
  description: string
}

export type WorkflowStep = {
  title: string
  description: string
}

export type BuyerFit = {
  title: string
  description: string
  lookAt: string
  href: string
}

export type Checkpoint = {
  title: string
  description: string
}

export type FacilityImage = {
  key: string
  src: string
  alt: string
  title: string
  caption: string
}

export type FaqGroup = {
  id: string
  title: string
  items: { question: string; answer: string }[]
}

export type NewsPost = {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  body: string[]
}

const content = {
  en: {
    heroSlides: [
      {
        id: 'manufacturing',
        image: '/images/hero/hero-factory.jpg',
        imageAlt:
          'Sewing operators at industrial machines in a bright workshop, with rolls of fabric and crates of garments beside the work tables',
        eyebrow: 'Wenzhou garment manufacturer',
        headline: 'From Sample Room to Bulk Production',
        body: 'Children’s and teen thermal sets developed from sample to bulk, with the workshop, sample room and packing area shown on this site.',
        cta: { label: 'View Manufacturing', href: '/manufacturing' },
        copySide: 'right',
        imagePosition: 'left center',
        localScrim: true,
      },
      {
        id: 'products',
        image: '/images/hero/hero-products.jpg',
        imageAlt:
          'Folded children’s thermal tops and bottoms in blue, orange, cream, peach and grey arranged on a warm beige surface',
        eyebrow: 'Thermal set collection',
        headline: 'Thermal Sets Designed Around Fit and Fabric',
        body: 'Brushed fleece, cotton soft knit and Lycra cotton sets for children and teens, ready to compare side by side.',
        cta: { label: 'Explore Products', href: '/products' },
        copySide: 'right',
        imagePosition: 'left center',
      },
      {
        id: 'rfq',
        image: '/images/hero/hero-teens.jpg',
        imageAlt:
          'Two teenagers in matching cream long-sleeve thermal tops and bottoms standing against a soft cream backdrop',
        eyebrow: 'OEM / ODM and private label',
        headline: 'Build the Right Base Layer for Your Market',
        body: 'Tell us the size, fabric, colour, print, binding and construction you need, and we will respond with a clear next step.',
        cta: { label: 'Start Your RFQ', href: '/contact' },
        copySide: 'left',
        imagePosition: 'right center',
      },
    ] satisfies HeroSlide[],

    customization: [
      {
        key: 'size',
        label: 'Size',
        description:
          'Size ranges and measurement points are discussed against your target wearer group and market.',
      },
      {
        key: 'fabric',
        label: 'Fabric',
        description:
          'Choose a direction from brushed fleece, cotton soft knit or Lycra cotton, then review the fabric on a sample.',
      },
      {
        key: 'colour',
        label: 'Colour',
        description:
          'Colourways are developed from your palette, reference swatch or seasonal colour story.',
      },
      {
        key: 'print',
        label: 'Print',
        description:
          'Stripes, prints and artwork placement are reviewed on a garment sample before bulk.',
      },
      {
        key: 'binding',
        label: 'Binding',
        description:
          'Neck, cuff and hem binding can be set in matching or contrast colour.',
      },
      {
        key: 'construction',
        label: 'Construction',
        description:
          'Seam placement, stitch finish and set structure are agreed during the sample stage.',
      },
    ] satisfies CustomizationDimension[],

    workflow: [
      {
        title: 'Share your brief',
        description:
          'Send the model of interest or a reference garment, with your target wearer, market and customization needs.',
      },
      {
        title: 'Review fit and fabric',
        description:
          'We discuss size, fabric, colour, print, binding and construction against your brief before sampling starts.',
      },
      {
        title: 'Develop the sample',
        description:
          'The sample room develops a garment sample to your agreed specifications.',
      },
      {
        title: 'Approve or adjust',
        description:
          'You review the sample, and adjustments are made until the specification is agreed for bulk.',
      },
      {
        title: 'Prepare bulk',
        description:
          'Materials, cutting and sewing are planned from the approved sample and confirmed quotation.',
      },
      {
        title: 'Produce, inspect and pack',
        description:
          'Garments move through cutting, sewing, inspection and packing checkpoints before dispatch is arranged.',
      },
    ] satisfies WorkflowStep[],

    buyerFit: [
      {
        title: 'Children’s apparel labels',
        description:
          'Brands that want a dependable thermal base layer in their own colours, prints and trims.',
        lookAt: 'Brushed fleece and cotton soft knit sets',
        href: '/products',
      },
      {
        title: 'Private-label and retail programmes',
        description:
          'Retail teams building a seasonal thermal range under their own label and packaging.',
        lookAt: 'OEM / ODM customization dimensions',
        href: '/oem-odm',
      },
      {
        title: 'Importers and wholesalers',
        description:
          'Buyers comparing garment fit, fabric and set structure before requesting a quotation.',
        lookAt: 'Product comparison and RFQ',
        href: '/contact',
      },
      {
        title: 'Teen and school-age ranges',
        description:
          'Buyers extending children’s ranges upward into teen sizing with a more grown-up cut.',
        lookAt: 'Teen girls’ Lycra cotton set',
        href: '/products',
      },
    ] satisfies BuyerFit[],

    checkpoints: [
      {
        title: 'Material intake',
        description:
          'Fabrics and trims are checked when they arrive and before they are released to cutting.',
      },
      {
        title: 'Cutting and sewing',
        description:
          'Panels, seams, binding and construction are checked against the approved sample as sewing proceeds.',
      },
      {
        title: 'Garment inspection',
        description:
          'Finished garments are inspected for workmanship, measurements and appearance.',
      },
      {
        title: 'Packing',
        description:
          'Garments are packed to the agreed packing instructions before dispatch is arranged.',
      },
    ] satisfies Checkpoint[],

    facility: [
      {
        key: 'workshop',
        src: '/images/facility/facility-workshop.jpg',
        alt: 'Wide view of a sewing workshop with operators at machines among large piles of grey, blue and cream knit fabric',
        title: 'Sewing workshop',
        caption: 'Operators sewing at stations on the workshop floor, with knit fabric stacked between the lines.',
      },
      {
        key: 'exterior',
        src: '/images/facility/facility-exterior.jpg',
        alt: 'Exterior of the factory buildings with a gated entrance, a parking area and a delivery truck',
        title: 'Factory buildings',
        caption: 'The factory compound, seen from the gated entrance and parking area.',
      },
      {
        key: 'sample-room',
        src: '/images/facility/facility-showroom.jpg',
        alt: 'Sample room with garment cabinets along one wall, hanging garments, a desk and a meeting table',
        title: 'Sample room',
        caption: 'Garment cabinets and a meeting table where samples are kept and reviewed.',
      },
      {
        key: 'equipment',
        src: '/images/facility/facility-sample-room.jpg',
        alt: 'Corner room with a studio light and softbox, two garment racks and folded garments on a table',
        title: 'Photo corner and garment racks',
        caption: 'Studio lighting and garment racks used to photograph and present garments.',
      },
      {
        key: 'warehouse',
        src: '/images/facility/facility-warehouse.jpg',
        alt: 'Packing room with a printer and desks, an operator working through paperwork and baskets of packaging bags',
        title: 'Packing and dispatch room',
        caption: 'Order paperwork, labels and packaging bags handled at the packing desks.',
      },
      {
        key: 'office',
        src: '/images/facility/facility-office.jpg',
        alt: 'Office meeting area with a desk, two computer monitors and mesh chairs',
        title: 'Office',
        caption: 'The office desk where product files and orders are managed.',
      },
    ] satisfies FacilityImage[],

    faqGroups: [
      {
        id: 'products',
        title: 'Products',
        items: [
          {
            question: 'Which products does XIONGBA currently offer?',
            answer:
              'The launch catalogue has four thermal sets: XB-SR-001 Kids’ Brushed Fleece Round-Neck Thermal Underwear Set, XB-CT-002 Cotton Candy Kids’ Soft Knit Thermal Set, XB-PT-003 Kids’ Plus-Fit Brushed Fleece Thermal Set, and XB-LY-004 Teen Girls’ Lycra Cotton Thermal Underwear Set.',
          },
          {
            question: 'Who are the sets designed for?',
            answer:
              'XB-SR-001, XB-CT-002 and XB-PT-003 are designed for children. XB-LY-004 is designed for teen girls. Each product page shows the intended wearer, fabric and fit.',
          },
          {
            question: 'Can I see garment details before I send an inquiry?',
            answer:
              'Yes. Product pages show a full-garment image, model images and close views of seams, hems or waistbands. If you need more views, mention it in your RFQ message.',
          },
        ],
      },
      {
        id: 'customization',
        title: 'OEM / ODM',
        items: [
          {
            question: 'Which parts of a garment can be customised?',
            answer:
              'Six dimensions are supported: size, fabric, colour, print, binding and construction. You can customise one or several of them for the same style.',
          },
          {
            question: 'Can I work from my own design or reference garment?',
            answer:
              'Yes. You can send your own design materials or a reference garment, or start from one of our models and adjust it using the supported dimensions.',
          },
          {
            question: 'What are the MOQ, sample fee and lead time?',
            answer:
              'These depend on the style, fabric, colour and print you choose, so we confirm them in the quotation after reviewing your RFQ rather than publishing fixed figures.',
          },
        ],
      },
      {
        id: 'process',
        title: 'Samples and production',
        items: [
          {
            question: 'How does the sample-to-bulk process work?',
            answer:
              'You share a brief, we review fit and fabric with you, develop a sample, adjust it until you approve it, then prepare bulk and move the order through cutting, sewing, inspection and packing.',
          },
          {
            question: 'What checks are made during production?',
            answer:
              'Checkpoints cover material intake, cutting and sewing, garment inspection and packing. Each checkpoint is described on the Manufacturing page.',
          },
        ],
      },
      {
        id: 'rfq',
        title: 'RFQ and contact',
        items: [
          {
            question: 'What should I include in an RFQ?',
            answer:
              'Your name, business email and company, the product you are interested in, and your message. An estimated quantity, target market and phone or WhatsApp number are optional but help us respond more precisely.',
          },
          {
            question: 'How can I reach the team?',
            answer:
              'Use the RFQ form on the Contact page, or email info@xiongbafushi.com with your requirements and any reference images.',
          },
          {
            question: 'Which markets can you supply?',
            answer:
              'Share your target market in the RFQ so we can discuss sizing, labelling and packing requirements for it. We do not list markets on the site in advance.',
          },
        ],
      },
    ] satisfies FaqGroup[],

    news: [] as NewsPost[],
  },
}

export async function getHeroSlides(locale: Locale = defaultLocale) {
  return content[locale].heroSlides
}

export async function getFaqGroups(locale: Locale = defaultLocale) {
  return content[locale].faqGroups
}

export async function getNewsPosts(locale: Locale = defaultLocale): Promise<NewsPost[]> {
  return [...content[locale].news]
}

export async function getNewsPostBySlug(slug: string, locale: Locale = defaultLocale) {
  return content[locale].news.find((post) => post.slug === slug)
}

export function getCustomization(locale: Locale = defaultLocale) {
  return content[locale].customization
}

export function getWorkflow(locale: Locale = defaultLocale) {
  return content[locale].workflow
}

export function getBuyerFit(locale: Locale = defaultLocale) {
  return content[locale].buyerFit
}

export function getCheckpoints(locale: Locale = defaultLocale) {
  return content[locale].checkpoints
}

export function getFacility(locale: Locale = defaultLocale) {
  return content[locale].facility
}
