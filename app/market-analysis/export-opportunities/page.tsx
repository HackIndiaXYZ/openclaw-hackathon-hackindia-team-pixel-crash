"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  RefreshCw,
  Globe,
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface ExportOpportunity {
  id: string
  country: string
  crop: string
  demandLevel: string
  currentPrice: string
  projectedPrice: string
  growthRate: string
  marketSize: string
  competitionLevel: string
  entryBarriers: string
  requirements: string[]
  logistics: {
    shippingTime: string
    shippingCost: string
    preferredPorts: string[]
    documentation: string[]
  }
  profitability: {
    margin: string
    breakeven: string
    roi: string
    paybackPeriod: string
  }
  risks: string[]
  opportunities: string[]
  contactInfo: {
    tradeOffice: string
    email: string
    phone: string
  }
}

interface Analytics {
  totalOpportunities: number
  averageMargin: number
  highDemandMarkets: number
  averageROI: number
  topCountries: Record<string, number>
  cropDistribution: Record<string, number>
  demandLevels: Record<string, number>
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function ExportOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<ExportOpportunity[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [selectedOpportunity, setSelectedOpportunity] = useState<ExportOpportunity | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    crop: "all",
    region: "all",
    timeframe: "6months",
    search: "",
  })
  const { toast } = useToast()

  const fetchOpportunities = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/export-opportunities-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filters }),
      })

      const data = await response.json()

      if (data.success) {
        setOpportunities(data.opportunities)
        setAnalytics(data.analytics)
        toast({
          title: "Opportunities Updated",
          description: `Loaded ${data.opportunities.length} export opportunities`,
        })
      } else {
        throw new Error(data.error || "Failed to fetch opportunities")
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error)
      toast({
        title: "Error",
        description: "Failed to load export opportunities. Using cached data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    fetchOpportunities()
  }

  const getDemandColor = (level: string) => {
    switch (level) {
      case "Very High":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Prepare chart data
  const countryData = analytics
    ? Object.entries(analytics.topCountries).map(([country, count]) => ({
        name: country,
        value: count,
      }))
    : []

  const cropData = analytics
    ? Object.entries(analytics.cropDistribution).map(([crop, count]) => ({
        name: crop,
        value: count,
      }))
    : []

  const demandData = analytics
    ? Object.entries(analytics.demandLevels).map(([level, count]) => ({
        name: level,
        value: count,
      }))
    : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Export Opportunities</h1>
          <p className="text-muted-foreground">Discover global markets for your agricultural products</p>
        </div>
        <Button onClick={fetchOpportunities} disabled={isLoading} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filter Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops or countries..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <Select value={filters.crop} onValueChange={(value) => handleFilterChange("crop", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="cotton">Cotton</SelectItem>
                <SelectItem value="spices">Spices</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.region} onValueChange={(value) => handleFilterChange("region", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="america">America</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
                <SelectItem value="oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOpportunities}</div>
              <p className="text-xs text-muted-foreground">Active export markets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageMargin}%</div>
              <p className="text-xs text-muted-foreground">Profit margin</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Demand</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.highDemandMarkets}</div>
              <p className="text-xs text-muted-foreground">Markets with high demand</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageROI}%</div>
              <p className="text-xs text-muted-foreground">Return on investment</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opportunity) => (
                <Card
                  key={opportunity.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedOpportunity(opportunity)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{opportunity.country}</CardTitle>
                        <CardDescription>{opportunity.crop}</CardDescription>
                      </div>
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Demand Level</span>
                      <Badge className={getDemandColor(opportunity.demandLevel)}>{opportunity.demandLevel}</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Competition</span>
                      <Badge className={getCompetitionColor(opportunity.competitionLevel)}>
                        {opportunity.competitionLevel}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Price</span>
                        <span className="text-sm font-medium">{opportunity.currentPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Growth Rate</span>
                        <span className="text-sm font-medium text-green-600">{opportunity.growthRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">ROI</span>
                        <span className="text-sm font-medium text-blue-600">{opportunity.profitability.roi}</span>
                      </div>
                    </div>

                    <Button className="w-full" size="sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Country Distribution</CardTitle>
                <CardDescription>Export opportunities by country</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={countryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crop Distribution</CardTitle>
                <CardDescription>Opportunities by crop type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={cropData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demand Levels</CardTitle>
                <CardDescription>Market demand distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={demandData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {demandData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {selectedOpportunity ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      {selectedOpportunity.country} - {selectedOpportunity.crop}
                    </CardTitle>
                    <CardDescription>
                      Market Size: {selectedOpportunity.marketSize} | Growth: {selectedOpportunity.growthRate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="requirements">Requirements</TabsTrigger>
                        <TabsTrigger value="logistics">Logistics</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                        <TabsTrigger value="profitability">Profitability</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Market Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Current Price:</span>
                                <span className="font-medium">{selectedOpportunity.currentPrice}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Projected Price:</span>
                                <span className="font-medium text-green-600">{selectedOpportunity.projectedPrice}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Market Size:</span>
                                <span className="font-medium">{selectedOpportunity.marketSize}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Market Conditions</h4>
                            <div className="space-y-2">
                              <Badge className={getDemandColor(selectedOpportunity.demandLevel)}>
                                {selectedOpportunity.demandLevel} Demand
                              </Badge>
                              <Badge className={getCompetitionColor(selectedOpportunity.competitionLevel)}>
                                {selectedOpportunity.competitionLevel} Competition
                              </Badge>
                              <Badge variant="outline">{selectedOpportunity.entryBarriers} Entry Barriers</Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Opportunities</h4>
                          <ul className="space-y-1">
                            {selectedOpportunity.opportunities.map((opp, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{opp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Risks</h4>
                          <ul className="space-y-1">
                            {selectedOpportunity.risks.map((risk, index) => (
                              <li key={index} className="flex items-start">
                                <AlertCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="requirements" className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Export Requirements
                          </h4>
                          <ul className="space-y-2">
                            {selectedOpportunity.requirements.map((req, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="logistics" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2 flex items-center">
                              <Truck className="h-4 w-4 mr-2" />
                              Shipping Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Shipping Time:</span>
                                <span className="font-medium">{selectedOpportunity.logistics.shippingTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Shipping Cost:</span>
                                <span className="font-medium">{selectedOpportunity.logistics.shippingCost}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Preferred Ports</h4>
                            <div className="space-y-1">
                              {selectedOpportunity.logistics.preferredPorts.map((port, index) => (
                                <Badge key={index} variant="secondary" className="mr-1">
                                  {port}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Required Documentation</h4>
                          <ul className="space-y-1">
                            {selectedOpportunity.logistics.documentation.map((doc, index) => (
                              <li key={index} className="flex items-start">
                                <FileText className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="analysis" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-600">{selectedOpportunity.growthRate}</div>
                            <div className="text-sm text-green-600">Growth Rate</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-blue-600">
                              {selectedOpportunity.profitability.margin}
                            </div>
                            <div className="text-sm text-blue-600">Profit Margin</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-purple-600">
                              {selectedOpportunity.profitability.roi}
                            </div>
                            <div className="text-sm text-purple-600">ROI</div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="profitability" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Financial Metrics</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Profit Margin:</span>
                                <span className="font-medium text-green-600">
                                  {selectedOpportunity.profitability.margin}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Breakeven:</span>
                                <span className="font-medium">{selectedOpportunity.profitability.breakeven}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>ROI:</span>
                                <span className="font-medium text-blue-600">
                                  {selectedOpportunity.profitability.roi}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Payback Period:</span>
                                <span className="font-medium">{selectedOpportunity.profitability.paybackPeriod}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Contact Information</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Trade Office:</span>
                                <p className="text-muted-foreground">{selectedOpportunity.contactInfo.tradeOffice}</p>
                              </div>
                              <div>
                                <span className="font-medium">Email:</span>
                                <p className="text-blue-600">{selectedOpportunity.contactInfo.email}</p>
                              </div>
                              <div>
                                <span className="font-medium">Phone:</span>
                                <p className="text-muted-foreground">{selectedOpportunity.contactInfo.phone}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Package className="h-4 w-4 mr-2" />
                      Contact Trade Office
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Market Analysis
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Market Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-blue-500 mr-2" />
                        <div className="text-sm">
                          <div className="font-medium">Entry Phase</div>
                          <div className="text-muted-foreground">0-3 months</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-orange-500 mr-2" />
                        <div className="text-sm">
                          <div className="font-medium">Growth Phase</div>
                          <div className="text-muted-foreground">3-12 months</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-green-500 mr-2" />
                        <div className="text-sm">
                          <div className="font-medium">Maturity Phase</div>
                          <div className="text-muted-foreground">12+ months</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select an Opportunity</h3>
                  <p className="text-muted-foreground">
                    Click on any opportunity from the list to view detailed information
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
