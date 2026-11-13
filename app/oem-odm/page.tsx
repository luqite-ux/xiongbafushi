import type { Metadata } from 'next'
import Image from 'next/image'
import { Reveal } from '@/components/motion/reveal'
import { CtaBand } from '@/components/site/cta-band'
import { PageHero } from '@/components/site/page-hero'
import { Section, SectionHeader } from '@/components/site/section'
import { CustomizationList } from '@/components/sections/oem-odm'
import { SampleToBulk } from '@/components/sections/sample-to-bulk'

export const metadata: Metadata = {
  title: 'OEM / ODM',
  description:
    'Customize children’s and teen thermal underwear by size, fabric, colour, print, binding and construction, with a clear sample-to-bulk process.',
  alternates: { canonical: '/oem-odm' },
}

const briefItems = [
  'A reference garment, sketch or one of our catalogue models as the starting point',
  'The intended wearer and the size range you plan to cover',
  'Fabric direction, colour palette and any print or artwork',
  'Binding and construction preferences, such as neckline, cuff and waistband finishing',
  'Estimated quantity and target market, if you already know them',
]

export default function OemOdmPage() {
  return (
    <>
      <PageHero
        eyebrow="OEM / ODM"
        title="Develop thermal sets to your own brief"
        description="Start from one of our models or bring your own reference. We work with you on six dimensions: size, fabric, colour, print, binding and construction."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'OEM / ODM' }]}
      />

      <Section id="customization" labelledBy="customization-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeader
              id="customization-title"
              eyebrow="Customization"
              title="What you can shape"
              description="Each dimension can be discussed on its own or combined into a complete development brief."
            />
            <Reveal delay={140} className="mt-10">
              <figure>
                <div className="bg-muted relative aspect-[4/5] overflow-hidden">
                  <Image
                    src="/images/products/xb-sr-001-waistband.jpg"
                    alt="Inside view of a cream thermal trouser waistband showing elastic and stitched seams"
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-muted-foreground mt-3 text-sm">
                  Waistband and seam construction on model XB-SR-001.
                </figcaption>
              </figure>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <CustomizationList />
          </div>
        </div>
      </Section>

      <SampleToBulk tone="sand" showLink={false} />

      <Section id="brief" labelledBy="brief-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader
              id="brief-title"
              eyebrow="Your brief"
              title="What to include in your first message"
              description="You do not need a complete specification. The more you can share, the more precisely we can respond."
            />
          </div>
          <Reveal delay={120} className="lg:col-span-7">
            <ul className="divide-y border-y">
              {briefItems.map((item, index) => (
                <li key={item} className="flex gap-5 py-5">
                  <span className="text-rust font-serif text-xl tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
              Minimum quantities, sample charges, payment terms and timing depend on the garment and are confirmed with
              you in writing for each project.
            </p>
          </Reveal>
        </div>
      </Section>

      <CtaBand
        id="oem-odm-cta"
        title="Send your OEM / ODM brief"
        description="Tell us the model or reference garment, the market you serve and the quantity you have in mind."
      />
    </>
  )
}
