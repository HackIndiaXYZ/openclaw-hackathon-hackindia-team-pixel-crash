"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/date-range-picker"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CalendarIcon,
  Search,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import type { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"

interface DayForecast {
  date: string
  day: string
  high: number
  low: number
  condition: string
  precipitation: number
  humidity: number
  windSpeed: number
  windDirection: string
  uvIndex: number
  sunrise: string
  sunset: string
  hourly?: HourlyForecast[]
}

interface HourlyForecast {
  time: string
  temperature: number
  condition: string
  precipitation: number
  windSpeed: number
  humidity: number
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
}

const forecastPeriods = [
  { key: "7days", label: "7 Days", days: 7 },
  { key: "15days", label: "15 Days", days: 15 },
  { key: "30days", label: "30 Days", days: 30 },
  { key: "custom", label: "Custom Range", days: 0 },
  { key: "specific", label: "Specific Date", days: 1 },
]

export default function ForecastPage() {
  const [forecast, setForecast] = useState<DayForecast[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("7days")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [specificDate, setSpecificDate] = useState<Date | undefined>(new Date())
  const [expandedDay, setExpandedDay] = useState<string | null>(null)

  const generateMockForecast = (days: number, startDate?: Date): DayForecast[] => {
    const conditions = ["sunny", "cloudy", "rainy", "snowy"]
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const baseDate = startDate || new Date()

    return Array.from({ length: days }, (_, i) => {
      const date = addDays(baseDate, i)
      const condition = conditions[Math.floor(Math.random() * conditions.length)]

      // Generate hourly data for the first 3 days or if it's a specific date
      const hourly =
        i < 3 || selectedPeriod === "specific"
          ? Array.from({ length: 24 }, (_, hour) => ({
              time: `${hour.toString().padStart(2, "0")}:00`,
              temperature: Math.round(Math.random() * 15 + 15 + Math.sin((hour / 24) * Math.PI * 2) * 5),
              condition: conditions[Math.floor(Math.random() * conditions.length)],
              precipitation: Math.round(Math.random() * 5 * 10) / 10,
              windSpeed: Math.round(Math.random() * 15 + 5),
              humidity: Math.round(Math.random() * 30 + 50),
            }))
          : undefined

      return {
        date: date.toISOString().split("T")[0],
        day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayNames[date.getDay()],
        high: Math.round(Math.random() * 15 + 20),
        low: Math.round(Math.random() * 10 + 10),
        condition,
        precipitation: Math.round(Math.random() * 10 * 10) / 10,
        humidity: Math.round(Math.random() * 30 + 50),
        windSpeed: Math.round(Math.random() * 20 + 5),
        windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
        uvIndex: Math.round(Math.random() * 11),
        sunrise: "06:30",
        sunset: "18:45",
        hourly,
      }
    })
  }

  const fetchForecast = async () => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const period = forecastPeriods.find((p) => p.key === selectedPeriod)
    let days = period?.days || 7
    let startDate = new Date()

    // Handle different period types
    if (selectedPeriod === "custom" && dateRange?.from && dateRange?.to) {
      const timeDiff = dateRange.to.getTime() - dateRange.from.getTime()
      days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
      days = Math.min(days, 30) // Limit to 30 days max
      startDate = dateRange.from
    } else if (selectedPeriod === "specific" && specificDate) {
      days = 1
      startDate = specificDate
    }

    const mockForecast = generateMockForecast(days, startDate)
    setForecast(mockForecast)
    setLoading(false)

    const periodLabel =
      selectedPeriod === "specific" ? `forecast for ${format(startDate, "PPP")}` : `${days}-day forecast`

    toast({
      title: "Forecast Updated",
      description: `Weather ${periodLabel} loaded successfully`,
    })
  }

  useEffect(() => {
    if (selectedPeriod !== "custom") {
      fetchForecast()
    }
  }, [selectedPeriod, specificDate])

  const handleCustomRangeLoad = () => {
    if (dateRange?.from && dateRange?.to) {
      fetchForecast()
    } else {
      toast({
        title: "Invalid Date Range",
        description: "Please select both start and end dates",
        variant: "destructive",
      })
    }
  }

  const handleSpecificDateLoad = () => {
    if (specificDate) {
      fetchForecast()
    } else {
      toast({
        title: "No Date Selected",
        description: "Please select a specific date",
        variant: "destructive",
      })
    }
  }

  const chartData = forecast.slice(0, 14).map((day) => ({
    day: day.day,
    date: day.date,
    high: day.high,
    low: day.low,
    precipitation: day.precipitation,
  }))

  const toggleDayExpansion = (date: string) => {
    setExpandedDay(expandedDay === date ? null : date)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Weather Forecast</h1>
            <p className="text-muted-foreground">Extended weather predictions</p>
          </div>
        </div>

        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Weather Forecast</h1>
          <p className="text-muted-foreground">Extended weather predictions for your location</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchForecast} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast Period</CardTitle>
          <CardDescription>Select the forecast duration or specific date</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <TabsList className="grid w-full grid-cols-5">
              {forecastPeriods.map((period) => (
                <TabsTrigger key={period.key} value={period.key}>
                  {period.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="custom" className="mt-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Select Date Range</label>
                    <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} className="w-full" />
                  </div>
                  <Button onClick={handleCustomRangeLoad} className="w-full sm:w-auto">
                    <Search className="h-4 w-4 mr-2" />
                    Load Range
                  </Button>
                </div>
                {dateRange?.from && dateRange?.to && (
                  <div className="text-sm text-muted-foreground">
                    Selected: {format(dateRange.from, "PPP")} to {format(dateRange.to, "PPP")}(
                    {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 3600 * 24)) + 1} days)
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specific" className="mt-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Select Specific Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {specificDate ? format(specificDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={specificDate}
                          onSelect={setSpecificDate}
                          initialFocus
                          disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button onClick={handleSpecificDateLoad} className="w-full sm:w-auto">
                    <Search className="h-4 w-4 mr-2" />
                    Load Date
                  </Button>
                </div>
                {specificDate && (
                  <div className="text-sm text-muted-foreground">Selected: {format(specificDate, "PPPP")}</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Current Selection Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Current Forecast:</span>
            </div>
            <Badge variant="secondary">
              {selectedPeriod === "specific" && specificDate
                ? `${format(specificDate, "MMM dd, yyyy")}`
                : selectedPeriod === "custom" && dateRange?.from && dateRange?.to
                  ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
                  : `Next ${forecast.length} days`}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Temperature Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Trend</CardTitle>
          <CardDescription>Daily high and low temperatures</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={selectedPeriod === "specific" ? "date" : "day"}
                tickFormatter={(value) => (selectedPeriod === "specific" ? format(new Date(value), "HH:mm") : value)}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => (selectedPeriod === "specific" ? format(new Date(value), "PPP") : value)}
              />
              <Line type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} name="High °C" />
              <Line type="monotone" dataKey="low" stroke="#3b82f6" strokeWidth={2} name="Low °C" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Precipitation Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Precipitation Forecast</CardTitle>
          <CardDescription>Expected rainfall over the forecast period</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={selectedPeriod === "specific" ? "date" : "day"}
                tickFormatter={(value) => (selectedPeriod === "specific" ? format(new Date(value), "HH:mm") : value)}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => (selectedPeriod === "specific" ? format(new Date(value), "PPP") : value)}
              />
              <Bar dataKey="precipitation" fill="#06b6d4" name="Precipitation (mm)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>{selectedPeriod === "specific" ? "Detailed Forecast" : "Daily Forecast"}</CardTitle>
          <CardDescription>
            {selectedPeriod === "specific"
              ? "Hourly breakdown for the selected date"
              : "Detailed daily weather conditions"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {forecast.map((day) => {
            const WeatherIcon = weatherIcons[day.condition as keyof typeof weatherIcons] || Sun
            const isExpanded = expandedDay === day.date

            return (
              <div key={day.date} className="border rounded-lg p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleDayExpansion(day.date)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium w-20">
                      {selectedPeriod === "specific" ? format(new Date(day.date), "MMM dd") : day.day}
                    </div>
                    <WeatherIcon className="h-6 w-6" />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{day.high}°</span>
                      <span className="text-muted-foreground">{day.low}°</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CloudRain className="h-4 w-4" />
                        {day.precipitation}mm
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="h-4 w-4" />
                        {day.windSpeed}km/h
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="h-4 w-4" />
                        {day.humidity}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {day.condition}
                    </Badge>
                    {day.hourly &&
                      (isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                  </div>
                </div>

                {isExpanded && day.hourly && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-3">Hourly Forecast</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                      {day.hourly
                        .filter((_, i) => (selectedPeriod === "specific" ? true : i % 3 === 0))
                        .map((hour) => {
                          const HourIcon = weatherIcons[hour.condition as keyof typeof weatherIcons] || Sun
                          return (
                            <div key={hour.time} className="text-center p-2 bg-muted/50 rounded">
                              <div className="text-xs text-muted-foreground">{hour.time}</div>
                              <HourIcon className="h-4 w-4 mx-auto my-1" />
                              <div className="text-sm font-semibold">{hour.temperature}°</div>
                              <div className="text-xs text-muted-foreground">{hour.precipitation}mm</div>
                            </div>
                          )
                        })}
                    </div>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Wind: </span>
                        <span>
                          {day.windSpeed}km/h {day.windDirection}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Humidity: </span>
                        <span>{day.humidity}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">UV Index: </span>
                        <span>{day.uvIndex}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sunrise: </span>
                        <span>{day.sunrise}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Agricultural Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Agricultural Insights</CardTitle>
          <CardDescription>Farming recommendations based on forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Irrigation Planning</h4>
              <p className="text-sm text-blue-700">
                Expected rainfall:{" "}
                {forecast
                  .slice(0, 7)
                  .reduce((sum, day) => sum + day.precipitation, 0)
                  .toFixed(1)}
                mm over forecast period
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Field Operations</h4>
              <p className="text-sm text-green-700">
                {forecast.filter((day) => day.condition === "sunny").length} sunny days optimal for field work
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Weather Alerts</h4>
              <p className="text-sm text-yellow-700">
                {forecast.filter((day) => day.precipitation > 5).length} days with heavy rain expected
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
