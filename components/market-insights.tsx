"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { CropMarketData } from "@/services/market-data-service"
import { ArrowUpDown, Download, TrendingDown, TrendingUp } from "lucide-react"
import { generateMarketDataPDF, getPdfDataUrl, savePDF } from "@/lib/pdf-generator"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { PDFPreviewModal } from "./pdf-preview-modal"

interface MarketInsightsProps {
  cropData: CropMarketData
}

export function MarketInsights({ cropData }: MarketInsightsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const fileName = `${cropData.name}-market-insights.pdf`

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
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Market Analysis for {cropData.name}</h3>
          <Button
            variant="default"
            size="sm"
            className="gap-2 bg-green-600 hover:bg-green-700"
            onClick={handleExportPDF}
            disabled={isGenerating}
          >
            <Download className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Export Report"}
          </Button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Price Outlook</h4>
              <p className="text-sm text-muted-foreground">{cropData.priceOutlook}</p>

              <h4 className="text-lg font-medium mt-6">Demand Forecast</h4>
              <div
                className={`
                inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                ${
                  cropData.demandForecast === "high"
                    ? "bg-green-100 text-green-800"
                    : cropData.demandForecast === "medium"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                }
              `}
              >
                {cropData.demandForecast === "high" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : cropData.demandForecast === "low" ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <ArrowUpDown className="h-4 w-4" />
                )}
                {cropData.demandForecast.toUpperCase()} DEMAND
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium">Seasonality</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Peak Season</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cropData.seasonality.peak.map((month) => (
                      <span key={month} className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Season</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cropData.seasonality.low.map((month) => (
                      <span key={month} className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Top Producers</h4>
            <div className="space-y-3">
              {cropData.topProducers.map((producer) => (
                <div key={producer.region}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{producer.region}</span>
                    <span className="text-sm text-muted-foreground">{producer.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${producer.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Market Insights</h4>
            <ul className="space-y-2">
              {cropData.marketInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="inline-block mt-1 size-2 bg-primary rounded-full"></span>
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* PDF Preview Modal */}
        <PDFPreviewModal
          isOpen={showPreview}
          onClose={handleClosePreview}
          pdfDataUrl={pdfDataUrl}
          fileName={fileName}
          onDownload={handleDownload}
        />
      </CardContent>
    </Card>
  )
}
