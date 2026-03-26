// Types for market data

export type PriceChange = {
  amount: number
  percentage: number
}

export type CropPrice = {
  id: string
  name: string
  price: number
  unit: string
  updatedAgo: string
  change: PriceChange
  trend: "up" | "down" | "stable"
}

export type PriceHistory = {
  date: string
  price: number
}

export type MarketTrend = {
  id: string
  title: string
  description: string
  impact: "low" | "medium" | "high"
  crops: string[]
  recommendation: string
}

export type PriceForecast = {
  cropId: string
  forecast: {
    trend: "up" | "down" | "stable"
    percentage: number
    confidence: number
    period: string
  }
}
