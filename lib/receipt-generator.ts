import jsPDF from "jspdf"
import QRCode from "qrcode"

export interface BookingData {
  id: string
  farmName: string
  date: string
  timeSlot: string
  adults: number
  children: number
  activities: string[]
  specialRequests?: string
  totalPrice: number
  createdAt: string
  status?: "Confirmed" | "Pending"
  paymentMethod?: string
  transactionId?: string
  contactInfo?: {
    name: string
    email: string
    phone: string
  }
}

export const generateBookingReceipt = async (booking: BookingData): Promise<Blob> => {
  // Add a small delay to prevent rapid successive calls
  await new Promise((resolve) => setTimeout(resolve, 100))

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  try {
    // Validate and sanitize booking data
    const safeBooking = {
      id: booking.id || "UNKNOWN",
      farmName: booking.farmName || "Unknown Farm",
      date: booking.date || new Date().toISOString(),
      timeSlot: booking.timeSlot || "Not specified",
      adults: booking.adults || 1,
      children: booking.children || 0,
      activities: Array.isArray(booking.activities) ? booking.activities : [],
      specialRequests: booking.specialRequests || "",
      totalPrice: booking.totalPrice || 0,
      createdAt: booking.createdAt || new Date().toISOString(),
      status: booking.status || "Confirmed",
      paymentMethod: booking.paymentMethod || "Online Payment",
      transactionId:
        booking.transactionId || `TXN${booking.id?.slice(-8).toUpperCase()}${Date.now().toString().slice(-6)}`,
      contactInfo: booking.contactInfo || {
        name: "Guest User",
        email: "guest@agrogenix.com",
        phone: "Not provided",
      },
    }

    // Generate comprehensive QR code with all booking information
    const bookingRef = safeBooking.id.slice(-8).toUpperCase()
    const experienceDate = new Date(safeBooking.date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })

    const comprehensiveBookingData = `AGRO-GENIX BOOKING CONFIRMATION
Booking Reference ID: ${bookingRef}
Farm Name: ${safeBooking.farmName}
Experience Date: ${experienceDate}
Selected Time: ${safeBooking.timeSlot}
Total Cost: ₹${safeBooking.totalPrice.toLocaleString("en-IN")}
Customer Name: ${safeBooking.contactInfo.name}
Contact Number: ${safeBooking.contactInfo.phone}
Email Address: ${safeBooking.contactInfo.email}
Number of Guests: ${safeBooking.adults} Adults, ${safeBooking.children} Children
Payment Method: ${safeBooking.paymentMethod}
Status: ${safeBooking.status}
Support: support@agrogenix.com`

    let qrCodeDataUrl: string
    try {
      qrCodeDataUrl = await QRCode.toDataURL(comprehensiveBookingData, {
        width: 400,
        margin: 1,
        color: {
          dark: "#1a5f3f",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      })
    } catch (qrError) {
      console.warn("QR Code generation failed, using fallback", qrError)
      // Create a simple fallback QR code with minimal data
      qrCodeDataUrl = await QRCode.toDataURL(`Booking: ${bookingRef}`, {
        width: 200,
        margin: 1,
        errorCorrectionLevel: "L",
      })
    }

    // Professional Agro-Genix color palette
    const colors = {
      primary: [26, 95, 63], // Deep Forest Green
      secondary: [52, 168, 83], // Vibrant Green
      accent: [16, 185, 129], // Emerald
      darkText: [31, 41, 55], // Charcoal
      mediumText: [75, 85, 99], // Steel Gray
      lightText: [107, 114, 128], // Cool Gray
      white: [255, 255, 255],
      lightBg: [248, 250, 252], // Light Background
      border: [229, 231, 235], // Border Gray
    }

    // Helper functions
    const setTextColor = (color: number[]) => doc.setTextColor(color[0], color[1], color[2])
    const setFillColor = (color: number[]) => doc.setFillColor(color[0], color[1], color[2])
    const setDrawColor = (color: number[]) => doc.setDrawColor(color[0], color[1], color[2])

    const addText = (text: string, x: number, y: number, options?: any) => {
      if (text && text.toString().trim()) {
        doc.text(String(text), x, y, options)
      }
    }

    const drawRect = (x: number, y: number, width: number, height: number, style = "S") => {
      doc.rect(x, y, width, height, style)
    }

    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      doc.line(x1, y1, x2, y2)
    }

    // HEADER SECTION - Logo (Left) and QR Code (Right)
    let yPos = 25

    // Logo (Left side)
    const logoX = 25
    const logoY = yPos

    // Logo background circle
    setFillColor(colors.primary)
    doc.circle(logoX, logoY, 18, "F")

    // Logo text
    setTextColor(colors.white)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    addText("AG", logoX, logoY + 6, { align: "center" })

    // Company name
    setTextColor(colors.primary)
    doc.setFontSize(28)
    doc.setFont("helvetica", "bold")
    addText("AGRO-GENIX", logoX + 30, logoY + 8)

    // Tagline - positioned below the logo as specified
    setTextColor(colors.mediumText)
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    addText("Sustainable Agriculture & Eco-Tourism", logoX + 30, logoY + 22)

    // QR Code (Top Right Corner)
    const qrSize = 50
    const qrX = pageWidth - qrSize - 25
    const qrY = yPos - 15

    // QR background with border
    setFillColor(colors.white)
    drawRect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6, "F")

    setDrawColor(colors.primary)
    doc.setLineWidth(1)
    drawRect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6, "S")

    // Add QR code with error handling
    try {
      doc.addImage(qrCodeDataUrl, "PNG", qrX, qrY, qrSize, qrSize)
    } catch (imageError) {
      console.warn("Failed to add QR code image", imageError)
      // Add fallback text instead of QR code
      setTextColor(colors.primary)
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      addText("QR Code", qrX + qrSize / 2, qrY + qrSize / 2, { align: "center" })
      addText("Unavailable", qrX + qrSize / 2, qrY + qrSize / 2 + 8, { align: "center" })
    }

    // QR label - "Scan for Details" positioned underneath as specified
    setTextColor(colors.mediumText)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    addText("Scan for Details", qrX + qrSize / 2, qrY + qrSize + 8, { align: "center" })

    // Header separator line for improved readability
    yPos = 75
    setDrawColor(colors.primary)
    doc.setLineWidth(2)
    drawLine(25, yPos, pageWidth - 25, yPos)

    // MAIN TITLE
    yPos = 95
    setTextColor(colors.primary)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    addText("AGRO-TOURISM BOOKING CONFIRMATION", pageWidth / 2, yPos, { align: "center" })

    // BOOKING DETAILS SECTION - Immediately below header as specified
    yPos += 30

    // Section container with equal margins
    const sectionX = 25
    const sectionY = yPos
    const sectionWidth = pageWidth - 50
    const sectionHeight = 140

    // Section background
    setFillColor(colors.lightBg)
    drawRect(sectionX, sectionY, sectionWidth, sectionHeight, "F")

    // Section border
    setDrawColor(colors.border)
    doc.setLineWidth(1)
    drawRect(sectionX, sectionY, sectionWidth, sectionHeight, "S")

    // Section header
    setFillColor(colors.primary)
    drawRect(sectionX, sectionY, sectionWidth, 25, "F")

    setTextColor(colors.white)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    addText("BOOKING DETAILS", sectionX + 15, sectionY + 16)

    // Two-column table layout with proper alignment and consistent font sizes
    const col1X = sectionX + 20
    const col2X = sectionX + sectionWidth / 2 + 10
    const tableStartY = sectionY + 40

    // Left column data
    const leftColumnData = [
      { label: "Booking Reference ID:", value: bookingRef },
      { label: "Farm Name:", value: safeBooking.farmName },
      { label: "Experience Date:", value: experienceDate },
      { label: "Selected Time:", value: safeBooking.timeSlot },
      { label: "Total Cost:", value: `₹ ${safeBooking.totalPrice.toLocaleString("en-IN")}` },
    ]

    // Right column data
    const rightColumnData = [
      { label: "Customer Name:", value: safeBooking.contactInfo.name },
      { label: "Contact Number:", value: safeBooking.contactInfo.phone },
      { label: "Email Address:", value: safeBooking.contactInfo.email },
      { label: "Number of Guests:", value: `${safeBooking.adults} Adults, ${safeBooking.children} Children` },
      { label: "Payment Method:", value: safeBooking.paymentMethod },
    ]

    // Consistent font size for neat appearance
    doc.setFontSize(11)

    // Render left column with balanced spacing
    leftColumnData.forEach((item, index) => {
      const currentY = tableStartY + index * 20

      doc.setFont("helvetica", "bold")
      setTextColor(colors.darkText)
      addText(item.label, col1X, currentY)

      doc.setFont("helvetica", "normal")
      setTextColor(colors.mediumText)
      addText(item.value, col1X, currentY + 10)
    })

    // Render right column with balanced spacing
    rightColumnData.forEach((item, index) => {
      const currentY = tableStartY + index * 20

      doc.setFont("helvetica", "bold")
      setTextColor(colors.darkText)
      addText(item.label, col2X, currentY)

      doc.setFont("helvetica", "normal")
      setTextColor(colors.mediumText)
      addText(item.value, col2X, currentY + 10)
    })

    // Vertical separator line between columns for clear section separation
    setDrawColor(colors.border)
    doc.setLineWidth(0.5)
    drawLine(sectionX + sectionWidth / 2, sectionY + 30, sectionX + sectionWidth / 2, sectionY + sectionHeight)

    // SPECIAL REQUESTS SECTION (if any) - Only show if there are special requests
    yPos = sectionY + sectionHeight + 25

    if (safeBooking.specialRequests && safeBooking.specialRequests.trim()) {
      const requestLines = doc.splitTextToSize(safeBooking.specialRequests, pageWidth - 100)
      const requestHeight = Array.isArray(requestLines) ? requestLines.length * 14 + 50 : 64

      setFillColor(colors.lightBg)
      drawRect(25, yPos, pageWidth - 50, requestHeight, "F")

      setDrawColor(colors.border)
      doc.setLineWidth(1)
      drawRect(25, yPos, pageWidth - 50, requestHeight, "S")

      setFillColor(colors.accent)
      drawRect(25, yPos, pageWidth - 50, 25, "F")

      setTextColor(colors.white)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      addText("SPECIAL REQUESTS", 40, yPos + 16)

      let reqY = yPos + 45
      setTextColor(colors.darkText)
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")

      if (Array.isArray(requestLines)) {
        requestLines.forEach((line: string) => {
          addText(line, 40, reqY)
          reqY += 14
        })
      } else {
        addText(requestLines, 40, reqY)
      }

      yPos += requestHeight + 25
    }

    // FULL-WIDTH FOOTER SECTION - As specified
    const footerStartY = Math.max(yPos + 50, pageHeight - 70)

    // Footer separator line for clear separation
    setDrawColor(colors.border)
    doc.setLineWidth(1.5)
    drawLine(25, footerStartY - 20, pageWidth - 25, footerStartY - 20)

    // Full-width footer background maintaining green theme
    setFillColor(colors.primary)
    drawRect(0, footerStartY, pageWidth, 60, "F")

    // Footer content with smaller but readable fonts and proper alignment
    setTextColor(colors.white)
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    addText(
      "Thank you for choosing Agro-Genix for your sustainable farm experience!",
      pageWidth / 2,
      footerStartY + 15,
      {
        align: "center",
      },
    )

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    addText(
      "Customer Support: support@agrogenix.com | +91-XXXX-XXXX-XX | Website: www.agrogenix.com",
      pageWidth / 2,
      footerStartY + 30,
      {
        align: "center",
      },
    )

    doc.setFontSize(8)
    doc.setFont("helvetica", "italic")
    addText(
      "This document is computer-generated and does not require a physical signature.",
      pageWidth / 2,
      footerStartY + 45,
      {
        align: "center",
      },
    )

    return doc.output("blob")
  } catch (error) {
    console.error("Error generating receipt PDF:", error)
    throw new Error("Failed to generate receipt PDF")
  }
}

export const downloadReceipt = async (booking: BookingData): Promise<void> => {
  try {
    // Add debouncing to prevent rapid successive calls
    await new Promise((resolve) => setTimeout(resolve, 200))

    const pdfBlob = await generateBookingReceipt(booking)

    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement("a")
    link.href = url
    const bookingIdShort = booking.id ? booking.id.substring(0, 12) : "unknown"
    const timestamp = new Date().toISOString().slice(0, 10)
    link.download = `agro-genix-booking-confirmation-${bookingIdShort}-${timestamp}.pdf`

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })
  } catch (error) {
    console.error("Error downloading receipt:", error)
    throw new Error("Failed to download receipt")
  }
}
