"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Sprout,
  MapPin,
  Droplets,
  Sun,
  Wind,
  ThermometerSun,
  Calendar,
  TrendingUp,
  Leaf,
  Search,
  ArrowRight,
  AlertCircle,
  Loader2,
  Brain,
  Zap,
} from "lucide-react"

// Types for crop recommendations
type CropRecommendation = {
  name: string
  suitabilityScore: number
  profitPotential: string
  waterRequirement: string
  growthDuration: string
  description: string
  image: string
  soilCompatibility: number
  climateCompatibility: number
  marketDemand: number
  seasonalTiming: "Optimal" | "Good" | "Average" | "Poor"
  investmentRequired: "Low" | "Medium" | "High"
  specialNotes?: string
  aiConfidence: number
  aiRecommendationReason: string
}

// Mock soil types
const soilTypes = [
  "Loamy",
  "Sandy",
  "Clay",
  "Silt",
  "Peaty",
  "Chalky",
  "Sandy Loam",
  "Clay Loam",
  "Silty Clay",
  "Black Cotton Soil",
]

// Function to get color based on score
function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-600"
  if (score >= 80) return "text-emerald-600"
  if (score >= 70) return "text-lime-600"
  if (score >= 60) return "text-yellow-600"
  if (score >= 50) return "text-amber-600"
  return "text-red-600"
}

// Function to get background color based on score
function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-green-100"
  if (score >= 80) return "bg-emerald-100"
  if (score >= 70) return "bg-lime-100"
  if (score >= 60) return "bg-yellow-100"
  if (score >= 50) return "bg-amber-100"
  return "bg-red-100"
}

// Function to get placeholder image for a crop
function getCropPlaceholderImage(cropName: string): string {
  const cropNameLower = cropName.toLowerCase()
  const commonCrops: Record<string, string> = {
    wheat: "/placeholder-cumeh.png",
    rice: "/placeholder-eneq3.png",
    maize: "/placeholder-q2185.png",
    soybean: "/placeholder-wcn3x.png",
    cotton: "/placeholder-ukk50.png",
  }

  return commonCrops[cropNameLower] || `/placeholder.svg?height=300&width=400&query=${cropName} crop field`
}

