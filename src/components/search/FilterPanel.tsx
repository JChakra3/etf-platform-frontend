'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'

const COUNTRIES = ['US', 'CA']
const CURRENCIES = ['USD', 'CAD']
const ASSET_CLASSES = ['Stocks', 'Bonds', 'Gold', 'Commodities', 'Cash', 'Crypto', 'Mixed']
const STRATEGIES = ['Passive Index', 'Active', 'Covered Call', 'Leveraged', 'Inverse', 'Dividend Growth', 'Income']
const DIV_FREQS = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'None']
const GROWTH_INCOME = ['Growth', 'Income', 'Balanced']

export function FilterPanel() {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  function applyFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value == null || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/search?${params.toString()}`)
  }

  const activeCount = ['country', 'currency', 'asset_class', 'strategy_type',
    'is_covered_call', 'is_leveraged', 'is_hedged', 'dividend_frequency',
    'growth_or_income', 'risk_score_min', 'risk_score_max', 'mer_max',
    'yield_min'].filter(k => searchParams.has(k)).length

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 active:bg-gray-100"
        aria-label="Open filters"
      >
        <SlidersHorizontal size={16} />
        <span className="hidden sm:inline">Filter</span>
        {activeCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[--color-brand] text-[10px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Bottom sheet overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/30" onClick={() => setOpen(false)}>
          <div
            className="max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-8 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Filters</h2>
              <button onClick={() => setOpen(false)} className="p-1 text-gray-400">
                <X size={20} />
              </button>
            </div>

            <FilterSection label="Country">
              <ChipGroup
                options={COUNTRIES}
                selected={searchParams.get('country')}
                onChange={(v) => applyFilter('country', v)}
              />
            </FilterSection>

            <FilterSection label="Currency">
              <ChipGroup
                options={CURRENCIES}
                selected={searchParams.get('currency')}
                onChange={(v) => applyFilter('currency', v)}
              />
            </FilterSection>

            <FilterSection label="Asset Class">
              <ChipGroup
                options={ASSET_CLASSES}
                selected={searchParams.get('asset_class')}
                onChange={(v) => applyFilter('asset_class', v)}
              />
            </FilterSection>

            <FilterSection label="Strategy">
              <ChipGroup
                options={STRATEGIES}
                selected={searchParams.get('strategy_type')}
                onChange={(v) => applyFilter('strategy_type', v)}
              />
            </FilterSection>

            <FilterSection label="Dividend Frequency">
              <ChipGroup
                options={DIV_FREQS}
                selected={searchParams.get('dividend_frequency')}
                onChange={(v) => applyFilter('dividend_frequency', v)}
              />
            </FilterSection>

            <FilterSection label="Focus">
              <ChipGroup
                options={GROWTH_INCOME}
                selected={searchParams.get('growth_or_income')}
                onChange={(v) => applyFilter('growth_or_income', v)}
              />
            </FilterSection>

            <FilterSection label="Risk Level (1 = Conservative, 5 = Very High)">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => {
                  const minActive = searchParams.get('risk_score_min') === String(n)
                  const maxActive = searchParams.get('risk_score_max') === String(n)
                  return (
                    <button
                      key={n}
                      onClick={() => {
                        applyFilter('risk_score_min', String(n))
                        applyFilter('risk_score_max', String(n))
                      }}
                      className={`h-9 w-9 rounded-lg border text-sm font-semibold transition ${
                        minActive || maxActive
                          ? 'border-[--color-brand] bg-[--color-brand-muted] text-[--color-brand]'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {n}
                    </button>
                  )
                })}
              </div>
            </FilterSection>

            <FilterSection label="Max MER">
              <div className="flex gap-2">
                {[['0.1%', '0.001'], ['0.25%', '0.0025'], ['0.5%', '0.005'], ['1%', '0.01']].map(([label, val]) => (
                  <button
                    key={val}
                    onClick={() => applyFilter('mer_max', val)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      searchParams.get('mer_max') === val
                        ? 'border-[--color-brand] bg-[--color-brand-muted] text-[--color-brand]'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </FilterSection>

            <button
              onClick={() => {
                router.push('/search')
                setOpen(false)
              }}
              className="mt-4 w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-500 active:bg-gray-50"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      {children}
    </div>
  )
}

function ChipGroup({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string | null
  onChange: (value: string | null) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(selected === opt ? null : opt)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            selected === opt
              ? 'border-[--color-brand] bg-[--color-brand-muted] text-[--color-brand]'
              : 'border-gray-200 text-gray-600'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
