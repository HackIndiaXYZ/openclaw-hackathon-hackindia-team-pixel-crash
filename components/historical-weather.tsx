"use client"

import { Badge } from "@/components/ui/badge"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, LineChart, BarChart2, ArrowDownToLine } from "lucide-react"
import { useState } from "react"

// Mock historical data
const generateMockHistoricalData = (location: string, month: number) => {
  // Generate mock temperature data for the month
  const daysInMonth = new Date(2025, month, 0).getDate()

  const temperatures = Array(daysInMonth)
    .fill(0)
    .map((_, i) => {
      // Base temperature varies by month (higher in summer, lower in winter)
      let baseTemp = 25
      if (month >= 3 && month <= 5)
        baseTemp = 32 // Summer (Apr-Jun)
      else if (month >= 6 && month <= 8)
        baseTemp = 28 // Monsoon (Jul-Sep)
      else if (month >= 9 && month <= 11)
        baseTemp = 22 // Autumn/Winter (Oct-Dec)
      else baseTemp = 18 // Winter/Spring (Jan-Mar)

      // Add some randomness
      const randomVariation = Math.sin(i / 5) * 5 + (Math.random() * 4 - 2)
      return {
        date: `2025-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
        max: Math.round(baseTemp + randomVariation + 5),
        min: Math.round(baseTemp + randomVariation - 5),
        avg: Math.round(baseTemp + randomVariation),
      }
    })

  // Generate mock rainfall data
  const rainfall = Array(daysInMonth)
    .fill(0)
    .map((_, i) => {
      // More rainfall during monsoon months
      let chance = 0.2
      if (month >= 6 && month <= 8) chance = 0.6 // Higher chance during monsoon

      const hasRain = Math.random() < chance
      return {
        date: `2025-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
        amount: hasRain ? Math.round(Math.random() * 30) : 0,
      }
    })

  return {
    location,
    month,
    year: 2025,
    temperatures,
    rainfall,
    summary: {
      avgTemp: Math.round(temperatures.reduce((sum, day) => sum + day.avg, 0) / daysInMonth),
      totalRainfall: Math.round(rainfall.reduce((sum, day) => sum + day.amount, 0)),
      rainyDays: rainfall.filter((day) => day.amount > 0).length,
      maxTemp: Math.max(...temperatures.map((day) => day.max)),
      minTemp: Math.min(...temperatures.map((day) => day.min)),
    },
  }
}

interface HistoricalWeatherProps {
  location: string
}

export function HistoricalWeather({ location }: HistoricalWeatherProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(2025)
  const [view, setView] = useState<"temperature" | "rainfall">("temperature")

  // Generate mock data based on selected month
  const historicalData = generateMockHistoricalData(location, month)

  // Available years for selection (just for UI, we'll always use 2025 for mock data)
  const years = [2023, 2024, 2025]

  // Month names for selection
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Historical Weather Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Select Month</label>
              <Select value={month.toString()} onValueChange={(value) => setMonth(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((monthName, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {monthName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Select Year</label>
              <Select value={year.toString()} onValueChange={(value) => setYear(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">
              {months[month - 1]} {year} - {location.split(",")[0]}
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowDownToLine className="h-4 w-4" />
                <span className="hidden sm:inline">Export Data</span>
              </Button>
            </div>
          </div>

          <Tabs value={view} onValueChange={(v) => setView(v as "temperature" | "rainfall")}>
            <TabsList className="mb-4">
              <TabsTrigger value="temperature" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                Temperature
              </TabsTrigger>
              <TabsTrigger value="rainfall" className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" />
                Rainfall
              </TabsTrigger>
            </TabsList>

            <TabsContent value="temperature">
              <div className="border rounded-lg p-4">
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Temperature chart visualization would appear here
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="border rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">Average Temp</div>
                    <div className="text-xl font-bold">{historicalData.summary.avgTemp}°C</div>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">Max Temp</div>
                    <div className="text-xl font-bold text-red-500">{historicalData.summary.maxTemp}°C</div>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">Min Temp</div>
                    <div className="text-xl font-bold text-blue-500">{historicalData.summary.minTemp}°C</div>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">Temp Range</div>
                    <div className="text-xl font-bold">
                      {historicalData.summary.maxTemp - historicalData.summary.minTemp}°C
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rainfall">
              <div className="border rounded-lg p-4">
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Rainfall chart visualization would appear here
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  <div className="border rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">Total Rainfall</div>
                    <div className="text-xl font-bold text-blue-500">{historicalData.summary.totalRainfall} mm</div>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">Rainy Days</div>
                    <div className="text-xl font-bold">{historicalData.summary.rainyDays} days</div>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">Avg per Rainy Day</div>
                    <div className="text-xl font-bold">
                      {historicalData.summary.rainyDays > 0
                        ? Math.round(historicalData.summary.totalRainfall / historicalData.summary.rainyDays)
                        : 0}{" "}
                      mm
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Agricultural Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Crop Suitability</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Based on historical weather patterns for {months[month - 1]} in {location.split(",")[0]}
              </p>

              <div className="space-y-3">
                {[
                  {
                    crop: "Wheat",
                    suitability: month >= 10 || month <= 2 ? "High" : "Low",
                    note:
                      month >= 10 || month <= 2
                        ? "Ideal temperature range for wheat cultivation"
                        : "Too warm for optimal wheat growth",
                  },
                  {
                    crop: "Rice",
                    suitability: month >= 6 && month <= 9 ? "High" : "Medium",
                    note:
                      month >= 6 && month <= 9
                        ? "Good rainfall and temperature for rice cultivation"
                        : "Consider irrigation requirements",
                  },
                  {
                    crop: "Cotton",
                    suitability: month >= 4 && month <= 7 ? "High" : "Medium",
                    note:
                      month >= 4 && month <= 7
                        ? "Warm temperatures favor cotton growth"
                        : "May require additional management",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{item.crop}</div>
                      <div className="text-xs text-muted-foreground">{item.note}</div>
                    </div>
                    <Badge
                      className={cn(
                        item.suitability === "High"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : item.suitability === "Medium"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100",
                      )}
                    >
                      {item.suitability}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Historical Comparison</h3>
              <p className="text-sm text-muted-foreground mb-4">Comparing current year with historical averages</p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Temperature vs. 10-year average</span>
                    <span className="text-sm font-medium">+1.2°C</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: "62%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Rainfall vs. 10-year average</span>
                    <span className="text-sm font-medium">-15%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Growing degree days</span>
                    <span className="text-sm font-medium">+8%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "58%" }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Climate Trend Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Long-term data indicates a warming trend of approximately 0.2°C per decade in this region, with more
                  variable rainfall patterns. Consider drought-resistant crop varieties and improved water management
                  practices.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
