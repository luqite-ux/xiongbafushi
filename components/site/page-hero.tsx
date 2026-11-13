import Link from 'next/link'
import { Reveal } from '@/components/motion/reveal'

type Crumb = { label: string; href?: string }

type PageHeroProps = {
  eyebrow: string
  title: string
  description?: string
  crumbs?: Crumb[]
  children?: React.ReactNode
}

export function PageHero({ eyebrow, title, description, crumbs, children }: PageHeroProps) {
  return (
    <section className="tone-sand weave-surface border-b">
      <div className="mx-auto w-full max-w-[1280px] px-5 pt-10 pb-14 sm:px-8 md:pt-16 md:pb-20 lg:px-10">
        {crumbs ? (
          <Reveal as="div" variant="fade">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                {crumbs.map((crumb, index) => (
                  <li key={crumb.label} className="flex items-center gap-2">
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:text-rust underline-offset-4 hover:underline">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-foreground">
                        {crumb.label}
                      </span>
                    )}
                    {index < crumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        ) : null}
        <Reveal className="max-w-3xl">
          <p className="text-rust text-xs font-semibold tracking-[0.22em] uppercase">{eyebrow}</p>
          <h1 className="font-serif mt-4 text-[2.2rem] leading-[1.06] font-medium tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Reveal>
        {description ? (
          <Reveal delay={120} className="mt-6 max-w-2xl">
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">{description}</p>
          </Reveal>
        ) : null}
        {children ? (
          <Reveal delay={220} className="mt-8">
            {children}
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
