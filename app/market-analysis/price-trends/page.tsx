"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, Filter, Download, Brain, Zap, ArrowLeft, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { generatePriceTrendsPDF } from "@/lib/price-trends-pdf-generator"

// Indian states for selection
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

const districts = {
  Maharashtra: ["Mumbai", "Pune", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Sangli"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
  Haryana: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad"],
  Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
  Rajasthan: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur", "Ajmer"],
}

// Generate realistic price trend data based on state and crop
const generateStatePriceTrendData = (crop: string, state: string, days = 90) => {
  const data = []
  let basePrice = 2000

  // State-specific price variations
  const statePriceMultipliers = {
    Punjab: 1.15,
    Haryana: 1.12,
    "Uttar Pradesh": 0.95,
    Maharashtra: 1.08,
    Karnataka: 1.05,
    "Tamil Nadu": 1.03,
    Gujarat: 1.1,
    Rajasthan: 0.98,
  }

  // Crop-specific base prices
  const cropBasePrices = {
    Wheat: 2200,
    Rice: 4650,
    Tomato: 1500,
    Cotton: 5400,
    Onion: 1000,
    Sugarcane: 350,
    Soybean: 4200,
    Maize: 1800,
    Potato: 1200,
    Chili: 8500,
  }

  basePrice = cropBasePrices[crop as keyof typeof cropBasePrices] || 2000
  const stateMultiplier = statePriceMultipliers[state as keyof typeof statePriceMultipliers] || 1.0
  basePrice = Math.round(basePrice * stateMultiplier)

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Daily variation factors
    const seasonalFactor = Math.sin(((date.getMonth() + date.getDate() / 30) * Math.PI) / 6) * 0.15
    const randomFactor = (Math.random() - 0.5) * 0.12
    const trendFactor = (i / days) * 0.25
    const dailyVolatility = (Math.random() - 0.5) * 0.08

    const price = basePrice * (1 + seasonalFactor + randomFactor + trendFactor + dailyVolatility)
    const prediction = price * (1 + (Math.random() - 0.5) * 0.1)

    data.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price),
      volume: Math.round(Math.random() * 500 + 100),
      prediction: Math.round(prediction),
    })
  }

  return data
}

const generateCropTrends = (selectedState: string, selectedDistrict: string) => {
  const crops = ["Wheat", "Rice", "Tomato", "Cotton", "Onion", "Sugarcane", "Soybean", "Maize", "Potato", "Chili"]

  return crops.map((crop) => {
    const data = generateStatePriceTrendData(crop, selectedState)
    const currentPrice = data[data.length - 1].price
    const previousPrice = data[data.length - 7].price // 7 days ago
    const change = ((currentPrice - previousPrice) / previousPrice) * 100

    return {
      crop,
      currentPrice,
      change: Number(change.toFixed(1)),
      trend: change > 0 ? "up" : "down",
      confidence: Math.floor(Math.random() * 15) + 85,
      forecast: change > 5 ? "Bullish" : change < -5 ? "Bearish" : "Neutral",
      data,
      state: selectedState,
      district: selectedDistrict,
    }
  })
}

