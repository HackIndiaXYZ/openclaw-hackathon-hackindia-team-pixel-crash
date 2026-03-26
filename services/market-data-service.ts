// This service handles fetching market data from the API
// For now, we'll use mock data but structure it for easy API integration

export interface MarketPrice {
  id: string
  cropName: string
  currentPrice: number
  unit: string
  change: number
  changePercentage: number
  trend: "up" | "down" | "stable"
  lastUpdated: string
  marketLocation: string
}

export interface HistoricalPrice {
  date: string
  price: number
}

export interface CropMarketData {
  id: string
  name: string
  image: string
  currentPrice: number
  unit: string
  change: number
  changePercentage: number
  trend: "up" | "down" | "stable"
  lastUpdated: string
  marketLocation: string
  description: string
  historicalPrices: HistoricalPrice[]
  seasonality: {
    peak: string[]
    low: string[]
  }
  topProducers: {
    region: string
    percentage: number
  }[]
  demandForecast: "high" | "medium" | "low"
  priceOutlook: string
  marketInsights: string[]
}

// Mock data for demonstration
const marketData: CropMarketData[] = [
  {
    id: "1",
    name: "Rice",
    image: "/lush-rice-paddy.png",
    currentPrice: 2250,
    unit: "per quintal",
    change: 150,
    changePercentage: 7.1,
    trend: "up",
    lastUpdated: new Date().toISOString(),
    marketLocation: "Azadpur Mandi, Delhi",
    description: "Rice is one of India's most important food crops and a staple for a large portion of the population.",
    historicalPrices: generateHistoricalData(2000, 2300, 180),
    seasonality: {
      peak: ["October", "November", "December"],
      low: ["April", "May"],
    },
    topProducers: [
      { region: "West Bengal", percentage: 28 },
      { region: "Uttar Pradesh", percentage: 22 },
      { region: "Punjab", percentage: 18 },
    ],
    demandForecast: "high",
    priceOutlook: "Prices expected to remain stable with slight increases during festival season",
    marketInsights: [
      "Government MSP increased by 5% this year",
      "Export demand from Middle East countries rising",
      "Domestic consumption expected to increase by 3% this year",
    ],
  },
  {
    id: "2",
    name: "Wheat",
    image: "/endless-cornfield.png",
    currentPrice: 1950,
    unit: "per quintal",
    change: -75,
    changePercentage: -3.7,
    trend: "down",
    lastUpdated: new Date().toISOString(),
    marketLocation: "Khanna Mandi, Punjab",
    description:
      "Wheat is the second most important cereal crop in India after rice and is a staple food for millions.",
    historicalPrices: generateHistoricalData(1900, 2100, 180),
    seasonality: {
      peak: ["March", "April", "May"],
      low: ["August", "September"],
    },
    topProducers: [
      { region: "Uttar Pradesh", percentage: 35 },
      { region: "Punjab", percentage: 25 },
      { region: "Haryana", percentage: 15 },
    ],
    demandForecast: "medium",
    priceOutlook: "Prices expected to decrease slightly due to bumper harvest this season",
    marketInsights: [
      "Government procurement target set at 44 million tonnes",
      "International wheat prices falling due to increased global production",
      "Quality concerns in some regions due to unseasonal rains",
    ],
  },
  {
    id: "3",
    name: "Tomato",
    image: "/tomato-field.png",
    currentPrice: 3500,
    unit: "per quintal",
    change: 1200,
    changePercentage: 52.2,
    trend: "up",
    lastUpdated: new Date().toISOString(),
    marketLocation: "Kolar Market, Karnataka",
    description:
      "Tomatoes are one of the most consumed vegetables in India, used in various cuisines across the country.",
    historicalPrices: generateHistoricalData(2000, 4000, 180),
    seasonality: {
      peak: ["February", "March", "April"],
      low: ["July", "August"],
    },
    topProducers: [
      { region: "Maharashtra", percentage: 30 },
      { region: "Karnataka", percentage: 20 },
      { region: "Andhra Pradesh", percentage: 15 },
    ],
    demandForecast: "high",
    priceOutlook: "Prices expected to remain high due to crop damage in major producing regions",
    marketInsights: [
      "Recent unseasonal rains damaged crops in Maharashtra",
      "Transportation costs increased due to fuel price hike",
      "Cold storage facilities operating at full capacity",
    ],
  },
  {
    id: "4",
    name: "Potato",
    image: "/placeholder-cumeh.png",
    currentPrice: 1200,
    unit: "per quintal",
    change: 50,
    changePercentage: 4.3,
    trend: "up",
    lastUpdated: new Date().toISOString(),
    marketLocation: "Agra Mandi, Uttar Pradesh",
    description: "Potatoes are a staple vegetable in Indian households and are used in numerous traditional dishes.",
    historicalPrices: generateHistoricalData(1000, 1300, 180),
    seasonality: {
      peak: ["January", "February"],
      low: ["June", "July"],
    },
    topProducers: [
      { region: "Uttar Pradesh", percentage: 35 },
      { region: "West Bengal", percentage: 25 },
      { region: "Bihar", percentage: 15 },
    ],
    demandForecast: "medium",
    priceOutlook: "Prices expected to stabilize as new harvest reaches markets",
    marketInsights: [
      "Cold storage inventory 15% higher than last year",
      "Processing industry demand increasing by 8% annually",
      "Export opportunities opening up in neighboring countries",
    ],
  },
  {
    id: "5",
    name: "Onion",
    image: "/placeholder-eneq3.png",
    currentPrice: 1800,
    unit: "per quintal",
    change: -200,
    changePercentage: -10,
    trend: "down",
    lastUpdated: new Date().toISOString(),
    marketLocation: "Lasalgaon APMC, Maharashtra",
    description:
      "Onions are an essential ingredient in Indian cooking and their price fluctuations often impact household budgets significantly.",
    historicalPrices: generateHistoricalData(1500, 2500, 180),
    seasonality: {
      peak: ["October", "November"],
      low: ["April", "May"],
    },
    topProducers: [
      { region: "Maharashtra", percentage: 40 },
      { region: "Karnataka", percentage: 15 },
      { region: "Gujarat", percentage: 10 },
    ],
    demandForecast: "high",
    priceOutlook: "Prices expected to decrease further as new crop arrives in markets",
    marketInsights: [
      "Government banned exports to control domestic prices",
      "Buffer stock of 2 lakh tonnes created to stabilize market",
      "Increased area under cultivation this season",
    ],
  },
  {
    id: "6",
    name: "Soybean",
    image: "/placeholder-q2185.png",
    currentPrice: 4200,
    unit: "per quintal",
    change: 300,
    changePercentage: 7.7,
    trend: "up",
    lastUpdated: new Date().toISOString(),
    marketLocation: "Indore Mandi, Madhya Pradesh",
    description:
      "Soybean is an important oilseed crop in India, primarily grown for oil extraction and protein-rich meal.",
    historicalPrices: generateHistoricalData(3800, 4300, 180),
    seasonality: {
      peak: ["October", "November"],
      low: ["February", "March"],
    },
    topProducers: [
      { region: "Madhya Pradesh", percentage: 50 },
      { region: "Maharashtra", percentage: 30 },
      { region: "Rajasthan", percentage: 10 },
    ],
    demandForecast: "medium",
    priceOutlook: "Prices expected to remain firm due to strong export demand",
    marketInsights: [
      "Crushing units operating at 70% capacity",
      "International prices trending upward",
      "Area under cultivation decreased by 5% this year",
    ],
  },
]

