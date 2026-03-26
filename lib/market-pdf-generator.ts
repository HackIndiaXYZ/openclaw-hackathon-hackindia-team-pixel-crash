import jsPDF from "jspdf"
import { format } from "date-fns"

interface CropPriceData {
  id: string
  cropName: string
  variety?: string
  currentPrice: number
  unit: string
  change: number
  changePercentage: number
  trend: "up" | "down" | "stable"
  lastUpdated: string
  location: {
    state: string
    district: string
    taluk?: string
    mandis: string[]
  }
  mandiName: string
  quality: "FAQ" | "Good" | "Average" | "Poor"
  minPrice: number
  maxPrice: number
  modalPrice: number
  arrivals: number
  source: "Agmarknet" | "eNAM" | "State Portal"
  historicalPrices: Array<{
    date: string
    price: number
    arrivals: number
  }>
}

interface MarketInsight {
  type: "price_alert" | "trend_analysis" | "seasonal_info" | "demand_forecast"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  actionable: boolean
}

interface ReportData {
  filteredData: CropPriceData[]
  selectedFilters: {
    state: string
    district: string
    crop: string
    searchQuery: string
  }
  statistics: {
    min: number
    max: number
    avg: number
  }
  insights: MarketInsight[]
  generatedAt: Date
}

