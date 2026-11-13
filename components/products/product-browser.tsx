'use client'

import { useMemo, useState } from 'react'
import { ProductCard } from '@/components/products/product-card'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { FabricGroup, Product, Wearer } from '@/data/products'
import { cn } from '@/lib/utils'

type ProductBrowserProps = {
  products: Product[]
  wearers: Wearer[]
  fabrics: FabricGroup[]
}

type FilterGroupProps<T extends string> = {
  label: string
  options: T[]
  value: T | 'all'
  onChange: (value: T | 'all') => void
}

function FilterGroup<T extends string>({ label, options, value, onChange }: FilterGroupProps<T>) {
  const all = ['all', ...options] as const
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="text-muted-foreground w-24 shrink-0 text-xs font-semibold tracking-[0.18em] uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {all.map((option) => {
          const selected = value === option
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option as T | 'all')}
              className={cn(
                'min-h-11 border px-4 text-sm font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.97]',
                selected
                  ? 'bg-ink text-ink-foreground border-ink'
                  : 'border-input hover:border-foreground bg-transparent',
              )}
            >
              {option === 'all' ? 'All' : option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ProductBrowser({ products, wearers, fabrics }: ProductBrowserProps) {
  const [wearer, setWearer] = useState<Wearer | 'all'>('all')
  const [fabric, setFabric] = useState<FabricGroup | 'all'>('all')

  const visible = useMemo(
    () =>
      products.filter(
        (product) =>
          (wearer === 'all' || product.wearer === wearer) && (fabric === 'all' || product.fabricGroup === fabric),
      ),
    [products, wearer, fabric],
  )

  const reset = () => {
    setWearer('all')
    setFabric('all')
  }

  return (
    <div>
      <div className="space-y-4 border-y py-5">
        <FilterGroup label="Wearer" options={wearers} value={wearer} onChange={setWearer} />
        <FilterGroup label="Fabric" options={fabrics} value={fabric} onChange={setFabric} />
      </div>

      <p className="text-muted-foreground mt-5 text-sm" role="status">
        Showing {visible.length} of {products.length} models
      </p>

      {visible.length > 0 ? (
        <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((product, index) => (
            <li key={product.slug}>
              <ProductCard product={product} index={index} priority={index < 2} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty className="mt-8 border">
          <EmptyHeader>
            <EmptyTitle>No models match these filters</EmptyTitle>
            <EmptyDescription>Clear the filters to see every model, or send an RFQ for a style not listed.</EmptyDescription>
          </EmptyHeader>
          <button
            type="button"
            onClick={reset}
            className="bg-ink text-ink-foreground hover:bg-rust hover:text-rust-foreground min-h-11 px-5 text-sm font-semibold transition-colors"
          >
            Clear filters
          </button>
        </Empty>
      )}
    </div>
  )
}
