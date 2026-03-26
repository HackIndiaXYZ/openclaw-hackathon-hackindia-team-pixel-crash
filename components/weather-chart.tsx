"use client"

import { useEffect, useRef, useState } from "react"
import type { WeatherData } from "@/services/weather-service"
import { Thermometer, Droplets, Umbrella } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WeatherChartProps {
  weatherData: WeatherData | null
  loading: boolean
  dateRange?: boolean // Add this line
}

export function WeatherChart({ weatherData, loading, dateRange = false }: WeatherChartProps) {
  const [activeTab, setActiveTab] = useState<"temperature" | "precipitation" | "humidity">("temperature")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!weatherData || !canvasRef.current || loading) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get data based on whether we're showing a date range or hourly data
    let hourlyData
    let dateLabels: string[] = []
    const isDateRange = dateRange && weatherData.forecast?.forecastday.length > 1

    if (isDateRange) {
      // For date range, we'll use the daily data
      hourlyData = weatherData.forecast?.forecastday.map((day) => ({
        time: day.date,
        temp_c: day.day.avgtemp_c,
        humidity: 60, // Placeholder value
        chance_of_rain: day.day.daily_chance_of_rain || 0,
      }))
      dateLabels = weatherData.forecast?.forecastday.map((day) => day.date) || []
    } else {
      // For single day, use hourly data as before
      hourlyData = weatherData.forecast?.forecastday[0].hour
    }

    if (!hourlyData) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * 2 // For high DPI displays
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2) // Scale for high DPI

    const displayWidth = canvas.offsetWidth
    const displayHeight = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, displayWidth, displayHeight)

    // Chart dimensions
    const padding = { top: 40, right: 20, bottom: 40, left: 40 }
    const chartWidth = displayWidth - padding.left - padding.right
    const chartHeight = displayHeight - padding.top - padding.bottom

    // Find min and max values based on active tab
    let dataValues: number[] = []
    let dataColor = ""
    let dataLabel = ""
    let dataUnit = ""
    let gradientColors: string[] = []

    switch (activeTab) {
      case "temperature":
        dataValues = hourlyData.map((hour) => hour.temp_c)
        dataColor = "#ff7e67"
        dataLabel = "Temperature"
        dataUnit = "°C"
        gradientColors = ["rgba(255, 126, 103, 0.8)", "rgba(255, 126, 103, 0.1)"]
        break
      case "humidity":
        dataValues = hourlyData.map((hour) => hour.humidity)
        dataColor = "#5d9cec"
        dataLabel = "Humidity"
        dataUnit = "%"
        gradientColors = ["rgba(93, 156, 236, 0.8)", "rgba(93, 156, 236, 0.1)"]
        break
      case "precipitation":
        dataValues = hourlyData.map((hour) => hour.chance_of_rain || 0)
        dataColor = "#4caf50"
        dataLabel = "Chance of Rain"
        dataUnit = "%"
        gradientColors = ["rgba(76, 175, 80, 0.8)", "rgba(76, 175, 80, 0.1)"]
        break
    }

    const maxValue = Math.max(...dataValues) + 5
    const minValue = Math.max(0, Math.min(...dataValues) - 5)
    const valueRange = maxValue - minValue

    // Draw background grid
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
    }

    // Vertical grid lines
    if (isDateRange) {
      // For date range, draw grid lines for each date
      const numDates = dateLabels.length
      for (let i = 0; i < numDates; i++) {
        const x = padding.left + (i / (numDates - 1)) * chartWidth
        ctx.moveTo(x, padding.top)
        ctx.lineTo(x, padding.top + chartHeight)
      }
    } else {
      // For hourly data, draw grid lines every 3 hours
      for (let i = 0; i <= 24; i += 3) {
        const x = padding.left + (i / 24) * chartWidth
        ctx.moveTo(x, padding.top)
        ctx.lineTo(x, padding.top + chartHeight)
      }
    }
    ctx.stroke()

    // Draw time labels
    ctx.fillStyle = "#6b7280"
    ctx.font = "10px Inter, system-ui, sans-serif"
    ctx.textAlign = "center"

    if (isDateRange) {
      // For date range, show date labels
      const numDates = dateLabels.length
      for (let i = 0; i < numDates; i++) {
        const x = padding.left + (i / (numDates - 1)) * chartWidth
        const date = new Date(dateLabels[i])
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`
        ctx.fillText(formattedDate, x, displayHeight - padding.bottom / 2)
      }
    } else {
      // For hourly data, show time labels every 3 hours
      for (let i = 0; i <= 24; i += 3) {
        const x = padding.left + (i / 24) * chartWidth
        const hour = i % 12 || 12
        const ampm = i < 12 || i === 24 ? "AM" : "PM"
        ctx.fillText(`${hour} ${ampm}`, x, displayHeight - padding.bottom / 2)
      }
    }

    // Draw value scale
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (i / 5) * valueRange
      const y = padding.top + chartHeight - (i / 5) * chartHeight
      ctx.fillText(`${Math.round(value)}${dataUnit}`, padding.left - 5, y + 3)
    }

    // Draw chart title
    ctx.textAlign = "left"
    ctx.font = "bold 12px Inter, system-ui, sans-serif"
    ctx.fillText(`${dataLabel} (${dataUnit})`, padding.left, padding.top / 2)

    // Create gradient for area
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
    gradient.addColorStop(0, gradientColors[0])
    gradient.addColorStop(1, gradientColors[1])

    // Draw data line
    ctx.beginPath()
    ctx.strokeStyle = dataColor
    ctx.lineWidth = 2
    ctx.lineJoin = "round"

    // Draw area under the line
    const points: [number, number][] = []

    if (isDateRange) {
      // For date range data
      const numDates = hourlyData.length
      hourlyData.forEach((data, index) => {
        const value = dataValues[index]
        const x = padding.left + (index / (numDates - 1)) * chartWidth
        const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        points.push([x, y])
      })
    } else {
      // For hourly data
      hourlyData.forEach((hour, index) => {
        const value = dataValues[index]
        const x = padding.left + (index / 23) * chartWidth
        const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        points.push([x, y])
      })
    }

    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
    ctx.lineTo(padding.left, padding.top + chartHeight)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw data points
    points.forEach(([x, y], index) => {
      if (isDateRange || index % 3 === 0) {
        // Draw every point for date range, or every 3 hours for hourly data
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "white"
        ctx.strokeStyle = dataColor
        ctx.lineWidth = 2
        ctx.fill()
        ctx.stroke()
      }
    })

    // Draw current time indicator if it's today and not a date range
    if (!isDateRange) {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const hourFraction = currentHour + currentMinute / 60

      if (hourFraction >= 0 && hourFraction <= 24) {
        const x = padding.left + (hourFraction / 24) * chartWidth

        // Draw vertical line
        ctx.beginPath()
        ctx.strokeStyle = "#6b7280"
        ctx.lineWidth = 1
        ctx.setLineDash([4, 2])
        ctx.moveTo(x, padding.top)
        ctx.lineTo(x, padding.top + chartHeight)
        ctx.stroke()
        ctx.setLineDash([])

        // Draw current time label
        ctx.fillStyle = "#6b7280"
        ctx.font = "10px Inter, system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Now", x, padding.top - 5)
      }
    }
  }, [weatherData, loading, activeTab, dateRange])

  if (loading) {
    return (
      <Card className="w-full h-[350px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weather Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) {
    return (
      <Card className="w-full h-[350px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weather Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px] flex items-center justify-center">
          <div className="text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-[350px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weather Trends</CardTitle>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="temperature" className="flex items-center gap-1">
              <Thermometer className="h-3 w-3 text-rose-500" />
              <span>Temperature</span>
            </TabsTrigger>
            <TabsTrigger value="humidity" className="flex items-center gap-1">
              <Droplets className="h-3 w-3 text-blue-500" />
              <span>Humidity</span>
            </TabsTrigger>
            <TabsTrigger value="precipitation" className="flex items-center gap-1">
              <Umbrella className="h-3 w-3 text-green-500" />
              <span>Rain Chance</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-[280px] relative">
        <canvas ref={canvasRef} className="w-full h-full" />
      </CardContent>
    </Card>
  )
}
