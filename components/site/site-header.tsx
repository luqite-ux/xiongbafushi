'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Wordmark } from '@/components/site/wordmark'
import { isActivePath, navItems } from '@/lib/site'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[4.5rem] lg:px-10">
        <Wordmark />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative inline-flex min-h-11 items-center px-3 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-rust after:transition-transform after:duration-300 hover:text-rust hover:after:scale-x-100 focus-visible:after:scale-x-100',
                      active && 'text-rust after:scale-x-100',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact#rfq"
            className="bg-ink text-ink-foreground hover:bg-rust hover:text-rust-foreground hidden min-h-11 items-center px-5 text-sm font-semibold tracking-wide transition-colors xl:inline-flex"
          >
            Send an RFQ
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="hover:bg-accent -mr-2 inline-flex size-11 items-center justify-center transition-colors lg:hidden"
          >
            {open ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
        className="bg-background max-h-[calc(100dvh-4rem)] overflow-y-auto border-t lg:hidden"
      >
        <ul className="mx-auto flex w-full max-w-[1280px] flex-col px-5 py-3 sm:px-8">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href)
            return (
              <li key={item.href} className="border-b border-dashed last:border-b-0">
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'font-serif flex min-h-14 items-center justify-between text-xl',
                    active && 'text-rust',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
          <li className="py-4">
            <Link
              href="/contact#rfq"
              className="bg-ink text-ink-foreground flex min-h-12 items-center justify-center text-sm font-semibold tracking-wide"
            >
              Send an RFQ
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
