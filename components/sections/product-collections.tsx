import { ProductCard } from '@/components/products/product-card'
import { CtaLink } from '@/components/site/cta-link'
import { Section, SectionHeader } from '@/components/site/section'
import { listProducts } from '@/lib/products-db'

export async function ProductCollections() {
  const products = await listProducts()

  return (
    <Section id="product-collections" labelledBy="product-collections-title">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          id="product-collections-title"
          eyebrow="Product collections"
          title="Four thermal sets, compared by fit and fabric"
          description="Each model shows the full garment, a model view and close detail, so you can judge fabric, binding and fit before you ask for a sample."
        />
        <CtaLink href="/products" variant="text" className="self-start md:self-auto">
          View all products
        </CtaLink>
      </div>

      <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:[&>li:nth-child(even)]:mt-12">
        {products.map((product, index) => (
          <li key={product.slug}>
            <ProductCard product={product} index={index} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