// Generate realistic historical price data
function generateHistoricalData(minPrice: number, maxPrice: number, days: number): HistoricalPrice[] {
  const data: HistoricalPrice[] = []
  let currentPrice = (minPrice + maxPrice) / 2

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Add some randomness to create realistic price movements
    const change = (Math.random() - 0.5) * (maxPrice - minPrice) * 0.05
    currentPrice += change

    // Keep price within bounds
    if (currentPrice < minPrice) currentPrice = minPrice + Math.random() * 50
    if (currentPrice > maxPrice) currentPrice = maxPrice - Math.random() * 50

    data.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(currentPrice),
    })
  }

  return data
}

// Function to get all market prices (summary data)
export async function getMarketPrices(): Promise<MarketPrice[]> {
  // In a real implementation, this would fetch from an API
  // await fetch('https://api.example.com/market-prices')

  // For now, transform our mock data
  return marketData.map((crop) => ({
    id: crop.id,
    cropName: crop.name,
    currentPrice: crop.currentPrice,
    unit: crop.unit,
    change: crop.change,
    changePercentage: crop.changePercentage,
    trend: crop.trend,
    lastUpdated: crop.lastUpdated,
    marketLocation: crop.marketLocation,
  }))
}

// Function to get detailed data for a specific crop
export async function getCropMarketData(cropId: string): Promise<CropMarketData | null> {
  // In a real implementation, this would fetch from an API
  // await fetch(`https://api.example.com/crops/${cropId}/market-data`)

  // For now, find in our mock data
  const crop = marketData.find((c) => c.id === cropId)
  return crop || null
}

// Function to get all crops data
export async function getAllCropsMarketData(): Promise<CropMarketData[]> {
  // In a real implementation, this would fetch from an API
  // await fetch('https://api.example.com/crops/market-data')

  // For now, return our mock data
  return marketData
}

// This service would connect to a real API in production
// For now, we'll use mock data with realistic patterns

import type { MarketTrend } from "@/types/market-types"

// Mock API endpoint that would be replaced with a real API in production
const API_BASE_URL = "https://api.example.com/market-data"

// Mock historical data generator
// const generateHistoricalData = (crop: string, basePrice: number, days = 30): PriceHistory[] => {
//   const data: PriceHistory[] = []
//   const today = new Date()
//   let price = basePrice

//   // Generate data with realistic price movements
//   for (let i = days; i >= 0; i--) {
//     const date = new Date(today)
//     date.setDate(date.getDate() - i)

