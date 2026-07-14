'use client'

import { useEffect, useState } from 'react'
import { searchETFs } from '@/lib/api'
import type { SearchFilters, SearchResponse } from '@/types/etf'

export function useSearch(query: string, filters: SearchFilters, page = 1) {
  const [data, setData] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    searchETFs(query, filters, page)
      .then((res) => { if (!cancelled) { setData(res); setIsLoading(false) } })
      .catch((err) => { if (!cancelled) { setError(err); setIsLoading(false) } })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, JSON.stringify(filters), page])

  return { data, isLoading, error }
}
