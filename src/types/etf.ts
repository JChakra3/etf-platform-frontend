export interface ETFSummary {
  id: number
  ticker: string
  name: string
  provider: string
  country: 'US' | 'CA'
  currency: 'USD' | 'CAD'
  etf_category: string
  asset_class: string
  strategy_type: string
  sector_focus: string | null
  geographic_exposure: string
  is_covered_call: boolean
  is_leveraged: boolean
  is_inverse: boolean
  is_hedged: boolean
  distribution_yield: number | null
  dividend_frequency: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual' | 'None' | null
  growth_or_income: 'Growth' | 'Income' | 'Balanced' | null
  mer: number | null
  aum_cad: number | null
  price: number | null
  exchange: string | null
  risk_score: number | null
}

export interface ETFHolding {
  holding_ticker: string
  holding_name: string
  weight_pct: number
  asset_type: string | null
  country: string | null
  as_of_date: string
}

export interface ETFMetricPoint {
  metric_date: string
  price: number | null
  total_return_1y: number | null
  distribution: number | null
  aum_cad: number | null
}

export interface ETFDetail extends ETFSummary {
  exchange: string
  inception_date: string | null
  management_fee: number | null
  is_esg: boolean
  tfsa_eligible: boolean
  rrsp_eligible: boolean
  withholding_tax_note: string | null
  roc_note: string | null
  ai_summary: string | null
  ai_overview: string | null
  risk_asset_class: number | null
  risk_concentration: number | null
  risk_leverage: number | null
  risk_liquidity: number | null
  risk_credit: number | null
  risk_currency: number | null
  last_scraped_at: string
  holdings: ETFHolding[]
  metrics: ETFMetricPoint[]
}

export interface SearchResponse {
  results: ETFSummary[]
  total: number
  page: number
  page_size: number
}

export interface SearchFilters {
  country?: string
  currency?: string
  asset_class?: string
  strategy_type?: string
  sector_focus?: string
  is_covered_call?: boolean
  is_leveraged?: boolean
  is_hedged?: boolean
  dividend_frequency?: string
  growth_or_income?: string
  risk_score_min?: number
  risk_score_max?: number
  mer_max?: number
  yield_min?: number
  aum_min_cad?: number
  exchange?: string
  price_min?: number
  price_max?: number
  sort?: 'aum_cad' | 'mer' | 'distribution_yield' | 'risk_score' | 'name' | 'price'
  order?: 'asc' | 'desc'
}
