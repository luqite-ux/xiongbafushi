import { defaultLocale, type Locale } from '@/lib/site'

export type ProductImage = {
  src: string
  alt: string
  caption: string
  view: 'garment' | 'model' | 'detail'
  blendWhite?: boolean
}

export type Wearer = 'Children' | 'Teen girls'
export type FabricGroup = 'Brushed fleece' | 'Cotton soft knit' | 'Lycra cotton'

export type Product = {
  slug: string
  model: string
  name: string
  shortName: string
  summary: string
  description: string
  wearer: Wearer
  fabricGroup: FabricGroup
  fit: string
  useScenarios: string[]
  specs: { label: string; value: string }[]
  images: ProductImage[]
}

const productsByLocale: Record<Locale, Product[]> = {
  en: [
    {
      slug: 'xb-sr-001-brushed-fleece-round-neck-set',
      model: 'XB-SR-001',
      name: "Kids' Brushed Fleece Round-Neck Thermal Underwear Set",
      shortName: 'Brushed Fleece Round-Neck Set',
      summary:
        'A brushed fleece round-neck top and bottoms for children’s cold-season base-layer ranges.',
      description:
        'A two-piece round-neck thermal set in brushed fleece. The raglan-sleeve top and elasticated bottoms are shown flat so buyers can read the seam lines, neckline and waistband before requesting a sample.',
      wearer: 'Children',
      fabricGroup: 'Brushed fleece',
      fit: 'Round-neck set',
      useScenarios: [
        'Children’s cold-season base-layer ranges',
        'Private-label thermal programmes',
        'Layering under everyday clothing',
      ],
      specs: [
        { label: 'Model', value: 'XB-SR-001' },
        { label: 'Product type', value: 'Thermal underwear set, top and bottoms' },
        { label: 'Intended wearer', value: 'Children' },
        { label: 'Fabric', value: 'Brushed fleece' },
        { label: 'Neckline', value: 'Round neck' },
        { label: 'Colour shown', value: 'Cream' },
      ],
      images: [
        {
          src: '/images/products/xb-sr-001-set.jpg',
          alt: 'Cream round-neck long-sleeve thermal top with raglan seams beside matching elasticated thermal bottoms, laid flat on white',
          caption: 'Full set, laid flat',
          view: 'garment',
          blendWhite: true,
        },
        {
          src: '/images/products/xb-sr-001-waistband.jpg',
          alt: 'Close view of the inside of a cream elasticated waistband with overlocked seams',
          caption: 'Waistband and seam detail',
          view: 'detail',
          blendWhite: true,
        },
      ],
    },
    {
      slug: 'xb-ct-002-cotton-candy-soft-knit-set',
      model: 'XB-CT-002',
      name: "Cotton Candy Kids' Soft Knit Thermal Set",
      shortName: 'Cotton Candy Soft Knit Set',
      summary:
        'A soft knit cotton thermal set with striped colourways for children’s everyday base layers.',
      description:
        'A soft knit thermal set in a striped colourway with contrast neck and cuff binding. Shown on a model and as a colour pair so buyers can compare stripe scale, binding and overall fit.',
      wearer: 'Children',
      fabricGroup: 'Cotton soft knit',
      fit: 'Soft knit set',
      useScenarios: [
        'Children’s everyday base-layer ranges',
        'Colour-led seasonal collections',
        'Layering under everyday clothing',
      ],
      specs: [
        { label: 'Model', value: 'XB-CT-002' },
        { label: 'Product type', value: 'Thermal underwear set, top and bottoms' },
        { label: 'Intended wearer', value: 'Children' },
        { label: 'Fabric', value: 'Cotton soft knit' },
        { label: 'Pattern shown', value: 'Horizontal stripe' },
        { label: 'Binding', value: 'Contrast neck and cuff binding' },
      ],
      images: [
        {
          src: '/images/products/xb-ct-002-model.jpg',
          alt: 'Smiling young model in a beige and white striped long-sleeve thermal top with contrast neck and cuffs and matching striped bottoms',
          caption: 'Beige stripe on model',
          view: 'model',
        },
        {
          src: '/images/products/xb-ct-002-striped-pair.jpg',
          alt: 'Two young models walking in matching striped thermal sets, one in light blue and white, one in pink and white',
          caption: 'Blue and pink stripe colourways',
          view: 'model',
        },
      ],
    },
    {
      slug: 'xb-pt-003-plus-fit-brushed-fleece-set',
      model: 'XB-PT-003',
      name: "Kids' Plus-Fit Brushed Fleece Thermal Set",
      shortName: 'Plus-Fit Brushed Fleece Set',
      summary:
        'A plus-fit brushed fleece thermal set for children’s cold-season ranges.',
      description:
        'A plus-fit thermal set in brushed fleece, shown in a peach colourway on a model with a close view of the seam finish. Fit and size range are confirmed against your market during sampling.',
      wearer: 'Children',
      fabricGroup: 'Brushed fleece',
      fit: 'Plus fit',
      useScenarios: [
        'Plus-fit size extensions for children’s ranges',
        'Cold-season base-layer programmes',
        'Layering under school and casual wear',
      ],
      specs: [
        { label: 'Model', value: 'XB-PT-003' },
        { label: 'Product type', value: 'Thermal underwear set, top and bottoms' },
        { label: 'Intended wearer', value: 'Children' },
        { label: 'Fabric', value: 'Brushed fleece' },
        { label: 'Fit', value: 'Plus fit' },
        { label: 'Colour shown', value: 'Peach' },
      ],
      images: [
        {
          src: '/images/products/xb-pt-003-model.jpg',
          alt: 'Model in a peach long-sleeve round-neck thermal top and matching bottoms, with an inset close view of a stitched seam',
          caption: 'Peach colourway on model with seam inset',
          view: 'model',
        },
        {
          src: '/images/products/xb-pt-003-hem-detail.jpg',
          alt: 'Close view of a peach ribbed fabric hem with a double-stitched edge',
          caption: 'Ribbed hem and stitching detail',
          view: 'detail',
          blendWhite: true,
        },
      ],
    },
    {
      slug: 'xb-ly-004-teen-girls-lycra-cotton-set',
      model: 'XB-LY-004',
      name: "Teen Girls' Lycra Cotton Thermal Underwear Set",
      shortName: 'Teen Girls’ Lycra Cotton Set',
      summary:
        'A Lycra cotton thermal set cut for teen girls, shown in a neutral grey-beige tone.',
      description:
        'A Lycra cotton thermal set for teen girls with a round neckline and long sleeves. Shown on a model with a close view of the ribbed fabric and seam finish.',
      wearer: 'Teen girls',
      fabricGroup: 'Lycra cotton',
      fit: 'Teen girls’ fit',
      useScenarios: [
        'Teen girls’ base-layer ranges',
        'Neutral colour programmes',
        'Layering under school and casual wear',
      ],
      specs: [
        { label: 'Model', value: 'XB-LY-004' },
        { label: 'Product type', value: 'Thermal underwear set, top and bottoms' },
        { label: 'Intended wearer', value: 'Teen girls' },
        { label: 'Fabric', value: 'Lycra cotton' },
        { label: 'Neckline', value: 'Round neck' },
        { label: 'Colour shown', value: 'Grey-beige' },
      ],
      images: [
        {
          src: '/images/products/xb-ly-004-model.jpg',
          alt: 'Smiling teen model in a grey-beige long-sleeve round-neck thermal top and matching bottoms, holding a cup in a warm room',
          caption: 'Grey-beige colourway on model',
          view: 'model',
        },
        {
          src: '/images/products/xb-ly-004-seam-detail.jpg',
          alt: 'Close view of fine ribbed peach-beige knit fabric with an overlocked seam',
          caption: 'Ribbed knit and seam detail',
          view: 'detail',
          blendWhite: true,
        },
      ],
    },
  ],
}

export async function listProducts(locale: Locale = defaultLocale): Promise<Product[]> {
  return productsByLocale[locale]
}

export async function getProductBySlug(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<Product | undefined> {
  return productsByLocale[locale].find((product) => product.slug === slug)
}

export function getProductFilters(products: Product[]) {
  return {
    wearers: Array.from(new Set(products.map((product) => product.wearer))),
    fabrics: Array.from(new Set(products.map((product) => product.fabricGroup))),
  }
}
