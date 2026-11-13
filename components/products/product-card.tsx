import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import type { Product } from '@/data/products'
import { cn } from '@/lib/utils'

type ProductCardProps = {
  product: Product
  index?: number
  priority?: boolean
  className?: string
}

export function ProductCard({ product, index = 0, priority = false, className }: ProductCardProps) {
  const cover = product.images[0]

  return (
    <Reveal as="article" delay={(index % 4) * 90} className={cn('group/card', className)}>
      <Link
        href={`/products/${product.slug}`}
        className="focus-visible:outline-ring block"
        aria-label={`${product.model}: ${product.name}`}
      >
        <div className="bg-stage relative aspect-square overflow-hidden">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              'object-contain',
              cover.blendWhite && 'mix-blend-multiply',
            )}
          />
          <span className="bg-background/90 absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold tracking-[0.14em]">
            {product.model}
          </span>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl leading-snug font-medium">{product.shortName}</h3>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {product.wearer} · {product.fabricGroup}
            </p>
          </div>
          <ArrowUpRight
            aria-hidden="true"
            className="text-rust mt-1 size-5 shrink-0 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
          />
        </div>
      </Link>
    </Reveal>
  )
}
