// This library handles PDF generation
import jsPDF from "jspdf"
import type { CropMarketData } from "@/services/market-data-service"
import QRCode from "qrcode"

// Format date for display
export const formatDate = (date: Date): string => {
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
}

export const formatTime = (date: Date): string => {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
}

// Function to generate QR code as data URL
const generateQRCode = async (url: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(url, {
      width: 100,
      margin: 1,
      color: {
        dark: "#18542F", // Dark green
        light: "#FFFFFF", // White background
      },
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return ""
  }
}

// Function to add a styled header to the PDF
const addStyledHeader = (doc: jsPDF, date: Date) => {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Add header background
  doc.setFillColor(18, 84, 47) // Dark green header
  doc.rect(0, 0, pageWidth, 30, "F")

  // Add logo circle
  doc.setFillColor(255, 255, 255) // White circle for logo
  doc.circle(20, 15, 10, "F")
  doc.setTextColor(18, 84, 47)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("AG", 15, 19)

  // Add title at center
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("Market Analysis Report", pageWidth / 2, 19, { align: "center" })

  // Add date and time on right
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Date: ${formatDate(date)}`, pageWidth - 15, 12, { align: "right" })
  doc.text(`Time: ${formatTime(date)}`, pageWidth - 15, 19, { align: "right" })
}

// Function to add a styled footer to the PDF
const addStyledFooter = (doc: jsPDF, pageNumber: number, totalPages: number, qrCodeDataUrl = "") => {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Skip footer on first page
  if (pageNumber === 1) {
    return
  }

  // Add QR code if available
  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, "PNG", 15, pageHeight - 30, 25, 25)
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text("Scan for live dashboard", 45, pageHeight - 18)
  }

  // Add AGRO-GENIX text
  doc.setTextColor(18, 84, 47)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("AGRO-GENIX", pageWidth / 2, pageHeight - 18, { align: "center" })

  // Add tagline
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text("Empowering farmers with data-driven insights", pageWidth / 2, pageHeight - 10, { align: "center" })

  // Add page number
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(10)
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 15, pageHeight - 18, { align: "right" })
}

// Function to add crop information
const addCropInfo = (doc: jsPDF, cropData: CropMarketData, yPosition: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Add crop info background
  doc.setFillColor(245, 250, 245)
  doc.roundedRect(15, yPosition, pageWidth - 30, 60, 3, 3, "F")

  // Add crop image if available
  if (cropData.image && cropData.image !== "/placeholder.svg") {
    try {
      doc.addImage(cropData.image, "JPEG", 25, yPosition + 10, 70, 40)
    } catch (error) {
      console.error("Error adding crop image:", error)
      // Add placeholder if image fails to load
      doc.setFillColor(230, 240, 230)
      doc.roundedRect(25, yPosition + 10, 70, 40, 3, 3, "F")
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(12)
      doc.text("Crop Image", 60, yPosition + 30, { align: "center" })
    }
  } else {
    // Add placeholder if no image
    doc.setFillColor(230, 240, 230)
    doc.roundedRect(25, yPosition + 10, 70, 40, 3, 3, "F")
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(12)
    doc.text("Crop Image", 60, yPosition + 30, { align: "center" })
  }

  // Add crop name
  doc.setTextColor(18, 84, 47)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(cropData.name, 110, yPosition + 20)

  // Add crop description
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`Historical price data for ${cropData.name}`, 110, yPosition + 35)

  // Add market location and last updated
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  doc.text(`Market: ${cropData.marketLocation}`, 110, yPosition + 45)
  doc.text(`Last Updated: ${formatDate(new Date(cropData.lastUpdated))}`, 110, yPosition + 52)

  return yPosition + 70
}

// Function to add a metrics grid
const addMetricsGrid = (doc: jsPDF, cropData: CropMarketData, yPosition: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth()
  const cellWidth = (pageWidth - 60) / 4
  const cellHeight = 60

  const metrics = [
    {
      title: "Average Price",
      value: `₹${cropData.currentPrice.toLocaleString()}`,
      unit: `per ${cropData.unit}`,
      icon: "₹",
      color: "#18542F", // Dark green
    },
    {
      title: "Price Change",
      value: `${cropData.changePercentage > 0 ? "+" : ""}${cropData.changePercentage.toFixed(1)}%`,
      unit: "vs last month",
      icon: cropData.trend === "up" ? "↑" : "↓",
      color: cropData.trend === "up" ? "#27AE60" : "#E74C3C", // Green or red
    },
    {
      title: "Supply Volume",
      value: "1,250",
      unit: "tonnes",
      icon: "⚖️",
      color: "#2980B9", // Blue
    },
    {
      title: "Demand Index",
      value: cropData.demandForecast === "high" ? "High" : cropData.demandForecast === "medium" ? "Medium" : "Low",
      unit: "current",
      icon: "📊",
      color:
        cropData.demandForecast === "high" ? "#27AE60" : cropData.demandForecast === "medium" ? "#F39C12" : "#E74C3C", // Green, orange, or red
    },
  ]

  metrics.forEach((metric, index) => {
    const x = 30 + index * cellWidth

    // Add cell background
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(x, yPosition, cellWidth - 10, cellHeight, 3, 3, "F")

    // Add icon box
    doc.setFillColor(metric.color)
    doc.roundedRect(x + 10, yPosition + 10, cellWidth - 30, cellWidth - 30, 2, 2, "F")

    // Add icon
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text(metric.icon, x + (cellWidth - 30) / 2 + 10, yPosition + (cellWidth - 30) / 2 + 15, { align: "center" })

    // Add title
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(metric.title, x + cellWidth / 2 - 5, yPosition + cellWidth - 5, { align: "center" })

    // Add value
    doc.setTextColor(20, 20, 20)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(metric.value, x + cellWidth / 2 - 5, yPosition + cellWidth + 10, { align: "center" })

    // Add unit
    doc.setTextColor(120, 120, 120)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text(metric.unit, x + cellWidth / 2 - 5, yPosition + cellWidth + 20, { align: "center" })
  })

  return yPosition + cellHeight + 10
}

// Function to add a price trend chart
const addPriceChart = (doc: jsPDF, cropData: CropMarketData, yPosition: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth()
  const chartWidth = pageWidth - 40
  const chartHeight = 180

  // Add chart background
  doc.setFillColor(250, 250, 250)
  doc.roundedRect(20, yPosition, chartWidth, chartHeight, 3, 3, "F")

  // Chart margins
  const marginLeft = 40
  const marginRight = 20
  const marginTop = 20
  const marginBottom = 40

  // Chart area dimensions
  const chartAreaWidth = chartWidth - marginLeft - marginRight
  const chartAreaHeight = chartHeight - marginTop - marginBottom

  // Chart area origin
  const chartX = 20 + marginLeft
  const chartY = yPosition + marginTop

  // Get last 6 months of data
  const last6Months = cropData.historicalPrices.slice(-180)

  // Ensure we have data
  if (last6Months.length === 0) {
    // Draw "No data available" message
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(12)
    doc.text("No historical price data available", pageWidth / 2, yPosition + chartHeight / 2, { align: "center" })
    return yPosition + chartHeight + 10
  }

  // Group by month and get average
  const monthlyData: { [key: string]: { sum: number; count: number } } = {}

  last6Months.forEach((point) => {
    const date = new Date(point.date)
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { sum: 0, count: 0 }
    }

    monthlyData[monthYear].sum += point.price
    monthlyData[monthYear].count += 1
  })

  // Convert to array of points
  const pricePoints: { monthYear: string; price: number; date: Date }[] = []

  Object.entries(monthlyData).forEach(([monthYear, data]) => {
    const [month, year] = monthYear.split("/").map(Number)
    const avgPrice = data.sum / data.count
    pricePoints.push({
      monthYear,
      price: avgPrice,
      date: new Date(year, month - 1, 1),
    })
  })

  // Sort by date
  pricePoints.sort((a, b) => a.date.getTime() - b.date.getTime())

  // Get min and max prices for scaling
  const prices = pricePoints.map((p) => p.price)
  const minPrice = Math.min(...prices) * 0.9
  const maxPrice = Math.max(...prices) * 1.1
  const priceRange = maxPrice - minPrice

  // Draw axes
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)

  // X-axis
  doc.line(chartX, chartY + chartAreaHeight, chartX + chartAreaWidth, chartY + chartAreaHeight)

  // Y-axis
  doc.line(chartX, chartY, chartX, chartY + chartAreaHeight)

  // Draw grid lines
  doc.setDrawColor(230, 230, 230)
  doc.setLineWidth(0.2)

  // Horizontal grid lines (5 lines)
  for (let i = 0; i <= 4; i++) {
    const yPos = chartY + (i * chartAreaHeight) / 4
    doc.line(chartX, yPos, chartX + chartAreaWidth, yPos)

    // Add price labels
    const price = maxPrice - (i * priceRange) / 4
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text(`₹${Math.round(price).toLocaleString()}`, chartX - 5, yPos, { align: "right" })
  }

  // Draw data points and connect with line
  const pointSpacing = chartAreaWidth / (pricePoints.length - 1 || 1)

  // Draw the line first (behind the points)
  doc.setDrawColor(18, 84, 47)
  doc.setLineWidth(1.5)

  for (let i = 1; i < pricePoints.length; i++) {
    const prevPoint = pricePoints[i - 1]
    const currPoint = pricePoints[i]

    const prevX = chartX + (i - 1) * pointSpacing
    const currX = chartX + i * pointSpacing

    const prevNormalizedPrice = (prevPoint.price - minPrice) / priceRange
    const currNormalizedPrice = (currPoint.price - minPrice) / priceRange

    const prevY = chartY + chartAreaHeight - prevNormalizedPrice * chartAreaHeight
    const currY = chartY + chartAreaHeight - currNormalizedPrice * chartAreaHeight

    doc.line(prevX, prevY, currX, currY)
  }

  // Now draw the points on top of the line
  doc.setFillColor(18, 84, 47)

  pricePoints.forEach((point, index) => {
    const x = chartX + index * pointSpacing
    const normalizedPrice = (point.price - minPrice) / priceRange
    const y = chartY + chartAreaHeight - normalizedPrice * chartAreaHeight

    // Draw point
    doc.circle(x, y, 3, "F")

    // Add month labels (X-axis)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthName = monthNames[point.date.getMonth()]

    // Only show every other label if we have many points to avoid crowding
    if (pricePoints.length <= 6 || index % 2 === 0) {
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(8)
      doc.text(`${monthName}`, x, chartY + chartAreaHeight + 15, { align: "center" })

      // Add year below month if it's first or last point
      if (
        index === 0 ||
        index === pricePoints.length - 1 ||
        (index > 0 && point.date.getFullYear() !== pricePoints[index - 1].date.getFullYear())
      ) {
        doc.text(`${point.date.getFullYear()}`, x, chartY + chartAreaHeight + 25, { align: "center" })
      }
    }
  })

  // Add chart title
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")

  // Create title with date range
  let titleText = `Price Trend of ${cropData.name}`
  if (pricePoints.length > 0) {
    const firstDate = pricePoints[0].date
    const lastDate = pricePoints[pricePoints.length - 1].date

    const formatMonthYear = (date: Date) => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
    }

    titleText += ` from ${formatMonthYear(firstDate)} to ${formatMonthYear(lastDate)}`
  }

  doc.text(titleText, pageWidth / 2, yPosition + chartHeight - 5, { align: "center" })

  return yPosition + chartHeight + 10
}

// Function to add AI insights
const addAIInsights = (doc: jsPDF, cropData: CropMarketData, yPosition: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Add insights background
  doc.setFillColor(240, 247, 240)
  doc.roundedRect(20, yPosition, pageWidth - 40, 100, 3, 3, "F")

  // Add insights title with AI icon
  doc.setFillColor(18, 84, 47)
  doc.roundedRect(30, yPosition + 10, 30, 30, 3, 3, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("AI", 45, yPosition + 28, { align: "center" })

  doc.setTextColor(18, 84, 47)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Market Insights & Recommendations", 70, yPosition + 25)

  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("AI-powered analysis based on historical data and market trends", 70, yPosition + 35)

  // Generate insights based on crop data
  const insights = [
    `Based on historical patterns, ${cropData.name} prices are expected to ${cropData.trend === "up" ? "continue rising" : "stabilize"} in the coming weeks.`,
    `${cropData.demandForecast === "high" ? "High demand" : cropData.demandForecast === "medium" ? "Moderate demand" : "Low demand"} is anticipated due to ${cropData.demandForecast === "high" ? "seasonal factors and export opportunities" : cropData.demandForecast === "medium" ? "balanced supply and demand" : "increased supply from major growing regions"}.`,
    `Farmers in ${cropData.topProducers[0]?.region || "major growing regions"} are seeing the highest returns, with prices ${cropData.trend === "up" ? "above" : "near"} the national average.`,
    `Consider ${cropData.trend === "up" ? "staggered selling to maximize profits" : "selling soon to avoid potential price decreases"} based on current market conditions.`,
  ]

  // Add insights
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")

  insights.forEach((insight, index) => {
    // Add bullet point
    doc.setFillColor(18, 84, 47)
    doc.circle(30, yPosition + 50 + index * 12, 2, "F")

    // Add insight text
    doc.text(insight, 35, yPosition + 50 + index * 12, { maxWidth: pageWidth - 80 })
  })

  return yPosition + 110
}

// Function to add footer only to the last page
const addLastPageFooter = (doc: jsPDF, qrCodeDataUrl = "") => {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const totalPages = doc.getNumberOfPages()

  // Only add footer to the last page
  doc.setPage(totalPages)

  // Add QR code if available
  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, "PNG", 15, pageHeight - 30, 25, 25)
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text("Scan for live dashboard", 45, pageHeight - 18)
  }

  // Add AGRO-GENIX text
  doc.setTextColor(18, 84, 47)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("AGRO-GENIX", pageWidth / 2, pageHeight - 18, { align: "center" })

  // Add tagline
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text("Empowering farmers with data-driven insights", pageWidth / 2, pageHeight - 10, { align: "center" })

  // Add page number
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(10)
  doc.text(`Page ${totalPages} of ${totalPages}`, pageWidth - 15, pageHeight - 18, { align: "right" })
}

// Main function to generate the PDF
export const generateMarketDataPDF = async (cropData: CropMarketData): Promise<jsPDF> => {
  try {
    // Initialize PDF document
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Initialize the yPos variable before using it
    let yPos = 40

    // Generate QR code for dashboard link
    const dashboardUrl = `https://agrogenix.com/market-analysis/${cropData.name.toLowerCase().replace(/\s+/g, "-")}`
    const qrCodeDataUrl = await generateQRCode(dashboardUrl)

    // Current date and time
    const now = new Date()

    // Add styled header
    addStyledHeader(doc, now)

    // Add crop information
    yPos = addCropInfo(doc, cropData, yPos)

    // Add metrics grid
    yPos = addMetricsGrid(doc, cropData, yPos)

    // Add price trend chart
    yPos = addPriceChart(doc, cropData, yPos)

    // Check if we need to add a new page for AI insights
    // We want AI insights to be on the last page
    if (yPos + 110 > pageHeight - 40) {
      // Add a new page if there's not enough space
      doc.addPage()
      yPos = 40
      // Add header to new page
      addStyledHeader(doc, now)
    }

    // Add AI insights
    yPos = addAIInsights(doc, cropData, yPos)

    // Add footer only to the last page
    addLastPageFooter(doc, qrCodeDataUrl)

    return doc
  } catch (error) {
    console.error("Error generating PDF:", error)
    // Return a simple PDF with error message as fallback
    const doc = new jsPDF()
    doc.text("Error generating PDF report. Please try again later.", 20, 20)
    return doc
  }
}

