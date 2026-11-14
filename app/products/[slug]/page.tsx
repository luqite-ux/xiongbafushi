import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/products/product-card'
import { ProductDetail } from '@/components/products/product-detail'
import { Reveal } from '@/components/motion/reveal'
import { CtaBand } from '@/components/site/cta-band'
import { Section } from '@/components/site/section'
import { getProductBySlug, listProducts } from '@/lib/products-db'

export const revalidate = 60
export const dynamicParams = true

type ProductPageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found' }

  return {
    title: `${product.model} ${product.shortName}`,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: 'website',
      url: `https://xiongbafushi.com/products/${product.slug}`,
      title: `${product.model} ${product.name}`,
      description: product.summary,
      images: product.images[0] ? [{ url: product.images[0].src, alt: product.images[0].alt }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const [product, products] = await Promise.all([getProductBySlug(slug), listProducts()])
  if (!product) notFound()

  const related = products.filter((item) => item.slug !== product.slug)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', '@id': `https://xiongbafushi.com/products/${product.slug}#product`, url: `https://xiongbafushi.com/products/${product.slug}`, name: product.name, model: product.model, description: product.description, image: product.images.map(image => new URL(image.src, 'https://xiongbafushi.com').href), manufacturer: { '@id': 'https://xiongbafushi.com/#organization' }, additionalProperty: product.specs.map(spec => ({ '@type': 'PropertyValue', name: spec.label, value: spec.value })) }).replace(/</g, '\\u003c') }} />
      <ProductDetail product={product} />
      {related.length > 0 ? (
        <Section id="related-products" tone="sand" labelledBy="related-products-title">
          <Reveal>
            <h2 id="related-products-title" className="font-serif text-2xl font-medium sm:text-3xl">
              Compare with other models
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <li key={item.slug}>
                <ProductCard product={item} index={index} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      <CtaBand
        id="product-cta"
        title={`Request a quote for ${product.model}`}
        description="Tell us the quantity, market and any customization you have in mind for this model."
        primary={{ label: 'Start your RFQ', href: `/contact?product=${product.slug}` }}
        secondary={{ label: 'See OEM / ODM', href: '/oem-odm' }}
      />
    </>
  )
}
