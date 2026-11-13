import { Reveal } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/site/section'
import { getCheckpoints } from '@/data/content'

export function QualitySection() {
  const checkpoints = getCheckpoints()

  return (
    <Section id="quality" labelledBy="quality-title">
      <SectionHeader
        id="quality-title"
        eyebrow="Quality"
        title="Four checkpoints between fabric and carton"
        description="Inspection standards and sampling levels are agreed with you per order. These are the points in the process where garments are checked."
      />

      <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {checkpoints.map((checkpoint, index) => (
          <Reveal as="li" key={checkpoint.title} delay={index * 90}>
            <div className="weave-edge" aria-hidden="true" />
            <p className="text-muted-foreground mt-5 text-xs font-semibold tracking-[0.2em] uppercase">
              Checkpoint {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="font-serif mt-3 text-2xl leading-snug font-medium">{checkpoint.title}</h3>
            <p className="text-muted-foreground mt-3 leading-relaxed">{checkpoint.description}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
