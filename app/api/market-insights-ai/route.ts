import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { state, crop } = await request.json()

    if (!state || !crop) {
      return NextResponse.json({ error: "State and crop are required" }, { status: 400 })
    }

    const systemPrompt = `You are an expert agricultural market analyst with deep knowledge of Indian agricultural markets, crop patterns, and regional farming conditions.

Provide comprehensive market insights for ${crop} in ${state}, India. Include:

1. Current Market Conditions (2-3 sentences)
2. Price Trends & Analysis (specific price ranges in ₹/quintal)
3. Demand-Supply Dynamics
4. Regional Market Factors
5. Quality Parameters & Grading
6. Transportation & Logistics
7. Government Policies Impact
8. Seasonal Variations
9. Export Potential
10. Risk Factors & Mitigation

Make the analysis specific to ${state} and current market conditions. Use realistic price data and market trends for India.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `Generate detailed market insights for ${crop} cultivation and trading in ${state}, India. Focus on actionable intelligence for farmers and traders.`,
      maxTokens: 1200,
      temperature: 0.3,
    })

    // Parse the response into structured data
    const insights = {
      summary: text.split("\n")[0] || "Market analysis generated successfully",
      marketConditions:
        extractSection(text, "Current Market Conditions") || "Favorable market conditions with steady demand",
      priceAnalysis: extractSection(text, "Price Trends") || `Current prices range from ₹2,500-3,200 per quintal`,
      demandSupply: extractSection(text, "Demand-Supply") || "Balanced demand-supply dynamics",
      regionalFactors: extractSection(text, "Regional Market") || `${state}-specific market factors analyzed`,
      qualityParameters: extractSection(text, "Quality Parameters") || "Standard quality grading applies",
      logistics: extractSection(text, "Transportation") || "Good transportation connectivity",
      policies: extractSection(text, "Government Policies") || "Supportive government policies in place",
      seasonality: extractSection(text, "Seasonal") || "Seasonal price variations expected",
      exportPotential: extractSection(text, "Export") || "Moderate export potential",
      risks: extractSection(text, "Risk") || "Standard market risks apply",
      fullAnalysis: text,
    }

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Market insights AI error:", error)
    return NextResponse.json({ error: "Failed to generate market insights" }, { status: 500 })
  }
}

function extractSection(text: string, keyword: string): string {
  const lines = text.split("\n")
  const sectionStart = lines.findIndex((line) => line.toLowerCase().includes(keyword.toLowerCase()))

  if (sectionStart === -1) return ""

  const sectionLines = []
  for (let i = sectionStart + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line === "" || line.match(/^\d+\./)) break
    sectionLines.push(line)
  }

  return sectionLines.join(" ").trim()
}
