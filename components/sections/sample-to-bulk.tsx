import { Reveal } from '@/components/motion/reveal'
import { CtaLink } from '@/components/site/cta-link'
import { Section, SectionHeader } from '@/components/site/section'
import { getWorkflow } from '@/data/content'

type SampleToBulkProps = {
  showLink?: boolean
  tone?: 'ivory' | 'sand'
}

export function SampleToBulk({ showLink = true, tone = 'ivory' }: SampleToBulkProps) {
  const steps = getWorkflow()

  return (
    <Section id="sample-to-bulk" tone={tone} labelledBy="sample-to-bulk-title">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          id="sample-to-bulk-title"
          eyebrow="Sample to bulk"
          title="From first brief to packed garments"
          description="One clear path in six steps. Your approval of the sample comes before bulk production begins."
        />
        {showLink ? (
          <CtaLink href="/oem-odm" variant="text" className="self-start md:self-auto">
            OEM / ODM details
          </CtaLink>
        ) : null}
      </div>

      <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Reveal as="li" key={step.title} delay={(index % 3) * 90}>
            <div className="stitch-rule" aria-hidden="true" />
            <p className="font-serif text-rust mt-5 text-4xl tabular-nums">{String(index + 1).padStart(2, '0')}</p>
            <h3 className="font-serif mt-3 text-2xl leading-snug font-medium">{step.title}</h3>
            <p className="text-muted-foreground mt-3 leading-relaxed">{step.description}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
