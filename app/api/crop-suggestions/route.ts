import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { location, soilType, landSize, waterAvailability, climateFactors } = await request.json()

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured. Please add your API key to enable AI capabilities.",
        },
        { status: 500 },
      )
    }

    // Prepare the prompt for OpenAI
    const prompt = `
      As an agricultural expert, provide crop recommendations based on the following farm details:
      
      Location: ${location}
      Soil Type: ${soilType}
      Land Size: ${landSize} acres
      Water Availability: ${waterAvailability}%
      Climate Factors: ${JSON.stringify(climateFactors)}
      
      For each recommended crop, provide:
      1. Crop name
      2. Suitability score (0-100)
      3. Profit potential (Low/Medium/High)
      4. Water requirement (Low/Medium/High)
      5. Growth duration in days
      6. Brief description of why it's suitable
      7. Soil compatibility score (0-100)
      8. Climate compatibility score (0-100)
      9. Current market demand score (0-100)
      10. Seasonal timing (Optimal/Good/Average/Poor)
      11. Investment required (Low/Medium/High)
      12. Special notes or variety recommendations (if any)
      
      Provide recommendations for 3 crops that would be most suitable for these conditions, focusing on crops that are commonly grown in India.
      Format the response as a JSON array of objects.
    `

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an agricultural expert specializing in Indian farming conditions." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    // Parse the response
    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("Failed to get recommendations from AI")
    }

    const recommendations = JSON.parse(content)

    return NextResponse.json(recommendations)
  } catch (error: any) {
    console.error("Error in crop suggestions:", error)
    return NextResponse.json(
      {
        error: `Error: ${error.message || "Failed to get crop recommendations"}`,
      },
      { status: 500 },
    )
  }
}
