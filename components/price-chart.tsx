"use client"

import { useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Download, LineChart } from "lucide-react"
import type { HistoricalPrice } from "@/services/market-service"

interface PriceChartProps {
  cropName: string
  historicalData: HistoricalPrice[]
  loading: boolean
  timeRange?: "1M" | "3M" | "6M" | "1Y" | "All"
  onTimeRangeChange?: (range: "1M" | "3M" | "6M" | "1Y" | "All") => void
}

export function PriceChart({
  cropName,
  historicalData,
  loading,
  timeRange = "3M",
  onTimeRangeChange,
}: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Filter data based on time range
  const getFilteredData = () => {
    if (timeRange === "All" || !historicalData.length) return historicalData

    const today = new Date()
    const startDate = new Date(today)

    switch (timeRange) {
      case "1M":
        startDate.setMonth(today.getMonth() - 1)
        break
      case "3M":
        startDate.setMonth(today.getMonth() - 3)
        break
      case "6M":
        startDate.setMonth(today.getMonth() - 6)
        break
      case "1Y":
        startDate.setFullYear(today.getFullYear() - 1)
        break
    }

    return historicalData.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate
    })
  }

  const filteredData = getFilteredData()

  useEffect(() => {
    if (!canvasRef.current || loading || !filteredData.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * 2 // For high DPI displays
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2) // Scale for high DPI

    const displayWidth = canvas.offsetWidth
    const displayHeight = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, displayWidth, displayHeight)

    // Chart dimensions
    const padding = { top: 40, right: 30, bottom: 60, left: 60 }
    const chartWidth = displayWidth - padding.left - padding.right
    const chartHeight = displayHeight - padding.top - padding.bottom

    // Find min and max values
    const prices = filteredData.map((item) => item.price)
    const maxPrice = Math.max(...prices) * 1.1 // Add 10% padding
    const minPrice = Math.min(...prices) * 0.9 // Subtract 10% padding

    // Draw background grid
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    const yStep = chartHeight / 5
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + i * yStep
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
    }

    // Vertical grid lines
    const xStep = chartWidth / Math.min(10, filteredData.length - 1)
    for (let i = 0; i <= Math.min(10, filteredData.length - 1); i++) {
      const x = padding.left + i * xStep
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
    }
    ctx.stroke()

    // Draw axes labels
    ctx.fillStyle = "#6b7280"
    ctx.font = "10px Inter, system-ui, sans-serif"
    ctx.textAlign = "center"

    // X-axis labels (dates)
    const labelStep = Math.max(1, Math.floor(filteredData.length / 10))
    for (let i = 0; i < filteredData.length; i += labelStep) {
      const x = padding.left + (i / (filteredData.length - 1)) * chartWidth
      const date = new Date(filteredData[i].date)
      const label = `${date.getDate()}/${date.getMonth() + 1}`
      ctx.fillText(label, x, displayHeight - padding.bottom / 2)
    }

    // Y-axis labels (prices)
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const value = minPrice + (i / 5) * (maxPrice - minPrice)
      const y = padding.top + chartHeight - (i / 5) * chartHeight
      ctx.fillText(`₹${Math.round(value)}`, padding.left - 10, y + 3)
    }

    // Draw chart title
    ctx.textAlign = "left"
    ctx.font = "bold 12px Inter, system-ui, sans-serif"
    ctx.fillText(`${cropName} Price Trend (₹ per quintal)`, padding.left, padding.top / 2)

    // Create gradient for area
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
    gradient.addColorStop(0, "rgba(34, 197, 94, 0.6)")
    gradient.addColorStop(1, "rgba(34, 197, 94, 0.1)")

    // Draw data line
    ctx.beginPath()
    ctx.strokeStyle = "#16a34a"
    ctx.lineWidth = 2
    ctx.lineJoin = "round"

    // Draw area under the line
    const points: [number, number][] = []

    filteredData.forEach((item, index) => {
      const x = padding.left + (index / (filteredData.length - 1)) * chartWidth
      const y = padding.top + chartHeight - ((item.price - minPrice) / (maxPrice - minPrice)) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      points.push([x, y])
    })

    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
    ctx.lineTo(padding.left, padding.top + chartHeight)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw data points
    const pointStep = Math.max(1, Math.floor(filteredData.length / 20))
    points.forEach(([x, y], index) => {
      if (index % pointStep === 0 || index === points.length - 1) {
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "white"
        ctx.strokeStyle = "#16a34a"
        ctx.lineWidth = 2
        ctx.fill()
        ctx.stroke()
      }
    })

    // Draw price labels for first and last points
    ctx.font = "bold 10px Inter, system-ui, sans-serif"
    ctx.fillStyle = "#16a34a"

    // First point
    const firstPoint = points[0]
    ctx.textAlign = "left"
    ctx.fillText(`₹${filteredData[0].price}`, firstPoint[0], firstPoint[1] - 10)

    // Last point
    const lastPoint = points[points.length - 1]
    ctx.textAlign = "right"
    ctx.fillText(`₹${filteredData[filteredData.length - 1].price}`, lastPoint[0], lastPoint[1] - 10)
  }, [filteredData, loading, cropName])

  if (loading) {
    return (
      <Card className="w-full h-[400px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <LineChart className="h-5 w-5 text-green-600" />
            Price History
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[320px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
        </CardContent>
      </Card>
    )
  }

  if (!historicalData.length) {
    return (
      <Card className="w-full h-[400px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <LineChart className="h-5 w-5 text-green-600" />
            Price History
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[320px] flex items-center justify-center">
          <div className="text-muted-foreground">No historical data available</div>
        </CardContent>
      </Card>
    )
  }

  // Calculate price change
  const firstPrice = filteredData[0]?.price || 0
  const lastPrice = filteredData[filteredData.length - 1]?.price || 0
  const priceChange = lastPrice - firstPrice
  const priceChangePercent = firstPrice ? (priceChange / firstPrice) * 100 : 0
  const isPositiveChange = priceChange >= 0

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <LineChart className="h-5 w-5 text-green-600" />
          Price History
        </CardTitle>
        <div className="flex items-center gap-2">
          <Tabs value={timeRange} onValueChange={(v) => onTimeRangeChange?.(v as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="1M" className="text-xs px-2">
                1M
              </TabsTrigger>
              <TabsTrigger value="3M" className="text-xs px-2">
                3M
              </TabsTrigger>
              <TabsTrigger value="6M" className="text-xs px-2">
                6M
              </TabsTrigger>
              <TabsTrigger value="1Y" className="text-xs px-2">
                1Y
              </TabsTrigger>
              <TabsTrigger value="All" className="text-xs px-2">
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="h-8">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date(filteredData[0]?.date).toLocaleDateString()} -{" "}
              {new Date(filteredData[filteredData.length - 1]?.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className={`h-4 w-4 ${isPositiveChange ? "text-green-600" : "text-red-600"}`} />
            <span className={`text-sm font-medium ${isPositiveChange ? "text-green-600" : "text-red-600"}`}>
              {isPositiveChange ? "+" : ""}
              {priceChange.toFixed(0)} ({isPositiveChange ? "+" : ""}
              {priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="h-[300px] relative">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  )
}
