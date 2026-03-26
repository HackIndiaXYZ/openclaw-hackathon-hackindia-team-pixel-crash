import jsPDF from "jspdf"
import QRCode from "qrcode"
import { Buffer } from "buffer"

// Types
interface SoilTestResult {
  id: string
  timestamp: Date
  imageUrl: string
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  organicMatter: number
  moisture: number
  temperature: number
  healthScore: number
  recommendations: string[]
  fieldName: string
  location: string
  confidence?: number
  metrics?: any[]
  notes?: string
}

// Utility functions
const formatDate = (date: Date): string => {
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
}

const formatTime = (date: Date): string => {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
}

// Generate QR code for report verification
const generateQRCode = async (reportId: string): Promise<string> => {
  try {
    const verificationUrl = `https://agrogenix.com/verify-report/${reportId}`
    return await QRCode.toDataURL(verificationUrl, {
      width: 100,
      margin: 1,
      color: {
        dark: "#18542F",
        light: "#FFFFFF",
      },
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return ""
  }
}

// Add styled header
const addHeader = (doc: jsPDF, testResult: SoilTestResult) => {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Header background
  doc.setFillColor(18, 84, 47)
  doc.rect(0, 0, pageWidth, 35, "F")

  // Logo circle
  doc.setFillColor(255, 255, 255)
  doc.circle(20, 17.5, 12, "F")
  doc.setTextColor(18, 84, 47)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("AG", 14, 22)

  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("Soil Analysis Report", pageWidth / 2, 18, { align: "center" })

  // Date and time
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated: ${formatDate(testResult.timestamp)}`, pageWidth - 15, 12, { align: "right" })
  doc.text(`Time: ${formatTime(testResult.timestamp)}`, pageWidth - 15, 20, { align: "right" })
  doc.text(`Report ID: ${testResult.id}`, pageWidth - 15, 28, { align: "right" })
}

// Add field information section
const addFieldInfo = (doc: jsPDF, testResult: SoilTestResult, yPos: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Section background
  doc.setFillColor(245, 250, 245)
  doc.roundedRect(15, yPos, pageWidth - 30, 70, 3, 3, "F")

  // Soil sample image
  if (testResult.imageUrl) {
    try {
      doc.addImage(testResult.imageUrl, "JPEG", 25, yPos + 10, 80, 50)
    } catch (error) {
      // Fallback if image can't be added
      doc.setFillColor(230, 240, 230)
      doc.roundedRect(25, yPos + 10, 80, 50, 3, 3, "F")
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(12)
      doc.text("Soil Sample", 65, yPos + 35, { align: "center" })
    }
  }

  // Field details
  doc.setTextColor(18, 84, 47)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(testResult.fieldName, 120, yPos + 20)

  doc.setTextColor(80, 80, 80)
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Location: ${testResult.location}`, 120, yPos + 35)
  doc.text(`Test Date: ${formatDate(testResult.timestamp)}`, 120, yPos + 45)
  doc.text(`Analysis Method: AI-Powered Image Analysis`, 120, yPos + 55)

  return yPos + 80
}

// Add health score section
const addHealthScore = (doc: jsPDF, testResult: SoilTestResult, yPos: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Health score card
  doc.setFillColor(240, 255, 240)
  doc.roundedRect(15, yPos, pageWidth - 30, 60, 3, 3, "F")

  // Score circle
  doc.setFillColor(34, 197, 94)
  doc.circle(50, yPos + 30, 25, "F")

  // Score text
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text(testResult.healthScore.toString(), 50, yPos + 35, { align: "center" })

  // Score label
  doc.setTextColor(34, 197, 94)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Soil Health Score", 90, yPos + 25)

  // Score description
  const scoreDescription =
    testResult.healthScore >= 8
      ? "Excellent"
      : testResult.healthScore >= 6
        ? "Good"
        : testResult.healthScore >= 4
          ? "Fair"
          : "Poor"

  doc.setTextColor(80, 80, 80)
  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text(`${scoreDescription} soil health condition`, 90, yPos + 40)

  doc.setFontSize(10)
  doc.text("Based on AI analysis of soil composition, nutrients, and environmental factors", 90, yPos + 50)

  return yPos + 70
}

// Add nutrient analysis section
const addNutrientAnalysis = (doc: jsPDF, testResult: SoilTestResult, yPos: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Section title
  doc.setTextColor(18, 84, 47)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Nutrient Analysis", 20, yPos)

  yPos += 15

  // Nutrient cards
  const nutrients = [
    { name: "pH Level", value: testResult.ph.toString(), unit: "", optimal: "6.0-7.0", color: [59, 130, 246] },
    {
      name: "Nitrogen (N)",
      value: testResult.nitrogen.toString(),
      unit: "ppm",
      optimal: "40-60",
      color: [34, 197, 94],
    },
    {
      name: "Phosphorus (P)",
      value: testResult.phosphorus.toString(),
      unit: "ppm",
      optimal: "20-30",
      color: [249, 115, 22],
    },
    {
      name: "Potassium (K)",
      value: testResult.potassium.toString(),
      unit: "ppm",
      optimal: "150-200",
      color: [168, 85, 247],
    },
  ]

  const cardWidth = (pageWidth - 60) / 2
  const cardHeight = 50

  nutrients.forEach((nutrient, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    const x = 20 + col * (cardWidth + 20)
    const y = yPos + row * (cardHeight + 10)

    // Card background
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, "F")

    // Nutrient icon/color bar
    doc.setFillColor(nutrient.color[0], nutrient.color[1], nutrient.color[2])
    doc.roundedRect(x + 5, y + 5, 5, cardHeight - 10, 2, 2, "F")

    // Nutrient name
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(nutrient.name, x + 15, y + 15)

    // Value
    doc.setTextColor(20, 20, 20)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text(`${nutrient.value}${nutrient.unit}`, x + 15, y + 28)

    // Optimal range
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(`Optimal: ${nutrient.optimal}${nutrient.unit}`, x + 15, y + 38)

    // Status indicator
    const numValue = Number.parseFloat(nutrient.value)
    const [min, max] = nutrient.optimal.split("-").map((v) => Number.parseFloat(v))
    const isOptimal = numValue >= min && numValue <= max

    doc.setFillColor(
      isOptimal ? 34 : numValue < min ? 239 : 220,
      isOptimal ? 197 : numValue < min ? 68 : 38,
      isOptimal ? 94 : numValue < min ? 68 : 38,
    )
    doc.circle(x + cardWidth - 15, y + 15, 4, "F")
  })

  return yPos + Math.ceil(nutrients.length / 2) * (cardHeight + 10) + 20
}

