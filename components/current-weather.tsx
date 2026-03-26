import { Card, CardContent } from "@/components/ui/card"
import { Thermometer, Droplets, Wind, Sun, CloudRain } from "lucide-react"
import type { WeatherData } from "@/services/weather-service"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface CurrentWeatherProps {
  weatherData: WeatherData | null
  loading: boolean
}

export function CurrentWeather({ weatherData, loading }: CurrentWeatherProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <div className="h-6 w-32 bg-slate-200 rounded"></div>
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
              </div>
              <div className="h-16 w-16 bg-slate-200 rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-20 bg-slate-200 rounded-md"></div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No weather data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get the appropriate weather icon based on condition
  const WeatherIcon = weatherData.current.condition.code
    ? weatherData.current.condition.text.toLowerCase().includes("rain")
      ? CloudRain
      : weatherData.current.condition.text.toLowerCase().includes("cloud")
        ? Droplets
        : Sun
    : Sun

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Background gradient based on weather condition */}
          <div
            className={cn(
              "absolute inset-0 opacity-20",
              weatherData.current.condition.text.toLowerCase().includes("rain")
                ? "bg-gradient-to-br from-blue-500 to-blue-700"
                : weatherData.current.condition.text.toLowerCase().includes("cloud")
                  ? "bg-gradient-to-br from-slate-400 to-slate-600"
                  : "bg-gradient-to-br from-amber-400 to-amber-600",
            )}
          ></div>

          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center">
                  {weatherData.location.name}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {weatherData.location.country}
                  </Badge>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Last updated: {weatherData.current.last_updated || weatherData.lastUpdated}
                </p>
              </div>
              <div
                className={cn(
                  "h-16 w-16 rounded-full flex items-center justify-center",
                  weatherData.current.condition.text.toLowerCase().includes("rain")
                    ? "bg-blue-100"
                    : weatherData.current.condition.text.toLowerCase().includes("cloud")
                      ? "bg-slate-100"
                      : "bg-amber-100",
                )}
              >
                <WeatherIcon
                  className={cn(
                    "h-8 w-8",
                    weatherData.current.condition.text.toLowerCase().includes("rain")
                      ? "text-blue-500"
                      : weatherData.current.condition.text.toLowerCase().includes("cloud")
                        ? "text-slate-500"
                        : "text-amber-500",
                  )}
                />
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="text-4xl font-bold mr-4">{Math.round(weatherData.current.temp_c)}°C</div>
              <div>
                <div className="font-medium">{weatherData.current.condition.text}</div>
                <div className="text-sm text-muted-foreground">
                  Feels like {Math.round(weatherData.current.feelslike_c)}°C
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg text-center">
                <div className="flex justify-center mb-1">
                  <Thermometer className="h-5 w-5 text-rose-500" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Feels Like</div>
                <div className="font-semibold">{Math.round(weatherData.current.feelslike_c)}°C</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg text-center">
                <div className="flex justify-center mb-1">
                  <Droplets className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Humidity</div>
                <div className="font-semibold">{weatherData.current.humidity}%</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg text-center">
                <div className="flex justify-center mb-1">
                  <Wind className="h-5 w-5 text-slate-500" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Wind</div>
                <div className="font-semibold">
                  {weatherData.current.wind_kph} km/h
                  {weatherData.current.wind_dir && <span className="text-xs ml-1">{weatherData.current.wind_dir}</span>}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg text-center">
                <div className="flex justify-center mb-1">
                  <Sun className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">UV Index</div>
                <div className="font-semibold">{weatherData.current.uv}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
