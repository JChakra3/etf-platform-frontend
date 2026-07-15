'use client'

import { useState, useEffect } from 'react'

const FALLBACK_RATE = 1.36
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export function useCurrency() {
  const [currency, setCurrency] = useState<'CAD' | 'USD'>('CAD')
  const [usdToCad, setUsdToCad] = useState(FALLBACK_RATE)

  useEffect(() => {
    const saved = localStorage.getItem('pref_currency')
    if (saved === 'CAD' || saved === 'USD') setCurrency(saved)

    // Fetch live FX rate
    fetch(`${API}/fx`)
      .then(r => r.json())
      .then(d => { if (d.usd_to_cad) setUsdToCad(d.usd_to_cad) })
      .catch(() => {})

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
    if (nativeCurrency === 'USD' && currency === 'CAD') return price * usdToCad
    if (nativeCurrency === 'CAD' && currency === 'USD') return price / usdToCad
    return price
  }

  return { currency, convertPrice, usdToCad }
}
