import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, HelpCircle, Sparkles } from 'lucide-react'
import { getETF, getETFOverview } from '@/lib/api'
import { ETFHoldings } from '@/components/etf/ETFHoldings'
import { ETFTaxNotes } from '@/components/etf/ETFTaxNotes'
import { formatPercent, formatMER, formatAUM } from '@/lib/formatters'

interface Props {
  params: Promise<{ ticker: string }>
}

export async function generateMetadata({ params }: Props) {
  const { ticker } = await params
  try {
    const etf = await getETF(ticker)
    return {
      title: `${etf.ticker} — ${etf.name} | ETF Intelligence`,
      description: etf.ai_summary ?? `Research ${etf.ticker} on ETF Intelligence.`,
    }
  } catch {
    return { title: 'ETF Not Found | ETF Intelligence' }
  }
}

export default async function ETFPage({ params }: Props) {
  const { ticker } = await params
  let etf
  try {
    etf = await getETF(ticker)
  } catch {
    notFound()
  }

  // Fetch AI overview (generated+cached on first request)
  let aiOverview: string | null = null
  try {
    aiOverview = etf.ai_overview ?? await getETFOverview(ticker)
  } catch {
    // non-fatal
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 pt-10 pb-8 px-5 transition-colors duration-200">
      {/* Nav & Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white font-semibold text-sm mb-4 active:scale-95 transition-all w-fit"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back to Search
        </Link>
        <h1 className="text-[40px] font-black text-black dark:text-white tracking-tighter mb-1 leading-none">
          {ticker}
        </h1>
        <p className="text-[15px] font-medium text-zinc-500 dark:text-zinc-400 leading-snug">{etf.name}</p>
      </div>

      {/* AI Overview Card */}
      {(aiOverview || etf.ai_summary) && (
        <div className="bg-black dark:bg-slate-900 text-white rounded-3xl p-5 mb-6 shadow-lg shadow-black/5 dark:border dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3 text-emerald-300 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <h3 className="text-[13px] font-bold tracking-wide uppercase">AI Overview</h3>
          </div>
          <p className="text-[15px] font-medium leading-relaxed text-zinc-200 dark:text-zinc-300 opacity-90">
            {aiOverview ?? etf.ai_summary}
          </p>
        </div>
      )}

      {/* 2×2 Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MetricCard label="MER (Annual Fee)" value={formatMER(etf.mer)} />
        <MetricCard label="Distribution Yield" value={formatPercent(etf.distribution_yield)} />
        <MetricCard label="Asset Class" value={etf.asset_class} />
        <MetricCard label="Trading Currency" value={etf.currency} />
        {etf.dividend_frequency && (
          <MetricCard label="Pays Dividends" value={etf.dividend_frequency} />
        )}
        {etf.aum_cad && (
          <MetricCard label="AUM" value={formatAUM(etf.aum_cad)} />
        )}
      </div>

      {/* Holdings Accordion */}
      <ETFHoldings holdings={etf.holdings} />

      {/* Tax Notes Accordion */}
      <div className="mt-3">
        <ETFTaxNotes etf={etf} />
      </div>

      <div className="h-4" />
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-zinc-200 dark:border-slate-800 relative shadow-sm">
      <HelpCircle className="w-4 h-4 text-zinc-300 dark:text-slate-600 absolute top-3 right-3" strokeWidth={2} />
      <span className="block text-[11px] font-bold tracking-wider text-zinc-500 dark:text-slate-500 uppercase mb-1.5">
        {label}
      </span>
      <span className="block text-[17px] font-black text-black dark:text-white">{value}</span>
    </div>
  )
}
