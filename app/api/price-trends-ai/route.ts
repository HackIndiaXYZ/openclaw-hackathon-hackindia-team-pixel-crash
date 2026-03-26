import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface PriceTrendAnalysis {
  success: boolean
  confidence: number
  forecast: string
  factors: string[]
  recommendation: string
  priceDirection: "bullish" | "bearish" | "neutral"
  volatilityLevel: "low" | "medium" | "high"
  keyInsights: string[]
}

// Mock price trends data
const priceTrendsData = {
  Rice: {
    currentPrice: 2850,
    previousPrice: 2720,
    change: 4.8,
    trend: "upward",
    forecast: [
      { month: "Jan 2024", price: 2720, predicted: 2750 },
      { month: "Feb 2024", price: 2780, predicted: 2800 },
      { month: "Mar 2024", price: 2850, predicted: 2870 },
      { month: "Apr 2024", price: null, predicted: 2920 },
      { month: "May 2024", price: null, predicted: 2980 },
      { month: "Jun 2024", price: null, predicted: 3050 },
    ],
    factors: [
      "Increased export demand from Middle East",
      "Reduced production in competing regions",
      "Government procurement at higher MSP",
      "Favorable monsoon predictions",
    ],
    recommendation: "Strong buy signal - prices expected to rise 7-10% over next quarter",
    confidence: 87,
    volatility: "Medium",
    seasonality: "Peak demand season approaching",
  },
  Wheat: {
    currentPrice: 2150,
    previousPrice: 2200,
    change: -2.3,
    trend: "downward",
    forecast: [
      { month: "Jan 2024", price: 2200, predicted: 2180 },
      { month: "Feb 2024", price: 2180, predicted: 2160 },
      { month: "Mar 2024", price: 2150, predicted: 2140 },
      { month: "Apr 2024", price: null, predicted: 2120 },
      { month: "May 2024", price: null, predicted: 2100 },
      { month: "Jun 2024", price: null, predicted: 2080 },
    ],
    factors: [
      "Bumper harvest expected this season",
      "Increased global supply from Russia/Ukraine",
      "Reduced industrial demand",
      "Government buffer stock release",
    ],
    recommendation: "Hold position - temporary decline expected before recovery",
    confidence: 82,
    volatility: "Low",
    seasonality: "Harvest season causing price pressure",
  },
  Cotton: {
    currentPrice: 6200,
    previousPrice: 5950,
    change: 4.2,
    trend: "upward",
    forecast: [
      { month: "Jan 2024", price: 5950, predicted: 6000 },
      { month: "Feb 2024", price: 6100, predicted: 6150 },
      { month: "Mar 2024", price: 6200, predicted: 6250 },
      { month: "Apr 2024", price: null, predicted: 6350 },
      { month: "May 2024", price: null, predicted: 6450 },
      { month: "Jun 2024", price: null, predicted: 6550 },
    ],
    factors: [
      "Strong textile industry recovery",
      "Export orders increasing from Bangladesh",
      "Reduced acreage in competing states",
      "Quality premium for Indian cotton",
    ],
    recommendation: "Buy on dips - strong fundamentals support higher prices",
    confidence: 91,
    volatility: "High",
    seasonality: "Pre-sowing season driving demand",
  },
  Sugarcane: {
    currentPrice: 350,
    previousPrice: 340,
    change: 2.9,
    trend: "upward",
    forecast: [
      { month: "Jan 2024", price: 340, predicted: 345 },
      { month: "Feb 2024", price: 345, predicted: 348 },
      { month: "Mar 2024", price: 350, predicted: 355 },
      { month: "Apr 2024", price: null, predicted: 360 },
      { month: "May 2024", price: null, predicted: 365 },
      { month: "Jun 2024", price: null, predicted: 370 },
    ],
    factors: [
      "Sugar mills increasing procurement",
      "Ethanol demand driving prices",
      "Favorable government policies",
      "Reduced production in Maharashtra",
    ],
    recommendation: "Moderate buy - steady growth expected",
    confidence: 85,
    volatility: "Low",
    seasonality: "Crushing season supporting prices",
  },
  Maize: {
    currentPrice: 1950,
    previousPrice: 1880,
    change: 3.7,
    trend: "upward",
    forecast: [
      { month: "Jan 2024", price: 1880, predicted: 1900 },
      { month: "Feb 2024", price: 1920, predicted: 1940 },
      { month: "Mar 2024", price: 1950, predicted: 1970 },
      { month: "Apr 2024", price: null, predicted: 2000 },
      { month: "May 2024", price: null, predicted: 2030 },
      { month: "Jun 2024", price: null, predicted: 2060 },
    ],
    factors: [
      "Poultry industry recovery boosting demand",
      "Starch industry expansion",
      "Export opportunities in Southeast Asia",
      "Reduced imports from Argentina",
    ],
    recommendation: "Buy - strong demand fundamentals",
    confidence: 88,
    volatility: "Medium",
    seasonality: "Demand picking up post-harvest",
  },
  Soybean: {
    currentPrice: 4200,
    previousPrice: 4000,
    change: 5.0,
    trend: "upward",
    forecast: [
      { month: "Jan 2024", price: 4000, predicted: 4050 },
      { month: "Feb 2024", price: 4050, predicted: 4100 },
      { month: "Mar 2024", price: 4100, predicted: 4150 },
      { month: "Apr 2024", price: null, predicted: 4200 },
      { month: "May 2024", price: null, predicted: 4250 },
      { month: "Jun 2024", price: null, predicted: 4300 },
    ],
    factors: [
      "Increased demand from animal feed industry",
      "Reduced soybean production in South America",
      "Government support for soybean cultivation",
      "Favorable trade agreements",
    ],
    recommendation: "Strong buy signal - prices expected to rise 5-8% over next quarter",
    confidence: 90,
    volatility: "Medium",
    seasonality: "Peak demand season approaching",
  },
  Turmeric: {
    currentPrice: 8500,
    previousPrice: 8000,
    change: 6.25,
    trend: "upward",
    forecast: [
      { month: "Jan 2024", price: 8000, predicted: 8100 },
      { month: "Feb 2024", price: 8100, predicted: 8200 },
      { month: "Mar 2024", price: 8200, predicted: 8300 },
      { month: "Apr 2024", price: null, predicted: 8400 },
      { month: "May 2024", price: null, predicted: 8500 },
      { month: "Jun 2024", price: null, predicted: 8600 },
    ],
    factors: [
      "Increased demand from pharmaceutical industry",
      "Reduced supply from Indonesia",
      "Government initiatives for organic farming",
      "Favorable export policies",
    ],
    recommendation: "Strong buy signal - prices expected to rise 6-9% over next quarter",
    confidence: 92,
    volatility: "High",
    seasonality: "Peak demand season approaching",
  },
  Onion: {
    currentPrice: 1800,
    previousPrice: 1700,
    change: 5.88,
    trend: "upward",
    forecast: [
      { month: "Jan 2024", price: 1700, predicted: 1750 },
      { month: "Feb 2024", price: 1750, predicted: 1800 },
      { month: "Mar 2024", price: 1800, predicted: 1850 },
      { month: "Apr 2024", price: null, predicted: 1900 },
      { month: "May 2024", price: null, predicted: 1950 },
      { month: "Jun 2024", price: null, predicted: 2000 },
    ],
    factors: [
      "Increased demand from urban centers",
      "Reduced supply from major growing regions",
      "Favorable weather conditions",
      "Government procurement policies",
    ],
    recommendation: "Strong buy signal - prices expected to rise 5-8% over next quarter",
    confidence: 89,
    volatility: "Medium",
    seasonality: "Peak demand season approaching",
  },
  Potato: {
    currentPrice: 1200,
    previousPrice: 1100,
    change: 9.09,
    trend: "upward",
    forecast: [
      { month: "Jan 2024", price: 1100, predicted: 1150 },
      { month: "Feb 2024", price: 1150, predicted: 1200 },
      { month: "Mar 2024", price: 1200, predicted: 1250 },
      { month: "Apr 2024", price: null, predicted: 1300 },
      { month: "May 2024", price: null, predicted: 1350 },
      { month: "Jun 2024", price: null, predicted: 1400 },
    ],
    factors: [
      "Increased demand from food processing industry",
      "Reduced supply from major growing regions",
      "Favorable weather conditions",
      "Government procurement policies",
    ],
    recommendation: "Strong buy signal - prices expected to rise 8-11% over next quarter",
    confidence: 93,
    volatility: "Medium",
    seasonality: "Peak demand season approaching",
  },
  Tomato: {
    currentPrice: 2500,
    previousPrice: 2400,
    change: 4.17,
    trend: "upward",
    forecast: [
      { month: "Jan 2024", price: 2400, predicted: 2450 },
      { month: "Feb 2024", price: 2450, predicted: 2500 },
      { month: "Mar 2024", price: 2500, predicted: 2550 },
      { month: "Apr 2024", price: null, predicted: 2600 },
      { month: "May 2024", price: null, predicted: 2650 },
      { month: "Jun 2024", price: null, predicted: 2700 },
    ],
    factors: [
      "Increased demand from urban centers",
      "Reduced supply from major growing regions",
      "Favorable weather conditions",
      "Government procurement policies",
    ],
    recommendation: "Strong buy signal - prices expected to rise 4-7% over next quarter",
    confidence: 86,
    volatility: "Medium",
    seasonality: "Peak demand season approaching",
  },
  Chili: {
    currentPrice: 8000,
    previousPrice: 7500,
    change: 6.67,
    trend: "upward",
    forecast: [
      { month: "Jan 2024", price: 7500, predicted: 7700 },
      { month: "Feb 2024", price: 7700, predicted: 7900 },
      { month: "Mar 2024", price: 8000, predicted: 8200 },
      { month: "Apr 2024", price: null, predicted: 8400 },
      { month: "May 2024", price: null, predicted: 8600 },
      { month: "Jun 2024", price: null, predicted: 8800 },
    ],
    factors: [
      "Increased demand from food processing industry",
      "Reduced supply from major growing regions",
      "Favorable weather conditions",
      "Government procurement policies",
    ],
    recommendation: "Strong buy signal - prices expected to rise 6-9% over next quarter",
    confidence: 94,
    volatility: "High",
    seasonality: "Peak demand season approaching",
  },
}

