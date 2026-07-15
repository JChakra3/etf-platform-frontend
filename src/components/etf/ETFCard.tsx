'use client'

import Link from 'next/link'
import type { ETFSummary } from '@/types/etf'
import { formatPercent, formatPrice } from '@/lib/formatters'
import { useCurrency } from '@/hooks/useCurrency'

interface Props {
  etf: ETFSummary
}

export function ETFCard({ etf }: Props) {
  const { currency, convertPrice } = useCurrency()
  const convertedPrice = convertPrice(etf.price, etf.currency ?? 'USD')

  return (
    <Link
      href={`/etf/${etf.ticker}`}
      className="flex items-center justify-between p-4 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-all shadow-sm"
    >
      <div className="flex-1 min-w-0 pr-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-0.5">{etf.ticker}</h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 truncate font-medium">{etf.name}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-[15px] font-bold text-slate-900 dark:text-white">
          {formatPrice(convertedPrice, currency)}
        </span>
        <span className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
          {formatPercent(etf.distribution_yield)}{' '}
          <span className="text-[10px] text-slate-400 dark:text-slate-500">YLD</span>
        </span>
      </div>
    </Link>
  )
}
