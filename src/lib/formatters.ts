export function formatPercent(value: number | null | undefined, decimals = 2): string {
  if (value == null) return '—'
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatMER(value: number | null | undefined): string {
  return formatPercent(value, 2)
}

export function formatAUM(valueCad: number | null | undefined): string {
  if (valueCad == null) return '—'
  if (valueCad >= 1_000_000) return `$${(valueCad / 1_000_000).toFixed(2)}T`
  if (valueCad >= 1_000) return `$${(valueCad / 1_000).toFixed(1)}B`
  return `$${valueCad.toFixed(0)}M`
}

export function formatCurrency(value: number | null | undefined, currency = 'CAD'): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value)
}

export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function riskLabel(score: number | null): string {
  if (score == null) return 'Unknown'
  return ({ 1: 'Low Risk', 2: 'Low-Med', 3: 'Medium', 4: 'Med-High', 5: 'High Risk' })[score] ?? 'Unknown'
}
