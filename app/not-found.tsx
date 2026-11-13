import type { Metadata } from 'next'
import { CtaLink } from '@/components/site/cta-link'
import { Section } from '@/components/site/section'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <Section id="not-found" tone="sand" innerClassName="py-24 md:py-36">
      <div className="max-w-2xl">
        <p className="text-rust text-xs font-semibold tracking-[0.22em] uppercase">Error 404</p>
        <h1 className="font-serif mt-4 text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
          This page could not be found
        </h1>
        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
          The link may be out of date, or the page may have moved. Use one of the pages below to continue.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <CtaLink href="/">Back to Home</CtaLink>
          <CtaLink href="/products" variant="outline">
            View products
          </CtaLink>
          <CtaLink href="/contact" variant="outline">
            Contact us
          </CtaLink>
        </div>
      </div>
    </Section>
  )
}
