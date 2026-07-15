'use client'

import { useState, useEffect } from 'react'

const USD_TO_CAD = 1.36

export function useCurrency() {
  const [currency, setCurrency] = useState<'CAD' | 'USD'>('CAD')

  useEffect(() => {
    const saved = localStorage.getItem('pref_currency')
    if (saved === 'CAD' || saved === 'USD') setCurrency(saved)

    function onStorage(e: StorageEvent) {
      if (e.key === 'pref_currency' && (e.newValue === 'CAD' || e.newValue === 'USD')) {
        setCurrency(e.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function convertPrice(price: number | null | undefined, nativeCurrency: string): number | null {
    if (price == null) return null
    if (nativeCurrency === currency) return price
    if (nativeCurrency === 'USD' && currency === 'CAD') return price * USD_TO_CAD
    if (nativeCurrency === 'CAD' && currency === 'USD') return price / USD_TO_CAD
    return price
  }

  return { currency, convertPrice }
}
