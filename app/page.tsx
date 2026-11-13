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
import { getFaqGroups } from '@/data/content'
import { getSiteContent, siteContentMetadata } from '@/lib/site-content/site-content'
import { siteTypographyStyle } from '@/lib/site-content/typography'

export async function generateMetadata() {
  try { return await siteContentMetadata('/', 'en') } catch { return {} }
}

function text(value: unknown, fallback: string) {
  if (typeof value === 'string' && value.trim()) return value
  if (value && typeof value === 'object' && 'en' in value && typeof (value as { en?: unknown }).en === 'string') return (value as { en: string }).en
  return fallback
}

export default async function HomePage() {
  const fallbackSlides = await getHeroSlides()
  const fallbackFaq = await getFaqGroups()
  const snapshot = await getSiteContent('en').catch(() => null)
  const home = snapshot?.pages.find((page) => page.path === '/')
  const hero = home?.modules.find((module) => module.key === 'hero')
  const faq = home?.modules.find((module) => module.key === 'faq')
  const values = hero?.values ?? {}
  const slides = hero ? [{
    ...fallbackSlides[0],
    eyebrow: text(values.eyebrow, fallbackSlides[0].eyebrow),
    headline: text(values.title, fallbackSlides[0].headline),
    body: text(values.body, fallbackSlides[0].body),
    cta: { ...fallbackSlides[0].cta, label: text(values.primary_label, fallbackSlides[0].cta.label) },
  }, ...fallbackSlides.slice(1)] : fallbackSlides
  const faqItems = Array.isArray(faq?.values?.items) ? faq.values.items.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object')) : []
  const faqGroups = faqItems.length ? [{ id: 'maintained', title: 'Buyer questions', items: faqItems.map((item) => ({ question: text(item.question, 'Buyer question'), answer: text(item.answer, 'Please contact us for details.') })) }] : fallbackFaq
  const titleStyle = siteTypographyStyle(hero?.styles, 'title', { 'site-serif': 'var(--font-display)' })

  return (
    <div {...(snapshot ? { 'data-hq-content-version': snapshot.version } : {})}>
      <HeroCarousel slides={slides} titleStyle={titleStyle} />
      <ProductCollections />
      <BuyerFit />
      <OemOdmSection />
      <SampleToBulk />
      <ManufacturingSection />
      <QualitySection />
      <FaqSection groups={faqGroups} />
      <ContactRfq />
    </div>
  )
}
