import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'
import { CurrentYear } from '@/components/site/current-year'
import { Wordmark } from '@/components/site/wordmark'
import { navItems, siteConfig } from '@/lib/site'

export function SiteFooter() {
  const buildYear = new Date().getFullYear()

  return (
    <footer className="tone-ink">
      <div className="weave-edge" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-5 py-14 sm:px-8 md:grid-cols-12 md:py-20 lg:px-10">
        <div className="md:col-span-5">
          <Wordmark className="text-ink-foreground" />
          <p className="text-muted-foreground mt-5 max-w-sm leading-relaxed">
            {siteConfig.legalName} develops and manufactures children’s and teen thermal underwear and base-layer sets
            for buyers, brands and private-label programmes.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="text-rust text-xs font-semibold tracking-[0.22em] uppercase">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 md:grid-cols-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="text-rust text-xs font-semibold tracking-[0.22em] uppercase">Contact</h2>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex min-h-11 items-center gap-3 underline-offset-4 hover:underline"
              >
                <Mail aria-hidden="true" className="text-rust size-4 shrink-0" />
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin aria-hidden="true" className="text-rust mt-1 size-4 shrink-0" />
              <span>{siteConfig.location}</span>
            </li>
          </ul>
          <Link
            href="/contact#rfq"
            className="border-ink-foreground/60 hover:bg-ink-foreground hover:text-ink mt-6 inline-flex min-h-12 items-center border px-6 text-sm font-semibold tracking-wide transition-colors"
          >
            Send an RFQ
          </Link>
        </div>
      </div>

      <div className="border-t">
        <p className="text-muted-foreground mx-auto w-full max-w-[1280px] px-5 py-6 text-sm sm:px-8 lg:px-10">
          © <CurrentYear fallbackYear={buildYear} /> {siteConfig.legalName}
        </p>
      </div>
    </footer>
  )
}
