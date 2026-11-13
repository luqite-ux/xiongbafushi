'use client'

import { useSyncExternalStore } from 'react'

const noopSubscribe = () => () => {}

export function CurrentYear({ fallbackYear }: { fallbackYear: number }) {
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => fallbackYear,
  )
  return <>{year}</>
}
