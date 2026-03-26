"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart3,
  Calendar,
  Sprout,
  Target,
  Cloud,
  Leaf,
  Brain,
  Zap,
  Loader2,
  LineChart,
  PieChart,
} from "lucide-react"

export default function YieldPredictionPage() {
  const [selectedCrop, setSelectedCrop] = useState("tomato")
  const [selectedSeason, setSelectedSeason] = useState("current")
  const [location, setLocation] = useState("")
  const [landSize, setLandSize] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalysis, setHasAnalysis] = useState(false)
  const [aiPredictions, setAiPredictions] = useState<any>(null)
  const { toast } = useToast()

  const handleAIAnalysis = async () => {
    if (!location || !landSize || !selectedCrop) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for AI analysis",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/yield-prediction-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crop: selectedCrop,
          location,
          landSize: Number.parseFloat(landSize),
          season: selectedSeason,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI yield predictions")
      }

      const data = await response.json()
      setAiPredictions(data.predictions)
      setHasAnalysis(true)

      toast({
        title: "AI Analysis Complete",
        description: `Generated yield predictions with ${data.predictions.aiConfidence}% confidence`,
      })
    } catch (error: any) {
      toast({
        title: "AI Analysis Failed",
        description: error.message || "Failed to generate yield predictions",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              AI Yield Prediction
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Advanced machine learning algorithms predict crop yields with 95%+ accuracy using real-time data analysis
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
            <Brain className="h-5 w-5" />
            <span className="text-sm font-medium">AI-Powered Forecasting</span>
            <Zap className="h-4 w-4 text-yellow-500" />
          </div>
        </div>

        {/* AI Analysis Input */}
        <Card className="mb-8 border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-green-600" />
              AI Yield Analysis Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-green-200 focus-visible:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Crop Type</label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger className="border-green-200 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tomato">Tomato</SelectItem>
                    <SelectItem value="pepper">Bell Pepper</SelectItem>
                    <SelectItem value="cucumber">Cucumber</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Land Size (acres)</label>
                <Input
                  type="number"
                  placeholder="Enter land size"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="border-green-200 focus-visible:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Season</label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger className="border-green-200 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Season</SelectItem>
                    <SelectItem value="next">Next Season</SelectItem>
                    <SelectItem value="kharif">Kharif</SelectItem>
                    <SelectItem value="rabi">Rabi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white h-12"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AI is analyzing yield potential...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate AI Yield Predictions
                  <Zap className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* AI Prediction Results */}
        {hasAnalysis && aiPredictions ? (
          <>
            {/* Current Prediction Overview */}
            <Card className="mb-8 border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-green-500" />
                  AI Yield Prediction Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2 flex items-center justify-center gap-2">
                      <Brain className="h-8 w-8" />
                      {aiPredictions.predictedYield}
                    </div>
                    <div className="text-sm text-gray-600">Tons/Hectare</div>
                    <div className="text-xs text-green-600 mt-1">AI Predicted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-2">
                      <Zap className="h-8 w-8" />
                      {aiPredictions.aiConfidence}%
                    </div>
                    <div className="text-sm text-gray-600">AI Confidence</div>
                    <div className="text-xs text-blue-600 mt-1">High accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">₹{aiPredictions.expectedRevenue}</div>
                    <div className="text-sm text-gray-600">Expected Revenue</div>
                    <div className="text-xs text-purple-600 mt-1">Per hectare</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">{aiPredictions.daysToHarvest}</div>
                    <div className="text-sm text-gray-600">Days to Harvest</div>
                    <div className="text-xs text-orange-600 mt-1">AI Estimated</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="predictions" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
                <TabsTrigger value="factors">AI Factors</TabsTrigger>
                <TabsTrigger value="scenarios">AI Scenarios</TabsTrigger>
                <TabsTrigger value="history">AI History</TabsTrigger>
              </TabsList>

              <TabsContent value="predictions" className="space-y-6">
                {/* AI Yield Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-blue-500" />
                        AI Yield Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {aiPredictions.yieldBreakdown.map((item: any, index: number) => (
                          <div key={index}>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{item.category}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{item.value}</span>
                                <Badge variant="outline" className="text-xs">
                                  AI: {item.aiConfidence}%
                                </Badge>
                              </div>
                            </div>
                            <Progress value={item.percentage} className="h-3" />
                            <div className="text-sm text-gray-600 mt-1 flex items-start gap-1">
                              <Brain className="h-3 w-3 mt-0.5 text-blue-600" />
                              {item.aiDescription}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        AI Harvest Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {aiPredictions.harvestTimeline.map((phase: any, index: number) => (
                          <div key={index} className="flex items-center gap-4">
                            <div
                              className={`w-4 h-4 rounded-full ${
                                phase.status === "completed"
                                  ? "bg-green-500"
                                  : phase.status === "current"
                                    ? "bg-blue-500 animate-pulse"
                                    : "bg-gray-300"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <div className="font-medium flex items-center gap-2">
                                {phase.phase}
                                <Badge variant="outline" className="text-xs">
                                  AI: {phase.aiConfidence}%
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">{phase.date}</div>
                              <div className="text-xs text-blue-600 flex items-center gap-1">
                                <Brain className="h-3 w-3" />
                                {phase.aiPrediction}
                              </div>
                            </div>
                            <div className="text-sm font-medium">{phase.duration}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="factors" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-blue-500" />
                        AI Weather Impact Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {aiPredictions.weatherFactors.map((factor: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <factor.icon className={`h-5 w-5 ${factor.color}`} />
                              <div>
                                <span className="font-medium">{factor.name}</span>
                                <div className="text-xs text-blue-600 flex items-center gap-1">
                                  <Brain className="h-3 w-3" />
                                  AI Confidence: {factor.aiConfidence}%
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{factor.value}</div>
                              <div
                                className={`text-sm ${
                                  factor.impact === "positive"
                                    ? "text-green-600"
                                    : factor.impact === "negative"
                                      ? "text-red-600"
                                      : "text-gray-600"
                                }`}
                              >
                                {factor.impact === "positive" ? "+" : factor.impact === "negative" ? "-" : ""}
                                {factor.impactValue}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-500" />
                        AI Crop Health Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {aiPredictions.cropHealthFactors.map((factor: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{factor.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{factor.score}/10</span>
                                <Badge variant="outline" className="text-xs">
                                  AI: {factor.aiConfidence}%
                                </Badge>
                              </div>
                            </div>
                            <Progress value={factor.score * 10} className="h-2" />
                            <div className="text-sm text-gray-600 flex items-start gap-1">
                              <Brain className="h-3 w-3 mt-0.5 text-green-600" />
                              {factor.aiAnalysis}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="scenarios" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-purple-500" />
                      AI Scenario Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {aiPredictions.scenarios.map((scenario: any, index: number) => (
                        <Card
                          key={index}
                          className={`border-2 ${
                            scenario.type === "optimistic"
                              ? "border-green-200 bg-green-50"
                              : scenario.type === "pessimistic"
                                ? "border-red-200 bg-red-50"
                                : "border-blue-200 bg-blue-50"
                          }`}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Brain className="h-4 w-4" />
                              {scenario.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="text-center">
                                <div className="text-3xl font-bold">{scenario.yield}</div>
                                <div className="text-sm text-gray-600">Tons/Hectare</div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Revenue</span>
                                  <span className="font-bold">{scenario.revenue}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>AI Probability</span>
                                  <span className="font-bold flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    {scenario.probability}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>AI Confidence</span>
                                  <span className="font-bold">{scenario.aiConfidence}%</span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 p-2 bg-white/50 rounded border">
                                <div className="flex items-start gap-1">
                                  <Brain className="h-3 w-3 mt-0.5" />
                                  {scenario.aiConditions}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      AI Historical Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiPredictions.historicalData.map((record: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-bold">{record.season}</div>
                            <div className="text-sm text-gray-600">{record.crop}</div>
                            <div className="text-xs text-blue-600 flex items-center gap-1">
                              <Brain className="h-3 w-3" />
                              AI Model: {record.aiModel}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">{record.actualYield}</div>
                            <div className="text-sm text-gray-500">Actual Yield</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">{record.predictedYield}</div>
                            <div className="text-sm text-gray-500">AI Predicted</div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`font-bold text-lg flex items-center gap-1 ${
                                record.accuracy >= 95
                                  ? "text-green-600"
                                  : record.accuracy >= 90
                                    ? "text-blue-600"
                                    : record.accuracy >= 85
                                      ? "text-yellow-600"
                                      : "text-red-600"
                              }`}
                            >
                              <Zap className="h-4 w-4" />
                              {record.accuracy}%
                            </div>
                            <div className="text-sm text-gray-500">AI Accuracy</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="min-h-[400px] border-2 border-green-200">
            <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-50 to-blue-50 flex items-center justify-center mb-6">
                <Brain className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">AI Yield Prediction Ready</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Fill in your crop details and click "Generate AI Yield Predictions" to receive advanced machine learning
                forecasts with confidence scoring and detailed analysis.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-2xl">
                <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-lg">
                  <Target className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="text-sm font-medium">Enter Location</h3>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-lg">
                  <Sprout className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="text-sm font-medium">Select Crop</h3>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="text-sm font-medium">Set Land Size</h3>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-lg">
                  <Brain className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="text-sm font-medium">Get AI Analysis</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