// Add environmental factors section
const addEnvironmentalFactors = (doc: jsPDF, testResult: SoilTestResult, yPos: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Section title
  doc.setTextColor(18, 84, 47)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Environmental Factors", 20, yPos)

  yPos += 15

  // Environmental data
  const factors = [
    {
      name: "Soil Moisture",
      value: `${testResult.moisture}%`,
      status: testResult.moisture >= 60 ? "Optimal" : testResult.moisture >= 40 ? "Moderate" : "Low",
    },
    {
      name: "Soil Temperature",
      value: `${testResult.temperature}°C`,
      status: testResult.temperature >= 20 && testResult.temperature <= 25 ? "Optimal" : "Suboptimal",
    },
    {
      name: "Organic Matter",
      value: `${testResult.organicMatter}%`,
      status: testResult.organicMatter >= 3 ? "Good" : testResult.organicMatter >= 2 ? "Fair" : "Low",
    },
  ]

  factors.forEach((factor, index) => {
    const y = yPos + index * 20

    // Factor name
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(factor.name, 25, y)

    // Value
    doc.setTextColor(20, 20, 20)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(factor.value, 120, y)

    // Status
    const statusColor =
      factor.status === "Optimal" || factor.status === "Good"
        ? [34, 197, 94]
        : factor.status === "Moderate" || factor.status === "Fair"
          ? [249, 115, 22]
          : [239, 68, 68]
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(factor.status, 160, y)
  })

  return yPos + factors.length * 20 + 20
}

