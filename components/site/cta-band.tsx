import { Reveal } from '@/components/motion/reveal'
import { CtaLink } from '@/components/site/cta-link'
import { Section } from '@/components/site/section'

type CtaBandProps = {
  id?: string
  title?: string
  description?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
}

export function CtaBand({
  id = 'cta-band',
  title = 'Ready to compare garments for your range?',
  description = 'Send the model, quantity and market you have in mind, and our team will reply to your business email.',
  primary = { label: 'Start your RFQ', href: '/contact' },
  secondary = { label: 'Browse products', href: '/products' },
}: CtaBandProps) {
  return (
    <Section id={id} tone="ink" labelledBy={`${id}-title`} innerClassName="py-14 md:py-20">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal className="max-w-2xl">
          <h2 id={`${id}-title`} className="font-serif text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed opacity-85 sm:text-lg">{description}</p>
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-3 sm:flex-row">
          <CtaLink href={primary.href} className="bg-rust text-rust-foreground hover:bg-ink-foreground hover:text-ink">
            {primary.label}
          </CtaLink>
          <CtaLink
            href={secondary.href}
            variant="outline"
            className="border-ink-foreground/70 hover:bg-ink-foreground hover:text-ink"
          >
            {secondary.label}
          </CtaLink>
        </Reveal>
      </div>
    </Section>
  )
}
