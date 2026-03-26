"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  MapPin,
  ExternalLink,
  Smartphone,
  Gift,
  CreditCard,
  TrendingUp,
  Map,
  Headphones,
  Grid3X3,
  IndianRupee,
  ShieldCheck,
  Star,
  Users,
  Phone,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText,
  Shield,
  HelpCircle,
  MapIcon,
  MessageSquare,
  CloudRain,
  Banknote,
  Receipt,
  Zap,
  Bell,
  Info,
} from "lucide-react"
import {
  useGovernmentServices,
  useGeolocation,
  INDIAN_STATES,
  type GovernmentService,
} from "@/services/government-services"
import landRecordsData from "@/data/land-records.json"

const iconMap = {
  "grid-3x3": Grid3X3,
  gift: Gift,
  smartphone: Smartphone,
  "indian-rupee": IndianRupee,
  "shield-check": ShieldCheck,
  map: Map,
  "trending-up": TrendingUp,
  "credit-card": CreditCard,
  headphones: Headphones,
}

interface LandRecord {
  name: string
  portal: string
  url: string
  features: string[]
  languages: string[]
  helpline: string
}

export default function KisanSetuPage() {
  const [selectedState, setSelectedState] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("featured")
  const [landRecordState, setLandRecordState] = useState<string>("")
  const [showLandRecordInfo, setShowLandRecordInfo] = useState(false)

  const { toast } = useToast()
  const {
    getServicesByState,
    getNationalServices,
    getFeaturedServices,
    getServicesByCategory,
    searchServices,
    getCategories,
    checkServiceAvailability,
  } = useGovernmentServices()

  const { location, loading: locationLoading, error: locationError, detectLocation } = useGeolocation()

  // Auto-select state when location is detected
  useEffect(() => {
    if (location?.state && !selectedState) {
      setSelectedState(location.state)
      setLandRecordState(location.state)
      toast({
        title: "Location Detected",
        description: `Showing services for ${INDIAN_STATES.find((s) => s.code === location.state)?.name}`,
      })
    }
  }, [location, selectedState, toast])

  // Get filtered services based on current filters
  const filteredServices = useMemo(() => {
    if (searchQuery.trim()) {
      return searchServices(searchQuery, selectedState)
    }

    if (activeTab === "featured") {
      return getFeaturedServices()
    }

    if (activeTab === "state" && selectedState) {
      return getServicesByState(selectedState)
    }

    if (activeTab === "national") {
      return getNationalServices()
    }

    return getServicesByCategory(selectedCategory, selectedState)
  }, [
    searchQuery,
    selectedState,
    selectedCategory,
    activeTab,
    searchServices,
    getFeaturedServices,
    getServicesByState,
    getNationalServices,
    getServicesByCategory,
  ])

  const categories = getCategories()
  const featuredServices = getFeaturedServices()

  const handleServiceClick = async (service: GovernmentService) => {
    try {
      const isAvailable = await checkServiceAvailability(service.url)

      if (!isAvailable) {
        toast({
          title: "Service Unavailable",
          description: `${service.name} appears to be temporarily unavailable. Please try again later.`,
          variant: "destructive",
        })
        return
      }

      window.open(service.url, "_blank", "noopener,noreferrer")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open service. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLandRecordAccess = (stateCode: string) => {
    const stateData = landRecordsData.states[stateCode as keyof typeof landRecordsData.states] as LandRecord

    if (!stateData) {
      toast({
        title: "State Not Found",
        description: "Land records portal not available for selected state.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Redirecting to Official Portal",
      description: `Opening ${stateData.portal} - ${stateData.name}`,
    })

    // Open the official government portal
    window.open(stateData.url, "_blank", "noopener,noreferrer")
  }

  const handleMKisanAccess = () => {
    toast({
      title: "Opening mKisan Portal",
      description: "Redirecting to official mKisan SMS advisory service",
    })
    window.open("https://mkisan.gov.in", "_blank", "noopener,noreferrer")
  }

  const handleDBTAccess = () => {
    toast({
      title: "Opening DBT Bharat Portal",
      description: "Redirecting to Direct Benefit Transfer portal",
    })
    window.open("https://www.dbtbharat.gov.in", "_blank", "noopener,noreferrer")
  }

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "app":
        return Smartphone
      case "scheme":
        return Gift
      case "portal":
        return Globe
      case "service":
        return Headphones
      default:
        return Globe
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "app":
        return "bg-blue-100 text-blue-800"
      case "scheme":
        return "bg-green-100 text-green-800"
      case "portal":
        return "bg-purple-100 text-purple-800"
      case "service":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const selectedLandRecord = landRecordState
    ? (landRecordsData.states[landRecordState as keyof typeof landRecordsData.states] as LandRecord)
    : null

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-800">KisanSetu - Government Services Hub</h1>
        <p className="text-lg text-green-700 max-w-3xl mx-auto">
          Your one-stop destination for all government agricultural services, schemes, and applications across India.
          Discover and access official resources tailored to your state and farming needs.
        </p>
      </div>

      {/* Quick Access Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* mKisan Portal */}
        <Card
          className="border-2 border-blue-200 bg-blue-50/80 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
          onClick={handleMKisanAccess}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-blue-800">
              <div className="p-2 bg-blue-600 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl">mKisan Portal</span>
                <Badge className="ml-2 bg-blue-100 text-blue-800" variant="secondary">
                  SMS ADVISORY
                </Badge>
              </div>
            </CardTitle>
            <CardDescription className="text-blue-700">
              Get SMS-based agricultural advisories, weather updates, and government scheme information directly on your
              mobile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <span>SMS Alerts</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CloudRain className="h-4 w-4 text-blue-600" />
                  <span>Weather Updates</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Gift className="h-4 w-4 text-blue-600" />
                  <span>Scheme Info</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>Location Based</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <h4 className="font-medium text-sm mb-2 text-blue-800">Key Features:</h4>
                <ul className="text-xs space-y-1 text-blue-700">
                  <li>• Crop-specific advisories via SMS</li>
                  <li>• Real-time weather alerts</li>
                  <li>• Market price information</li>
                  <li>• Government scheme notifications</li>
                </ul>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <ExternalLink className="h-4 w-4 mr-2" />
                Access mKisan Portal
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* DBT Bharat Portal */}
        <Card
          className="border-2 border-green-200 bg-green-50/80 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
          onClick={handleDBTAccess}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-green-800">
              <div className="p-2 bg-green-600 rounded-lg">
                <Banknote className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl">DBT Bharat</span>
                <Badge className="ml-2 bg-green-100 text-green-800" variant="secondary">
                  DIRECT BENEFITS
                </Badge>
              </div>
            </CardTitle>
            <CardDescription className="text-green-700">
              Check Direct Benefit Transfer status, fertilizer subsidies, and track government scheme payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Receipt className="h-4 w-4 text-green-600" />
                  <span>DBT Status</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                  <span>Subsidies</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span>Quick Tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>Verified Data</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-green-200">
                <h4 className="font-medium text-sm mb-2 text-green-800">Available Services:</h4>
                <ul className="text-xs space-y-1 text-green-700">
                  <li>• Fertilizer subsidy tracking</li>
                  <li>• PM-KISAN payment status</li>
                  <li>• Beneficiary verification</li>
                  <li>• Scheme-wise payment details</li>
                </ul>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <ExternalLink className="h-4 w-4 mr-2" />
                Access DBT Portal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Land Records Section - Enhanced */}
      <Card className="mb-8 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <FileText className="h-6 w-6" />
            RTO Pahani - Land Records Access
          </CardTitle>
          <CardDescription className="text-orange-700">
            Access your official land records directly from verified state government portals. Get Pahani, Khasra,
            mutation status, and other land documents instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* State Selection */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-orange-800">Select Your State</label>
                <Select value={landRecordState} onValueChange={setLandRecordState}>
                  <SelectTrigger className="w-full border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Choose your state for land records" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        <div className="flex items-center gap-2">
                          <MapIcon className="h-4 w-4 text-orange-600" />
                          {state.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedLandRecord && (
                <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg text-orange-800">{selectedLandRecord.portal}</h3>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                      Official Portal
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1 text-orange-700">Available Records:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedLandRecord.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-1 text-orange-700">Languages:</h4>
                      <div className="flex gap-1">
                        {selectedLandRecord.languages.map((lang, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-orange-300 text-orange-600">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">Helpline:</span> {selectedLandRecord.helpline}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => landRecordState && handleLandRecordAccess(landRecordState)}
                  disabled={!landRecordState}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white shadow-md"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Access Land Records
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowLandRecordInfo(!showLandRecordInfo)}
                  className="px-3 border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Information Panel */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-orange-800">
                  <Shield className="h-5 w-5 text-orange-600" />
                  Why Use Official Portals?
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                    100% authentic and legally valid documents
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                    Real-time mutation and ownership status
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                    Direct access without intermediaries
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                    Secure government-verified information
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-800">Documents You'll Need:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {landRecordsData.commonDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <FileText className="h-3 w-3 text-blue-600" />
                      {doc}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="font-semibold mb-2 text-yellow-800">Use Cases:</h3>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  {landRecordsData.benefits.slice(0, 4).map((benefit, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-600" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {showLandRecordInfo && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-3 text-blue-800 flex items-center gap-2">
                <Info className="h-5 w-5" />
                How to Access Your Land Records:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Select State</p>
                    <p className="text-muted-foreground">Choose your state from the dropdown above</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Click Access</p>
                    <p className="text-muted-foreground">You'll be redirected to the official portal</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Enter Details</p>
                    <p className="text-muted-foreground">Provide your land details to get records</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Detection */}
      <Card className="mb-8 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <MapPin className="h-5 w-5" />
            Location & State Selection
          </CardTitle>
          <CardDescription>We can auto-detect your location or you can manually select your state</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={detectLocation}
                disabled={locationLoading}
                className="flex items-center gap-2 bg-transparent border-green-300 text-green-700 hover:bg-green-50"
              >
                {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                Detect Location
              </Button>

              {location && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Location detected
                </div>
              )}

              {locationError && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  Location failed
                </div>
              )}
            </div>

            <div className="flex-1 max-w-xs">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="border-green-200 focus:border-green-400">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services, schemes, or apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-green-200 focus:border-green-400"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48 border-green-200 focus:border-green-400">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => {
                const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Grid3X3
                return (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {category.name}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 6).map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Grid3X3
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-1 ${
                  selectedCategory === category.id
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-green-300 text-green-700 hover:bg-green-50"
                }`}
              >
                <IconComponent className="h-3 w-3" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-green-100">
          <TabsTrigger
            value="featured"
            className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Star className="h-4 w-4" />
            Featured
          </TabsTrigger>
          <TabsTrigger
            value="state"
            className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <MapPin className="h-4 w-4" />
            State Services
          </TabsTrigger>
          <TabsTrigger
            value="national"
            className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Globe className="h-4 w-4" />
            National
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Grid3X3 className="h-4 w-4" />
            All Services
          </TabsTrigger>
        </TabsList>

        {/* Featured Services */}
        <TabsContent value="featured">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-green-800">Featured Government Services</h2>
            <p className="text-green-700">Major national programs and schemes that benefit farmers across India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => {
              const IconComponent = getServiceIcon(service.type)
              return (
                <Card
                  key={service.id}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-green-800">{service.name}</CardTitle>
                          <Badge className={getTypeColor(service.type)} variant="secondary">
                            {service.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      {service.isFeatured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 text-green-700">{service.description}</CardDescription>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-green-800">Key Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-green-300 text-green-700">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleServiceClick(service)}
                      className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Access Service
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* State Services */}
        <TabsContent value="state">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-green-800">State-Specific Services</h2>
            {selectedState ? (
              <p className="text-green-700">
                Government services and schemes available in {INDIAN_STATES.find((s) => s.code === selectedState)?.name}
              </p>
            ) : (
              <p className="text-green-700">Please select your state to view state-specific services</p>
            )}
          </div>

          {!selectedState ? (
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-lg font-medium mb-2 text-green-800">Select Your State</h3>
                <p className="text-green-700 text-center mb-4">
                  Choose your state from the dropdown above to view state-specific agricultural services
                </p>
                <Button
                  onClick={detectLocation}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Auto-Detect Location
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getServicesByState(selectedState).map((service) => {
                const IconComponent = getServiceIcon(service.type)
                return (
                  <Card
                    key={service.id}
                    className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-green-800">{service.name}</CardTitle>
                          <Badge className={getTypeColor(service.type)} variant="secondary">
                            {service.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4 text-green-700">{service.description}</CardDescription>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-green-800">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {service.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-green-300 text-green-700">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleServiceClick(service)}
                        className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Access Service
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* National Services */}
        <TabsContent value="national">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-green-800">National Services</h2>
            <p className="text-green-700">Government services and schemes available across all states in India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getNationalServices().map((service) => {
              const IconComponent = getServiceIcon(service.type)
              return (
                <Card
                  key={service.id}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-green-800">{service.name}</CardTitle>
                          <Badge className={getTypeColor(service.type)} variant="secondary">
                            {service.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      {service.isFeatured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 text-green-700">{service.description}</CardDescription>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-green-800">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-green-300 text-green-700">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleServiceClick(service)}
                      className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Access Service
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* All Services */}
        <TabsContent value="all">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-green-800">All Services</h2>
            <p className="text-green-700">
              Complete list of government agricultural services, schemes, and applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const IconComponent = getServiceIcon(service.type)
              return (
                <Card
                  key={service.id}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-green-800">{service.name}</CardTitle>
                          <Badge className={getTypeColor(service.type)} variant="secondary">
                            {service.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      {service.isFeatured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 text-green-700">{service.description}</CardDescription>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-green-800">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-green-300 text-green-700">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleServiceClick(service)}
                      className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Access Service
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredServices.length === 0 && (
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-lg font-medium mb-2 text-green-800">No Services Found</h3>
                <p className="text-green-700 text-center">
                  Try adjusting your search query or filters to find relevant services
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card className="mt-12 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Phone className="h-5 w-5" />
            Need Help?
          </CardTitle>
          <CardDescription>Get assistance with government services and schemes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-2 text-green-800">Kisan Call Center</h3>
              <p className="text-sm text-green-700 mb-2">24x7 helpline for farmers</p>
              <Button
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
              >
                Call 1551
              </Button>
            </div>

            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2 text-green-800">Local Agriculture Office</h3>
              <p className="text-sm text-green-700 mb-2">Visit your nearest office</p>
              <Button
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
              >
                Find Office
              </Button>
            </div>

            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-2 text-green-800">Online Support</h3>
              <p className="text-sm text-green-700 mb-2">Get help through official portals</p>
              <Button
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
              >
                Get Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
