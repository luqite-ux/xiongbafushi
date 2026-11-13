import type { Metadata } from 'next'
import { PageHero } from '@/components/site/page-hero'
import { ContactRfq } from '@/components/sections/contact-rfq'

export const metadata: Metadata = {
  title: 'Contact and RFQ',
  description:
    'Send a request for quotation to XIONGBA with your product interest, estimated quantity and target market.',
  alternates: { canonical: '/contact' },
}

type ContactPageProps = {
  searchParams: Promise<{ product?: string | string[] }>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { product } = await searchParams
  const defaultProduct = Array.isArray(product) ? product[0] : product

  return (
    <>
      <PageHero
        eyebrow="Contact / RFQ"
        title="Send us your request for quotation"
        description="Tell us the model, quantity and market you have in mind. Our team replies to the business email you provide."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />
      <ContactRfq variant="page" defaultProduct={defaultProduct} />
    </>
  )
}
