"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { HistoricalPrice } from "@/services/market-data-service"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { Download, TrendingDown, TrendingUp } from "lucide-react"
import { generateMarketDataPDF, getPdfDataUrl, savePDF } from "@/lib/pdf-generator"
import { toast } from "@/hooks/use-toast"
import { PDFPreviewModal } from "./pdf-preview-modal"

interface PriceHistoryChartProps {
  cropName: string
  historicalPrices: HistoricalPrice[]
  currentPrice: number
  change: number
  changePercentage: number
  trend: "up" | "down" | "stable"
  unit: string
  cropImage?: string
}

export function PriceHistoryChart({
  cropName,
  historicalPrices,
  currentPrice,
  change,
  changePercentage,
  trend,
  unit,
  cropImage,
}: PriceHistoryChartProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "180d" | "1y">("30d")
  const [chartData, setChartData] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const fileName = `${cropName}-price-history.pdf`

  useEffect(() => {
    // Filter data based on selected time range
    const now = new Date()
    const filterDate = new Date()

    switch (timeRange) {
      case "7d":
        filterDate.setDate(now.getDate() - 7)
        break
      case "30d":
        filterDate.setDate(now.getDate() - 30)
        break
      case "90d":
        filterDate.setDate(now.getDate() - 90)
        break
      case "180d":
        filterDate.setDate(now.getDate() - 180)
        break
      case "1y":
        filterDate.setDate(now.getDate() - 365)
        break
    }

    const filteredData = historicalPrices.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= filterDate
    })

    // Format data for the chart
    const formattedData = filteredData.map((item) => ({
      date: formatDate(item.date),
      price: item.price,
    }))

    setChartData(formattedData)
  }, [timeRange, historicalPrices])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}`
  }

  // Calculate min and max for Y axis
  const minPrice = Math.min(...chartData.map((d) => d.price)) * 0.95
  const maxPrice = Math.max(...chartData.map((d) => d.price)) * 1.05

  const handleExportPDF = async () => {
    try {
      setIsGenerating(true)
      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your report...",
      })

      // Create a simple, throwaway crop data object just for this chart
      const cropDataForPDF = {
        name: cropName,
        currentPrice,
        unit,
        change,
        changePercentage,
        trend,
        lastUpdated: new Date().toISOString(),
        marketLocation: "Various Markets",
        description: `Historical price data for ${cropName}`,
        historicalPrices: chartData.map((item) => ({
          date: item.date,
          price: item.price,
        })),
        seasonality: {
          peak: ["Unknown"],
          low: ["Unknown"],
        },
        topProducers: [{ region: "Unknown", percentage: 0 }],
        demandForecast: "medium" as const,
        priceOutlook: "Based on historical data analysis",
        marketInsights: [
          `${cropName} has shown ${trend === "up" ? "an upward" : "a downward"} trend over the selected period.`,
          `The average price over this period was ₹${Math.round(chartData.reduce((sum, item) => sum + item.price, 0) / chartData.length).toLocaleString()}.`,
          `Historical data indicates price fluctuations of approximately ${Math.round(Math.abs(changePercentage))}% over the analyzed timeframe.`,
        ],
        image: cropImage || "/placeholder.svg",
      }

      // Generate the PDF document
      const doc = await generateMarketDataPDF(cropDataForPDF)

      // Ensure doc is a valid jsPDF instance
      if (!doc || typeof doc.output !== "function") {
        throw new Error("Invalid PDF document generated")
      }

      // Get data URL for preview
      const dataUrl = getPdfDataUrl(doc)

      setPdfDoc(doc)
      setPdfDataUrl(dataUrl)
      setShowPreview(true)

      toast({
        title: "PDF Generated",
        description: "Preview is ready. You can download or cancel.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error exporting chart as PDF:", error)
      toast({
        title: "Error Generating PDF",
        description: "There was a problem creating your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!pdfDoc || typeof pdfDoc.output !== "function") {
      toast({
        title: "Error Downloading PDF",
        description: "Invalid PDF document. Please try generating the report again.",
        variant: "destructive",
      })
      return
    }

    try {
      await savePDF(pdfDoc, fileName)
      toast({
        title: "PDF Downloaded",
        description: "Your market report has been downloaded successfully.",
        variant: "success",
      })
      setShowPreview(false)
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast({
        title: "Download Failed",
        description: "There was a problem downloading your report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleClosePreview = () => {
    setShowPreview(false)
  }

  // Calculate statistics
  const avgPrice =
    chartData.length > 0 ? Math.round(chartData.reduce((sum, item) => sum + item.price, 0) / chartData.length) : 0
  const highestPrice = chartData.length > 0 ? Math.max(...chartData.map((item) => item.price)) : 0
  const lowestPrice = chartData.length > 0 ? Math.min(...chartData.map((item) => item.price)) : 0

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{`Date: ${label}`}</p>
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            {`Price: ₹${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full overflow-hidden border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Header section */}
        <div className="p-4 md:p-6 pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <div>
              <h2 className="text-xl font-bold">{cropName} Price History</h2>
              <p className="text-sm text-muted-foreground">Trends and analysis</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={handleExportPDF} disabled={isGenerating}>
                <Download className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Export"}
              </Button>
            </div>
          </div>

          {/* Price display section */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">₹{currentPrice.toLocaleString()}</span>
              <span
                className={`text-sm font-medium ${trend === "up" ? "text-green-500" : "text-red-500"} flex items-center`}
              >
                {trend === "up" ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                {change > 0 ? "+" : ""}
                {change.toLocaleString()} ({changePercentage > 0 ? "+" : ""}
                {changePercentage.toFixed(1)}%)
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">{unit}</span>
            </div>
          </div>

          {/* Time range selector */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button variant={timeRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("7d")}>
              7D
            </Button>
            <Button variant={timeRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30d")}>
              1M
            </Button>
            <Button variant={timeRange === "90d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("90d")}>
              3M
            </Button>
            <Button
              variant={timeRange === "180d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("180d")}
            >
              6M
            </Button>
            <Button variant={timeRange === "1y" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("1y")}>
              1Y
            </Button>
          </div>
        </div>

        {/* Chart section */}
        <div className="h-[250px] md:h-[300px] px-2 md:px-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => value}
                />
                <YAxis
                  domain={[minPrice, maxPrice]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={trend === "up" ? "#10b981" : "#ef4444"}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: trend === "up" ? "#10b981" : "#ef4444" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No data available for the selected time range</p>
            </div>
          )}
        </div>

        {/* Statistics section */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700 mt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="p-3 md:p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium">Avg. Price</p>
            <p className="text-base md:text-lg font-bold mt-1">₹{avgPrice.toLocaleString()}</p>
          </div>
          <div className="p-3 md:p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium">Highest Price</p>
            <p className="text-base md:text-lg font-bold mt-1">₹{highestPrice.toLocaleString()}</p>
          </div>
          <div className="p-3 md:p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium">Lowest Price</p>
            <p className="text-base md:text-lg font-bold mt-1">₹{lowestPrice.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>

      {/* PDF Preview Modal */}
      {pdfDataUrl && (
        <PDFPreviewModal
          isOpen={showPreview}
          onClose={handleClosePreview}
          pdfDataUrl={pdfDataUrl}
          fileName={fileName}
          onDownload={handleDownload}
        />
      )}
    </Card>
  )
}
