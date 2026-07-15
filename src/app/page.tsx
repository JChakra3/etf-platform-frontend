'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Menu, X, Settings } from 'lucide-react'
import { useSearch } from '@/hooks/useSearch'
import { ETFCard } from '@/components/etf/ETFCard'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { FilterSheet } from '@/components/search/FilterSheet'
import type { SearchFilters } from '@/types/etf'

const FILTER_CHIPS = ['All', 'Equities', 'Fixed Income', 'High Yield', 'Cash', 'Covered Call']

const CHIP_FILTER_MAP: Record<string, Record<string, string>> = {
  'Equities':     { asset_class: 'Stocks' },
  'Fixed Income': { asset_class: 'Bonds' },
  'High Yield':   { yield_min: '0.04', growth_or_income: 'Income' },
  'Cash':         { asset_class: 'Cash' },
  'Covered Call': { is_covered_call: 'true' },
}

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [extraFilters, setExtraFilters] = useState<SearchFilters>({})
  const [, startTransition] = useTransition()

  const activeFilters = CHIP_FILTER_MAP[activeFilter] ?? {}
  const { data, isLoading } = useSearch('', {
    ...(activeFilters.asset_class ? { asset_class: activeFilters.asset_class } : {}),
    ...(activeFilters.is_covered_call ? { is_covered_call: true } : {}),
    ...(activeFilters.growth_or_income ? { growth_or_income: activeFilters.growth_or_income as any } : {}),
    ...extraFilters,
  })

  const activeFilterCount = Object.keys(extraFilters).length

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    })
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 pt-12 pb-6 px-5 transition-colors duration-200">
      {/* Header */}
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">Home</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Research, compare, and discover funds.</p>
        </div>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 -mr-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95"
        >
          <Menu className="w-6 h-6" strokeWidth={2} />
        </button>
      </header>

      {/* Search Input + Filter button */}
      <div className="flex items-center gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" strokeWidth={2.5} />
            </div>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by ticker, provider..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl py-4 pl-12 pr-4 text-[15px] font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </form>
        <FilterSheet
          currentFilters={extraFilters}
          onApply={setExtraFilters}
          activeCount={activeFilterCount}
        />
      </div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto no-scrollbar gap-2.5 mb-6 -mx-5 px-5 pb-2">
        {FILTER_CHIPS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[13px] font-bold tracking-wide transition-all shadow-sm ${
              activeFilter === f
                ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] border border-blue-600'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex flex-col gap-3.5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : data?.results.map(etf => <ETFCard key={etf.id} etf={etf} />)
        }
      </div>

      <div className="h-6" />

      {/* Hamburger Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Full-screen dim — no blur */}
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Constrain panel to the app shell */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] flex justify-end pointer-events-none">
          <div className="relative pointer-events-auto w-[75%] bg-white dark:bg-slate-900 h-full shadow-[-20px_0_40px_rgba(0,0,0,0.15)] dark:shadow-[-20px_0_40px_rgba(0,0,0,0.4)] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>
            <div className="flex flex-col py-2 flex-1">
              <Link
                href="/settings"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-6 py-5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Settings className="w-6 h-6 text-slate-400 dark:text-slate-500" strokeWidth={2} />
                <span className="text-[16px] font-semibold">Settings</span>
              </Link>
              <div className="mt-auto pb-10">
                <div className="mb-4 border-t border-slate-100 dark:border-slate-800 mx-6" />
                <Link
                  href="/feedback"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-6 py-4 text-[15px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Provide Feedback
                </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  )
}