function generatePriceTrendAnalysis(crop: string, state: string, timeframe: string, analysisType: string) {
  // Generate historical price data
  const historicalData = generateHistoricalPriceData(crop, timeframe)

  // Generate forecast data
  const forecastData = generateForecastData(historicalData)

  // Calculate key metrics
  const metrics = calculatePriceMetrics(historicalData)

  // Generate insights
  const insights = generatePriceInsights(crop, state, metrics)

  return {
    crop,
    state,
    timeframe,
    analysisType,

    summary: {
      currentPrice: historicalData[historicalData.length - 1].price,
      averagePrice: metrics.averagePrice,
      priceChange: metrics.priceChange,
      volatility: metrics.volatility,
      trend: metrics.trend,
    },

    historicalData,
    forecastData,

    keyMetrics: {
      highestPrice: metrics.highestPrice,
      lowestPrice: metrics.lowestPrice,
      averagePrice: metrics.averagePrice,
      standardDeviation: metrics.standardDeviation,
      volatilityIndex: metrics.volatility,
      trendDirection: metrics.trend,
      seasonalPattern: metrics.seasonalPattern,
    },

    marketFactors: {
      supplyFactors: [
        "Weather conditions and rainfall patterns",
        "Crop yield variations across regions",
        "Harvesting season timing",
        "Storage and post-harvest losses",
      ],
      demandFactors: [
        "Urban consumption patterns",
        "Export demand fluctuations",
        "Industrial processing requirements",
        "Government procurement policies",
      ],
      externalFactors: [
        "Fuel price impacts on transportation",
        "Currency exchange rate effects",
        "International market dynamics",
        "Policy changes and regulations",
      ],
    },

    priceDrivers: {
      primary: insights.primaryDrivers,
      secondary: insights.secondaryDrivers,
      seasonal: insights.seasonalDrivers,
    },

    forecast: {
      nextMonth: {
        predictedPrice: forecastData[0].price,
        confidence: 0.85,
        range: {
          low: forecastData[0].price * 0.9,
          high: forecastData[0].price * 1.1,
        },
      },
      nextQuarter: {
        predictedPrice: forecastData[2].price,
        confidence: 0.75,
        range: {
          low: forecastData[2].price * 0.85,
          high: forecastData[2].price * 1.15,
        },
      },
      nextYear: {
        predictedPrice: forecastData[11].price,
        confidence: 0.65,
        range: {
          low: forecastData[11].price * 0.8,
          high: forecastData[11].price * 1.2,
        },
      },
    },

    recommendations: {
      farmers: [
        "Consider staggered harvesting to avoid peak supply periods",
        "Invest in storage facilities to capitalize on price peaks",
        "Monitor weather forecasts for optimal planting decisions",
        "Diversify crop portfolio to reduce price risk",
      ],
      traders: [
        "Build strategic inventory during low-price periods",
        "Establish direct farmer relationships for better margins",
        "Monitor export opportunities for premium pricing",
        "Use price hedging instruments to manage risk",
      ],
      policyMakers: [
        "Strengthen market information systems",
        "Improve storage and logistics infrastructure",
        "Consider price stabilization mechanisms",
        "Promote crop diversification programs",
      ],
    },

    riskAssessment: {
      priceVolatility: metrics.volatility > 0.3 ? "High" : metrics.volatility > 0.15 ? "Medium" : "Low",
      marketRisk: "Medium",
      weatherRisk: "High",
      policyRisk: "Low",
      overallRisk: "Medium",
    },

    opportunities: [
      "Value addition through processing",
      "Direct marketing to consumers",
      "Export market development",
      "Contract farming arrangements",
      "Organic certification premium",
    ],
  }
}