// Function to get a data URL from the PDF for preview
export const getPdfDataUrl = (doc: jsPDF): string => {
  try {
    // Generate the PDF as a data URL with proper MIME type
    const pdfOutput = doc.output("dataurlstring")

    // Ensure the data URL has the correct format
    if (pdfOutput && pdfOutput.startsWith("data:application/pdf")) {
      return pdfOutput
    } else {
      // Fallback: create a proper data URL
      const pdfBlob = doc.output("blob")
      return URL.createObjectURL(pdfBlob)
    }
  } catch (error) {
    console.error("Error generating PDF data URL:", error)
    // Return a fallback empty PDF data URL
    return "data:application/pdf;base64,"
  }
}

// Function to save the PDF to device
export const savePDF = async (doc: jsPDF, fileName: string): Promise<void> => {
  try {
    const pdfOutput = doc.output("blob")

    if ("showSaveFilePicker" in window) {
      // For browsers that support the File System Access API
      try {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: "PDF Files",
              accept: { "application/pdf": [".pdf"] },
            },
          ],
        })

        const writable = await fileHandle.createWritable()
        await writable.write(pdfOutput)
        await writable.close()
        return
      } catch (err) {
        // User canceled or API not available, fall back to regular download
        console.log("File System Access API not supported or canceled. Falling back to download.")
      }
    }

    // Regular download fallback
    const url = URL.createObjectURL(pdfOutput)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error saving PDF:", error)
    throw error
  }
}