export default function CropSuggestionsPage() {
  // Form state
  const [location, setLocation] = useState("")
  const [soilType, setSoilType] = useState("")
  const [landSize, setLandSize] = useState("")
  const [waterAvailability, setWaterAvailability] = useState([50])
  const [activeTab, setActiveTab] = useState("recommended")
  const { toast } = useToast()

  // Recommendations state
  const [hasRecommendations, setHasRecommendations] = useState(false)
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Climate factors (fixed for now, could be made dynamic)
  const climateFactors = {
    sunshine: "6-8 hrs/day",
    rainfall: "750mm/year",
    wind: "5-10 km/h",
    temperature: "25-32°C",
  }

  // Handle form submission
  const handleGetRecommendations = async () => {
    // Validate form
    if (!location || !soilType || !landSize) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Call the AI-powered API
      const response = await fetch("/api/crop-suggestions-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location,
          soilType,
          landSize,
          waterAvailability: waterAvailability[0],
          climateFactors,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get AI recommendations")
      }

      const data = await response.json()

      // Process the AI recommendations
      const processedRecommendations = data.recommendations.map((crop: any) => ({
        ...crop,
        image: getCropPlaceholderImage(crop.name),
      }))

      setRecommendations(processedRecommendations)
      setHasRecommendations(true)

      toast({
        title: "AI Analysis Complete",
        description: `Generated ${processedRecommendations.length} personalized crop recommendations`,
      })
    } catch (err: any) {
      console.error("Error getting AI recommendations:", err)
      setError(err.message || "Failed to get AI recommendations. Please try again.")
      toast({
        title: "AI Recommendation Error",
        description: err.message || "Failed to get AI recommendations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Crop Suggestions</h1>
          <p className="text-muted-foreground mt-2">
            Get personalized crop recommendations powered by advanced AI intelligence
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200">
          <Brain className="h-5 w-5" />
          <span className="text-sm font-medium">AI-Powered Analysis</span>
          <Zap className="h-4 w-4 text-yellow-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Farm Parameters Form */}
        <Card className="lg:col-span-1 border-blue-100 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg border-b border-blue-100">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI Analysis Parameters
            </CardTitle>
            <CardDescription>Enter your farm details for AI-powered crop recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Location
                </label>
                <div className="relative">
                  <Input
                    id="location"
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-9 border-blue-200 focus-visible:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label htmlFor="soil-type" className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Leaf className="h-4 w-4 text-blue-600" />
                  Soil Type
                </label>
                <Select value={soilType} onValueChange={setSoilType}>
                  <SelectTrigger id="soil-type" className="border-blue-200 focus:ring-blue-500">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="land-size" className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Land Size (in acres)
                </label>
                <Input
                  id="land-size"
                  type="number"
                  placeholder="Enter land size"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  min="0.1"
                  step="0.1"
                  className="border-blue-200 focus-visible:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label htmlFor="water-availability" className="block text-sm font-medium flex items-center gap-1.5">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    Water Availability
                  </label>
                  <span className="text-sm text-muted-foreground">{waterAvailability[0]}%</span>
                </div>
                <Slider
                  id="water-availability"
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  value={waterAvailability}
                  onValueChange={setWaterAvailability}
                  className="[&>span]:bg-blue-600"
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-medium flex items-center gap-1.5">
                <ThermometerSun className="h-4 w-4 text-amber-500" />
                Climate Factors
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-amber-50 rounded-md p-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <div className="text-xs">
                    <p className="font-medium">Sunshine</p>
                    <p className="text-muted-foreground">{climateFactors.sunshine}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 rounded-md p-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <div className="text-xs">
                    <p className="font-medium">Rainfall</p>
                    <p className="text-muted-foreground">{climateFactors.rainfall}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 rounded-md p-2">
                  <Wind className="h-4 w-4 text-emerald-500" />
                  <div className="text-xs">
                    <p className="font-medium">Wind</p>
                    <p className="text-muted-foreground">{climateFactors.wind}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-red-50 rounded-md p-2">
                  <ThermometerSun className="h-4 w-4 text-red-500" />
                  <div className="text-xs">
                    <p className="font-medium">Temperature</p>
                    <p className="text-muted-foreground">{climateFactors.temperature}</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2 h-11"
              onClick={handleGetRecommendations}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI is analyzing your farm data...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Get AI Recommendations
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recommendations or Empty State */}
        <Card className="lg:col-span-2 min-h-[600px] border-blue-100 shadow-sm">
          {!hasRecommendations ? (
            <CardContent className="flex flex-col items-center justify-center min-h-[600px] text-center p-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center mb-6">
                <Brain className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">AI Crop Analysis Ready</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Fill in your farm details and click "Get AI Recommendations" to receive personalized crop suggestions
                powered by advanced artificial intelligence and machine learning algorithms.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
                <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg">
                  <MapPin className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="text-sm font-medium">Enter Location</h3>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg">
                  <Leaf className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="text-sm font-medium">Specify Soil Type</h3>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg">
                  <Brain className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="text-sm font-medium">Get AI Analysis</h3>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg max-w-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
            </CardContent>
          ) : (
            <div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg border-b border-blue-100">
                <Tabs defaultValue="recommended" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 bg-blue-100/50">
                    <TabsTrigger
                      value="recommended"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      AI Recommended
                    </TabsTrigger>
                    <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      All Crops
                    </TabsTrigger>
                    <TabsTrigger
                      value="compare"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      AI Compare
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {activeTab === "recommended" && (
                      <>
                        <Brain className="h-5 w-5 text-blue-600" />
                        AI Top Recommended Crops
                      </>
                    )}
                    {activeTab === "all" && (
                      <>
                        <Sprout className="h-5 w-5 text-blue-600" />
                        All AI Analyzed Crops
                      </>
                    )}
                    {activeTab === "compare" && (
                      <>
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        AI Crop Comparison
                      </>
                    )}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeTab === "recommended" &&
                      "These crops are AI-selected as best suited for your farm conditions"}
                    {activeTab === "all" && "All crops analyzed by AI with suitability scores"}
                    {activeTab === "compare" && "Compare different crops analyzed by AI intelligence"}
                  </p>
                </div>

                <TabsContent value="recommended" className="mt-0">
                  <div className="space-y-6">
                    {recommendations.map((crop, index) => (
                      <div
                        key={index}
                        className="border border-blue-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/3 h-48 bg-muted relative">
                            <img
                              src={crop.image || "/placeholder.svg"}
                              alt={crop.name}
                              className="w-full h-full object-cover"
                            />
                            <div
                              className={`absolute top-3 right-3 ${getScoreBgColor(crop.suitabilityScore)} ${getScoreColor(crop.suitabilityScore)} px-2.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5`}
                            >
                              <Brain className="h-4 w-4" />
                              {crop.suitabilityScore}% AI Match
                            </div>
                            <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {crop.aiConfidence}% AI Confidence
                            </div>
                          </div>
                          <div className="p-5 flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold">{crop.name}</h3>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {crop.seasonalTiming} Timing
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">{crop.description}</p>

                            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-start gap-2">
                                <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-blue-800 mb-1">AI Recommendation Reason:</p>
                                  <p className="text-sm text-blue-700">{crop.aiRecommendationReason}</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground mb-1">Soil Compatibility</span>
                                <div className="flex items-center gap-2">
                                  <Progress value={crop.soilCompatibility} className="h-2" />
                                  <span className="text-xs font-medium">{crop.soilCompatibility}%</span>
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground mb-1">Climate Compatibility</span>
                                <div className="flex items-center gap-2">
                                  <Progress value={crop.climateCompatibility} className="h-2" />
                                  <span className="text-xs font-medium">{crop.climateCompatibility}%</span>
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground mb-1">Market Demand</span>
                                <div className="flex items-center gap-2">
                                  <Progress value={crop.marketDemand} className="h-2" />
                                  <span className="text-xs font-medium">{crop.marketDemand}%</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                              <div className="flex items-center gap-2 bg-blue-50 rounded-md p-2">
                                <Droplets className="h-4 w-4 text-blue-600 shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Water Need</p>
                                  <p className="font-medium">{crop.waterRequirement}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 bg-amber-50 rounded-md p-2">
                                <TrendingUp className="h-4 w-4 text-amber-600 shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Profit</p>
                                  <p className="font-medium">{crop.profitPotential}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 bg-purple-50 rounded-md p-2">
                                <Calendar className="h-4 w-4 text-purple-600 shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Duration</p>
                                  <p className="font-medium">{crop.growthDuration}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 bg-emerald-50 rounded-md p-2">
                                <Sprout className="h-4 w-4 text-emerald-600 shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Investment</p>
                                  <p className="font-medium">{crop.investmentRequired}</p>
                                </div>
                              </div>
                            </div>

                            {crop.specialNotes && (
                              <div className="mt-4 flex items-start gap-2 bg-amber-50 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                <p className="text-sm">{crop.specialNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 border-t border-blue-100 flex justify-between">
                          <Button
                            variant="outline"
                            className="text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800 bg-transparent"
                          >
                            View AI Details
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add to Plan</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((crop, index) => (
                      <div
                        key={index}
                        className="border border-blue-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="h-32 bg-muted relative">
                          <img
                            src={crop.image || "/placeholder.svg"}
                            alt={crop.name}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className={`absolute top-2 right-2 ${getScoreBgColor(crop.suitabilityScore)} ${getScoreColor(crop.suitabilityScore)} px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1`}
                          >
                            <Brain className="h-3 w-3" />
                            {crop.suitabilityScore}% AI
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{crop.name}</h3>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {crop.seasonalTiming}
                            </Badge>
                          </div>

                          <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
                            <div className="flex items-center gap-1 mb-1">
                              <Brain className="h-3 w-3 text-blue-600" />
                              <span className="font-medium text-blue-800">AI Confidence: {crop.aiConfidence}%</span>
                            </div>
                            <p className="text-blue-700">{crop.aiRecommendationReason}</p>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                            <div className="flex items-center gap-1">
                              <Droplets className="h-3 w-3 text-blue-600" />
                              <span>{crop.waterRequirement}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-amber-600" />
                              <span>{crop.profitPotential}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-purple-600" />
                              <span>{crop.growthDuration}</span>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800 bg-transparent"
                          >
                            View AI Analysis
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="compare" className="mt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="border border-blue-100 p-3 text-left">Crop</th>
                          <th className="border border-blue-100 p-3 text-center">AI Suitability</th>
                          <th className="border border-blue-100 p-3 text-center">AI Confidence</th>
                          <th className="border border-blue-100 p-3 text-center">Water Need</th>
                          <th className="border border-blue-100 p-3 text-center">Growth Period</th>
                          <th className="border border-blue-100 p-3 text-center">Profit Potential</th>
                          <th className="border border-blue-100 p-3 text-center">Investment</th>
                          <th className="border border-blue-100 p-3 text-center">Market Demand</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recommendations.map((crop, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-blue-50/30"}>
                            <td className="border border-blue-100 p-3 font-medium">{crop.name}</td>
                            <td className="border border-blue-100 p-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Brain className="h-3 w-3 text-blue-600" />
                                <span className={getScoreColor(crop.suitabilityScore)}>{crop.suitabilityScore}%</span>
                              </div>
                            </td>
                            <td className="border border-blue-100 p-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Zap className="h-3 w-3 text-yellow-500" />
                                <span className="font-medium">{crop.aiConfidence}%</span>
                              </div>
                            </td>
                            <td className="border border-blue-100 p-3 text-center">{crop.waterRequirement}</td>
                            <td className="border border-blue-100 p-3 text-center">{crop.growthDuration}</td>
                            <td className="border border-blue-100 p-3 text-center">{crop.profitPotential}</td>
                            <td className="border border-blue-100 p-3 text-center">{crop.investmentRequired}</td>
                            <td className="border border-blue-100 p-3 text-center">{crop.marketDemand}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </CardContent>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