function generateHistoricalPriceData(crop: string, timeframe: string) {
  const basePrice = getCropBasePrice(crop)
  const dataPoints = getDataPointsForTimeframe(timeframe)
  const data = []

  for (let i = 0; i < dataPoints; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() - (dataPoints - i))

    // Add seasonal and random variations
    const seasonalFactor = 1 + 0.2 * Math.sin((i / dataPoints) * 2 * Math.PI)
    const randomFactor = 1 + (Math.random() - 0.5) * 0.3
    const trendFactor = 1 + (i / dataPoints) * 0.1 // Slight upward trend

    const price = Math.round(basePrice * seasonalFactor * randomFactor * trendFactor)

    data.push({
      date: date.toISOString().split("T")[0],
      price,
      volume: Math.floor(Math.random() * 1000) + 500,
      market: getRandomMarket(),
    })
  }

  return data
}

function generateForecastData(historicalData: any[]) {
  const lastPrice = historicalData[historicalData.length - 1].price
  const forecast = []

  for (let i = 1; i <= 12; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() + i)

    // Simple trend-based forecast with seasonal adjustment
    const trendFactor = 1 + i * 0.005 // Slight upward trend
    const seasonalFactor = 1 + 0.15 * Math.sin((i / 12) * 2 * Math.PI)
    const price = Math.round(lastPrice * trendFactor * seasonalFactor)

    forecast.push({
      date: date.toISOString().split("T")[0],
      price,
      confidence: Math.max(0.9 - i * 0.05, 0.5),
    })
  }

  return forecast
}

