'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type TouchEvent } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { CtaLink } from '@/components/site/cta-link'
import type { HeroSlide } from '@/data/content'
import { cn } from '@/lib/utils'

const AUTOPLAY_MS = 7500
const SWIPE_THRESHOLD = 48

export function HeroCarousel({ slides, titleStyle }: { slides: HeroSlide[]; titleStyle?: CSSProperties }) {
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const count = slides.length

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const sync = () => setPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  const playing = !reducedMotion && !userPaused && !interacting && pageVisible

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % count), AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [playing, index, count])

  const goTo = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])
  const next = useCallback(() => goTo(index + 1), [goTo, index])

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      prev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    } else if (event.key === 'Home') {
      event.preventDefault()
      goTo(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      goTo(count - 1)
    }
  }

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) next()
      else prev()
    }
  }

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false)
      }}
      className="tone-ivory"
    >
      <div
        className="grid touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-live={playing ? 'off' : 'polite'}
      >
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index
          const Heading = active ? 'h1' : 'h2'
          // The manufacturing artwork reserves its clean copy-safe area on the right.
          // Keep that composition explicit even when maintained content replaces text fields.
          const copyOnRight = slide.id === 'manufacturing' || slide.copySide === 'right'

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${count}`}
              aria-hidden={!active}
              data-active={active}
              className="hero-slide relative flex flex-col xl:block xl:h-[clamp(540px,41.7vw,780px)]"
            >
              <div className="relative order-2 aspect-[3/2] w-full overflow-hidden md:aspect-[2.2/1] xl:absolute xl:inset-0 xl:aspect-auto">
                <Image
                  src={slide.image || '/placeholder.svg'}
                  alt={slide.imageAlt}
                  fill
                  priority={slideIndex === 0}
                  sizes="100vw"
                  quality={85}
                  className="hero-image object-cover"
                  style={{ objectPosition: slide.imagePosition }}
                />
              </div>

              <div
                className={cn(
                  'order-1 xl:absolute xl:inset-0 xl:flex xl:items-center',
                  copyOnRight ? 'xl:justify-end' : 'xl:justify-start',
                )}
              >
                <div className="mx-auto w-full max-w-[1280px] px-5 pt-9 pb-8 sm:px-8 md:pt-12 md:pb-10 xl:flex xl:px-10 xl:py-0 xl:pointer-events-none">
                  <div
                    className={cn(
                      'pointer-events-auto max-w-xl xl:max-w-[27rem]',
                      copyOnRight ? 'xl:ml-auto' : 'xl:mr-auto',
                      slide.localScrim && 'xl:bg-background/60 xl:-m-6 xl:p-6',
                    )}
                  >
                    <p
                      className="hero-layer text-rust text-xs font-semibold tracking-[0.22em] uppercase"
                      style={{ ['--layer' as string]: 0 }}
                    >
                      {slide.eyebrow}
                    </p>
                    <Heading
                      className="hero-layer font-serif mt-4 text-[2.15rem] leading-[1.05] font-medium tracking-tight sm:text-5xl xl:text-[3.2rem]"
                      style={{ ['--layer' as string]: 1, ...titleStyle }}
                    >
                      {slide.headline}
                    </Heading>
                    <p
                      className="hero-layer text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg"
                      style={{ ['--layer' as string]: 2 }}
                    >
                      {slide.body}
                    </p>
                    <div className="hero-layer mt-7" style={{ ['--layer' as string]: 3 }}>
                      <CtaLink href={slide.cta.href} className="w-full sm:w-auto">
                        {slide.cta.label}
                      </CtaLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-5 py-2 sm:px-8 lg:px-10">
          <p className="text-muted-foreground text-sm tabular-nums" aria-hidden="true">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </p>

          <div role="group" aria-label="Choose slide" className="flex items-center">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show slide ${slideIndex + 1}: ${slide.headline}`}
                aria-current={slideIndex === index}
                onClick={() => goTo(slideIndex)}
                className="group/dot flex h-11 w-11 items-center justify-center"
              >
                <span
                  className={cn(
                    'block h-[3px] transition-[width,background-color] duration-300',
                    slideIndex === index
                      ? 'bg-rust w-9'
                      : 'bg-foreground/35 group-hover/dot:bg-foreground/70 w-5',
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center">
            {reducedMotion ? null : (
              <button
                type="button"
                onClick={() => setUserPaused((value) => !value)}
                aria-pressed={userPaused}
                className="hover:text-rust inline-flex h-11 w-11 items-center justify-center transition-colors"
              >
                {userPaused ? (
                  <Play aria-hidden="true" className="size-5" />
                ) : (
                  <Pause aria-hidden="true" className="size-5" />
                )}
                <span className="sr-only">{userPaused ? 'Play slideshow' : 'Pause slideshow'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={prev}
              className="hover:text-rust inline-flex h-11 w-11 items-center justify-center transition-[color,transform] active:scale-90"
            >
              <ChevronLeft aria-hidden="true" className="size-6" />
              <span className="sr-only">Previous slide</span>
            </button>
            <button
              type="button"
              onClick={next}
              className="hover:text-rust inline-flex h-11 w-11 items-center justify-center transition-[color,transform] active:scale-90"
            >
              <ChevronRight aria-hidden="true" className="size-6" />
              <span className="sr-only">Next slide</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