export default function PriceTrendsPage() {
  const [selectedState, setSelectedState] = useState("Maharashtra")
  const [selectedDistrict, setSelectedDistrict] = useState("Mumbai")
  const [selectedCrop, setSelectedCrop] = useState("Wheat")
  const [timeRange, setTimeRange] = useState("90d")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPdfGenerating, setIsPdfGenerating] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [cropTrends, setCropTrends] = useState<any[]>([])
  const { toast } = useToast()

  // Update crop trends when state or district changes
  useEffect(() => {
    setCropTrends(generateCropTrends(selectedState, selectedDistrict))
  }, [selectedState, selectedDistrict])

  // Update data daily
  useEffect(() => {
    const updateDailyData = () => {
      setCropTrends(generateCropTrends(selectedState, selectedDistrict))
    }

    // Update immediately
    updateDailyData()

    // Set up daily update at midnight
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const msUntilMidnight = tomorrow.getTime() - now.getTime()

    const timeoutId = setTimeout(() => {
      updateDailyData()
      // Then update every 24 hours
      const intervalId = setInterval(updateDailyData, 24 * 60 * 60 * 1000)
      return () => clearInterval(intervalId)
    }, msUntilMidnight)

    return () => clearTimeout(timeoutId)
  }, [selectedState, selectedDistrict])

  const selectedCropData = cropTrends.find((crop) => crop.crop === selectedCrop) || cropTrends[0]

  const runAIAnalysis = async () => {
    setIsLoading(true)
    toast({
      title: "Running AI Analysis",
      description: `Analyzing ${selectedCrop} price trends in ${selectedState}, ${selectedDistrict}...`,
    })

    try {
      const response = await fetch("/api/price-trends-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: selectedCrop,
          state: selectedState,
          district: selectedDistrict,
          timeRange,
          analysisType: "comprehensive",
        }),
      })

      const result = await response.json()
      setAiAnalysis(result)

      toast({
        title: "AI Analysis Complete",
        description: `Generated insights for ${selectedCrop} in ${selectedState} with ${result.confidence}% confidence`,
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to complete AI analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadPDF = async () => {
    if (!selectedCropData || !aiAnalysis) {
      toast({
        title: "Missing Data",
        description: "Please run AI analysis first before downloading PDF.",
        variant: "destructive",
      })
      return
    }

    setIsPdfGenerating(true)
    toast({
      title: "Generating PDF",
      description: "Creating comprehensive price trends report...",
    })

    try {
      const reportData = {
        cropData: selectedCropData,
        aiAnalysis,
        timeRange,
        generatedAt: new Date(),
        state: selectedState,
        district: selectedDistrict,
      }

      await generatePriceTrendsPDF(reportData)

      toast({
        title: "PDF Generated Successfully",
        description: `Price trends report for ${selectedCrop} in ${selectedState} has been downloaded.`,
      })
    } catch (error) {
      toast({
        title: "PDF Generation Failed",
        description: "Unable to generate PDF report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPdfGenerating(false)
    }
  }

  const availableDistricts = districts[selectedState as keyof typeof districts] || ["Select State First"]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/market-analysis">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Price Trends Analysis</h1>
            <p className="text-gray-600 mt-2">AI-powered price trend analysis and forecasting</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {selectedState}, {selectedDistrict}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Updated Daily</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runAIAnalysis}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Brain className={`h-4 w-4 mr-2 ${isLoading ? "animate-pulse" : ""}`} />
            {isLoading ? "Analyzing..." : "AI Analysis"}
          </Button>
          <Button variant="outline" onClick={downloadPDF} disabled={isPdfGenerating || !aiAnalysis}>
            <Download className={`h-4 w-4 mr-2 ${isPdfGenerating ? "animate-spin" : ""}`} />
            {isPdfGenerating ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <Card className="border-l-4 border-l-purple-600 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              AI Analysis Results - {selectedState}
              <Badge variant="secondary" className="ml-2">
                {aiAnalysis.confidence}% Confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Price Forecast</h4>
                <p className="text-sm text-gray-600">{aiAnalysis.forecast}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Factors</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {aiAnalysis.factors?.map((factor: string, index: number) => (
                    <li key={index}>• {factor}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recommendation</h4>
                <p className="text-sm text-gray-600">{aiAnalysis.recommendation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Location & Analysis Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Select
                value={selectedState}
                onValueChange={(value) => {
                  setSelectedState(value)
                  setSelectedDistrict(districts[value as keyof typeof districts]?.[0] || "")
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">District</label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Crop</label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cropTrends.map((crop) => (
                    <SelectItem key={crop.crop} value={crop.crop}>
                      {crop.crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="180d">Last 6 Months</SelectItem>
                  <SelectItem value="365d">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Confidence</label>
              <div className="flex items-center h-10 px-3 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-green-600">{selectedCropData?.confidence || 0}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Price</p>
                <p className="text-2xl font-bold text-gray-900">₹{selectedCropData?.currentPrice || 0}</p>
                <p className="text-xs text-gray-500">{selectedState}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Price Change</p>
                <p
                  className={`text-2xl font-bold ${selectedCropData?.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {selectedCropData?.change > 0 ? "+" : ""}
                  {selectedCropData?.change || 0}%
                </p>
                <p className="text-xs text-gray-500">7-day change</p>
              </div>
              {selectedCropData?.trend === "up" ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Forecast</p>
                <p className="text-2xl font-bold text-gray-900">{selectedCropData?.forecast || "Neutral"}</p>
                <p className="text-xs text-gray-500">Next 30 days</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confidence</p>
                <p className="text-2xl font-bold text-green-600">{selectedCropData?.confidence || 0}%</p>
                <p className="text-xs text-gray-500">AI accuracy</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            Price Trend Chart - {selectedCrop} ({selectedState})
          </CardTitle>
          <CardDescription>Historical prices and AI predictions for {selectedDistrict}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="line-chart" className="space-y-4">
            <TabsList>
              <TabsTrigger value="line-chart">Line Chart</TabsTrigger>
              <TabsTrigger value="area-chart">Area Chart</TabsTrigger>
              <TabsTrigger value="prediction">AI Prediction</TabsTrigger>
            </TabsList>

            <TabsContent value="line-chart" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedCropData?.data || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip
                      formatter={(value) => [`₹${value}`, "Price"]}
                      labelFormatter={(value) => new Date(value).toLocaleDateString("en-IN")}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="area-chart" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedCropData?.data || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip
                      formatter={(value) => [`₹${value}`, "Price"]}
                      labelFormatter={(value) => new Date(value).toLocaleDateString("en-IN")}
                    />
                    <Area type="monotone" dataKey="price" stroke="#3b82f6" fill="url(#colorPrice)" strokeWidth={2} />
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="prediction" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedCropData?.data || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip
                      formatter={(value, name) => [`₹${value}`, name === "price" ? "Actual Price" : "AI Prediction"]}
                      labelFormatter={(value) => new Date(value).toLocaleDateString("en-IN")}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="prediction"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
