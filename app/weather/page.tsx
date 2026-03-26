"use client"

import type React from "react"
import { MapPin, Search, Navigation, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWeatherData, getFarmingRecommendations, useWeatherDataByDateRange } from "@/services/weather-service"
import { useToast } from "@/hooks/use-toast"
import { WeatherChart } from "@/components/weather-chart"
import { DailyForecast } from "@/components/daily-forecast"
import { WeatherAlerts } from "@/components/weather-alerts"
import { FarmingRecommendations } from "@/components/farming-recommendations"
import { CurrentWeather } from "@/components/current-weather"
import { HistoricalWeather } from "@/components/historical-weather"
import { DateRangePicker } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"

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
  "Delhi",
]

const popularCities = [
  "New Delhi, Delhi",
  "Mumbai, Maharashtra",
  "Bangalore, Karnataka",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Chandigarh, Punjab",
]

interface LocationData {
  city: string
  state: string
  country: string
  latitude: number
  longitude: number
}

export default function WeatherPage() {
  const [location, setLocation] = useState("New Delhi, Delhi")
  const [searchInput, setSearchInput] = useState("")
  const [selectedState, setSelectedState] = useState<string>("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isDateRangeMode, setIsDateRangeMode] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [locationStatus, setLocationStatus] = useState<"idle" | "detecting" | "success" | "error">("idle")

  // Stable "today" so we don't create new Date() each render
  const todayDefaults = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return { from: start, to: start }
  }, [])

  const start = dateRange?.from ?? todayDefaults.from
  const end = dateRange?.to ?? todayDefaults.to

  // Hooks: date range and regular
  const {
    data: dateRangeWeatherData,
    loading: dateRangeLoading,
    error: dateRangeError,
  } = useWeatherDataByDateRange(location, start, end)

  const { data: regularWeatherData, loading: regularLoading, error: regularError } = useWeatherData(location)

  // Select active dataset based on mode
  const weatherData = isDateRangeMode ? dateRangeWeatherData : regularWeatherData
  const loading = isDateRangeMode ? dateRangeLoading : regularLoading
  const error = isDateRangeMode ? dateRangeError : regularError

  const recommendations = getFarmingRecommendations(weatherData)
  const { toast } = useToast()

  // Show error toast once when error changes
  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching weather data",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  // Auto-detect location on component mount
  useEffect(() => {
    detectCurrentLocation()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setLocation(searchInput)
      setLocationStatus("success")
    }
  }

  const handleQuickSelect = (city: string) => {
    setSearchInput(city)
    setLocation(city)
    setLocationStatus("success")
  }

  const handleStateSelect = (state: string) => {
    setSelectedState(state)
    const stateLocation = `${state}, India`
    setSearchInput(stateLocation)
    setLocation(stateLocation)
    setLocationStatus("success")

    toast({
      title: "State Selected",
      description: `Weather data for ${state} will be displayed`,
    })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      setIsDateRangeMode(true)
    }
  }

  const handleResetDateRange = () => {
    setDateRange(undefined)
    setIsDateRangeMode(false)
  }

  const detectCurrentLocation = async () => {
    setIsDetectingLocation(true)
    setLocationError(null)
    setLocationStatus("detecting")

    if (!navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by this browser"
      setLocationError(errorMsg)
      setLocationStatus("error")
      setIsDetectingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Simulate reverse geocoding (in real app, use actual geocoding service)
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Mock location data based on coordinates
          const mockLocationData: LocationData = {
            city: "New Delhi",
            state: "Delhi",
            country: "India",
            latitude,
            longitude,
          }

          const locationName = `${mockLocationData.city}, ${mockLocationData.state}`
          setLocationData(mockLocationData)
          setSearchInput(locationName)
          setLocation(locationName)
          setLocationStatus("success")

          toast({
            title: "Location detected successfully",
            description: `Current location: ${locationName}`,
          })
        } catch (error) {
          const errorMsg = "Failed to get location details"
          setLocationError(errorMsg)
          setLocationStatus("error")
          toast({
            title: "Location detection failed",
            description: errorMsg,
            variant: "destructive",
          })
        } finally {
          setIsDetectingLocation(false)
        }
      },
      (error) => {
        let errorMessage = "Failed to detect location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }
        setLocationError(errorMessage)
        setLocationStatus("error")
        toast({
          title: "Location detection failed",
          description: errorMessage,
          variant: "destructive",
        })
        setIsDetectingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const getLocationStatusIcon = () => {
    switch (locationStatus) {
      case "detecting":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Weather Intelligence</h1>
          <p className="text-muted-foreground">
            Get accurate weather forecasts and essential data for your farm location
          </p>
        </div>
      </div>

      {/* Location Detection Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getLocationStatusIcon()}
            Location Detection
          </CardTitle>
          <CardDescription>
            {locationStatus === "detecting" && "Detecting your current location..."}
            {locationStatus === "success" && `Location set to: ${location}`}
            {locationStatus === "error" && `Error: ${locationError}`}
            {locationStatus === "idle" && "Click detect location or enter manually"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Auto Location Detection */}
            <div className="flex items-center gap-2">
              <Button
                onClick={detectCurrentLocation}
                disabled={isDetectingLocation}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                {isDetectingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                {isDetectingLocation ? "Detecting..." : "Auto-Detect Location"}
              </Button>

              {locationData && (
                <Badge variant="secondary" className="ml-2">
                  Lat: {locationData.latitude.toFixed(4)}, Lon: {locationData.longitude.toFixed(4)}
                </Badge>
              )}
            </div>

            {/* Manual Location Input */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter city, state..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </form>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">or</span>
                  <Select value={selectedState} onValueChange={handleStateSelect}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select State" />
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Cities */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Popular Cities</h3>
        <div className="flex flex-wrap gap-2">
          {popularCities.map((city) => (
            <Button
              key={city}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-transparent"
              onClick={() => handleQuickSelect(city)}
            >
              <MapPin className="h-3 w-3" />
              {city.split(",")[0]}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            className="w-full sm:w-[300px]"
          />
        </div>
        {isDateRangeMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDateRange}
            className="flex items-center gap-1 bg-transparent"
          >
            Reset to Current
          </Button>
        )}
      </div>

      <Tabs defaultValue="current">
        <TabsList className="mb-6">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="historical">Historical</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="space-y-6">
            <CurrentWeather weatherData={weatherData} loading={loading} />
            <WeatherChart weatherData={weatherData} loading={loading} dateRange={isDateRangeMode} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FarmingRecommendations recommendations={recommendations} loading={loading} />
              <WeatherAlerts alerts={recommendations?.alerts} loading={loading} />
            </div>
            <DailyForecast weatherData={weatherData} loading={loading} />
          </div>
        </TabsContent>

        <TabsContent value="historical">
          <HistoricalWeather location={location} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