function calculatePriceMetrics(data: any[]) {
  const prices = data.map((d) => d.price)
  const sum = prices.reduce((a, b) => a + b, 0)
  const averagePrice = Math.round(sum / prices.length)

  const highestPrice = Math.max(...prices)
  const lowestPrice = Math.min(...prices)

  // Calculate standard deviation
  const variance = prices.reduce((acc, price) => acc + Math.pow(price - averagePrice, 2), 0) / prices.length
  const standardDeviation = Math.sqrt(variance)

  // Calculate volatility (coefficient of variation)
  const volatility = standardDeviation / averagePrice

  // Determine trend
  const firstHalf = prices.slice(0, Math.floor(prices.length / 2))
  const secondHalf = prices.slice(Math.floor(prices.length / 2))
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length

  const trend = secondAvg > firstAvg * 1.05 ? "Upward" : secondAvg < firstAvg * 0.95 ? "Downward" : "Stable"

  const priceChange = (((prices[prices.length - 1] - prices[0]) / prices[0]) * 100).toFixed(2)

  return {
    averagePrice,
    highestPrice,
    lowestPrice,
    standardDeviation: Math.round(standardDeviation),
    volatility: Math.round(volatility * 100) / 100,
    trend,
    priceChange: `${priceChange}%`,
    seasonalPattern: "Moderate seasonal variation observed",
  }
}

