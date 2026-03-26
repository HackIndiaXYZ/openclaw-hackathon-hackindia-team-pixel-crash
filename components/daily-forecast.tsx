import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Umbrella, Sun } from "lucide-react"
import type { WeatherData } from "@/services/weather-service"
import { cn } from "@/lib/utils"

interface DailyForecastProps {
  weatherData: WeatherData | null
  loading: boolean
}

export function DailyForecast({ weatherData, loading }: DailyForecastProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    <div className="w-16 h-4 bg-slate-200 rounded"></div>
                  </div>
                  <div className="w-24 h-4 bg-slate-200 rounded"></div>
                  <div className="w-16 h-4 bg-slate-200 rounded"></div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData || !weatherData.forecast) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">7-Day Forecast</CardTitle>
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
        <CardTitle className="text-lg">7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col divide-y">
          {weatherData.forecast.forecastday.map((day, index) => {
            const date = new Date(day.date)
            const dayName = index === 0 ? "Today" : index === 1 ? "Tomorrow" : days[(today + index) % 7]
            const Icon = day.day.condition.code
              ? day.day.condition.text.toLowerCase().includes("rain")
                ? Umbrella
                : day.day.condition.text.toLowerCase().includes("cloud")
                  ? Droplets
                  : Sun
              : Sun

            return (
              <div key={day.date} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      index === 0 ? "bg-blue-100" : "bg-slate-100",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        day.day.condition.text.toLowerCase().includes("rain")
                          ? "text-blue-500"
                          : day.day.condition.text.toLowerCase().includes("cloud")
                            ? "text-slate-500"
                            : "text-amber-500",
                      )}
                    />
                  </div>
                  <div>
                    <div className="font-medium">{dayName}</div>
                    <div className="text-xs text-muted-foreground">
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>

                <div className="text-sm">{day.day.condition.text}</div>

                <div className="flex items-center gap-1">
                  <span className="font-medium">{Math.round(day.day.maxtemp_c)}°</span>
                  <span className="text-muted-foreground">{Math.round(day.day.mintemp_c)}°</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