export const generateMarketAnalysisPDF = async (reportData: ReportData): Promise<void> => {
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
  doc.setFillColor(22, 163, 74) // Green background
  doc.rect(0, 0, pageWidth, 40, "F")

  // Logo placeholder
  doc.setFillColor(255, 255, 255)
  doc.circle(20, 20, 8, "F")
  doc.setTextColor(22, 163, 74)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("AG", 16, 24)

  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("Market Analysis Report", pageWidth / 2, 25, { align: "center" })

  // Date and time
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated: ${format(reportData.generatedAt, "PPpp")}`, pageWidth - 15, 15, { align: "right" })
  doc.text("AGRO-GENIX Platform", pageWidth - 15, 25, { align: "right" })

  yPosition = 50

  // Applied Filters Section
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Applied Filters", 20, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`State: ${reportData.selectedFilters.state}`, 20, yPosition)
  doc.text(`District: ${reportData.selectedFilters.district}`, 100, yPosition)
  yPosition += 8
  doc.text(`Crop: ${reportData.selectedFilters.crop}`, 20, yPosition)
  if (reportData.selectedFilters.searchQuery) {
    doc.text(`Search: ${reportData.selectedFilters.searchQuery}`, 100, yPosition)
  }
  yPosition += 15

  // Statistics Overview
  checkPageBreak(40)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Market Statistics", 20, yPosition)
  yPosition += 15

  // Statistics boxes
  const statBoxWidth = (pageWidth - 60) / 3
  const statBoxHeight = 25

  // Total Markets
  doc.setFillColor(240, 253, 244)
  doc.rect(20, yPosition, statBoxWidth, statBoxHeight, "F")
  doc.setDrawColor(34, 197, 94)
  doc.rect(20, yPosition, statBoxWidth, statBoxHeight)
  doc.setTextColor(21, 128, 61)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Total Markets", 20 + statBoxWidth / 2, yPosition + 8, { align: "center" })
  doc.setFontSize(16)
  doc.text(reportData.filteredData.length.toString(), 20 + statBoxWidth / 2, yPosition + 18, { align: "center" })

  // Average Price
  doc.setFillColor(239, 246, 255)
  doc.rect(30 + statBoxWidth, yPosition, statBoxWidth, statBoxHeight, "F")
  doc.setDrawColor(59, 130, 246)
  doc.rect(30 + statBoxWidth, yPosition, statBoxWidth, statBoxHeight)
  doc.setTextColor(30, 64, 175)
  doc.setFontSize(12)
  doc.text("Average Price", 30 + statBoxWidth + statBoxWidth / 2, yPosition + 8, { align: "center" })
  doc.setFontSize(16)
  doc.text(`₹${reportData.statistics.avg.toLocaleString()}`, 30 + statBoxWidth + statBoxWidth / 2, yPosition + 18, {
    align: "center",
  })

  // Price Range
  doc.setFillColor(254, 243, 199)
  doc.rect(40 + 2 * statBoxWidth, yPosition, statBoxWidth, statBoxHeight, "F")
  doc.setDrawColor(245, 158, 11)
  doc.rect(40 + 2 * statBoxWidth, yPosition, statBoxWidth, statBoxHeight)
  doc.setTextColor(146, 64, 14)
  doc.setFontSize(12)
  doc.text("Price Range", 40 + 2 * statBoxWidth + statBoxWidth / 2, yPosition + 8, { align: "center" })
  doc.setFontSize(10)
  doc.text(
    `₹${reportData.statistics.min} - ₹${reportData.statistics.max}`,
    40 + 2 * statBoxWidth + statBoxWidth / 2,
    yPosition + 18,
    { align: "center" },
  )

  yPosition += 35

  // Market Insights
  checkPageBreak(60)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Market Insights", 20, yPosition)
  yPosition += 15

  reportData.insights.forEach((insight, index) => {
    checkPageBreak(25)

    // Insight box
    const impactColor =
      insight.impact === "high" ? [239, 68, 68] : insight.impact === "medium" ? [245, 158, 11] : [59, 130, 246]

    doc.setFillColor(impactColor[0], impactColor[1], impactColor[2], 0.1)
    doc.rect(20, yPosition, pageWidth - 40, 20, "F")
    doc.setDrawColor(impactColor[0], impactColor[1], impactColor[2])
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, 20, yPosition + 20)
    doc.line(22, yPosition, 22, yPosition + 20)

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(insight.title, 25, yPosition + 8)

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    const splitDescription = doc.splitTextToSize(insight.description, pageWidth - 60)
    doc.text(splitDescription, 25, yPosition + 15)

    yPosition += 25
  })

  // Price History Chart (if data available)
  if (reportData.filteredData.length > 0 && reportData.filteredData[0].historicalPrices.length > 0) {
    checkPageBreak(100)

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Price Trend Analysis", 20, yPosition)
    yPosition += 15

    // Draw a simple chart
    const chartWidth = pageWidth - 40
    const chartHeight = 60
    const chartX = 20
    const chartY = yPosition

    // Chart background
    doc.setFillColor(248, 250, 252)
    doc.rect(chartX, chartY, chartWidth, chartHeight, "F")
    doc.setDrawColor(203, 213, 225)
    doc.rect(chartX, chartY, chartWidth, chartHeight)

    // Sample the first crop's historical data
    const sampleCrop = reportData.filteredData[0]
    const historicalData = sampleCrop.historicalPrices.slice(-30) // Last 30 days

    if (historicalData.length > 1) {
      const prices = historicalData.map((d) => d.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const priceRange = maxPrice - minPrice || 1

      // Draw price line
      doc.setDrawColor(22, 163, 74)
      doc.setLineWidth(1.5)

      for (let i = 1; i < historicalData.length; i++) {
        const prevX = chartX + ((i - 1) / (historicalData.length - 1)) * chartWidth
        const currX = chartX + (i / (historicalData.length - 1)) * chartWidth

        const prevY = chartY + chartHeight - ((historicalData[i - 1].price - minPrice) / priceRange) * chartHeight
        const currY = chartY + chartHeight - ((historicalData[i].price - minPrice) / priceRange) * chartHeight

        doc.line(prevX, prevY, currX, currY)
      }

      // Chart labels
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(8)
      doc.text(`${sampleCrop.cropName} - ${sampleCrop.location.district}`, chartX, chartY - 5)
      doc.text(`₹${minPrice}`, chartX - 15, chartY + chartHeight)
      doc.text(`₹${maxPrice}`, chartX - 15, chartY + 5)
      doc.text("30 days ago", chartX, chartY + chartHeight + 10)
      doc.text("Today", chartX + chartWidth - 20, chartY + chartHeight + 10)
    }

    yPosition += chartHeight + 20
  }

  // Market Data Table
  checkPageBreak(80)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Detailed Market Data", 20, yPosition)
  yPosition += 15

  // Table headers
  doc.setFillColor(22, 163, 74)
  doc.rect(20, yPosition, pageWidth - 40, 8, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")

  const colWidths = [30, 35, 25, 25, 20, 25, 30]
  let xPos = 20
  const headers = ["Crop", "Location", "Price (₹)", "Change", "Quality", "Arrivals", "Source"]

  headers.forEach((header, index) => {
    doc.text(header, xPos + 2, yPosition + 6)
    xPos += colWidths[index]
  })

  yPosition += 10

  // Table data (limit to first 20 items to fit in PDF)
  const displayData = reportData.filteredData.slice(0, 20)

  displayData.forEach((item, index) => {
    checkPageBreak(8)

    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252)
      doc.rect(20, yPosition, pageWidth - 40, 8, "F")
    }

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")

    xPos = 20
    const rowData = [
      item.cropName,
      `${item.location.district}, ${item.location.state}`,
      `₹${item.currentPrice.toLocaleString()}`,
      `${item.changePercentage > 0 ? "+" : ""}${item.changePercentage.toFixed(1)}%`,
      item.quality,
      `${item.arrivals}q`,
      item.source,
    ]

    rowData.forEach((data, colIndex) => {
      const text = doc.splitTextToSize(data, colWidths[colIndex] - 4)
      doc.text(text, xPos + 2, yPosition + 6)
      xPos += colWidths[colIndex]
    })

    yPosition += 8
  })

  if (reportData.filteredData.length > 20) {
    yPosition += 5
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`... and ${reportData.filteredData.length - 20} more entries`, 20, yPosition)
  }

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: "right" })
    doc.text("Generated by AGRO-GENIX Market Analysis", 20, pageHeight - 10)
    doc.text(`Report ID: MKT-${Date.now()}`, pageWidth / 2, pageHeight - 10, { align: "center" })
  }

  // Save the PDF
  const fileName = `Market_Analysis_Report_${format(reportData.generatedAt, "yyyy-MM-dd_HH-mm")}.pdf`
  doc.save(fileName)
}