function generatePriceInsights(crop: string, state: string, metrics: any) {
  const cropInsights = {
    Wheat: {
      primaryDrivers: ["Government procurement policy", "Export demand", "Monsoon patterns"],
      secondaryDrivers: ["Storage costs", "Transportation", "Processing demand"],
      seasonalDrivers: ["Harvest season (March-May)", "Sowing season (Oct-Dec)"],
    },
    Rice: {
      primaryDrivers: ["Monsoon rainfall", "Government MSP", "Export policies"],
      secondaryDrivers: ["Fuel prices", "Labor costs", "Milling capacity"],
      seasonalDrivers: ["Kharif harvest (Oct-Nov)", "Rabi harvest (Apr-May)"],
    },
    Cotton: {
      primaryDrivers: ["Textile industry recovery", "Export orders", "Reduced acreage"],
      secondaryDrivers: ["Quality premium", "Storage facilities", "Transportation costs"],
      seasonalDrivers: ["Pre-sowing season (Dec-Feb)", "Sowing season (Mar-Apr)"],
    },
    Sugarcane: {
      primaryDrivers: ["Sugar mills procurement", "Ethanol demand", "Government policies"],
      secondaryDrivers: ["Reduced production", "Storage capacity", "Transportation costs"],
      seasonalDrivers: ["Crushing season (Oct-Dec)", "Sowing season (Jan-Feb)"],
    },
    Maize: {
      primaryDrivers: ["Poultry industry recovery", "Starch industry expansion", "Export opportunities"],
      secondaryDrivers: ["Reduced imports", "Storage facilities", "Transportation costs"],
      seasonalDrivers: ["Post-harvest season (Apr-June)", "Sowing season (July-September)"],
    },
    Soybean: {
      primaryDrivers: ["Increased demand from animal feed", "Reduced supply from South America", "Government support"],
      secondaryDrivers: ["Favorable trade agreements", "Storage facilities", "Transportation costs"],
      seasonalDrivers: ["Peak demand season (March-May)", "Sowing season (June-August)"],
    },
    Turmeric: {
      primaryDrivers: [
        "Increased demand from pharmaceuticals",
        "Reduced supply from Indonesia",
        "Government initiatives",
      ],
      secondaryDrivers: ["Favorable export policies", "Storage facilities", "Transportation costs"],
      seasonalDrivers: ["Peak demand season (March-May)", "Sowing season (June-August)"],
    },
    Onion: {
      primaryDrivers: [
        "Increased demand from urban centers",
        "Reduced supply from major growing regions",
        "Favorable weather",
      ],
      secondaryDrivers: ["Government procurement policies", "Storage facilities", "Transportation costs"],
      seasonalDrivers: ["Peak demand season (March-May)", "Sowing season (June-August)"],
    },
    Potato: {
      primaryDrivers: [
        "Increased demand from food processing",
        "Reduced supply from major growing regions",
        "Favorable weather",
      ],
      secondaryDrivers: ["Government procurement policies", "Storage facilities", "Transportation costs"],
      seasonalDrivers: ["Peak demand season (March-May)", "Sowing season (June-August)"],
    },
    Tomato: {
      primaryDrivers: [
        "Increased demand from urban centers",
        "Reduced supply from major growing regions",
        "Favorable weather",
      ],
      secondaryDrivers: ["Government procurement policies", "Storage facilities", "Transportation costs"],
      seasonalDrivers: ["Peak demand season (March-May)", "Sowing season (June-August)"],
    },
    Chili: {
      primaryDrivers: [
        "Increased demand from food processing",
        "Reduced supply from major growing regions",
        "Favorable weather",
      ],
      secondaryDrivers: ["Government procurement policies", "Storage facilities", "Transportation costs"],
      seasonalDrivers: ["Peak demand season (March-May)", "Sowing season (June-August)"],
    },
  }

  return cropInsights[crop as keyof typeof cropInsights] || cropInsights["Wheat"]
}

