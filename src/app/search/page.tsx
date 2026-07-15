'use client'

import { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, ArrowLeft, SlidersHorizontal, X } from 'lucide-react'
import { useSearch } from '@/hooks/useSearch'
import { ETFCard } from '@/components/etf/ETFCard'
import { SkeletonCard } from '@/components/shared/SkeletonCard'

const QUICK_CHIPS = [
  { label: 'All',          filters: {} },
  { label: 'Equities',     filters: { asset_class: 'Stocks' } },
  { label: 'Fixed Income', filters: { asset_class: 'Bonds' } },
  { label: 'High Yield',   filters: { yield_min: '0.04' } },
  { label: 'Covered Call', filters: { is_covered_call: 'true' } },
  { label: 'Leveraged',    filters: { is_leveraged: 'true' } },
  { label: 'Hedged',       filters: { is_hedged: 'true' } },
  { label: 'Cash',         filters: { asset_class: 'Cash' } },
]

const EXCHANGES = ['NYSE Arca', 'NASDAQ', 'Toronto', 'CBOE']
const COUNTRIES = ['US', 'CA']
const ASSET_CLASSES = ['Stocks', 'Bonds', 'Gold', 'Commodities', 'Cash', 'Mixed']

function RangeSlider({
  label, min, max, step, value, onChange, format,
}: {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  format: (v: number) => string
}) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">{label}</p>
        <span className="text-[13px] font-bold text-blue-600">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-blue-600"
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-400">{format(min)}</span>
        <span className="text-[10px] text-slate-400">{format(max)}</span>
      </div>
    </div>
  )
}

function DualRangeSlider({
  label, min, max, step, valueMin, valueMax, onChangeMin, onChangeMax, format,
}: {
  label: string
  min: number
  max: number
  step: number
  valueMin: number
  valueMax: number
  onChangeMin: (v: number) => void
  onChangeMax: (v: number) => void
  format: (v: number) => string
}) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">{label}</p>
        <span className="text-[13px] font-bold text-blue-600">{format(valueMin)} – {format(valueMax)}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 w-6">Min</span>
          <input
            type="range" min={min} max={max} step={step} value={valueMin}
            onChange={e => onChangeMin(Math.min(Number(e.target.value), valueMax - step))}
            className="flex-1 h-1.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-blue-600"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 w-6">Max</span>
          <input
            type="range" min={min} max={max} step={step} value={valueMax}
            onChange={e => onChangeMax(Math.max(Number(e.target.value), valueMin + step))}
            className="flex-1 h-1.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-blue-600"
          />
        </div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-400">{format(min)}</span>
        <span className="text-[10px] text-slate-400">{format(max)}</span>
      </div>
    </div>
  )
}

