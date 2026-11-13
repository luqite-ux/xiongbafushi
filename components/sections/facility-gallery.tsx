import { Section, SectionHeader } from '@/components/site/section'
import { getFacility, type FacilityImage } from '@/data/content'
import { FacilityFigure } from '@/components/sections/manufacturing'

function pick(images: FacilityImage[], key: string) {
  const image = images.find((item) => item.key === key)
  if (!image) throw new Error(`Missing facility image: ${key}`)
  return image
}

export function FacilityGallery() {
  const facility = getFacility()

  return (
    <Section id="facility" labelledBy="facility-title">
      <SectionHeader
        id="facility-title"
        eyebrow="Inside the facility"
        title="Workshop, sample room, warehouse and office"
        description="Photographs from the working areas that support each order, from sample development to packing."
      />

      <div className="mt-14 grid gap-x-5 gap-y-10 md:grid-cols-12">
        <FacilityFigure
          image={pick(facility, 'workshop')}
          aspect="aspect-[16/8]"
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="md:col-span-12"
        />
        <FacilityFigure
          image={pick(facility, 'sample-room')}
          aspect="aspect-[4/3]"
          sizes="(min-width: 768px) 58vw, 100vw"
          delay={60}
          className="md:col-span-7"
        />
        <FacilityFigure
          image={pick(facility, 'exterior')}
          aspect="aspect-[4/3]"
          sizes="(min-width: 768px) 40vw, 100vw"
          delay={140}
          className="md:col-span-5"
        />
        <FacilityFigure
          image={pick(facility, 'warehouse')}
          aspect="aspect-[4/3]"
          sizes="(min-width: 768px) 33vw, 100vw"
          className="md:col-span-4"
        />
        <FacilityFigure
          image={pick(facility, 'office')}
          aspect="aspect-[4/3]"
          sizes="(min-width: 768px) 33vw, 100vw"
          delay={90}
          className="md:col-span-4"
        />
        <FacilityFigure
          image={pick(facility, 'equipment')}
          aspect="aspect-[4/3]"
          sizes="(min-width: 768px) 33vw, 100vw"
          delay={180}
          className="md:col-span-4"
        />
      </div>
    </Section>
  )
}
