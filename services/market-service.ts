"use client"

import { useState, useEffect } from "react"

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
  marketLocation?: string
  quality?: string
  variety?: string
}

export type HistoricalPrice = {
  date: string
  price: number
}

export type MarketInsight = {
  type: "tip" | "alert" | "forecast"
  title: string
  description: string
  severity?: "low" | "medium" | "high"
}

// Mock data for current market prices
const marketPrices: CropPrice[] = [
  {
    id: "rice-paddy",
    name: "Rice (Paddy)",
    price: 2250,
    unit: "quintal",
    updatedAgo: "2 hours ago",
    change: { amount: 150, percentage: 7.14 },
    trend: "up",
    marketLocation: "Ludhiana Mandi",
    quality: "Grade A",
    variety: "Basmati",
  },
  {
    id: "wheat",
    name: "Wheat",
    price: 2100,
    unit: "quintal",
    updatedAgo: "3 hours ago",
    change: { amount: -50, percentage: -2.33 },
    trend: "down",
    marketLocation: "Amritsar Mandi",
    quality: "Standard",
    variety: "HD-2967",
  },
  {
    id: "tomato",
    name: "Tomato",
    price: 3500,
    unit: "quintal",
    updatedAgo: "1 hour ago",
    change: { amount: 700, percentage: 25 },
    trend: "up",
    marketLocation: "Delhi Wholesale Market",
    quality: "Premium",
    variety: "Hybrid",
  },
  {
    id: "potato",
    name: "Potato",
    price: 1800,
    unit: "quintal",
    updatedAgo: "4 hours ago",
    change: { amount: 0, percentage: 0 },
    trend: "stable",
    marketLocation: "Agra Mandi",
    quality: "Standard",
    variety: "Kufri Jyoti",
  },
  {
    id: "onion",
    name: "Onion",
    price: 2200,
    unit: "quintal",
    updatedAgo: "2 hours ago",
    change: { amount: -300, percentage: -12 },
    trend: "down",
    marketLocation: "Nashik Mandi",
    quality: "Standard",
    variety: "Red",
  },
  {
    id: "soybean",
    name: "Soybean",
    price: 4200,
    unit: "quintal",
    updatedAgo: "5 hours ago",
    change: { amount: -200, percentage: -5 },
    trend: "down",
    marketLocation: "Indore Mandi",
    quality: "Grade A",
    variety: "JS-335",
  },
  {
    id: "cotton",
    name: "Cotton",
    price: 6500,
    unit: "quintal",
    updatedAgo: "3 hours ago",
    change: { amount: 400, percentage: 6.17 },
    trend: "up",
    marketLocation: "Rajkot Mandi",
    quality: "Long Staple",
    variety: "Bt Cotton",
  },
  {
    id: "maize",
    name: "Maize",
    price: 1950,
    unit: "quintal",
    updatedAgo: "6 hours ago",
    change: { amount: 50, percentage: 2.63 },
    trend: "up",
    marketLocation: "Davangere Mandi",
    quality: "Standard",
    variety: "Hybrid",
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    price: 350,
    unit: "quintal",
    updatedAgo: "12 hours ago",
    change: { amount: 15, percentage: 4.48 },
    trend: "up",
    marketLocation: "Muzaffarnagar Mandi",
    quality: "Standard",
    variety: "CO-0238",
  },
]

