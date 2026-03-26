"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  MapPin,
  RefreshCw,
  Sunrise,
  Sunset,
  Moon,
  Umbrella,
  Navigation,
  Activity,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WeatherData {
  location: string
  temperature: number
  feelsLike: number
  condition: string
  humidity: number
  windSpeed: number
  windDirection: string
  pressure: number
  visibility: number
  uvIndex: number
  sunrise: string
  sunset: string
  moonPhase: string
  precipitation: number
  dewPoint: number
  cloudCover: number
}

interface LocationData {
  latitude: number
  longitude: number
  city: string
  country: string
}

const weatherConditions = {
  sunny: { icon: Sun, bg: "from-yellow-400 to-orange-500", text: "Sunny" },
  cloudy: { icon: Cloud, bg: "from-gray-400 to-gray-600", text: "Cloudy" },
  rainy: { icon: CloudRain, bg: "from-blue-500 to-blue-700", text: "Rainy" },
  snowy: { icon: CloudSnow, bg: "from-blue-200 to-blue-400", text: "Snowy" },
  stormy: { icon: Zap, bg: "from-purple-600 to-purple-800", text: "Stormy" },
}

const getWeatherCondition = (condition: string) => {
  const lowerCondition = condition.toLowerCase()
  if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) return weatherConditions.sunny
  if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) return weatherConditions.rainy
  if (lowerCondition.includes("snow") || lowerCondition.includes("blizzard")) return weatherConditions.snowy
  if (lowerCondition.includes("storm") || lowerCondition.includes("thunder")) return weatherConditions.stormy
  return weatherConditions.cloudy
}

const generateMockWeatherData = (location: string): WeatherData => {
  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain", "Thunderstorm"]
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

  return {
    location,
    temperature: Math.floor(Math.random() * 35) + 5, // 5-40°C
    feelsLike: Math.floor(Math.random() * 35) + 5,
    condition: randomCondition,
    humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
    windSpeed: Math.floor(Math.random() * 25) + 5, // 5-30 km/h
    windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
    pressure: Math.floor(Math.random() * 50) + 980, // 980-1030 hPa
    visibility: Math.floor(Math.random() * 15) + 5, // 5-20 km
    uvIndex: Math.floor(Math.random() * 11), // 0-10
    sunrise: "06:30 AM",
    sunset: "07:45 PM",
    moonPhase: "Waxing Crescent",
    precipitation: Math.floor(Math.random() * 20), // 0-20mm
    dewPoint: Math.floor(Math.random() * 25) + 5,
    cloudCover: Math.floor(Math.random() * 100), // 0-100%
  }
}

const getUVIndexColor = (uvIndex: number) => {
  if (uvIndex <= 2) return "bg-green-500"
  if (uvIndex <= 5) return "bg-yellow-500"
  if (uvIndex <= 7) return "bg-orange-500"
  if (uvIndex <= 10) return "bg-red-500"
  return "bg-purple-500"
}

const getUVIndexLabel = (uvIndex: number) => {
  if (uvIndex <= 2) return "Low"
  if (uvIndex <= 5) return "Moderate"
  if (uvIndex <= 7) return "High"
  if (uvIndex <= 10) return "Very High"
  return "Extreme"
}