//     // Create realistic price movements with some volatility and trends
//     const volatility = Math.random() * 0.05 // 0-5% daily change
//     const trend = Math.sin(i / 10) * 0.02 // Slight cyclical trend
//     const change = volatility - 0.025 + trend // Center volatility around 0

//     price = price * (1 + change)

//     data.push({
//       date: date.toISOString().split("T")[0],
//       price: Math.round(price * 100) / 100,
//     })
//   }

//   return data
// }

// Get current market prices
// export async function getMarketPrices(): Promise<CropPrice[]> {
//   // In a real app, this would fetch from an API
//   // For demo purposes, we'll return mock data

//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   const marketPrices: CropPrice[] = [
//     {
//       id: "rice-paddy",
//       name: "Rice (Paddy)",
//       price: 2250,
//       unit: "quintal",
//       updatedAgo: "2 hours ago",
//       change: { amount: 150, percentage: 7.14 },
//       trend: "up",
//     },
//     {
//       id: "wheat",
//       name: "Wheat",
//       price: 2100,
//       unit: "quintal",
//       updatedAgo: "3 hours ago",
//       change: { amount: -50, percentage: -2.33 },
//       trend: "down",
//     },
//     {
//       id: "tomato",
//       name: "Tomato",
//       price: 3500,
//       unit: "quintal",
//       updatedAgo: "1 hour ago",
//       change: { amount: 700, percentage: 25 },
//       trend: "up",
//     },
//     {
//       id: "potato",
//       name: "Potato",
//       price: 1800,
//       unit: "quintal",
//       updatedAgo: "4 hours ago",
//       change: { amount: 0, percentage: 0 },
//       trend: "stable",
//     },
//     {
//       id: "onion",
//       name: "Onion",
//       price: 2200,
//       unit: "quintal",
//       updatedAgo: "2 hours ago",
//       change: { amount: -300, percentage: -12 },
//       trend: "down",
//     },
//     {
//       id: "soybean",
//       name: "Soybean",
//       price: 4200,
//       unit: "quintal",
//       updatedAgo: "5 hours ago",
//       change: { amount: -200, percentage: -5 },
//       trend: "down",
//     },
//     {
//       id: "cotton",
//       name: "Cotton",
//       price: 6500,
//       unit: "quintal",
//       updatedAgo: "3 hours ago",
//       change: { amount: 400, percentage: 6.17 },
//       trend: "up",
//     },
//   ]

//   return marketPrices
// }

// Get historical price data for a specific crop
// export async function getCropPriceHistory(
//   cropId: string,
//   period: "1w" | "1m" | "3m" | "6m" | "1y" = "1m",
// ): Promise<PriceHistory[]> {
//   // In a real app, this would fetch from an API
//   // For demo purposes, we'll generate mock data

//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 800))

//   // Map period to number of days
//   const days = {
//     "1w": 7,
//     "1m": 30,
//     "3m": 90,
//     "6m": 180,
//     "1y": 365,
//   }[period]

//   // Find the crop in our mock data
//   const crop = (await getMarketPrices()).find((c) => c.id === cropId)

//   if (!crop) {
//     throw new Error(`Crop with ID ${cropId} not found`)
//   }

//   return generateHistoricalData(crop.name, crop.price, days)
// }

// Get market trends and analysis
export async function getMarketTrends(): Promise<MarketTrend[]> {
  // In a real app, this would fetch from an API
  // For demo purposes, we'll return mock data

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  return [
    {
      id: "tomato-price-surge",
      title: "Tomato Price Surge",
      description: "Tomato prices have increased by 25% in the last week due to unseasonal rains affecting supply.",
      impact: "high",
      crops: ["tomato"],
      recommendation: "Consider selling your tomato produce now to maximize profits.",
    },
    {
      id: "onion-price-drop",
      title: "Onion Price Drop",
      description: "Onion prices have fallen by 12% due to increased supply from northern regions.",
      impact: "medium",
      crops: ["onion"],
      recommendation: "Consider storing your harvest if possible until prices recover.",
    },
    {
      id: "wheat-stable-outlook",
      title: "Wheat Stable Outlook",
      description: "Wheat prices are expected to remain stable over the next month with minimal fluctuations.",
      impact: "low",
      crops: ["wheat"],
      recommendation: "Regular selling schedule recommended, no need for special actions.",
    },
  ]
}

// Get price forecasts for crops
export async function getPriceForecasts(cropIds: string[]): Promise<any> {
  // In a real app, this would fetch from an API
  // For demo purposes, we'll return mock data

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // This would be a more complex model in a real application
  const forecasts = cropIds.map((id) => {
    const trend = Math.random() > 0.5 ? "up" : "down"
    const percentage = Math.round((Math.random() * 10 + 1) * 10) / 10

    return {
      cropId: id,
      forecast: {
        trend,
        percentage,
        confidence: Math.round(Math.random() * 30 + 70), // 70-100% confidence
        period: "next 2 weeks",
      },
    }
  })

  return forecasts
}
