import Image from 'next/image'
import { Reveal } from '@/components/motion/reveal'
import { CtaLink } from '@/components/site/cta-link'
import { Section, SectionHeader } from '@/components/site/section'
import { getFacility, type FacilityImage } from '@/data/content'
import { cn } from '@/lib/utils'

type FacilityFigureProps = {
  image: FacilityImage
  aspect: string
  sizes: string
  delay?: number
  priority?: boolean
  className?: string
}

export function FacilityFigure({ image, aspect, sizes, delay = 0, priority, className }: FacilityFigureProps) {
  return (
    <Reveal as="figure" delay={delay} className={cn('group/fig', className)}>
      <div className={cn('bg-muted relative overflow-hidden', aspect)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover/fig:scale-[1.03]"
        />
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed">
        <span className="font-semibold">{image.title}.</span>{' '}
        <span className="text-muted-foreground">{image.caption}</span>
      </figcaption>
    </Reveal>
  )
}

function pick(images: FacilityImage[], key: string) {
  const image = images.find((item) => item.key === key)
  if (!image) throw new Error(`Missing facility image: ${key}`)
  return image
}

export function ManufacturingSection() {
  const facility = getFacility()

  return (
    <Section id="manufacturing" tone="sand" labelledBy="manufacturing-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <SectionHeader
            id="manufacturing-title"
            eyebrow="Manufacturing"
            title="See where your garments are made"
            description="Photographs of the sewing workshop, sample room and packing area, so you can review the working environment before you start."
          />
          <Reveal delay={140} className="mt-8 max-w-md">
            <p className="text-muted-foreground leading-relaxed">
              Samples are developed in the sample room, then bulk orders move through the workshop to inspection and
              packing. Visit the Manufacturing page for the full set of images and process notes.
            </p>
          </Reveal>
          <Reveal delay={200} className="mt-8">
            <CtaLink href="/manufacturing">Explore manufacturing</CtaLink>
          </Reveal>
        </div>

        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:col-span-7">
          <FacilityFigure
            image={pick(facility, 'workshop')}
            aspect="aspect-[16/9]"
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="sm:col-span-2"
          />
          <FacilityFigure
            image={pick(facility, 'sample-room')}
            aspect="aspect-[4/3]"
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
            delay={90}
          />
          <FacilityFigure
            image={pick(facility, 'warehouse')}
            aspect="aspect-[4/3]"
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
            delay={180}
          />
        </div>
      </div>
    </Section>
  )
}
