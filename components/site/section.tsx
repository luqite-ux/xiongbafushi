import { Reveal } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

type Tone = 'ivory' | 'sand' | 'ink'

const toneClass: Record<Tone, string> = {
  ivory: 'tone-ivory',
  sand: 'tone-sand weave-surface',
  ink: 'tone-ink',
}

type SectionProps = {
  id?: string
  tone?: Tone
  className?: string
  innerClassName?: string
  children: React.ReactNode
  labelledBy?: string
}

export function Section({ id, tone = 'ivory', className, innerClassName, children, labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative scroll-mt-20', toneClass[tone], className)}
    >
      <div className={cn('mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 md:py-24 lg:px-10', innerClassName)}>
        {children}
      </div>
    </section>
  )
}

type SectionHeaderProps = {
  id: string
  eyebrow: string
  title: string
  description?: string
  level?: 1 | 2
  className?: string
  children?: React.ReactNode
}

export function SectionHeader({ id, eyebrow, title, description, level = 2, className, children }: SectionHeaderProps) {
  const Heading = level === 1 ? 'h1' : 'h2'
  return (
    <Reveal className={cn('max-w-2xl', className)}>
      <p className="text-rust text-xs font-semibold tracking-[0.22em] uppercase">{eyebrow}</p>
      <Heading
        id={id}
        className="font-serif mt-4 text-[1.9rem] leading-[1.1] font-medium tracking-tight sm:text-4xl lg:text-[2.6rem]"
      >
        {title}
      </Heading>
      {description ? (
        <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">{description}</p>
      ) : null}
      {children}
    </Reveal>
  )
}