function getCropBasePrice(crop: string): number {
  const basePrices = {
    Wheat: 2500,
    Rice: 3000,
    Cotton: 5800,
    Sugarcane: 350,
    Soybean: 4200,
    Maize: 2100,
    Turmeric: 8500,
    Onion: 1800,
    Potato: 1200,
    Tomato: 2500,
    Chili: 8000,
  }

  return basePrices[crop as keyof typeof basePrices] || 3000
}

function getDataPointsForTimeframe(timeframe: string): number {
  const timeframes = {
    "1M": 30,
    "3M": 90,
    "6M": 180,
    "1Y": 365,
    "2Y": 730,
  }

  return timeframes[timeframe as keyof typeof timeframes] || 365
}

function getRandomMarket(): string {
  const markets = ["Mumbai", "Delhi", "Kolkata", "Chennai", "Bangalore", "Hyderabad", "Pune", "Ahmedabad"]
  return markets[Math.floor(Math.random() * markets.length)]
}

// Generate realistic price data
function generatePriceData(basePrice: number, timeframe: string) {
  const months = timeframe.includes("12") ? 12 : 6
  const data = []

  for (let i = months; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)

    const seasonalFactor = 0.9 + Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 0.2
    const randomFactor = 0.95 + Math.random() * 0.1
    const price = Math.round(basePrice * seasonalFactor * randomFactor)

    data.push({
      date: date.toISOString().split("T")[0],
      price: price,
      volume: Math.floor(Math.random() * 1000) + 500,
    })
  }

  return data
}

