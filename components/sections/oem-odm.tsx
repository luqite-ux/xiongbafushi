import Image from 'next/image'
import { Reveal } from '@/components/motion/reveal'
import { CtaLink } from '@/components/site/cta-link'
import { Section, SectionHeader } from '@/components/site/section'
import { getCustomization } from '@/data/content'

export function CustomizationList() {
  const dimensions = getCustomization()

  return (
    <dl className="grid gap-x-10 sm:grid-cols-2">
      {dimensions.map((dimension, index) => (
        <Reveal
          key={dimension.key}
          delay={(index % 2) * 90 + Math.floor(index / 2) * 60}
          className="border-foreground/25 border-t py-6"
        >
          <dt className="flex items-baseline gap-3">
            <span className="text-rust text-xs font-semibold tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            <span className="font-serif text-2xl font-medium">{dimension.label}</span>
          </dt>
          <dd className="text-muted-foreground mt-3 leading-relaxed">{dimension.description}</dd>
        </Reveal>
      ))}
    </dl>
  )
}

export function OemOdmSection() {
  return (
    <Section id="oem-odm" tone="ink" labelledBy="oem-odm-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeader
            id="oem-odm-title"
            eyebrow="OEM / ODM"
            title="Six dimensions you can shape"
            description="Start from one of our models or bring your own reference. Size, fabric, colour, print, binding and construction can each be adjusted for your range."
          />
          <Reveal delay={140} className="mt-10">
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/products/xb-ly-004-seam-detail.jpg"
                  alt="Close view of fine ribbed peach-beige knit fabric with an overlocked seam"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-muted-foreground mt-3 text-sm">
                Ribbed knit and overlocked seam, shown on model XB-LY-004.
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={200} className="mt-8">
            <CtaLink
              href="/oem-odm"
              variant="outline"
              className="hover:bg-ink-foreground hover:text-ink border-ink-foreground/70"
            >
              See how customization works
            </CtaLink>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <CustomizationList />
        </div>
      </div>
    </Section>
  )
}
