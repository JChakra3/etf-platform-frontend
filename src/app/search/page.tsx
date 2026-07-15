'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, ArrowLeft, SlidersHorizontal, X } from 'lucide-react'
import { useSearch } from '@/hooks/useSearch'
import { ETFCard } from '@/components/etf/ETFCard'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { Suspense } from 'react'

const FILTER_CHIPS = ['All', 'Equities', 'Fixed Income', 'High Yield', 'Cash', 'Covered Call', 'Leveraged', 'Hedged', 'ESG']

function SearchResults() {
  const params = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [activeChip, setActiveChip] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [, startTransition] = useTransition()

  const filters = {
    country: params.get('country') ?? undefined,
    asset_class: params.get('asset_class') ?? undefined,
    is_covered_call: params.get('is_covered_call') === 'true' ? true : undefined,
    is_leveraged: params.get('is_leveraged') === 'true' ? true : undefined,
    is_hedged: params.get('is_hedged') === 'true' ? true : undefined,
    mer_max: params.get('mer_max') ? Number(params.get('mer_max')) : undefined,
    yield_min: params.get('yield_min') ? Number(params.get('yield_min')) : undefined,
    exchange: params.get('exchange') ?? undefined,
    price_min: params.get('price_min') ? Number(params.get('price_min')) : undefined,
    price_max: params.get('price_max') ? Number(params.get('price_max')) : undefined,
    risk_score_min: params.get('risk_score_min') ? Number(params.get('risk_score_min')) : undefined,
    risk_score_max: params.get('risk_score_max') ? Number(params.get('risk_score_max')) : undefined,
  }

  const { data, isLoading } = useSearch(params.get('q') ?? '', filters)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    })
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 pt-10 pb-6 px-5 transition-colors duration-200">
      {/* Back + Search bar */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2.5} />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search ETFs..."
              className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl py-3 pl-9 pr-3 text-[14px] font-medium placeholder:text-slate-400 border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </form>
        <button
          onClick={() => setShowFilters(true)}
          className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <SlidersHorizontal className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-5 -mx-5 px-5 pb-1">
        {FILTER_CHIPS.map(f => (
          <button
            key={f}
            onClick={() => setActiveChip(f)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-bold tracking-wide transition-all shadow-sm ${
              activeChip === f
                ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] border border-blue-600'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Result count */}
      {!isLoading && data && (
        <p className="text-[12px] text-slate-400 dark:text-slate-500 font-medium mb-3">
          {data.total.toLocaleString()} results
        </p>
      )}

      {/* Results */}
      <div className="flex flex-col gap-3.5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : data?.results.map(etf => <ETFCard key={etf.id} etf={etf} />)
        }
        {!isLoading && data?.results.length === 0 && (
          <p className="mt-16 text-center text-sm text-slate-400">No ETFs found. Try different filters.</p>
        )}
      </div>

      {/* Filter bottom sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/30" onClick={() => setShowFilters(false)}>
          <div
            className="max-h-[80vh] overflow-y-auto rounded-t-[32px] bg-white dark:bg-slate-900 px-5 pb-10 pt-4 border-t border-slate-100 dark:border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-1.5 text-slate-400 dark:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterGroup label="Country">
              {['US', 'CA'].map(v => (
                <FilterChip key={v} label={v} active={params.get('country') === v}
                  onClick={() => {
                    const p = new URLSearchParams(params.toString())
                    params.get('country') === v ? p.delete('country') : p.set('country', v)
                    router.push(`/search?${p.toString()}`)
                  }}
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Exchange">
              {['NYSE Arca', 'NASDAQ', 'Toronto'].map(v => (
                <FilterChip key={v} label={v} active={params.get('exchange') === v}
                  onClick={() => {
                    const p = new URLSearchParams(params.toString())
                    params.get('exchange') === v ? p.delete('exchange') : p.set('exchange', v)
                    router.push(`/search?${p.toString()}`)
                  }}
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Price Range">
              {[['Under $25', '0', '25'], ['$25–$100', '25', '100'], ['$100–$500', '100', '500'], ['Over $500', '500', '']].map(([label, min, max]) => (
                <FilterChip key={label} label={label}
                  active={params.get('price_min') === min && params.get('price_max') === (max || '')}
                  onClick={() => {
                    const p = new URLSearchParams(params.toString())
                    min ? p.set('price_min', min) : p.delete('price_min')
                    max ? p.set('price_max', max) : p.delete('price_max')
                    router.push(`/search?${p.toString()}`)
                  }}
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Max MER">
              {[['0.10%', '0.001'], ['0.25%', '0.0025'], ['0.50%', '0.005'], ['1.00%', '0.01']].map(([label, val]) => (
                <FilterChip key={val} label={label} active={params.get('mer_max') === val}
                  onClick={() => {
                    const p = new URLSearchParams(params.toString())
                    params.get('mer_max') === val ? p.delete('mer_max') : p.set('mer_max', val)
                    router.push(`/search?${p.toString()}`)
                  }}
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Risk Level">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => {
                    const p = new URLSearchParams(params.toString())
                    p.set('risk_score_min', String(n)); p.set('risk_score_max', String(n))
                    router.push(`/search?${p.toString()}`)
                  }}
                  className={`h-10 w-10 rounded-xl border text-sm font-bold transition ${
                    params.get('risk_score_min') === String(n)
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600'
                      : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900'
                  }`}
                >{n}</button>
              ))}
            </FilterGroup>

            <button
              onClick={() => { router.push('/search'); setShowFilters(false) }}
              className="mt-4 w-full py-3.5 rounded-[16px] border border-slate-100 dark:border-slate-800 text-sm font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[12px] font-bold border transition-all ${
        active
          ? 'bg-blue-600 text-white border-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.25)]'
          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800'
      }`}
    >
      {label}
    </button>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-10 px-5 flex flex-col gap-3.5">{Array.from({length:8}).map((_,i)=><SkeletonCard key={i}/>)}</div>}>
      <SearchResults />
    </Suspense>
  )
}