// Generate forecast data
function generateForecast(historicalData: any[], days = 7) {
  const lastPrice = historicalData[historicalData.length - 1].price
  const forecast = []

  for (let i = 1; i <= days; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)

    // Simple trend-based forecast with confidence intervals
    const trendFactor = 1 + (Math.random() - 0.5) * 0.08 // ±4% variation
    const forecastPrice = lastPrice * Math.pow(trendFactor, i)

    const confidence = Math.max(60, 90 - i * 5) // Decreasing confidence over time

    forecast.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(forecastPrice),
      confidence: confidence,
      lower: Math.round(forecastPrice * 0.95),
      upper: Math.round(forecastPrice * 1.05),
    })
  }

  return forecast
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const crop = searchParams.get("crop") || "Rice"
    const period = searchParams.get("period") || "30"
    const state = searchParams.get("state") || "Maharashtra"

    // Generate historical price data
    const historicalData = generatePriceData(getCropBasePrice(crop), period)

    const currentPrice = historicalData[historicalData.length - 1]?.price || 2500
    const previousPrice = historicalData[historicalData.length - 2]?.price || 2450
    const priceChange = currentPrice - previousPrice
    const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2)

    // Generate AI-powered forecast
    const forecast = generateForecast(historicalData)

    // AI-generated insights
    const insights = {
      trendAnalysis: {
        direction: priceChange > 0 ? "upward" : "downward",
        strength: Math.abs(Number.parseFloat(priceChangePercent)) > 5 ? "strong" : "moderate",
        duration: `${Math.floor(Math.random() * 10) + 5} days`,
        confidence: 0.78,
      },
      marketFactors: [
        {
          factor: "Weather Conditions",
          impact: Math.random() > 0.5 ? "positive" : "negative",
          weight: 0.35,
          description: "Recent rainfall patterns affecting crop yield expectations",
        },
        {
          factor: "Export Demand",
          impact: "positive",
          weight: 0.25,
          description: "Increased international demand driving prices up",
        },
        {
          factor: "Government Policy",
          impact: "neutral",
          weight: 0.2,
          description: "MSP announcements providing price stability",
        },
        {
          factor: "Storage Capacity",
          impact: Math.random() > 0.5 ? "positive" : "negative",
          weight: 0.2,
          description: "Warehouse availability affecting market dynamics",
        },
      ],
      priceDrivers: [
        "Seasonal demand patterns",
        "Supply chain disruptions",
        "International market prices",
        "Government procurement policies",
        "Weather forecast predictions",
      ],
      recommendations: [
        priceChange > 0
          ? "Consider selling current stock to capitalize on price increase"
          : "Hold inventory as prices may recover in coming weeks",
        "Monitor weather forecasts for potential supply impacts",
        "Explore contract farming opportunities for price stability",
        "Consider futures contracts for risk management",
      ],
    }

    const analytics = {
      currentPrice,
      priceChange,
      priceChangePercent: Number.parseFloat(priceChangePercent),
      volatility: (Math.random() * 20 + 10).toFixed(2),
      averageVolume: Math.floor(historicalData.reduce((sum, day) => sum + day.volume, 0) / historicalData.length),
      highestPrice: Math.max(...historicalData.map((d) => d.price)),
      lowestPrice: Math.min(...historicalData.map((d) => d.price)),
      marketCap: Math.floor(Math.random() * 1000000) + 500000,
      supportLevel: Math.round(currentPrice * 0.92),
      resistanceLevel: Math.round(currentPrice * 1.08),
    }

    return NextResponse.json({
      crop,
      state,
      period: Number.parseInt(period),
      timestamp: new Date().toISOString(),
      historicalData,
      forecast,
      analytics,
      insights,
      aiGenerated: true,
    })
  } catch (error) {
    console.error("Error generating price trends:", error)
    return NextResponse.json({ error: "Failed to generate price trends" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { state, crop, timeframe } = await request.json()

    if (!state || !crop) {
      return NextResponse.json({ error: "State and crop are required" }, { status: 400 })
    }

    const systemPrompt = `You are an expert agricultural economist and market analyst specializing in Indian crop price forecasting.

Analyze price trends for ${crop} in ${state}, India over the ${timeframe || "6-month"} period. Provide:

1. Historical Price Analysis (last 2 years)
2. Current Market Price (₹/quintal)
3. Price Forecast (next 3-6 months)
4. Seasonal Price Patterns
5. Key Price Drivers
6. Market Volatility Assessment
7. Price Risk Factors
8. Confidence Intervals for Forecasts
9. Comparative Analysis with Other States
10. Recommendations for Farmers

Use realistic price data based on Indian agricultural markets and provide specific numerical forecasts.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `Generate comprehensive price trend analysis and forecasting for ${crop} in ${state}, India. Include specific price predictions with confidence levels and actionable recommendations.`,
      maxTokens: 1200,
      temperature: 0.2,
    })

    // Generate realistic price data
    const basePrice = generateBasePrice(crop)
    const priceData = generatePriceData(basePrice, timeframe || "6-month")

    const analysis = {
      currentPrice: {
        value: basePrice,
        currency: "₹/quintal",
        lastUpdated: new Date().toISOString(),
        change: "+5.2%",
        changeType: "increase",
      },
      forecast: {
        nextMonth: Math.round(basePrice * 1.03),
        next3Months: Math.round(basePrice * 1.08),
        next6Months: Math.round(basePrice * 1.12),
        confidence: "75-85%",
        trend: "upward",
      },
      historicalData: priceData,
      seasonalPattern: {
        peak: "March-May",
        low: "October-December",
        volatility: "Medium",
        cyclical: true,
      },
      keyDrivers: [
        "Monsoon patterns and rainfall",
        "Government MSP announcements",
        "Export demand fluctuations",
        "Storage and logistics costs",
        "Regional production levels",
      ],
      riskFactors: ["Weather uncertainties", "Policy changes", "Market speculation", "Transportation disruptions"],
      recommendations: {
        selling: "Consider selling 40% of produce in next 2 months",
        storage: "Store remaining 60% for better prices in peak season",
        timing: "Monitor weekly price movements for optimal selling",
        hedging: "Consider forward contracts for price protection",
      },
      fullAnalysis: text,
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Price trends AI error:", error)
    return NextResponse.json({ error: "Failed to generate price trends analysis" }, { status: 500 })
  }
}

function generateBasePrice(crop: string): number {
  const basePrices: { [key: string]: number } = {
    wheat: 2200,
    rice: 2800,
    cotton: 5500,
    sugarcane: 350,
    maize: 1800,
    soybean: 4200,
    onion: 1500,
    potato: 1200,
    tomato: 2000,
    chili: 8000,
  }

  const cropLower = crop.toLowerCase()
  return basePrices[cropLower] || 2500 + Math.floor(Math.random() * 2000)
}