function ChipGroup({ options, selected, onToggle }: {
  options: string[]
  selected: string | null
  onToggle: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold border transition-all ${
            selected === opt
              ? 'bg-blue-600 text-white border-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.25)]'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800'
          }`}
        >{opt}</button>
      ))}
    </div>
  )
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">{children}</p>
}

function SearchResults() {
  const params = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [showFilters, setShowFilters] = useState(false)
  const [, startTransition] = useTransition()

  // Slider draft state (not applied until user hits Apply)
  const [draftPriceMin, setDraftPriceMin] = useState(0)
  const [draftPriceMax, setDraftPriceMax] = useState(1000)
  const [draftMerMax, setDraftMerMax] = useState(3)
  const [draftYieldMin, setDraftYieldMin] = useState(0)
  const [draftExchange, setDraftExchange] = useState<string | null>(params.get('exchange'))
  const [draftCountry, setDraftCountry] = useState<string | null>(params.get('country'))
  const [draftAssetClass, setDraftAssetClass] = useState<string | null>(params.get('asset_class'))

  function openFilters() {
    // Sync draft state from current URL params
    setDraftPriceMin(params.get('price_min') ? Number(params.get('price_min')) : 0)
    setDraftPriceMax(params.get('price_max') ? Number(params.get('price_max')) : 1000)
    setDraftMerMax(params.get('mer_max') ? Number(params.get('mer_max')) * 100 : 3)
    setDraftYieldMin(params.get('yield_min') ? Number(params.get('yield_min')) * 100 : 0)
    setDraftExchange(params.get('exchange'))
    setDraftCountry(params.get('country'))
    setDraftAssetClass(params.get('asset_class'))
    setShowFilters(true)
  }

  function applyFilters() {
    const p = new URLSearchParams()
    if (params.get('q')) p.set('q', params.get('q')!)
    if (draftCountry) p.set('country', draftCountry)
    if (draftAssetClass) p.set('asset_class', draftAssetClass)
    if (draftExchange) p.set('exchange', draftExchange)
    if (draftPriceMin > 0) p.set('price_min', String(draftPriceMin))
    if (draftPriceMax < 1000) p.set('price_max', String(draftPriceMax))
    if (draftMerMax < 3) p.set('mer_max', String(draftMerMax / 100))
    if (draftYieldMin > 0) p.set('yield_min', String(draftYieldMin / 100))
    router.push(`/search?${p.toString()}`)
    setShowFilters(false)
  }

  function clearFilters() {
    setDraftPriceMin(0); setDraftPriceMax(1000)
    setDraftMerMax(3); setDraftYieldMin(0)
    setDraftExchange(null); setDraftCountry(null); setDraftAssetClass(null)
  }

  function applyQuickChip(chip: typeof QUICK_CHIPS[0]) {
    const p = new URLSearchParams()
    if (params.get('q')) p.set('q', params.get('q')!)
    Object.entries(chip.filters).forEach(([k, v]) => p.set(k, v))
    router.push(`/search?${p.toString()}`)
  }

  const activeChipLabel = QUICK_CHIPS.find(c =>
    Object.entries(c.filters).every(([k, v]) => params.get(k) === v) &&
    Object.keys(c.filters).length === [...params.keys()].filter(k => k !== 'q').length
  )?.label ?? 'All'

  const filters = {
    country:       params.get('country') ?? undefined,
    asset_class:   params.get('asset_class') ?? undefined,
    is_covered_call: params.get('is_covered_call') === 'true' ? true : undefined,
    is_leveraged:  params.get('is_leveraged') === 'true' ? true : undefined,
    is_hedged:     params.get('is_hedged') === 'true' ? true : undefined,
    mer_max:       params.get('mer_max') ? Number(params.get('mer_max')) : undefined,
    yield_min:     params.get('yield_min') ? Number(params.get('yield_min')) : undefined,
    exchange:      params.get('exchange') ?? undefined,
    price_min:     params.get('price_min') ? Number(params.get('price_min')) : undefined,
    price_max:     params.get('price_max') ? Number(params.get('price_max')) : undefined,
    risk_score_min: params.get('risk_score_min') ? Number(params.get('risk_score_min')) : undefined,
    risk_score_max: params.get('risk_score_max') ? Number(params.get('risk_score_max')) : undefined,
  }

  const { data, isLoading } = useSearch(params.get('q') ?? '', filters)

  const activeFilterCount = ['country', 'asset_class', 'exchange', 'price_min', 'price_max',
    'mer_max', 'yield_min', 'is_covered_call', 'is_leveraged', 'is_hedged'].filter(k => params.has(k)).length

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 pt-10 pb-6 px-5 transition-colors duration-200">

      {/* Search bar row */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <form onSubmit={e => { e.preventDefault(); startTransition(() => router.push(`/search?q=${encodeURIComponent(query.trim())}`)) }} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2.5} />
            <input
              type="search" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search ETFs..."
              className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl py-3 pl-9 pr-3 text-[14px] font-medium placeholder:text-slate-400 border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </form>
        {/* Filter button */}
        <button
          onClick={openFilters}
          className="relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm active:scale-95 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
          <span className="text-[12px] font-bold">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Quick filter chips */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-4 -mx-5 px-5 pb-1">
        {QUICK_CHIPS.map(chip => (
          <button
            key={chip.label}
            onClick={() => applyQuickChip(chip)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-bold tracking-wide transition-all shadow-sm ${
              activeChipLabel === chip.label
                ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] border border-blue-600'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Result count */}
      {!isLoading && data && (
        <p className="text-[12px] text-slate-400 dark:text-slate-500 font-medium mb-3">
          {data.total.toLocaleString()} ETFs
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
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={() => setShowFilters(false)}>
          <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none" style={{left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '393px'}}>
          <div
            className="w-full max-h-[88vh] overflow-y-auto no-scrollbar rounded-t-[32px] bg-white dark:bg-slate-900 px-5 pb-6 pt-5 border-t border-slate-100 dark:border-slate-800 pointer-events-auto animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-1.5 text-slate-400 dark:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Range */}
            <DualRangeSlider
              label="Price Range"
              min={0} max={1000} step={5}
              valueMin={draftPriceMin} valueMax={draftPriceMax}
              onChangeMin={setDraftPriceMin} onChangeMax={setDraftPriceMax}
              format={v => v >= 1000 ? 'Any' : `$${v}`}
            />

            {/* MER Max */}
            <RangeSlider
              label="Max MER"
              min={0} max={3} step={0.05}
              value={draftMerMax}
              onChange={setDraftMerMax}
              format={v => v >= 3 ? 'Any' : `${v.toFixed(2)}%`}
            />

            {/* Min Yield */}
            <RangeSlider
              label="Min Distribution Yield"
              min={0} max={15} step={0.5}
              value={draftYieldMin}
              onChange={setDraftYieldMin}
              format={v => v === 0 ? 'Any' : `${v.toFixed(1)}%`}
            />

            {/* Exchange */}
            <FilterLabel>Exchange</FilterLabel>
            <ChipGroup
              options={EXCHANGES}
              selected={draftExchange}
              onToggle={v => setDraftExchange(draftExchange === v ? null : v)}
            />

            {/* Country */}
            <FilterLabel>Country</FilterLabel>
            <ChipGroup
              options={COUNTRIES}
              selected={draftCountry}
              onToggle={v => setDraftCountry(draftCountry === v ? null : v)}
            />

            {/* Asset Class */}
            <FilterLabel>Asset Class</FilterLabel>
            <ChipGroup
              options={ASSET_CLASSES}
              selected={draftAssetClass}
              onToggle={v => setDraftAssetClass(draftAssetClass === v ? null : v)}
            />

            {/* Action buttons */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={clearFilters}
                className="flex-1 py-3.5 rounded-[16px] border border-slate-100 dark:border-slate-800 text-[14px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900"
              >
                Clear
              </button>
              <button
                onClick={applyFilters}
                className="flex-[2] py-3.5 rounded-[16px] bg-blue-600 text-white text-[14px] font-bold shadow-[0_4px_16px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-10 px-5 flex flex-col gap-3.5">{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}</div>}>
      <SearchResults />
    </Suspense>
  )
}
