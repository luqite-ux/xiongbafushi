import { HeroCarousel } from '@/components/home/hero-carousel'
import { BuyerFit } from '@/components/sections/buyer-fit'
import { ContactRfq } from '@/components/sections/contact-rfq'
import { FaqSection } from '@/components/sections/faq'
import { ManufacturingSection } from '@/components/sections/manufacturing'
import { OemOdmSection } from '@/components/sections/oem-odm'
import { ProductCollections } from '@/components/sections/product-collections'
import { QualitySection } from '@/components/sections/quality'
import { SampleToBulk } from '@/components/sections/sample-to-bulk'
import { getHeroSlides } from '@/data/content'

export default async function HomePage() {
  const slides = await getHeroSlides()

  return (
    <>
      <HeroCarousel slides={slides} />
      <ProductCollections />
      <BuyerFit />
      <OemOdmSection />
      <SampleToBulk />
      <ManufacturingSection />
      <QualitySection />
      <FaqSection />
      <ContactRfq />
    </>
  )
}
