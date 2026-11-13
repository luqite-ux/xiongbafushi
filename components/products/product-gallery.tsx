'use client'

import Image from 'next/image'
import { useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { ProductImage } from '@/data/products'
import { cn } from '@/lib/utils'

type ProductGalleryProps = {
  productName: string
  images: ProductImage[]
}

export function ProductGallery({ productName, images }: ProductGalleryProps) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const count = images.length
  const current = images[index]

  const step = (direction: 1 | -1) => setIndex((value) => (value + direction + count) % count)

  const onLightboxKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (count < 2) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group/stage bg-stage relative block aspect-square w-full overflow-hidden"
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1024px) 600px, 100vw"
          className={cn(
            'state-in object-contain p-2 transition-transform duration-500 group-hover/stage:scale-[1.03]',
            current.blendWhite && 'mix-blend-multiply',
          )}
        />
        <span className="bg-background/90 absolute right-3 bottom-3 inline-flex min-h-11 items-center gap-2 px-3 text-xs font-semibold tracking-wide">
          <Maximize2 aria-hidden="true" className="size-4" />
          View larger
        </span>
        <span className="sr-only">Open enlarged image: {current.caption}</span>
      </button>

      <p className="text-muted-foreground mt-3 text-sm" aria-live="polite">
        {index + 1} / {count} — {current.caption}
      </p>

      <ul className="mt-4 grid grid-cols-4 gap-3" aria-label={`${productName} images`}>
        {images.map((image, imageIndex) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-current={imageIndex === index}
              aria-label={`Show image ${imageIndex + 1}: ${image.caption}`}
              className={cn(
                'bg-stage relative block aspect-square w-full overflow-hidden border-2 transition-[border-color,transform] duration-200 active:scale-95',
                imageIndex === index ? 'border-rust' : 'hover:border-foreground/40 border-transparent',
              )}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="140px"
                className={cn('object-contain p-1', image.blendWhite && 'mix-blend-multiply')}
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          onKeyDown={onLightboxKeyDown}
          className="bg-stage max-h-[94dvh] w-[min(96vw,1000px)] max-w-none gap-0 overflow-hidden rounded-none p-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">{productName}</DialogTitle>
          <DialogDescription className="sr-only">{current.caption}</DialogDescription>
          <div className="flex min-h-0 items-center justify-center overflow-auto p-3 sm:p-6">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={1600}
              height={1600}
              sizes="96vw"
              className={cn(
                'h-auto max-h-[70dvh] w-auto max-w-full object-contain',
                current.blendWhite && 'mix-blend-multiply',
              )}
            />
          </div>
          <div className="bg-background flex items-center justify-between gap-3 border-t px-3 py-1 sm:px-5">
            <p className="text-sm">
              <span className="font-semibold">{index + 1} / {count}</span>
              <span className="text-muted-foreground"> — {current.caption}</span>
            </p>
            <div className="flex items-center">
              {count > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="hover:text-rust inline-flex size-11 items-center justify-center"
                  >
                    <ChevronLeft aria-hidden="true" className="size-6" />
                    <span className="sr-only">Previous image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="hover:text-rust inline-flex size-11 items-center justify-center"
                  >
                    <ChevronRight aria-hidden="true" className="size-6" />
                    <span className="sr-only">Next image</span>
                  </button>
                </>
              ) : null}
              <DialogClose className="hover:text-rust inline-flex size-11 items-center justify-center">
                <X aria-hidden="true" className="size-6" />
                <span className="sr-only">Close enlarged image</span>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
