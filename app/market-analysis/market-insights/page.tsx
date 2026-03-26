"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Activity,
  Clock,
  Target,
  Shield,
  Lightbulb,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Pie,
} from "recharts"

interface MarketInsight {
  id: string
  title: string
  category: string
  description: string
  impact: string
  confidence: number
  recommendation: string
  riskLevel: string
  timeframe: string
  affectedCrops: string[]
  lastUpdated?: string
}

interface InsightSummary {
  totalInsights: number
  highImpact: number
  lowRisk: number
  avgConfidence: number
  categories: string[]
  state: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const states = [
  "All States",
  "Maharashtra",
  "Punjab",
  "Haryana",
  "Uttar Pradesh",
  "Karnataka",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh",
  "West Bengal",
]

export default function MarketInsightsPage() {
  const [insights, setInsights] = useState<MarketInsight[]>([])
  const [summary, setSummary] = useState<InsightSummary | null>(null)
  const [selectedState, setSelectedState] = useState("All States")
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const { toast } = useToast()

  const fetchInsights = async (state: string = selectedState) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/market-insights-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state }),
      })

      const data = await response.json()

      if (data.success) {
        setInsights(data.insights)
        setSummary(data.summary)
        setLastRefresh(new Date())
        toast({
          title: "Insights Updated",
          description: `Loaded ${data.insights.length} market insights for ${state}`,
        })
      } else {
        throw new Error(data.error || "Failed to fetch insights")
      }
    } catch (error) {
      console.error("Error fetching insights:", error)
      toast({
        title: "Error",
        description: "Failed to load market insights. Using cached data.",
        variant: "destructive",
      })

      // Fallback to default data
      const fallbackInsights = [
        {
          id: "1",
          title: "Rising Demand for Organic Produce",
          category: "Market Trend",
          description: "Consumer preference shifting towards organic farming products with 25% increase in demand",
          impact: "High",
          confidence: 92,
          recommendation: "Consider transitioning to organic farming methods for premium pricing",
          riskLevel: "Low",
          timeframe: "Next 6 months",
          affectedCrops: ["Vegetables", "Fruits", "Grains"],
        },
      ]
      setInsights(fallbackInsights)
      setSummary({
        totalInsights: 1,
        highImpact: 1,
        lowRisk: 1,
        avgConfidence: 92,
        categories: ["Market Trend"],
        state: state,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()

    // Auto-refresh every 30 minutes
    const interval = setInterval(
      () => {
        fetchInsights()
      },
      30 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [])

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    fetchInsights(state)
  }

  const handleRefresh = () => {
    fetchInsights()
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Market Trend":
        return <TrendingUp className="h-4 w-4" />
      case "Price Alert":
        return <AlertTriangle className="h-4 w-4" />
      case "Export":
        return <Activity className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  // Prepare chart data
  const categoryData =
    summary?.categories.map((category) => ({
      name: category,
      value: insights.filter((insight) => insight.category === category).length,
    })) || []

  const confidenceData = [
    { name: "90-100%", value: insights.filter((i) => i.confidence >= 90).length },
    { name: "80-89%", value: insights.filter((i) => i.confidence >= 80 && i.confidence < 90).length },
    { name: "70-79%", value: insights.filter((i) => i.confidence >= 70 && i.confidence < 80).length },
    { name: "Below 70%", value: insights.filter((i) => i.confidence < 70).length },
  ].filter((item) => item.value > 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Market Insights</h1>
          <p className="text-muted-foreground">AI-powered market analysis and recommendations</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedState} onValueChange={handleStateChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {lastRefresh && (
        <div className="mb-6 text-sm text-muted-foreground flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Last updated: {lastRefresh.toLocaleString()}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalInsights}</div>
              <p className="text-xs text-muted-foreground">For {summary.state}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Impact</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.highImpact}</div>
              <p className="text-xs text-muted-foreground">Critical opportunities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.lowRisk}</div>
              <p className="text-xs text-muted-foreground">Safe opportunities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.avgConfidence}%</div>
              <p className="text-xs text-muted-foreground">AI prediction accuracy</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight) => (
                <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(insight.category)}
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <CardDescription>{insight.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{insight.description}</p>

                    <div className="flex flex-wrap gap-2">
                      <Badge className={getImpactColor(insight.impact)}>{insight.impact} Impact</Badge>
                      <Badge className={getRiskColor(insight.riskLevel)}>{insight.riskLevel} Risk</Badge>
                      <Badge variant="outline">{insight.timeframe}</Badge>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Recommendation
                      </h4>
                      <p className="text-sm bg-blue-50 p-3 rounded-lg">{insight.recommendation}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Affected Crops</h4>
                      <div className="flex flex-wrap gap-1">
                        {insight.affectedCrops.map((crop, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Insights by Category</CardTitle>
                <CardDescription>Distribution of market insights across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confidence Distribution</CardTitle>
                <CardDescription>AI prediction confidence levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={confidenceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends Summary</CardTitle>
              <CardDescription>Key trends identified for {selectedState}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {insights.filter((i) => i.impact === "High").length}
                    </div>
                    <div className="text-sm text-green-600">High Impact Opportunities</div>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {insights.filter((i) => i.riskLevel === "Low").length}
                    </div>
                    <div className="text-sm text-blue-600">Low Risk Options</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{summary?.avgConfidence || 0}%</div>
                    <div className="text-sm text-purple-600">Average Confidence</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Key Recommendations</h3>
                  <div className="space-y-3">
                    {insights.slice(0, 3).map((insight, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{insight.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
