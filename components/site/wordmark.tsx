import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="XIONGBA home"
      className={cn(
        'font-serif inline-flex min-h-11 items-center text-[1.45rem] leading-none font-semibold tracking-[0.2em]',
        className,
      )}
    >
      XIONGBA
    </Link>
  )
}
