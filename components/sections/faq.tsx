import { FaqGroups } from '@/components/sections/faq-groups'
import { Section, SectionHeader } from '@/components/site/section'
import { getFaqGroups, type FaqGroup } from '@/data/content'

export async function FaqSection({ groups }: { groups?: FaqGroup[] } = {}) {
  const resolvedGroups = groups ?? await getFaqGroups()

  return (
    <Section id="faq" tone="sand" labelledBy="faq-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <SectionHeader
          id="faq-title"
          eyebrow="FAQ"
          title="Questions buyers ask before an RFQ"
          description="Answers on products, customization, sampling and how to reach the team."
          className="lg:col-span-4 lg:self-start"
        />
        <FaqGroups groups={resolvedGroups} className="lg:col-span-8" />
      </div>
    </Section>
  )
}
