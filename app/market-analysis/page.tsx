"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  BarChart3,
  Globe,
  Lightbulb,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const marketOverview = [
  {
    crop: "Wheat",
    price: 2200,
    change: 2.3,
    trend: "up",
    volume: "450 tonnes",
  },
  {
    crop: "Rice",
    price: 4650,
    change: -1.2,
    trend: "down",
    volume: "320 tonnes",
  },
  {
    crop: "Tomato",
    price: 1500,
    change: 5.2,
    trend: "up",
    volume: "280 tonnes",
  },
  {
    crop: "Cotton",
    price: 5400,
    change: -0.8,
    trend: "down",
    volume: "180 tonnes",
  },
]

const quickStats = [
  {
    title: "Active Markets",
    value: "1,247",
    icon: BarChart3,
    color: "text-blue-600",
  },
  {
    title: "Price Alerts",
    value: "23",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    title: "Export Opportunities",
    value: "156",
    icon: Globe,
    color: "text-purple-600",
  },
  {
    title: "Market Insights",
    value: "8",
    icon: Lightbulb,
    color: "text-orange-600",
  },
]

export default function MarketAnalysisPage() {
  const [selectedState, setSelectedState] = useState("All States")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const refreshData = () => {
    setIsLoading(true)
    toast({
      title: "Refreshing Data",
      description: "Fetching latest market information...",
    })

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Market data has been updated successfully.",
      })
    }, 2000)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Analysis</h1>
          <p className="text-gray-600 mt-2">Comprehensive agricultural market intelligence and insights</p>
        </div>
        <Button onClick={refreshData} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Quick Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All States">All States</SelectItem>
                  <SelectItem value="Punjab">Punjab</SelectItem>
                  <SelectItem value="Haryana">Haryana</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Markets</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search crops, markets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Actions</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Top Gainers
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  Top Losers
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Market Overview</CardTitle>
          <CardDescription>Latest prices from major agricultural markets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketOverview.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{item.crop}</h4>
                  <div className="flex items-center gap-1">
                    {item.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {item.change > 0 ? "+" : ""}
                      {item.change}%
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{item.price}</p>
                <p className="text-sm text-gray-600">{item.volume}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Price Trends */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Price Trends
            </CardTitle>
            <CardDescription>Analyze historical price movements and forecast future trends</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Trends</span>
                <span className="font-semibold">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Price Alerts</span>
                <span className="font-semibold">23</span>
              </div>
              <Link href="/market-analysis/price-trends">
                <Button className="w-full mt-4">
                  View Price Trends
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-purple-600" />
              Market Insights
            </CardTitle>
            <CardDescription>AI-powered market analysis and trading recommendations</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Insights</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">AI Recommendations</span>
                <span className="font-semibold">15</span>
              </div>
              <Link href="/market-analysis/market-insights">
                <Button className="w-full mt-4">
                  View Market Insights
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Export Opportunities */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-purple-50 dark:from-green-950/20 dark:to-purple-950/20">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-green-600" />
              Export Opportunities
            </CardTitle>
            <CardDescription>Discover international trade opportunities and export markets</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Opportunities</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Countries</span>
                <span className="font-semibold">42</span>
              </div>
              <Link href="/market-analysis/export-opportunities">
                <Button className="w-full mt-4">
                  View Export Opportunities
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