// Generate historical price data for a crop
export const generateHistoricalPrices = (cropId: string, days = 90): HistoricalPrice[] => {
  // Base price depends on crop
  let basePrice = 2000
  switch (cropId) {
    case "rice-paddy":
      basePrice = 2100
      break
    case "wheat":
      basePrice = 2150
      break
    case "tomato":
      basePrice = 2800
      break
    case "potato":
      basePrice = 1800
      break
    case "onion":
      basePrice = 2500
      break
    case "soybean":
      basePrice = 4400
      break
    case "cotton":
      basePrice = 6100
      break
    case "maize":
      basePrice = 1900
      break
    case "sugarcane":
      basePrice = 335
      break
    default:
      basePrice = 2000
  }

  // Generate data points
  const today = new Date()
  const data: HistoricalPrice[] = []

  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Add some randomness and seasonal patterns
    const seasonalFactor = Math.sin(((date.getMonth() + date.getDate() / 30) * Math.PI) / 6) * 0.15
    const randomFactor = (Math.random() - 0.5) * 0.1
    const trendFactor = (i / days) * 0.2 // Slight upward trend over time

    // Calculate price with variation
    const priceVariation = basePrice * (1 + seasonalFactor + randomFactor + trendFactor)

    data.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(priceVariation),
    })
  }

  return data
}

// Generate market insights
export const generateMarketInsights = (cropId?: string): MarketInsight[] => {
  const generalInsights: MarketInsight[] = [
    {
      type: "forecast",
      title: "Price increase expected for vegetables",
      description:
        "Due to upcoming festival season, vegetable prices are expected to rise by 10-15% in the next two weeks.",
      severity: "medium",
    },
    {
      type: "alert",
      title: "Export restrictions affecting grain prices",
      description: "Recent government export restrictions may cause domestic grain prices to fall in the short term.",
      severity: "high",
    },
    {
      type: "tip",
      title: "Best time to sell pulses",
      description: "Current market trends suggest selling pulses now rather than waiting for the next harvest season.",
      severity: "low",
    },
  ]

  // If a specific crop is selected, add crop-specific insights
  if (cropId) {
    const crop = marketPrices.find((c) => c.id === cropId)
    if (crop) {
      const cropSpecificInsights: MarketInsight[] = []

      if (crop.trend === "up") {
        cropSpecificInsights.push({
          type: "tip",
          title: `${crop.name} prices trending upward`,
          description: `Consider holding your ${crop.name.toLowerCase()} stock for potential higher returns in the coming weeks.`,
          severity: "medium",
        })
      } else if (crop.trend === "down") {
        cropSpecificInsights.push({
          type: "alert",
          title: `${crop.name} prices declining`,
          description: `${crop.name} prices have fallen by ${Math.abs(crop.change.percentage).toFixed(2)}% recently. Consider diversifying your crop portfolio.`,
          severity: "high",
        })
      }

      return [...cropSpecificInsights, ...generalInsights]
    }
  }

  return generalInsights
}

// Function to get market data
export const useMarketData = (searchQuery = "", selectedState?: string) => {
  const [data, setData] = useState<CropPrice[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from a market API
        // For demo purposes, we'll use mock data with a slight delay to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Filter data based on search query and selected state
        let filteredData = [...marketPrices]

        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filteredData = filteredData.filter(
            (crop) =>
              crop.name.toLowerCase().includes(query) ||
              crop.variety?.toLowerCase().includes(query) ||
              crop.marketLocation?.toLowerCase().includes(query),
          )
        }

        if (selectedState) {
          // This is a simplified filter - in a real app, you'd have proper state data
          filteredData = filteredData.filter((crop) => crop.marketLocation?.includes(selectedState))
        }

        setData(filteredData)
        setError(null)
      } catch (err) {
        setError("Failed to fetch market data. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchQuery, selectedState])

  return { data, loading, error }
}

// Function to get specific crop data
export const useCropData = (cropId: string) => {
  const [data, setData] = useState<CropPrice | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalPrice[]>([])
  const [insights, setInsights] = useState<MarketInsight[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from a market API
        await new Promise((resolve) => setTimeout(resolve, 600))

        const cropData = marketPrices.find((crop) => crop.id === cropId) || null
        const historical = generateHistoricalPrices(cropId)
        const marketInsights = generateMarketInsights(cropId)

        setData(cropData)
        setHistoricalData(historical)
        setInsights(marketInsights)
        setError(null)
      } catch (err) {
        setError("Failed to fetch crop data. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (cropId) {
      fetchData()
    }
  }, [cropId])

  return { data, historicalData, insights, loading, error }
}
