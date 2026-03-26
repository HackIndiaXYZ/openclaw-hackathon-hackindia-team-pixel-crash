import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { state, crop } = await request.json()

    if (!state || !crop) {
      return NextResponse.json({ error: "State and crop are required" }, { status: 400 })
    }

    const systemPrompt = `You are an expert international trade analyst specializing in Indian agricultural exports.

Generate 5 specific export opportunities for ${crop} from ${state}, India. For each opportunity, provide:

1. Target Country/Region
2. Market Size (in USD millions)
3. Current Demand Level (High/Medium/Low)
4. Price Premium (percentage above domestic)
5. Quality Requirements
6. Certification Needed
7. Logistics Requirements
8. Market Entry Barriers
9. Competition Level
10. ROI Potential (percentage)
11. Risk Assessment
12. Timeline to Market Entry

Focus on realistic, actionable export opportunities based on current global trade patterns and India's export capabilities.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `Identify and analyze 5 specific export opportunities for ${crop} from ${state}, India. Include detailed market analysis, requirements, and potential returns for each opportunity.`,
      maxTokens: 1500,
      temperature: 0.3,
    })

    // Generate structured export opportunities
    const opportunities = [
      {
        id: 1,
        country: "United Arab Emirates",
        region: "Middle East",
        marketSize: "$45-60 million",
        demand: "High",
        pricePremium: "25-35%",
        qualityReqs: "Grade A, pesticide residue compliance",
        certification: "HACCP, Organic (optional)",
        logistics: "Air freight, 3-5 days transit",
        barriers: "Low - existing trade relations",
        competition: "Medium",
        roi: "35-45%",
        risk: "Low",
        timeline: "3-6 months",
        description:
          extractOpportunityDescription(text, 1) || "Strong demand for premium quality produce in UAE markets",
      },
      {
        id: 2,
        country: "European Union",
        region: "Europe",
        marketSize: "$120-180 million",
        demand: "Medium-High",
        pricePremium: "40-60%",
        qualityReqs: "EU organic standards, traceability",
        certification: "EU Organic, GlobalGAP",
        logistics: "Sea freight, 15-20 days",
        barriers: "Medium - strict regulations",
        competition: "High",
        roi: "45-65%",
        risk: "Medium",
        timeline: "6-12 months",
        description: extractOpportunityDescription(text, 2) || "Growing organic market with premium pricing in EU",
      },
      {
        id: 3,
        country: "Singapore",
        region: "Southeast Asia",
        marketSize: "$25-35 million",
        demand: "High",
        pricePremium: "30-40%",
        qualityReqs: "Fresh, consistent quality",
        certification: "HACCP, ISO 22000",
        logistics: "Air freight, 4-6 hours",
        barriers: "Low - FTA benefits",
        competition: "Medium",
        roi: "40-50%",
        risk: "Low",
        timeline: "2-4 months",
        description: extractOpportunityDescription(text, 3) || "Strategic hub for Southeast Asian distribution",
      },
      {
        id: 4,
        country: "Japan",
        region: "East Asia",
        marketSize: "$80-120 million",
        demand: "Medium",
        pricePremium: "50-70%",
        qualityReqs: "Premium grade, specific packaging",
        certification: "JAS Organic, strict quality standards",
        logistics: "Air freight, specialized handling",
        barriers: "High - quality standards",
        competition: "High",
        roi: "55-75%",
        risk: "Medium-High",
        timeline: "8-15 months",
        description:
          extractOpportunityDescription(text, 4) || "Premium market with highest price realization potential",
      },
      {
        id: 5,
        country: "United States",
        region: "North America",
        marketSize: "$200-300 million",
        demand: "Medium",
        pricePremium: "35-50%",
        qualityReqs: "USDA standards, organic preferred",
        certification: "USDA Organic, FDA compliance",
        logistics: "Sea/air freight combination",
        barriers: "Medium - regulatory compliance",
        competition: "Very High",
        roi: "30-45%",
        risk: "Medium",
        timeline: "6-10 months",
        description: extractOpportunityDescription(text, 5) || "Large market with diverse opportunities across states",
      },
    ]

    const summary = {
      totalMarketSize: "$470-695 million",
      averageROI: "41-56%",
      recommendedMarkets: ["UAE", "Singapore", "EU"],
      keySuccess: "Quality consistency, certification compliance, reliable logistics",
      fullAnalysis: text,
    }

    return NextResponse.json({ opportunities, summary })
  } catch (error) {
    console.error("Export opportunities AI error:", error)
    return NextResponse.json({ error: "Failed to generate export opportunities" }, { status: 500 })
  }
}

function extractOpportunityDescription(text: string, opportunityNumber: number): string {
  const lines = text.split("\n")
  const opportunityStart = lines.findIndex(
    (line) => line.includes(`${opportunityNumber}.`) || line.includes(`Opportunity ${opportunityNumber}`),
  )

  if (opportunityStart === -1) return ""

  const descriptionLines = []
  for (let i = opportunityStart; i < opportunityStart + 5 && i < lines.length; i++) {
    const line = lines[i].trim()
    if (line && !line.match(/^\d+\./)) {
      descriptionLines.push(line)
    }
  }

  return descriptionLines.join(" ").trim().substring(0, 200) + "..."
}
