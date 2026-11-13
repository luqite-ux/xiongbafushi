import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CtaLinkProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'text'
  arrow?: boolean
  className?: string
}

const variants = {
  primary:
    'bg-ink text-ink-foreground hover:bg-rust hover:text-rust-foreground border border-transparent',
  outline:
    'border border-foreground/70 text-foreground hover:bg-foreground hover:text-background',
  text: 'text-foreground underline decoration-rust decoration-2 underline-offset-[6px] hover:text-rust px-0 min-h-11',
}

export function CtaLink({ href, children, variant = 'primary', arrow = true, className }: CtaLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group/cta inline-flex min-h-12 items-center justify-center gap-2 text-sm font-semibold tracking-wide transition-[background-color,color,transform,border-color] duration-200 active:scale-[0.98]',
        variant !== 'text' && 'px-6',
        variants[variant],
        className,
      )}
    >
      {children}
      {arrow ? (
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-hover/cta:translate-x-1 group-focus-visible/cta:translate-x-1"
        />
      ) : null}
    </Link>
  )
}
