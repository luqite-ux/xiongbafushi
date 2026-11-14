import type { Metadata } from 'next'
import { Reveal } from '@/components/motion/reveal'
import { CtaBand } from '@/components/site/cta-band'
import { CtaLink } from '@/components/site/cta-link'
import { PageHero } from '@/components/site/page-hero'
import { Section, SectionHeader } from '@/components/site/section'
import { FacilityGallery } from '@/components/sections/facility-gallery'
import { QualitySection } from '@/components/sections/quality'

export const metadata: Metadata = {
  title: 'Manufacturing',
  description:
    'Explore the XIONGBA sewing workshop, sample room, packing area and office in Wenzhou, together with the inspection checkpoints used for each order.',
  alternates: { canonical: '/manufacturing' },
}

const links = [
  {
    title: 'Customization',
    description: 'Size, fabric, colour, print, binding and construction.',
    href: '/oem-odm',
    label: 'OEM / ODM',
  },
  {
    title: 'Products',
    description: 'Four thermal sets for children and teens, with fabric and fit details.',
    href: '/products',
    label: 'View products',
  },
  {
    title: 'Your RFQ',
    description: 'Share your brief and we will reply to your business email.',
    href: '/contact',
    label: 'Start your RFQ',
  },
]

export default function ManufacturingPage() {
  return (
    <>
      <PageHero
        eyebrow="Manufacturing"
        title="Where XIONGBA garments are developed and made"
        description="Explore the sewing workshop, sample room, packing area and office, then review the checkpoints that support an order from sample to dispatch."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Manufacturing' }]}
      />

      <FacilityGallery />
      <QualitySection />

      <Section id="next-steps" tone="sand" labelledBy="next-steps-title">
        <SectionHeader
          id="next-steps-title"
          eyebrow="Next steps"
          title="From the workshop to your brief"
        />
        <ul className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
          {links.map((item, index) => (
            <Reveal as="li" key={item.href} delay={index * 90}>
              <div className="stitch-rule" aria-hidden="true" />
              <h3 className="font-serif mt-5 text-2xl font-medium">{item.title}</h3>
              <p className="text-muted-foreground mt-3 leading-relaxed">{item.description}</p>
              <CtaLink href={item.href} variant="text" className="mt-5">
                {item.label}
              </CtaLink>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand id="manufacturing-cta" />
    </>
  )
}
