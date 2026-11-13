import type { Metadata } from 'next'
import { ProductBrowser } from '@/components/products/product-browser'
import { CtaBand } from '@/components/site/cta-band'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/site/section'
import { getProductFilters, listProducts } from '@/data/products'

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Browse XIONGBA children’s and teen thermal underwear sets by intended wearer and fabric, then request a quote for the model you want to develop.',
  alternates: { canonical: '/products' },
}

export default async function ProductsPage() {
  const products = await listProducts()
  const { wearers, fabrics } = getProductFilters(products)

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Thermal sets for children and teens"
        description="Compare garment fit, fabric and intended wearer across the current catalogue. Every model can be developed further through OEM / ODM."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
      />
      <Section id="catalogue" labelledBy="catalogue-title">
        <h2 id="catalogue-title" className="sr-only">
          Product catalogue
        </h2>
        <ProductBrowser products={products} wearers={wearers} fabrics={fabrics} />
      </Section>
      <CtaBand
        id="products-cta"
        title="Need a different fabric, print or fit?"
        description="Tell us what you are developing. Supported customization covers size, fabric, colour, print, binding and construction."
        secondary={{ label: 'See OEM / ODM', href: '/oem-odm' }}
      />
    </>
  )
}
