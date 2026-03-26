"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Phone,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Search,
  ChevronRight,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Expert types
interface Expert {
  id: string
  name: string
  specialty: string
  experience: string
  rating: number
  availability: string
  location: string
  image: string
}

// Disease prediction types
interface DiseaseRisk {
  disease: string
  riskLevel: "Low" | "Medium" | "High" | "Very High"
  probability: number
  affectedCrops: string[]
  preventionTips: string[]
}

export default function AgriCarePage() {
  const [activeTab, setActiveTab] = useState("scanner")
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Expert Connect states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all")
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null)
  const [consultationDate, setConsultationDate] = useState("")
  const [consultationTime, setConsultationTime] = useState("")
  const [consultationIssue, setConsultationIssue] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState(false)

  // Disease Prediction states
  const [selectedLocation, setSelectedLocation] = useState<string>("Delhi")
  const [selectedCrop, setSelectedCrop] = useState<string>("Rice")
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false)
  const [predictions, setPredictions] = useState<DiseaseRisk[] | null>(null)
  const [weatherData, setWeatherData] = useState<any | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Mock experts data
  const experts: Expert[] = [
    {
      id: "exp1",
      name: "Dr. Rajesh Kumar",
      specialty: "Plant Pathology",
      experience: "15 years",
      rating: 4.8,
      availability: "Mon, Wed, Fri",
      location: "Delhi",
      image: "/placeholder-zszxi.png",
    },
    {
      id: "exp2",
      name: "Dr. Priya Singh",
      specialty: "Soil Science",
      experience: "12 years",
      rating: 4.7,
      availability: "Tue, Thu, Sat",
      location: "Mumbai",
      image: "/female-agricultural-scientist.png",
    },
    {
      id: "exp3",
      name: "Dr. Anand Verma",
      specialty: "Entomology",
      experience: "10 years",
      rating: 4.5,
      availability: "Mon, Tue, Wed",
      location: "Bangalore",
      image: "/placeholder-ihgtb.png",
    },
    {
      id: "exp4",
      name: "Dr. Meena Patel",
      specialty: "Horticulture",
      experience: "18 years",
      rating: 4.9,
      availability: "Thu, Fri, Sat",
      location: "Chennai",
      image: "/placeholder.svg?height=100&width=100&query=female%20horticulture%20expert",
    },
  ]

  // Mock disease prediction data
  const mockPredictions: DiseaseRisk[] = [
    {
      disease: "Rice Blast",
      riskLevel: "High",
      probability: 75,
      affectedCrops: ["Rice", "Wheat"],
      preventionTips: [
        "Use resistant varieties",
        "Apply fungicides preventively",
        "Maintain proper field drainage",
        "Avoid excessive nitrogen fertilization",
      ],
    },
    {
      disease: "Bacterial Leaf Blight",
      riskLevel: "Medium",
      probability: 45,
      affectedCrops: ["Rice"],
      preventionTips: [
        "Use disease-free seeds",
        "Avoid overhead irrigation",
        "Practice crop rotation",
        "Apply copper-based bactericides",
      ],
    },
    {
      disease: "Brown Spot",
      riskLevel: "Low",
      probability: 20,
      affectedCrops: ["Rice", "Maize"],
      preventionTips: [
        "Use balanced fertilization",
        "Treat seeds with fungicides",
        "Maintain proper spacing between plants",
        "Remove infected plant debris",
      ],
    },
  ]

  // Mock weather data
  const mockWeatherData = {
    location: "Delhi, India",
    temperature: 32,
    humidity: 65,
    rainfall: 2.5,
    windSpeed: 8,
    forecast: "Partly cloudy with chance of rain",
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Reset states when changing tabs
    if (value === "scanner") {
      setUploadedImage(null)
      setAnalysisResult(null)
      setError(null)
    } else if (value === "expert") {
      setSelectedExpert(null)
      setBookingSuccess(false)
    } else if (value === "predictions") {
      // Load predictions when tab is selected
      loadPredictions()
    }
  }

  // Load predictions and weather data
  const loadPredictions = () => {
    setIsLoadingPredictions(true)

    // Simulate API call
    setTimeout(() => {
      setPredictions(mockPredictions)
      setWeatherData(mockWeatherData)
      setIsLoadingPredictions(false)
    }, 1500)
  }

  // Filter experts based on search and specialty
  const filteredExperts = experts.filter((expert) => {
    const matchesSearch =
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSpecialty = selectedSpecialty === "all" || expert.specialty === selectedSpecialty

    return matchesSearch && matchesSpecialty
  })

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = async (file: File) => {
    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/heic"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or HEIC image",
        variant: "destructive",
      })
      return
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      })
      return
    }

    // Create a URL for the image preview
    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)
    setError(null)
    setIsAnalyzing(true)

    try {
      // Convert image to base64
      const base64Image = await fileToBase64(file)
      const base64String = base64Image.split(",")[1]

      // Call the API
      const response = await fetch("/api/crop-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: base64String }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze image")
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (err: any) {
      console.error("Error analyzing image:", err)
      setError(err.message || "Failed to analyze image. Please try again.")
      toast({
        title: "Analysis Failed",
        description: err.message || "Failed to analyze image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const resetUpload = () => {
    setUploadedImage(null)
    setAnalysisResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleExpertSelect = (expert: Expert) => {
    setSelectedExpert(expert)
  }

  const handleBookConsultation = () => {
    if (!consultationDate || !consultationTime || !consultationIssue) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Simulate booking process
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setBookingSuccess(true)
      toast({
        title: "Consultation Booked",
        description: `Your consultation with ${selectedExpert?.name} has been scheduled for ${consultationDate} at ${consultationTime}`,
      })
    }, 1500)
  }

  const handleBackToExperts = () => {
    setSelectedExpert(null)
    setBookingSuccess(false)
    setConsultationDate("")
    setConsultationTime("")
    setConsultationIssue("")
  }

  // Load predictions when the predictions tab is first selected
  useEffect(() => {
    if (activeTab === "predictions" && !predictions) {
      loadPredictions()
    }
  }, [activeTab])

  // Get risk level color
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Very High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">AgriCare</h1>
      <p className="text-muted-foreground mb-6">Your comprehensive resource for plant health and agricultural care</p>

      <Tabs defaultValue="scanner" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Crop Health Scanner
          </TabsTrigger>
          <TabsTrigger value="expert" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Expert Connect
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Disease Predictions
          </TabsTrigger>
        </TabsList>

        {/* Crop Health Scanner Tab */}
        <TabsContent value="scanner">
          <Card>
            <CardContent className="p-6">
              {!uploadedImage ? (
                <div className="max-w-xl mx-auto">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Crop Image Upload
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Upload a clear image of your crop for AI-powered health analysis
                    </p>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                      isDragging ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={handleUploadClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/jpeg,image/png,image/heic"
                      onChange={handleFileChange}
                    />
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium mb-1">Click to upload an image</p>
                    <p className="text-sm text-muted-foreground">Or drag and drop (JPG, PNG, HEIC up to 10MB)</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto">
                  {isAnalyzing ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      <p className="mt-4 font-medium">Analyzing your crop image...</p>
                      <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
                      <p className="font-medium text-destructive mb-2">Analysis Error</p>
                      <p className="text-sm text-muted-foreground mb-6">{error}</p>
                      <Button variant="outline" onClick={resetUpload}>
                        Try Again
                      </Button>
                    </div>
                  ) : analysisResult ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="rounded-lg overflow-hidden border mb-4">
                          <img
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Uploaded crop"
                            className="w-full h-auto"
                          />
                        </div>
                        <Button variant="outline" onClick={resetUpload} className="w-full">
                          Upload a different image
                        </Button>
                      </div>
                      <div>
                        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg mb-4 inline-block">
                          <span className="font-medium">{analysisResult.disease}</span>
                          <span className="text-sm ml-2">({analysisResult.confidence}% confidence)</span>
                        </div>
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground mb-4">{analysisResult.description}</p>

                        <h3 className="text-lg font-medium mb-2">Recommended Treatment</h3>
                        <p className="text-sm text-muted-foreground mb-4">{analysisResult.treatment}</p>

                        <h3 className="text-lg font-medium mb-2">Prevention Tips</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                          {analysisResult.preventionTips.map((tip: string, index: number) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expert Connect Tab */}
        <TabsContent value="expert">
          <Card>
            <CardContent className="p-6">
              {!selectedExpert ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Connect with Agricultural Experts</h2>
                    <p className="text-sm text-muted-foreground">
                      Get personalized advice from certified agricultural experts for complex plant health issues
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name, specialty or location"
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-64">
                      <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Specialties</SelectItem>
                          <SelectItem value="Plant Pathology">Plant Pathology</SelectItem>
                          <SelectItem value="Soil Science">Soil Science</SelectItem>
                          <SelectItem value="Entomology">Entomology</SelectItem>
                          <SelectItem value="Horticulture">Horticulture</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredExperts.length > 0 ? (
                      filteredExperts.map((expert) => (
                        <Card key={expert.id} className="overflow-hidden">
                          <div className="flex p-4">
                            <div className="mr-4">
                              <div className="h-16 w-16 rounded-full overflow-hidden">
                                <img
                                  src={expert.image || "/placeholder.svg"}
                                  alt={expert.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{expert.name}</h3>
                              <p className="text-sm text-muted-foreground">{expert.specialty}</p>
                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`h-4 w-4 ${i < Math.floor(expert.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs ml-1">{expert.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 pb-2">
                            <div className="flex items-center text-xs text-muted-foreground mb-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Available: {expert.availability}</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mb-3">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{expert.location}</span>
                            </div>
                          </div>
                          <div className="px-4 pb-4">
                            <Button onClick={() => handleExpertSelect(expert)} className="w-full">
                              Book Consultation
                            </Button>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-12">
                        <p className="text-muted-foreground">No experts found matching your criteria</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : bookingSuccess ? (
                <div className="max-w-md mx-auto text-center py-8">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Consultation Booked Successfully!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your consultation with {selectedExpert.name} has been scheduled for {consultationDate} at{" "}
                    {consultationTime}
                  </p>
                  <div className="bg-muted p-4 rounded-lg text-left mb-6">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{consultationDate}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{consultationTime}</span>
                    </div>
                    <div className="flex items-start">
                      <div className="h-4 w-4 mr-2 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm">{consultationIssue}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    You will receive a confirmation email with details and a link to join the video consultation.
                  </p>
                  <Button onClick={handleBackToExperts}>Book Another Consultation</Button>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <Button variant="outline" className="mb-6" onClick={handleBackToExperts}>
                    <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                    Back to Experts
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <div className="text-center mb-4">
                        <div className="h-24 w-24 rounded-full overflow-hidden mx-auto mb-3">
                          <img
                            src={selectedExpert.image || "/placeholder.svg"}
                            alt={selectedExpert.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h3 className="font-medium">{selectedExpert.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedExpert.specialty}</p>
                        <div className="flex items-center justify-center mt-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(selectedExpert.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs ml-1">{selectedExpert.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-1">Experience</p>
                          <p className="text-sm">{selectedExpert.experience}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-1">Availability</p>
                          <p className="text-sm">{selectedExpert.availability}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Location</p>
                          <p className="text-sm">{selectedExpert.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-lg font-medium mb-4">Book a Consultation</h3>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="date">Preferred Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={consultationDate}
                            onChange={(e) => setConsultationDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>

                        <div>
                          <Label htmlFor="time">Preferred Time</Label>
                          <Select value={consultationTime} onValueChange={setConsultationTime}>
                            <SelectTrigger id="time">
                              <SelectValue placeholder="Select a time slot" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                              <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                              <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                              <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                              <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                              <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                              <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                              <SelectItem value="05:00 PM">05:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="issue">Describe your issue</Label>
                          <Textarea
                            id="issue"
                            placeholder="Please describe the issue you're facing with your crops in detail"
                            className="min-h-[120px]"
                            value={consultationIssue}
                            onChange={(e) => setConsultationIssue(e.target.value)}
                          />
                        </div>

                        <div className="pt-4">
                          <Button onClick={handleBookConsultation} className="w-full" disabled={isAnalyzing}>
                            {isAnalyzing ? (
                              <>
                                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              "Book Consultation"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disease Predictions Tab */}
        <TabsContent value="predictions">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Disease Risk Predictions</h2>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered predictions about potential disease outbreaks based on weather patterns and historical
                  data
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Label htmlFor="location" className="mb-2 block">
                        Location
                      </Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Bangalore">Bangalore</SelectItem>
                          <SelectItem value="Chennai">Chennai</SelectItem>
                          <SelectItem value="Kolkata">Kolkata</SelectItem>
                          <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="crop" className="mb-2 block">
                        Crop Type
                      </Label>
                      <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                        <SelectTrigger id="crop">
                          <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rice">Rice</SelectItem>
                          <SelectItem value="Wheat">Wheat</SelectItem>
                          <SelectItem value="Maize">Maize</SelectItem>
                          <SelectItem value="Cotton">Cotton</SelectItem>
                          <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                          <SelectItem value="Potato">Potato</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={loadPredictions} disabled={isLoadingPredictions} className="w-full md:w-auto">
                    {isLoadingPredictions ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                        Loading predictions...
                      </>
                    ) : (
                      "Update Predictions"
                    )}
                  </Button>
                </div>

                {weatherData && (
                  <div className="md:col-span-1">
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Current Weather</CardTitle>
                        <CardDescription>{weatherData.location}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center">
                            <Thermometer className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{weatherData.temperature}°C</span>
                          </div>
                          <div className="flex items-center">
                            <Droplets className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{weatherData.humidity}%</span>
                          </div>
                          <div className="flex items-center">
                            <CloudRain className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{weatherData.rainfall} mm</span>
                          </div>
                          <div className="flex items-center">
                            <Wind className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{weatherData.windSpeed} km/h</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {isLoadingPredictions ? (
                <div className="text-center py-12">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="mt-4 font-medium">Analyzing disease risk factors...</p>
                  <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
                </div>
              ) : predictions ? (
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Disease Risk Assessment for {selectedCrop} in {selectedLocation}
                  </h3>

                  <div className="space-y-6">
                    {predictions.map((prediction, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="border-l-4 border-l-orange-500">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">{prediction.disease}</CardTitle>
                                <CardDescription>Affects: {prediction.affectedCrops.join(", ")}</CardDescription>
                              </div>
                              <Badge className={getRiskLevelColor(prediction.riskLevel)}>
                                {prediction.riskLevel} Risk ({prediction.probability}%)
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <h4 className="text-sm font-medium mb-2">Prevention Tips</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                              {prediction.preventionTips.map((tip, tipIndex) => (
                                <li key={tipIndex}>{tip}</li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter className="bg-muted/30 py-2">
                            <div className="w-full">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Risk Level</span>
                                <span className="text-xs text-muted-foreground">{prediction.probability}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2 mt-1">
                                <div
                                  className="bg-orange-500 h-2 rounded-full"
                                  style={{ width: `${prediction.probability}%` }}
                                ></div>
                              </div>
                            </div>
                          </CardFooter>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-8 bg-muted/30 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Disclaimer</h3>
                    <p className="text-xs text-muted-foreground">
                      These predictions are based on historical data, current weather patterns, and machine learning
                      models. They should be used as guidance only and not as a replacement for professional
                      agricultural advice.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium mb-2">No predictions available</p>
                  <p className="text-sm text-muted-foreground">
                    Select a location and crop type, then click "Update Predictions" to view disease risk assessments
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
