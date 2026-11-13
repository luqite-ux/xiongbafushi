'use client'

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RevealTag = 'div' | 'section' | 'article' | 'li' | 'header' | 'figure' | 'p' | 'ul' | 'ol' | 'dl'

type RevealProps = {
  as?: RevealTag
  variant?: 'up' | 'fade' | 'scale'
  delay?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
  id?: string
}

export function Reveal({
  as = 'div',
  variant = 'up',
  delay = 0,
  className,
  style,
  children,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reveal = () => element.setAttribute('data-revealed', 'true')

    if (typeof IntersectionObserver === 'undefined') {
      reveal()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal()
            observer.disconnect()
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return createElement(
    as,
    {
      ref,
      id,
      'data-reveal': variant,
      className: cn(className),
      style: { ...style, '--reveal-delay': `${delay}ms` } as CSSProperties,
    },
    children,
  )
}
