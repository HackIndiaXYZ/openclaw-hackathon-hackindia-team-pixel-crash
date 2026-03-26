import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Droplets, Umbrella, Wind, Sun, CloudRain, Thermometer } from "lucide-react"
import type { WeatherData } from "@/services/weather-service"
import { cn } from "@/lib/utils"

interface DetailedForecastProps {
  weatherData: WeatherData | null
  loading: boolean
}

export function DetailedForecast({ weatherData, loading }: DetailedForecastProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Detailed Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded-md w-full"></div>
            <div className="h-64 bg-slate-200 rounded-md w-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData || !weatherData.forecast) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Detailed Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No forecast data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const today = new Date().getDay()

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Detailed Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="w-full grid grid-cols-7">
            {weatherData.forecast.forecastday.map((day, index) => {
              const date = new Date(day.date)
              const dayName =
                index === 0 ? "Today" : index === 1 ? "Tomorrow" : days[(today + index) % 7].substring(0, 3)

              return (
                <TabsTrigger key={day.date} value={index.toString()} className="text-xs sm:text-sm">
                  {dayName}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {weatherData.forecast.forecastday.map((day, index) => {
            const date = new Date(day.date)
            const dayName = index === 0 ? "Today" : index === 1 ? "Tomorrow" : days[(today + index) % 7]

            // Get the appropriate weather icon based on condition
            const WeatherIcon = day.day.condition.code
              ? day.day.condition.text.toLowerCase().includes("rain")
                ? CloudRain
                : day.day.condition.text.toLowerCase().includes("cloud")
                  ? Droplets
                  : Sun
              : Sun

            return (
              <TabsContent key={day.date} value={index.toString()} className="pt-4">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Day Summary */}
                  <div className="w-full md:w-1/3">
                    <div className="border rounded-lg p-4 h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{dayName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center",
                            day.day.condition.text.toLowerCase().includes("rain")
                              ? "bg-blue-100"
                              : day.day.condition.text.toLowerCase().includes("cloud")
                                ? "bg-slate-100"
                                : "bg-amber-100",
                          )}
                        >
                          <WeatherIcon
                            className={cn(
                              "h-6 w-6",
                              day.day.condition.text.toLowerCase().includes("rain")
                                ? "text-blue-500"
                                : day.day.condition.text.toLowerCase().includes("cloud")
                                  ? "text-slate-500"
                                  : "text-amber-500",
                            )}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-2xl font-bold">{Math.round(day.day.avgtemp_c)}°C</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Thermometer className="h-3 w-3" />
                          <span>
                            {Math.round(day.day.mintemp_c)}° - {Math.round(day.day.maxtemp_c)}°
                          </span>
                        </div>
                      </div>

                      <div className="text-sm mb-4">{day.day.condition.text}</div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{day.day.daily_chance_of_rain}% chance of rain</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Umbrella className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{day.day.totalprecip_mm}mm precipitation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-slate-500" />
                          <span className="text-sm">{day.day.maxwind_kph} km/h wind</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">UV Index: {day.day.uv || "N/A"}</span>
                        </div>
                      </div>

                      {day.astro && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Sunrise:</span>{" "}
                              <span className="font-medium">{day.astro.sunrise}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sunset:</span>{" "}
                              <span className="font-medium">{day.astro.sunset}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Moon:</span>{" "}
                              <span className="font-medium">{day.astro.moon_phase}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hourly Forecast */}
                  <div className="w-full md:w-2/3">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Hourly Forecast</h3>
                      <div className="overflow-x-auto">
                        <div className="inline-flex gap-3 pb-2">
                          {day.hour
                            .filter((_, i) => i % 3 === 0)
                            .map((hour) => {
                              const hourTime = new Date(hour.time)
                              const hourNum = hourTime.getHours()
                              const ampm = hourNum >= 12 ? "PM" : "AM"
                              const hour12 = hourNum % 12 || 12

                              // Get the appropriate weather icon based on condition
                              const HourIcon = hour.condition.code
                                ? hour.condition.text.toLowerCase().includes("rain")
                                  ? CloudRain
                                  : hour.condition.text.toLowerCase().includes("cloud")
                                    ? Droplets
                                    : Sun
                                : Sun

                              return (
                                <div
                                  key={hour.time}
                                  className="flex flex-col items-center min-w-[80px] p-2 border rounded-lg"
                                >
                                  <div className="text-sm font-medium">
                                    {hour12} {ampm}
                                  </div>
                                  <div
                                    className={cn(
                                      "h-8 w-8 my-2 rounded-full flex items-center justify-center",
                                      hour.condition.text.toLowerCase().includes("rain")
                                        ? "bg-blue-100"
                                        : hour.condition.text.toLowerCase().includes("cloud")
                                          ? "bg-slate-100"
                                          : "bg-amber-100",
                                    )}
                                  >
                                    <HourIcon
                                      className={cn(
                                        "h-4 w-4",
                                        hour.condition.text.toLowerCase().includes("rain")
                                          ? "text-blue-500"
                                          : hour.condition.text.toLowerCase().includes("cloud")
                                            ? "text-slate-500"
                                            : "text-amber-500",
                                      )}
                                    />
                                  </div>
                                  <div className="text-sm font-bold">{Math.round(hour.temp_c)}°C</div>
                                  <div className="flex items-center mt-1">
                                    <Droplets className="h-3 w-3 text-blue-500 mr-1" />
                                    <span className="text-xs">{hour.humidity}%</span>
                                  </div>
                                  {hour.chance_of_rain > 0 && (
                                    <Badge className="mt-1 text-xs bg-blue-100 text-blue-800 hover:bg-blue-100">
                                      {hour.chance_of_rain}%
                                    </Badge>
                                  )}
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </div>

                    {/* Agricultural Impact */}
                    <div className="border rounded-lg p-4 mt-4">
                      <h3 className="font-medium mb-4">Agricultural Impact</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-3">
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <Droplets className="h-4 w-4 text-blue-500 mr-1" />
                            Irrigation Needs
                          </h4>
                          <p className="text-sm">
                            {day.day.daily_chance_of_rain > 50 || day.day.totalprecip_mm > 5
                              ? "Natural rainfall likely sufficient. Consider reducing irrigation."
                              : day.day.daily_chance_of_rain > 20
                                ? "Light irrigation may be needed depending on crop type."
                                : "Full irrigation recommended for optimal growth."}
                          </p>
                        </div>
                        <div className="border rounded-lg p-3">
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <Wind className="h-4 w-4 text-slate-500 mr-1" />
                            Field Operations
                          </h4>
                          <p className="text-sm">
                            {day.day.daily_chance_of_rain > 70 || day.day.totalprecip_mm > 10
                              ? "Avoid field operations due to wet conditions."
                              : day.day.maxwind_kph > 25
                                ? "Caution advised for spraying operations due to wind."
                                : "Favorable conditions for field operations."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}
