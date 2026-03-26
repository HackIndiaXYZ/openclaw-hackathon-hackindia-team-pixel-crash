import jsPDF from "jspdf"
import { format } from "date-fns"

interface PriceTrendData {
  date: string
  price: number
  volume: number
  prediction: number
}

interface CropTrendData {
  crop: string
  currentPrice: number
  change: number
  trend: "up" | "down"
  confidence: number
  forecast: string
  data: PriceTrendData[]
  state: string
  district: string
}

interface AIAnalysisData {
  forecast: string
  factors: string[]
  recommendation: string
  confidence: number
  algorithm: string
  processingTime: string
  dataPoints: number
  accuracy: string
}

interface PriceTrendReportData {
  cropData: CropTrendData
  aiAnalysis: AIAnalysisData
  timeRange: string
  generatedAt: Date
  state: string
  district: string
}

export const generatePriceTrendsPDF = async (reportData: PriceTrendReportData): Promise<void> => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage()
      yPosition = 20
      return true
    }
    return false
  }

  // Header
  doc.setFillColor(34, 197, 94) // Green background
  doc.rect(0, 0, pageWidth, 40, "F")

  // Logo placeholder
  doc.setFillColor(255, 255, 255)
  doc.circle(20, 20, 8, "F")
  doc.setTextColor(34, 197, 94)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("AG", 16, 24)

  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("Price Trends Analysis Report", pageWidth / 2, 25, { align: "center" })

  // Date and time
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated: ${format(reportData.generatedAt, "PPpp")}`, pageWidth - 15, 15, { align: "right" })
  doc.text("AGRO-GENIX Platform", pageWidth - 15, 25, { align: "right" })

  yPosition = 50

  // Report Details Section
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Report Details", 20, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Crop: ${reportData.cropData.crop}`, 20, yPosition)
  doc.text(`State: ${reportData.state}`, 100, yPosition)
  yPosition += 8
  doc.text(`District: ${reportData.district}`, 20, yPosition)
  doc.text(`Time Range: ${reportData.timeRange}`, 100, yPosition)
  yPosition += 8
  doc.text(`Analysis Date: ${format(reportData.generatedAt, "PP")}`, 20, yPosition)
  yPosition += 15

  // Current Market Status
  checkPageBreak(50)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Current Market Status", 20, yPosition)
  yPosition += 15

  // Status boxes
  const boxWidth = (pageWidth - 60) / 3
  const boxHeight = 30

  // Current Price Box
  doc.setFillColor(240, 253, 244)
  doc.rect(20, yPosition, boxWidth, boxHeight, "F")
  doc.setDrawColor(34, 197, 94)
  doc.rect(20, yPosition, boxWidth, boxHeight)
  doc.setTextColor(21, 128, 61)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Current Price", 20 + boxWidth / 2, yPosition + 10, { align: "center" })
  doc.setFontSize(18)
  doc.text(`₹${reportData.cropData.currentPrice}`, 20 + boxWidth / 2, yPosition + 22, { align: "center" })

  // Price Change Box
  const changeColor = reportData.cropData.trend === "up" ? [34, 197, 94] : [239, 68, 68]
  doc.setFillColor(changeColor[0], changeColor[1], changeColor[2], 0.1)
  doc.rect(30 + boxWidth, yPosition, boxWidth, boxHeight, "F")
  doc.setDrawColor(changeColor[0], changeColor[1], changeColor[2])
  doc.rect(30 + boxWidth, yPosition, boxWidth, boxHeight)
  doc.setTextColor(changeColor[0], changeColor[1], changeColor[2])
  doc.setFontSize(12)
  doc.text("Price Change", 30 + boxWidth + boxWidth / 2, yPosition + 10, { align: "center" })
  doc.setFontSize(18)
  doc.text(
    `${reportData.cropData.change > 0 ? "+" : ""}${reportData.cropData.change}%`,
    30 + boxWidth + boxWidth / 2,
    yPosition + 22,
    { align: "center" },
  )

  // AI Confidence Box
  doc.setFillColor(239, 246, 255)
  doc.rect(40 + 2 * boxWidth, yPosition, boxWidth, boxHeight, "F")
  doc.setDrawColor(59, 130, 246)
  doc.rect(40 + 2 * boxWidth, yPosition, boxWidth, boxHeight)
  doc.setTextColor(30, 64, 175)
  doc.setFontSize(12)
  doc.text("AI Confidence", 40 + 2 * boxWidth + boxWidth / 2, yPosition + 10, { align: "center" })
  doc.setFontSize(18)
  doc.text(`${reportData.cropData.confidence}%`, 40 + 2 * boxWidth + boxWidth / 2, yPosition + 22, { align: "center" })

  yPosition += 40

  // AI Analysis Section
  checkPageBreak(80)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("AI Analysis Results", 20, yPosition)
  yPosition += 15

  // AI Analysis Box
  doc.setFillColor(147, 51, 234, 0.1)
  doc.rect(20, yPosition, pageWidth - 40, 60, "F")
  doc.setDrawColor(147, 51, 234)
  doc.setLineWidth(0.5)
  doc.line(20, yPosition, 20, yPosition + 60)
  doc.line(22, yPosition, 22, yPosition + 60)

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("AI Forecast", 25, yPosition + 12)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const forecastText = doc.splitTextToSize(reportData.aiAnalysis.forecast, pageWidth - 60)
  doc.text(forecastText, 25, yPosition + 20)

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Algorithm Details", 25, yPosition + 40)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text(`Model: ${reportData.aiAnalysis.algorithm}`, 25, yPosition + 48)
  doc.text(`Processing Time: ${reportData.aiAnalysis.processingTime}`, 25, yPosition + 54)
  doc.text(`Data Points: ${reportData.aiAnalysis.dataPoints.toLocaleString()}`, 120, yPosition + 48)
  doc.text(`Accuracy: ${reportData.aiAnalysis.accuracy}`, 120, yPosition + 54)

  yPosition += 70

  // Key Factors Section
  checkPageBreak(60)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Key Market Factors", 20, yPosition)
  yPosition += 15

  reportData.aiAnalysis.factors.forEach((factor, index) => {
    checkPageBreak(8)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`${index + 1}. ${factor}`, 25, yPosition)
    yPosition += 8
  })

  yPosition += 10

  // AI Recommendation Section
  checkPageBreak(40)
  doc.setFillColor(34, 197, 94, 0.1)
  doc.rect(20, yPosition, pageWidth - 40, 35, "F")
  doc.setDrawColor(34, 197, 94)
  doc.setLineWidth(0.5)
  doc.line(20, yPosition, 20, yPosition + 35)
  doc.line(22, yPosition, 22, yPosition + 35)

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("AI Recommendation", 25, yPosition + 12)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const recommendationText = doc.splitTextToSize(reportData.aiAnalysis.recommendation, pageWidth - 60)
  doc.text(recommendationText, 25, yPosition + 20)

  yPosition += 45

  // Price History Chart
  if (reportData.cropData.data.length > 0) {
    checkPageBreak(100)

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Price History Chart", 20, yPosition)
    yPosition += 15

    // Draw chart
    const chartWidth = pageWidth - 40
    const chartHeight = 80
    const chartX = 20
    const chartY = yPosition

    // Chart background
    doc.setFillColor(248, 250, 252)
    doc.rect(chartX, chartY, chartWidth, chartHeight, "F")
    doc.setDrawColor(203, 213, 225)
    doc.rect(chartX, chartY, chartWidth, chartHeight)

    // Get price data
    const prices = reportData.cropData.data.map((d) => d.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice || 1

    // Draw price line
    doc.setDrawColor(34, 197, 94)
    doc.setLineWidth(2)

    for (let i = 1; i < reportData.cropData.data.length; i++) {
      const prevX = chartX + ((i - 1) / (reportData.cropData.data.length - 1)) * chartWidth
      const currX = chartX + (i / (reportData.cropData.data.length - 1)) * chartWidth

      const prevY =
        chartY + chartHeight - ((reportData.cropData.data[i - 1].price - minPrice) / priceRange) * chartHeight
      const currY = chartY + chartHeight - ((reportData.cropData.data[i].price - minPrice) / priceRange) * chartHeight

      doc.line(prevX, prevY, currX, currY)
    }

    // Draw prediction line (dashed)
    doc.setDrawColor(147, 51, 234)
    doc.setLineWidth(1.5)
    doc.setLineDashPattern([3, 3], 0)

    const lastDataIndex = Math.floor(reportData.cropData.data.length * 0.8)
    for (let i = lastDataIndex + 1; i < reportData.cropData.data.length; i++) {
      const prevX = chartX + ((i - 1) / (reportData.cropData.data.length - 1)) * chartWidth
      const currX = chartX + (i / (reportData.cropData.data.length - 1)) * chartWidth

      const prevY =
        chartY + chartHeight - ((reportData.cropData.data[i - 1].prediction - minPrice) / priceRange) * chartHeight
      const currY =
        chartY + chartHeight - ((reportData.cropData.data[i].prediction - minPrice) / priceRange) * chartHeight

      doc.line(prevX, prevY, currX, currY)
    }

    doc.setLineDashPattern([], 0) // Reset line dash

    // Chart labels
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text(`${reportData.cropData.crop} Price Trends - ${reportData.state}`, chartX, chartY - 5)
    doc.text(`₹${minPrice}`, chartX - 15, chartY + chartHeight)
    doc.text(`₹${maxPrice}`, chartX - 15, chartY + 5)
    doc.text(`${reportData.timeRange} ago`, chartX, chartY + chartHeight + 10)
    doc.text("Today", chartX + chartWidth - 20, chartY + chartHeight + 10)

    // Legend
    doc.setDrawColor(34, 197, 94)
    doc.setLineWidth(2)
    doc.line(chartX + chartWidth - 100, chartY - 15, chartX + chartWidth - 85, chartY - 15)
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(8)
    doc.text("Actual Price", chartX + chartWidth - 80, chartY - 12)

    doc.setDrawColor(147, 51, 234)
    doc.setLineDashPattern([3, 3], 0)
    doc.line(chartX + chartWidth - 100, chartY - 8, chartX + chartWidth - 85, chartY - 8)
    doc.text("AI Prediction", chartX + chartWidth - 80, chartY - 5)
    doc.setLineDashPattern([], 0)

    yPosition += chartHeight + 20
  }

  // Market Summary
  checkPageBreak(50)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Market Summary", 20, yPosition)
  yPosition += 15

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const summaryPoints = [
    `Current ${reportData.cropData.crop} price in ${reportData.state} is ₹${reportData.cropData.currentPrice} per quintal`,
    `Price has ${reportData.cropData.trend === "up" ? "increased" : "decreased"} by ${Math.abs(reportData.cropData.change)}% in recent trading`,
    `AI forecast indicates ${reportData.cropData.forecast.toLowerCase()} market conditions`,
    `Confidence level of ${reportData.cropData.confidence}% based on ${reportData.aiAnalysis.dataPoints.toLocaleString()} data points`,
    `Recommendation: ${reportData.aiAnalysis.recommendation}`,
  ]

  summaryPoints.forEach((point, index) => {
    checkPageBreak(8)
    doc.text(`• ${point}`, 25, yPosition)
    yPosition += 8
  })

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: "right" })
    doc.text("Generated by AGRO-GENIX Price Trends Analysis", 20, pageHeight - 10)
    doc.text(`Report ID: PT-${Date.now()}`, pageWidth / 2, pageHeight - 10, { align: "center" })
  }

  // Save the PDF
  const fileName = `Price_Trends_${reportData.cropData.crop}_${reportData.state}_${format(reportData.generatedAt, "yyyy-MM-dd_HH-mm")}.pdf`
  doc.save(fileName)
}
