import { NextResponse } from "next/server"
import { generateSoilAnalysisPDF } from "@/lib/soil-pdf-generator"

export async function POST(request: Request) {
  try {
    const analysisData = await request.json()

    if (!analysisData || !analysisData.id) {
      return NextResponse.json({ success: false, message: "Analysis data is required" }, { status: 400 })
    }

    // Generate PDF
    const pdfBuffer = await generateSoilAnalysisPDF(analysisData)

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="soil-analysis-${analysisData.id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ success: false, message: "Failed to generate PDF report" }, { status: 500 })
  }
}
