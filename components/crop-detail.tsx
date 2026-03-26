"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PriceHistoryChart } from "@/components/price-history-chart"
import { MarketInsights } from "@/components/market-insights"
import type { CropMarketData } from "@/services/market-data-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generateMarketDataPDF, getPdfDataUrl, savePDF } from "@/lib/pdf-generator"
import { Download, Bell, Share2, ArrowLeft, Calendar, MapPin, TrendingDown, TrendingUp } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { PDFPreviewModal } from "./pdf-preview-modal"

interface CropDetailProps {
  cropData: CropMarketData
  onBack: () => void
}

export function CropDetail({ cropData, onBack }: CropDetailProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const fileName = `${cropData.name}-market-report.pdf`

  const handleExportPDF = async () => {
    try {
      setIsGenerating(true)
      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your report...",
      })

      const doc = generateMarketDataPDF(cropData)
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
      console.error("Error generating PDF:", error)
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
    if (!pdfDoc) return

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{cropData.name} Market Analysis</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isSubscribed ? "default" : "outline"}
            size="sm"
            onClick={() => setIsSubscribed(!isSubscribed)}
            className="gap-1"
          >
            <Bell className="h-4 w-4" />
            {isSubscribed ? "Subscribed" : "Price Alerts"}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="gap-1 bg-green-600 hover:bg-green-700"
            onClick={handleExportPDF}
            disabled={isGenerating}
          >
            <Download className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Export PDF"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-1/3 aspect-square rounded-lg overflow-hidden">
                <Image src={cropData.image || "/placeholder.svg"} alt={cropData.name} fill className="object-cover" />
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                <div>
                  <h2 className="text-xl font-bold">{cropData.name}</h2>
                  <p className="text-muted-foreground">{cropData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Current Price</div>
                    <div className="text-2xl font-bold">₹{cropData.currentPrice.toLocaleString()}</div>
                    <div className="text-sm">{cropData.unit}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Price Change</div>
                    <div
                      className={`text-xl font-bold flex items-center ${cropData.trend === "up" ? "text-green-500" : cropData.trend === "down" ? "text-red-500" : "text-gray-500"}`}
                    >
                      {cropData.trend === "up" ? (
                        <TrendingUp className="mr-1 h-5 w-5" />
                      ) : (
                        <TrendingDown className="mr-1 h-5 w-5" />
                      )}
                      <span>
                        {cropData.change > 0 ? "+" : ""}
                        {cropData.change.toLocaleString()} ({cropData.changePercentage > 0 ? "+" : ""}
                        {cropData.changePercentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Market: {cropData.marketLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Last Updated: {new Date(cropData.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Demand Forecast</div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium">{cropData.demandForecast.toUpperCase()}</div>
                  <Badge
                    variant="outline"
                    className={
                      cropData.demandForecast === "high"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : cropData.demandForecast === "medium"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }
                  >
                    {cropData.demandForecast.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Top Producer</div>
                <div className="text-lg font-medium">{cropData.topProducers[0].region}</div>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${cropData.topProducers[0].percentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Peak Season</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {cropData.seasonality.peak.map((month) => (
                    <Badge key={month} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                      {month}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Price Range (Last 6 Months)</div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-base font-medium">
                    ₹{Math.min(...cropData.historicalPrices.slice(-180).map((p) => p.price)).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">to</div>
                  <div className="text-base font-medium">
                    ₹{Math.max(...cropData.historicalPrices.slice(-180).map((p) => p.price)).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="price-history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="price-history">Price History</TabsTrigger>
          <TabsTrigger value="market-insights">Market Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="price-history" className="mt-4">
          <PriceHistoryChart
            cropName={cropData.name}
            historicalPrices={cropData.historicalPrices}
            currentPrice={cropData.currentPrice}
            change={cropData.change}
            changePercentage={cropData.changePercentage}
            trend={cropData.trend}
            unit={cropData.unit}
          />
        </TabsContent>
        <TabsContent value="market-insights" className="mt-4">
          <MarketInsights cropData={cropData} />
        </TabsContent>
      </Tabs>

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={showPreview}
        onClose={handleClosePreview}
        pdfDataUrl={pdfDataUrl}
        fileName={fileName}
        onDownload={handleDownload}
      />
    </div>
  )
}
