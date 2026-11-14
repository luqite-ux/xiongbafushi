import type { Metadata } from 'next'
import Image from 'next/image'
import { Reveal } from '@/components/motion/reveal'
import { CtaBand } from '@/components/site/cta-band'
import { CtaLink } from '@/components/site/cta-link'
import { PageHero } from '@/components/site/page-hero'
import { Section, SectionHeader } from '@/components/site/section'
import { getFacility } from '@/data/content'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Wenzhou Xiongba Apparel Co., Ltd. develops and manufactures children’s and teen thermal underwear and base-layer sets for brands, importers and wholesalers.',
  alternates: { canonical: '/about' },
}

const focusAreas = [
  {
    title: 'Children’s and teen thermal sets',
    description:
      'Our catalogue covers brushed fleece, soft knit, plus-fit and Lycra cotton thermal underwear sets for children and teens.',
  },
  {
    title: 'Catalogue models and OEM / ODM',
    description:
      'Buyers can select a catalogue model or develop their own by adjusting size, fabric, colour, print, binding and construction.',
  },
  {
    title: 'Sample-to-bulk development',
    description:
      'Each project moves from brief to sample to bulk production, with your sample approval before bulk begins.',
  },
]

export default function AboutPage() {
  const facility = getFacility()
  const exterior = facility.find((image) => image.key === 'exterior')
  const workshop = facility.find((image) => image.key === 'workshop')

  return (
    <>
      <PageHero
        eyebrow="About"
        title="A thermal underwear manufacturer for children and teens"
        description={`${siteConfig.legalName} develops and manufactures children’s and teen thermal underwear and base-layer sets, based in ${siteConfig.location}.`}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <Section id="company" labelledBy="company-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <SectionHeader
              id="company-title"
              eyebrow="The company"
              title="Garment development and production under one roof"
              description="We work with brands, importers and wholesalers who want thermal sets that fit well, feel right against the skin and arrive ready for their market."
            />
            <Reveal delay={140} className="mt-8">
              <CtaLink href="/manufacturing" variant="text">
                See the facility
              </CtaLink>
            </Reveal>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {exterior ? (
              <Reveal as="figure" className="sm:col-span-2">
                <div className="bg-muted relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={exterior.src}
                    alt={exterior.alt}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-muted-foreground mt-3 text-sm">{exterior.caption}</figcaption>
              </Reveal>
            ) : null}
            {workshop ? (
              <Reveal as="figure" delay={90} className="sm:col-span-2">
                <div className="bg-muted relative aspect-[16/8] overflow-hidden">
                  <Image
                    src={workshop.src}
                    alt={workshop.alt}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-muted-foreground mt-3 text-sm">{workshop.caption}</figcaption>
              </Reveal>
            ) : null}
          </div>
        </div>
      </Section>

      <Section id="focus" tone="sand" labelledBy="focus-title">
        <SectionHeader id="focus-title" eyebrow="What we do" title="Our focus" />
        <ul className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
          {focusAreas.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 90}>
              <div className="stitch-rule" aria-hidden="true" />
              <h3 className="font-serif mt-5 text-2xl leading-snug font-medium">{item.title}</h3>
              <p className="text-muted-foreground mt-3 leading-relaxed">{item.description}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand id="about-cta" />
    </>
  )
}
