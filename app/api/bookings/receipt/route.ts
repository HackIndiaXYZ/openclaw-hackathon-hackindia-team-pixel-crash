import { NextResponse } from "next/server"
import { getBookingsByUserId } from "@/lib/file-db"
import jsPDF from "jspdf"
import QRCode from "qrcode"

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ success: false, message: "Booking ID is required" }, { status: 400 })
    }

    const bookings = getBookingsByUserId("demo-user")
    const booking = bookings.find((b) => b.id === bookingId)

    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 })
    }

    const pdfBuffer = await generateReceiptPDF(booking)

    const bookingIdShort = bookingId.substring(0, 12)
    const timestamp = new Date().toISOString().slice(0, 10)
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="agro-genix-booking-confirmation-${bookingIdShort}-${timestamp}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Receipt generation error:", error)
    return NextResponse.json({ success: false, message: "Failed to generate receipt" }, { status: 500 })
  }
}

async function generateReceiptPDF(booking: any): Promise<Buffer> {
  // Add a small delay to prevent rapid successive calls
  await new Promise((resolve) => setTimeout(resolve, 100))

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  try {
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

    const colors = {
      primary: [26, 95, 63],
      secondary: [52, 168, 83],
      accent: [16, 185, 129],
      darkText: [31, 41, 55],
      mediumText: [75, 85, 99],
      lightText: [107, 114, 128],
      white: [255, 255, 255],
      lightBg: [248, 250, 252],
      border: [229, 231, 235],
    }

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

    // HEADER SECTION
    let yPos = 25

    const logoX = 25
    const logoY = yPos

    setFillColor(colors.primary)
    doc.circle(logoX, logoY, 18, "F")

    setTextColor(colors.white)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    addText("AG", logoX, logoY + 6, { align: "center" })

    setTextColor(colors.primary)
    doc.setFontSize(28)
    doc.setFont("helvetica", "bold")
    addText("AGRO-GENIX", logoX + 30, logoY + 8)

    setTextColor(colors.mediumText)
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    addText("Sustainable Agriculture & Eco-Tourism", logoX + 30, logoY + 22)

    // QR Code (Top Right Corner)
    const qrSize = 50
    const qrX = pageWidth - qrSize - 25
    const qrY = yPos - 15

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

    setTextColor(colors.mediumText)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    addText("Scan for Details", qrX + qrSize / 2, qrY + qrSize + 8, { align: "center" })

    yPos = 75
    setDrawColor(colors.primary)
    doc.setLineWidth(2)
    drawLine(25, yPos, pageWidth - 25, yPos)

    yPos = 95
    setTextColor(colors.primary)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    addText("AGRO-TOURISM BOOKING CONFIRMATION", pageWidth / 2, yPos, { align: "center" })

    // BOOKING DETAILS SECTION
    yPos += 30

    const sectionX = 25
    const sectionY = yPos
    const sectionWidth = pageWidth - 50
    const sectionHeight = 140

    setFillColor(colors.lightBg)
    drawRect(sectionX, sectionY, sectionWidth, sectionHeight, "F")

    setDrawColor(colors.border)
    doc.setLineWidth(1)
    drawRect(sectionX, sectionY, sectionWidth, sectionHeight, "S")

    setFillColor(colors.primary)
    drawRect(sectionX, sectionY, sectionWidth, 25, "F")

    setTextColor(colors.white)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    addText("BOOKING DETAILS", sectionX + 15, sectionY + 16)

    const col1X = sectionX + 20
    const col2X = sectionX + sectionWidth / 2 + 10
    const tableStartY = sectionY + 40

    const leftColumnData = [
      { label: "Booking Reference ID:", value: bookingRef },
      { label: "Farm Name:", value: safeBooking.farmName },
      { label: "Experience Date:", value: experienceDate },
      { label: "Selected Time:", value: safeBooking.timeSlot },
      { label: "Total Cost:", value: `₹ ${safeBooking.totalPrice.toLocaleString("en-IN")}` },
    ]

    const rightColumnData = [
      { label: "Customer Name:", value: safeBooking.contactInfo.name },
      { label: "Contact Number:", value: safeBooking.contactInfo.phone },
      { label: "Email Address:", value: safeBooking.contactInfo.email },
      { label: "Number of Guests:", value: `${safeBooking.adults} Adults, ${safeBooking.children} Children` },
      { label: "Payment Method:", value: safeBooking.paymentMethod },
    ]

    doc.setFontSize(11)

    leftColumnData.forEach((item, index) => {
      const currentY = tableStartY + index * 20

      doc.setFont("helvetica", "bold")
      setTextColor(colors.darkText)
      addText(item.label, col1X, currentY)

      doc.setFont("helvetica", "normal")
      setTextColor(colors.mediumText)
      addText(item.value, col1X, currentY + 10)
    })

    rightColumnData.forEach((item, index) => {
      const currentY = tableStartY + index * 20

      doc.setFont("helvetica", "bold")
      setTextColor(colors.darkText)
      addText(item.label, col2X, currentY)

      doc.setFont("helvetica", "normal")
      setTextColor(colors.mediumText)
      addText(item.value, col2X, currentY + 10)
    })

    setDrawColor(colors.border)
    doc.setLineWidth(0.5)
    drawLine(sectionX + sectionWidth / 2, sectionY + 30, sectionX + sectionWidth / 2, sectionY + sectionHeight)

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

    // FULL-WIDTH FOOTER SECTION
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

    const pdfOutput = doc.output("arraybuffer")
    return Buffer.from(pdfOutput)
  } catch (error) {
    console.error("Error in generateReceiptPDF:", error)
    throw error
  }
}
