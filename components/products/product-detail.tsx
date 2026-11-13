import Link from 'next/link'
import { Reveal } from '@/components/motion/reveal'
import { ProductGallery } from '@/components/products/product-gallery'
import { CtaLink } from '@/components/site/cta-link'
import { Section } from '@/components/site/section'
import { getCustomization } from '@/data/content'
import type { Product } from '@/data/products'

export function ProductDetail({ product }: { product: Product }) {
  const customization = getCustomization()

  return (
    <>
      <Section id="product-overview" labelledBy="product-title" className="pt-0" innerClassName="pt-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <li>
              <Link href="/" className="hover:text-rust underline-offset-4 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="hover:text-rust underline-offset-4 hover:underline">
                Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">
              {product.model}
            </li>
          </ol>
        </nav>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery productName={product.name} images={product.images} />
          </div>

          <Reveal className="flex flex-col lg:col-span-5">
            <p className="text-rust text-xs font-semibold tracking-[0.22em] uppercase">
              {product.model} &middot; {product.wearer}
            </p>
            <h1
              id="product-title"
              className="font-serif mt-4 text-[1.9rem] leading-[1.1] font-medium tracking-tight sm:text-4xl"
            >
              {product.name}
            </h1>
            <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">{product.description}</p>

            <dl className="mt-8 divide-y border-y text-sm">
              <div className="grid grid-cols-[8rem_1fr] gap-4 py-3">
                <dt className="text-muted-foreground">Fabric</dt>
                <dd>{product.fabricGroup}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-4 py-3">
                <dt className="text-muted-foreground">Fit</dt>
                <dd>{product.fit}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-4 py-3">
                <dt className="text-muted-foreground">Intended wearer</dt>
                <dd>{product.wearer}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href={`/contact?product=${product.slug}`}>Request a quote for {product.model}</CtaLink>
              <CtaLink href="/products" variant="outline" arrow={false}>
                All products
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="product-specs" tone="sand" labelledBy="product-specs-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <h2 id="product-specs-title" className="font-serif text-2xl font-medium sm:text-3xl">
              Supported specifications
            </h2>
            <dl className="mt-8 divide-y border-y">
              {product.specs.map((spec) => (
                <div key={spec.label} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                  <dt className="text-muted-foreground text-sm">{spec.label}</dt>
                  <dd className="text-base">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <h2 className="font-serif text-2xl font-medium sm:text-3xl">Sourcing fit</h2>
            <ul className="mt-8 flex flex-col gap-4 text-base leading-relaxed">
              {product.useScenarios.map((scenario) => (
                <li key={scenario} className="flex gap-3">
                  <span aria-hidden="true" className="bg-rust mt-3 size-1.5 shrink-0" />
                  <span>{scenario}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section id="product-customization" labelledBy="product-customization-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <h2 id="product-customization-title" className="font-serif text-2xl font-medium sm:text-3xl">
              Customization for this model
            </h2>
            <p className="text-muted-foreground mt-5 text-base leading-relaxed">
              Any of the dimensions below can be discussed when you request a quote for {product.model}. Share what you
              need and we will confirm what is supported for this garment.
            </p>
            <div className="mt-8">
              <CtaLink href="/oem-odm" variant="text">
                How OEM / ODM works
              </CtaLink>
            </div>
          </Reveal>

          <ul className="grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:col-span-7">
            {customization.map((item, index) => (
              <Reveal as="li" key={item.key} delay={index * 60} className="border-t py-5">
                <p className="font-semibold">{item.label}</p>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.description}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>
    </>
  )
}
