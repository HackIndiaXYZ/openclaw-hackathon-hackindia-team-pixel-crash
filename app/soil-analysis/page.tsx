"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Camera,
  Upload,
  Download,
  MapPin,
  Calendar,
  Leaf,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Brain,
  Zap,
  Microscope,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Types for soil analysis
type SoilMetric = {
  name: string
  value: number
  unit: string
  status: "optimal" | "low" | "high"
  optimalRange: string
  icon: React.ReactNode
  aiConfidence: number
  aiRecommendation: string
}

type SoilAnalysisResult = {
  id: string
  timestamp: string
  location?: string
  image: string
  healthScore: number
  confidence: number
  metrics: SoilMetric[]
  recommendations: string[]
  fieldNotes?: string
  aiAnalysis: {
    processingTime: string
    algorithm: string
    dataPoints: number
    overallConfidence: number
  }
}

export default function SoilAnalysisPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<SoilAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [recentTests, setRecentTests] = useState<SoilAnalysisResult[]>([])
  const [fieldNotes, setFieldNotes] = useState("")
  const [location, setLocation] = useState("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setShowCamera(true)
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions or try uploading an image instead.",
        variant: "destructive",
      })
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }, [])

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImage(imageData)
        stopCamera()
      }
    }
  }, [stopCamera])

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = e.target?.result as string
          setCapturedImage(imageData)
        }
        reader.readAsDataURL(file)
      } else {
        toast({
          title: "Invalid File",
          description: "Please select an image file.",
          variant: "destructive",
        })
      }
    }
  }, [])

  // Analyze soil with AI
  const analyzeSoil = useCallback(async () => {
    if (!capturedImage) return

    setIsAnalyzing(true)

    try {
      // Call AI-powered soil analysis API
      const response = await fetch("/api/soil-analysis-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: capturedImage,
          location,
          fieldNotes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze soil sample")
      }

      const data = await response.json()
      const result = data.result

      setAnalysisResult(result)

      // Add to recent tests
      setRecentTests((prev) => [result, ...prev.slice(0, 4)])

      toast({
        title: "AI Analysis Complete",
        description: `Soil health score: ${result.healthScore}/10 (${result.confidence}% AI confidence)`,
      })
    } catch (error: any) {
      console.error("AI Analysis error:", error)
      toast({
        title: "AI Analysis Failed",
        description: error.message || "Unable to analyze soil sample. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }, [capturedImage, location, fieldNotes])

  // Generate PDF report
  const generatePDFReport = useCallback(async () => {
    if (!analysisResult) return

    setIsGeneratingPDF(true)

    try {
      const response = await fetch("/api/soil-analysis/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analysisResult),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ai-soil-analysis-${analysisResult.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "PDF Generated",
        description: "AI soil analysis report has been downloaded.",
      })
    } catch (error) {
      console.error("PDF generation error:", error)
      toast({
        title: "PDF Generation Failed",
        description: "Unable to generate PDF report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }, [analysisResult])

  // Reset analysis
  const resetAnalysis = useCallback(() => {
    setCapturedImage(null)
    setAnalysisResult(null)
    setFieldNotes("")
    setLocation("")
    stopCamera()
  }, [stopCamera])

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimal":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "low":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "high":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-green-600 bg-green-50 border-green-200"
      case "low":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Soil Analysis</h1>
            <p className="text-muted-foreground">
              Advanced AI-powered soil analysis with machine learning algorithms for precise agricultural insights
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 px-4 py-2 rounded-lg border border-purple-200">
            <Brain className="h-5 w-5" />
            <span className="text-sm font-medium">AI-Powered Analysis</span>
            <Microscope className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Capture Section */}
          <Card className="border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg border-b border-purple-100">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Soil Sample Analysis
              </CardTitle>
              <CardDescription>Capture or upload a soil sample image for advanced AI-powered analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {!capturedImage ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={startCamera} className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="border-2 border-dashed border-purple-200 rounded-lg p-8 text-center bg-purple-50/30">
                    <Brain className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                    <p className="text-muted-foreground">
                      No image selected. Take a photo or upload an image for AI-powered soil analysis.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Soil sample"
                      className="w-full h-64 object-cover rounded-lg border border-purple-200"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetAnalysis}
                      className="absolute top-2 right-2 bg-white/90 border-purple-200"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Retake
                    </Button>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location" className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        Location (Optional)
                      </Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., North Field, Plot A"
                        className="mt-1 border-purple-200 focus-visible:ring-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes" className="flex items-center gap-1.5">
                        <Leaf className="h-4 w-4 text-purple-600" />
                        Field Notes (Optional)
                      </Label>
                      <Input
                        id="notes"
                        value={fieldNotes}
                        onChange={(e) => setFieldNotes(e.target.value)}
                        placeholder="e.g., After recent rainfall"
                        className="mt-1 border-purple-200 focus-visible:ring-purple-500"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={analyzeSoil}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        AI is analyzing soil sample...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Start AI Analysis
                        <Zap className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysisResult && (
            <Card className="border-purple-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI Analysis Results
                    </CardTitle>
                    <CardDescription>
                      Completed on {new Date(analysisResult.timestamp).toLocaleString()}
                      {analysisResult.location && ` • ${analysisResult.location}`}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={generatePDFReport}
                    disabled={isGeneratingPDF}
                    variant="outline"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                  >
                    {isGeneratingPDF ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download AI Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Analysis Info */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Microscope className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-800">AI Analysis Details</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-purple-600 font-medium">Processing Time</p>
                      <p className="text-purple-800">{analysisResult.aiAnalysis.processingTime}</p>
                    </div>
                    <div>
                      <p className="text-purple-600 font-medium">Algorithm</p>
                      <p className="text-purple-800">{analysisResult.aiAnalysis.algorithm}</p>
                    </div>
                    <div>
                      <p className="text-purple-600 font-medium">Data Points</p>
                      <p className="text-purple-800">{analysisResult.aiAnalysis.dataPoints}</p>
                    </div>
                    <div>
                      <p className="text-purple-600 font-medium">AI Confidence</p>
                      <p className="text-purple-800 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {analysisResult.aiAnalysis.overallConfidence}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Health Score */}
                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div className="text-4xl font-bold text-purple-600 mb-2 flex items-center justify-center gap-2">
                    <Brain className="h-8 w-8" />
                    {analysisResult.healthScore}/10
                  </div>
                  <div className="text-lg font-medium mb-2">AI Soil Health Score</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    {analysisResult.confidence}% AI confidence
                  </div>
                  <Progress value={analysisResult.healthScore * 10} className="mt-4 max-w-xs mx-auto" />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {analysisResult.metrics.map((metric, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {metric.icon}
                          <span className="font-medium">{metric.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(metric.status)}
                          <span className="text-xs bg-white/50 px-2 py-1 rounded-full">AI: {metric.aiConfidence}%</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        {metric.value}
                        {metric.unit}
                      </div>
                      <div className="text-xs opacity-75 mb-2">Optimal: {metric.optimalRange}</div>
                      <div className="text-xs bg-white/30 p-2 rounded border border-white/50">
                        <div className="flex items-start gap-1">
                          <Brain className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>{metric.aiRecommendation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-2">
                    {analysisResult.recommendations.map((recommendation, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
                      >
                        <Zap className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {analysisResult.fieldNotes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Field Notes</h3>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {analysisResult.fieldNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Tests */}
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Recent AI Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTests.length > 0 ? (
                <div className="space-y-3">
                  {recentTests.map((test, index) => (
                    <div
                      key={test.id}
                      className="p-3 border border-purple-100 rounded-lg hover:bg-purple-50/50 cursor-pointer transition-colors"
                      onClick={() => setAnalysisResult(test)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          AI Score: {test.healthScore}/10
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(test.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-purple-600 mb-1">
                        <Zap className="h-3 w-3" />
                        {test.confidence}% AI Confidence
                      </div>
                      {test.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {test.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent AI tests. Complete your first AI soil analysis to see results here.
                </p>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis Tips */}
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Analysis Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Take photos in natural lighting for optimal AI analysis</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Remove debris and vegetation from soil surface</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Capture soil at 6-8 inches depth for accurate AI reading</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Include location details for enhanced AI recommendations</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>AI works best with clear, focused soil sample images</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Camera Modal */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Soil Sample Capture
            </DialogTitle>
            <DialogDescription>
              Position your camera over the soil sample and tap capture when ready for AI analysis.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={stopCamera}>
              Cancel
            </Button>
            <Button onClick={capturePhoto} className="bg-purple-600 hover:bg-purple-700">
              <Camera className="h-4 w-4 mr-2" />
              Capture for AI Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
