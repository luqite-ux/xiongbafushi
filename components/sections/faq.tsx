import { FaqGroups } from '@/components/sections/faq-groups'
import { Section, SectionHeader } from '@/components/site/section'
import { getFaqGroups } from '@/data/content'

export async function FaqSection() {
  const groups = await getFaqGroups()

  return (
    <Section id="faq" tone="sand" labelledBy="faq-title">
      <SectionHeader
        id="faq-title"
        eyebrow="FAQ"
        title="Questions buyers ask before an RFQ"
        description="Answers on products, customization, sampling and how to reach the team."
      />
      <FaqGroups groups={groups} />
    </Section>
  )
}
