'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import type { SearchFilters } from '@/types/etf'

const EXCHANGES    = ['NYSE Arca', 'NASDAQ', 'Toronto', 'CBOE']
const COUNTRIES    = ['US', 'CA']
const ASSET_CLASSES = ['Stocks', 'Bonds', 'Gold', 'Commodities', 'Mixed']

function RangeSlider({ label, min, max, step, value, onChange, format }: {
  label: string; min: number; max: number; step: number
  value: number; onChange: (v: number) => void; format: (v: number) => string
}) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">{label}</p>
        <span className="text-[13px] font-bold text-blue-600">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
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

function DualRangeSlider({ label, min, max, step, valueMin, valueMax, onChangeMin, onChangeMax, format }: {
  label: string; min: number; max: number; step: number
  valueMin: number; valueMax: number
  onChangeMin: (v: number) => void; onChangeMax: (v: number) => void
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
          <input type="range" min={min} max={max} step={step} value={valueMin}
            onChange={e => onChangeMin(Math.min(Number(e.target.value), valueMax - step))}
            className="flex-1 h-1.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-blue-600"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 w-6">Max</span>
          <input type="range" min={min} max={max} step={step} value={valueMax}
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

function ChipRow({ options, selected, onToggle }: {
  options: string[]; selected: string | null; onToggle: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {options.map(opt => (
        <button key={opt} onClick={() => onToggle(opt)}
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">{children}</p>
}

interface Props {
  currentFilters?: SearchFilters
  onApply: (filters: SearchFilters) => void
  activeCount?: number
}

export function FilterSheet({ currentFilters = {}, onApply, activeCount = 0 }: Props) {
  const [open, setOpen] = useState(false)
  const [priceMin,    setPriceMin]    = useState(currentFilters.price_min ?? 0)
  const [priceMax,    setPriceMax]    = useState(currentFilters.price_max ?? 1000)
  const [merMax,      setMerMax]      = useState(currentFilters.mer_max ? currentFilters.mer_max * 100 : 3)
  const [yieldMin,    setYieldMin]    = useState(currentFilters.yield_min ? currentFilters.yield_min * 100 : 0)
  const [exchange,    setExchange]    = useState<string | null>(currentFilters.exchange ?? null)
  const [country,     setCountry]     = useState<string | null>(currentFilters.country ?? null)
  const [assetClass,  setAssetClass]  = useState<string | null>(currentFilters.asset_class ?? null)

  function handleOpen() {
    setPriceMin(currentFilters.price_min ?? 0)
    setPriceMax(currentFilters.price_max ?? 1000)
    setMerMax(currentFilters.mer_max ? currentFilters.mer_max * 100 : 3)
    setYieldMin(currentFilters.yield_min ? currentFilters.yield_min * 100 : 0)
    setExchange(currentFilters.exchange ?? null)
    setCountry(currentFilters.country ?? null)
    setAssetClass(currentFilters.asset_class ?? null)
    setOpen(true)
    document.body.classList.add('filter-open')
  }

  function handleClose() {
    setOpen(false)
    document.body.classList.remove('filter-open')
  }

  function handleApply() {
    const f: SearchFilters = {}
    if (country)          f.country     = country
    if (assetClass)       f.asset_class = assetClass
    if (exchange)         f.exchange    = exchange
    if (priceMin > 0)     f.price_min   = priceMin
    if (priceMax < 1000)  f.price_max   = priceMax
    if (merMax < 3)       f.mer_max     = merMax / 100
    if (yieldMin > 0)     f.yield_min   = yieldMin / 100
    onApply(f)
    handleClose()
  }

  function handleClear() {
    setPriceMin(0); setPriceMax(1000)
    setMerMax(3); setYieldMin(0)
    setExchange(null); setCountry(null); setAssetClass(null)
  }

  return (
    <>
      <button onClick={handleOpen}
        className="relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm active:scale-95 transition-all"
      >
        <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
        <span className="text-[12px] font-bold">Filters</span>
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 animate-fade-in" onClick={handleClose}>
          <div className="w-full max-w-[393px]">
            <div
              className="w-full max-h-[88vh] overflow-y-auto no-scrollbar rounded-t-[32px] bg-white dark:bg-slate-900 px-5 pb-10 pt-5 animate-slide-up"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">Filters</h2>
                <button onClick={handleClose} className="p-1.5 text-slate-400 dark:text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <DualRangeSlider
                label="Price Range" min={0} max={1000} step={5}
                valueMin={priceMin} valueMax={priceMax}
                onChangeMin={setPriceMin} onChangeMax={setPriceMax}
                format={v => v >= 1000 ? 'Any' : `$${v}`}
              />
              <RangeSlider
                label="Max MER" min={0} max={3} step={0.05}
                value={merMax} onChange={setMerMax}
                format={v => v >= 3 ? 'Any' : `${v.toFixed(2)}%`}
              />
              <RangeSlider
                label="Min Distribution Yield" min={0} max={15} step={0.5}
                value={yieldMin} onChange={setYieldMin}
                format={v => v === 0 ? 'Any' : `${v.toFixed(1)}%`}
              />

              <SectionLabel>Exchange</SectionLabel>
              <ChipRow options={EXCHANGES} selected={exchange} onToggle={v => setExchange(exchange === v ? null : v)} />

              <SectionLabel>Country</SectionLabel>
              <ChipRow options={COUNTRIES} selected={country} onToggle={v => setCountry(country === v ? null : v)} />

              <SectionLabel>Asset Class</SectionLabel>
              <ChipRow options={ASSET_CLASSES} selected={assetClass} onToggle={v => setAssetClass(assetClass === v ? null : v)} />

              <div className="flex gap-3 mt-2">
                <button onClick={handleClear}
                  className="flex-1 py-3.5 rounded-[16px] border border-slate-100 dark:border-slate-800 text-[14px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900"
                >Clear</button>
                <button onClick={handleApply}
                  className="flex-[2] py-3.5 rounded-[16px] bg-blue-600 text-white text-[14px] font-bold shadow-[0_4px_16px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all"
                >Apply Filters</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