export default function CurrentWeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Mock reverse geocoding
          const mockLocation: LocationData = {
            latitude,
            longitude,
            city: "Current Location",
            country: "India",
          }
          setLocation(mockLocation)
          setWeatherData(generateMockWeatherData(`${mockLocation.city}, ${mockLocation.country}`))
          setLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          // Fallback to default location
          const defaultLocation: LocationData = {
            latitude: 28.6139,
            longitude: 77.209,
            city: "New Delhi",
            country: "India",
          }
          setLocation(defaultLocation)
          setWeatherData(generateMockWeatherData(`${defaultLocation.city}, ${defaultLocation.country}`))
          setLoading(false)
          toast({
            title: "Location Access Denied",
            description: "Using default location: New Delhi, India",
            variant: "default",
          })
        },
      )
    } else {
      // Geolocation not supported
      const defaultLocation: LocationData = {
        latitude: 28.6139,
        longitude: 77.209,
        city: "New Delhi",
        country: "India",
      }
      setLocation(defaultLocation)
      setWeatherData(generateMockWeatherData(`${defaultLocation.city}, ${defaultLocation.country}`))
      setLoading(false)
    }
  }

  const refreshWeather = async () => {
    setRefreshing(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (location) {
      setWeatherData(generateMockWeatherData(`${location.city}, ${location.country}`))
    }
    setRefreshing(false)
    toast({
      title: "Weather Updated",
      description: "Current weather data has been refreshed",
    })
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading current weather...</p>
        </div>
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">Unable to load weather data</p>
          <Button onClick={getCurrentLocation} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const weatherCondition = getWeatherCondition(weatherData.condition)
  const WeatherIcon = weatherCondition.icon

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Hero Weather Card */}
      <Card className={`mb-8 overflow-hidden bg-gradient-to-br ${weatherCondition.bg} text-white`}>
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span className="text-lg font-medium">{weatherData.location}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={refreshWeather}
              disabled={refreshing}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <WeatherIcon className="h-16 w-16" />
                <div>
                  <div className="text-5xl font-bold">{weatherData.temperature}°C</div>
                  <div className="text-lg opacity-90">Feels like {weatherData.feelsLike}°C</div>
                </div>
              </div>
              <div className="text-xl font-medium">{weatherData.condition}</div>
            </div>

            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">Last updated</div>
              <div className="text-lg font-medium">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Current Conditions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{weatherData.humidity}%</div>
                  <div className="text-sm text-gray-600">Humidity</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Wind className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                  <div className="text-2xl font-bold">{weatherData.windSpeed}</div>
                  <div className="text-sm text-gray-600">km/h {weatherData.windDirection}</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Gauge className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{weatherData.pressure}</div>
                  <div className="text-sm text-gray-600">hPa</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{weatherData.visibility}</div>
                  <div className="text-sm text-gray-600">km</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">UV Index</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getUVIndexColor(weatherData.uvIndex)} text-white`}>
                      {weatherData.uvIndex}
                    </Badge>
                    <span className="text-sm text-gray-600">{getUVIndexLabel(weatherData.uvIndex)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Umbrella className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Precipitation</span>
                  </div>
                  <span className="font-bold">{weatherData.precipitation} mm</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Dew Point</span>
                  </div>
                  <span className="font-bold">{weatherData.dewPoint}°C</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sun & Moon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sun className="h-5 w-5" />
                <span>Sun & Moon</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sunrise className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Sunrise</span>
                </div>
                <span className="font-medium">{weatherData.sunrise}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sunset className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Sunset</span>
                </div>
                <span className="font-medium">{weatherData.sunset}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Moon Phase</span>
                </div>
                <span className="font-medium">{weatherData.moonPhase}</span>
              </div>
            </CardContent>
          </Card>

          {/* Agricultural Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Agricultural Recommendations</CardTitle>
              <CardDescription>Based on current weather conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {weatherData.condition.toLowerCase().includes("rain") ? (
                <>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-blue-800">Irrigation</div>
                    <div className="text-sm text-blue-600">Skip irrigation today due to rainfall</div>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-yellow-800">Field Work</div>
                    <div className="text-sm text-yellow-600">Avoid heavy machinery in wet fields</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-800">Irrigation</div>
                    <div className="text-sm text-green-600">Good conditions for watering crops</div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-blue-800">Field Work</div>
                    <div className="text-sm text-blue-600">Excellent conditions for field operations</div>
                  </div>
                </>
              )}

              {weatherData.uvIndex > 7 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="font-medium text-orange-800">UV Protection</div>
                  <div className="text-sm text-orange-600">High UV levels - protect workers and sensitive crops</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="h-5 w-5" />
                <span>Location Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {location && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Latitude:</span>
                    <span className="font-medium">{location.latitude.toFixed(4)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Longitude:</span>
                    <span className="font-medium">{location.longitude.toFixed(4)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cloud Cover:</span>
                    <span className="font-medium">{weatherData.cloudCover}%</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
