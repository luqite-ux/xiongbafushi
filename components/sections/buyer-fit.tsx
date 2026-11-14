import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/site/section'
import { getBuyerFit } from '@/data/content'

export function BuyerFit() {
  const items = getBuyerFit()

  return (
    <Section id="buyer-fit" tone="sand" labelledBy="buyer-fit-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              id="buyer-fit-title"
              eyebrow="Buyer fit"
              title="Find the starting point that matches your range"
              description="Choose the sourcing profile closest to your programme, then compare the models and customization options that fit it."
            />
          </div>
        </div>

        <ol className="lg:col-span-8">
          {items.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 80} className="border-foreground/25 border-t last:border-b">
              <div className="grid gap-4 py-7 sm:grid-cols-[4rem_1fr] md:grid-cols-[4rem_1fr_auto] md:items-center md:gap-8 md:py-9">
                <span className="font-serif text-rust text-3xl tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-serif text-2xl leading-snug font-medium">{item.title}</h3>
                  <p className="text-muted-foreground mt-2 max-w-xl leading-relaxed">{item.description}</p>
                </div>
                <Link
                  href={item.href}
                  className="group/fit hover:text-rust inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-[6px] hover:underline sm:col-start-2 md:col-start-auto"
                >
                  {item.lookAt}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-hover/fit:translate-x-0.5 group-hover/fit:-translate-y-0.5"
                  />
                </Link>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
