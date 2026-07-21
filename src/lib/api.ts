import type { ETFDetail, ETFMetricPoint, SearchFilters, SearchResponse } from '@/types/etf'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

export function searchETFs(
  q: string,
  filters: SearchFilters = {},
  page = 1,
  pageSize = 20,
): Promise<SearchResponse> {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (filters.country) params.set('country', filters.country)
  if (filters.currency) params.set('currency', filters.currency)
  if (filters.asset_class) params.set('asset_class', filters.asset_class)
  if (filters.strategy_type) params.set('strategy_type', filters.strategy_type)
  if (filters.sector_focus) params.set('sector_focus', filters.sector_focus)
  if (filters.is_covered_call != null) params.set('is_covered_call', String(filters.is_covered_call))
  if (filters.is_leveraged != null) params.set('is_leveraged', String(filters.is_leveraged))
  if (filters.is_hedged != null) params.set('is_hedged', String(filters.is_hedged))
  if (filters.dividend_frequency) params.set('dividend_frequency', filters.dividend_frequency)
  if (filters.growth_or_income) params.set('growth_or_income', filters.growth_or_income)
  if (filters.risk_score_min != null) params.set('risk_score_min', String(filters.risk_score_min))
  if (filters.risk_score_max != null) params.set('risk_score_max', String(filters.risk_score_max))
  if (filters.mer_max != null) params.set('mer_max', String(filters.mer_max))
  if (filters.yield_min != null) params.set('yield_min', String(filters.yield_min))
  if (filters.aum_min_cad != null) params.set('aum_min_cad', String(filters.aum_min_cad))
  if (filters.exchange) params.set('exchange', filters.exchange)
  if (filters.price_min != null) params.set('price_min', String(filters.price_min))
  if (filters.price_max != null) params.set('price_max', String(filters.price_max))
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.order) params.set('order', filters.order)
  params.set('page', String(page))
  params.set('page_size', String(pageSize))

  return apiFetch<SearchResponse>(`/search?${params.toString()}`)
}

export function getETF(ticker: string): Promise<ETFDetail> {
  return apiFetch<ETFDetail>(`/etfs/${ticker}`)
}

export interface ChatMessage { role: 'user' | 'assistant'; content: string }

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const data = await apiFetch<{ reply: string }>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  })
  return data.reply
}

export async function getETFOverview(ticker: string): Promise<string> {
  const data = await apiFetch<{ overview: string }>(`/ai/overview/${ticker}`)
  return data.overview
}

export function getETFMetrics(
  ticker: string,
  period: '1m' | '3m' | '6m' | '1y' | '3y' | '5y' = '1y',
): Promise<ETFMetricPoint[]> {
  return apiFetch<ETFMetricPoint[]>(`/etfs/${ticker}/metrics?period=${period}`)
}