// Add recommendations section
const addRecommendations = (doc: jsPDF, testResult: SoilTestResult, yPos: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Section title
  doc.setTextColor(18, 84, 47)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("AI-Powered Recommendations", 20, yPos)

  yPos += 15

  // Recommendations background
  doc.setFillColor(240, 247, 255)
  const recHeight = testResult.recommendations.length * 15 + 20
  doc.roundedRect(15, yPos, pageWidth - 30, recHeight, 3, 3, "F")

  // AI icon
  doc.setFillColor(59, 130, 246)
  doc.roundedRect(25, yPos + 10, 25, 25, 3, 3, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("AI", 37.5, yPos + 25, { align: "center" })

  // Recommendations list
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")

  testResult.recommendations.forEach((recommendation, index) => {
    const y = yPos + 20 + index * 15

    // Bullet point
    doc.setFillColor(59, 130, 246)
    doc.circle(60, y - 2, 2, "F")

    // Recommendation text
    const maxWidth = pageWidth - 80
    const lines = doc.splitTextToSize(recommendation, maxWidth)
    doc.text(lines, 65, y)
  })

  return yPos + recHeight + 20
}

// Add footer with QR code
const addFooter = async (doc: jsPDF, testResult: SoilTestResult, qrCodeDataUrl: string) => {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // QR code for verification
  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, "PNG", 15, pageHeight - 35, 25, 25)
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text("Scan to verify report", 45, pageHeight - 22)
    doc.text("authenticity online", 45, pageHeight - 15)
  }

  // Company branding
  doc.setTextColor(18, 84, 47)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("AGRO-GENIX", pageWidth / 2, pageHeight - 25, { align: "center" })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text("Advanced AI-Powered Soil Analysis", pageWidth / 2, pageHeight - 15, { align: "center" })

  // Disclaimer
  doc.setFontSize(7)
  doc.text(
    "This report is generated using AI analysis. For critical decisions, consider laboratory testing.",
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" },
  )

  // Page number
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(10)
  doc.text("Page 1 of 1", pageWidth - 15, pageHeight - 15, { align: "right" })
}

// Main PDF generation function
export const generateSoilTestPDF = async (testResult: SoilTestResult): Promise<jsPDF> => {
  try {
    const doc = new jsPDF()
    let yPos = 45

    // Generate QR code
    const qrCodeDataUrl = await generateQRCode(testResult.id)

    // Add header
    addHeader(doc, testResult)

    // Add field information
    yPos = addFieldInfo(doc, testResult, yPos)

    // Add health score
    yPos = addHealthScore(doc, testResult, yPos)

    // Check if we need a new page
    if (yPos > 200) {
      doc.addPage()
      yPos = 20
    }

    // Add nutrient analysis
    yPos = addNutrientAnalysis(doc, testResult, yPos)

    // Add environmental factors
    yPos = addEnvironmentalFactors(doc, testResult, yPos)

    // Check if we need a new page for recommendations
    if (yPos > 180) {
      doc.addPage()
      yPos = 20
    }

    // Add recommendations
    yPos = addRecommendations(doc, testResult, yPos)

    // Add footer
    await addFooter(doc, testResult, qrCodeDataUrl)

    return doc
  } catch (error) {
    console.error("Error generating soil test PDF:", error)

    // Return a simple error PDF
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Error generating soil test report", 20, 30)
    doc.setFontSize(12)
    doc.text("Please try again or contact support if the problem persists.", 20, 50)
    return doc
  }
}

// Export PDF as blob for preview
export const getSoilPDFBlob = async (testResult: SoilTestResult): Promise<Blob> => {
  const doc = await generateSoilTestPDF(testResult)
  return doc.output("blob")
}

// Save PDF to device
export const saveSoilPDF = async (testResult: SoilTestResult, fileName?: string): Promise<void> => {
  try {
    const doc = await generateSoilTestPDF(testResult)
    const defaultFileName = `soil-analysis-${testResult.fieldName.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`
    doc.save(fileName || defaultFileName)
  } catch (error) {
    console.error("Error saving soil PDF:", error)
    throw error
  }
}

// Mock PDF generation - in a real app, you'd use a library like jsPDF or Puppeteer
export async function generateSoilAnalysisPDF(analysisData: any): Promise<Buffer> {
  try {
    // Use the proper PDF generation function
    const doc = await generateSoilTestPDF({
      id: analysisData.id,
      timestamp: new Date(analysisData.timestamp),
      imageUrl: analysisData.image || "",
      ph: analysisData.metrics?.[0]?.value || 6.5,
      nitrogen: analysisData.metrics?.[1]?.value || 50,
      phosphorus: analysisData.metrics?.[2]?.value || 25,
      potassium: analysisData.metrics?.[3]?.value || 175,
      organicMatter: analysisData.metrics?.[4]?.value || 3.0,
      moisture: analysisData.metrics?.[5]?.value || 25,
      temperature: 22,
      healthScore: analysisData.healthScore || 8,
      recommendations: analysisData.recommendations || [],
      fieldName: analysisData.location || "Field Analysis",
      location: analysisData.location || "Unknown",
      confidence: analysisData.confidence || 95,
      metrics: analysisData.metrics || [],
      notes: analysisData.fieldNotes || "",
    })

    return Buffer.from(await doc.output("arraybuffer"))
  } catch (error) {
    console.error("Error generating soil analysis PDF:", error)
    throw error
  }
}
