import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const LANGUAGE_PROMPTS = {
  en: "Respond in English",
  hi: "Respond in Hindi (हिंदी में जवाब दें)",
  mr: "Respond in Marathi (मराठीत उत्तर द्या)",
  gu: "Respond in Gujarati (ગુજરાતીમાં જવાબ આપો)",
  pa: "Respond in Punjabi (ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ)",
  ta: "Respond in Tamil (தமிழில் பதிலளிக்கவும்)",
  te: "Respond in Telugu (తెలుగులో సమాధానం ఇవ్వండి)",
  kn: "Respond in Kannada (ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ)",
  bn: "Respond in Bengali (বাংলায় উত্তর দিন)",
  or: "Respond in Odia (ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ)",
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const message = formData.get("message") as string
    const language = (formData.get("language") as string) || "en"
    const conversationHistory = formData.get("conversationHistory") as string
    const imageFile = formData.get("image") as File | null

    if (!message && !imageFile) {
      return NextResponse.json({ error: "Message or image is required" }, { status: 400 })
    }

    let systemPrompt = `You are AgroBot, an expert AI agricultural assistant with deep knowledge of:
- Crop management and cultivation techniques
- Plant diseases and pest identification
- Soil health and fertilization
- Weather-based farming advice
- Sustainable farming practices
- Market trends and crop pricing
- Irrigation and water management
- Organic farming methods
- Agricultural technology and tools
- Regional farming practices in India

${LANGUAGE_PROMPTS[language as keyof typeof LANGUAGE_PROMPTS] || LANGUAGE_PROMPTS.en}

Provide practical, actionable advice that farmers can implement. Be concise but comprehensive.`

    const userMessage = message

    // Handle image analysis
    if (imageFile) {
      const imageBuffer = await imageFile.arrayBuffer()
      const base64Image = Buffer.from(imageBuffer).toString("base64")
      const imageDataUrl = `data:${imageFile.type};base64,${base64Image}`

      systemPrompt += `\n\nYou are also capable of analyzing agricultural images. When provided with an image, analyze it for:
- Crop health and growth stage
- Disease symptoms or pest damage
- Nutrient deficiencies
- Soil conditions (if visible)
- Recommended treatments or interventions
- Best practices for the specific crop shown`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userMessage || "Please analyze this agricultural image and provide detailed insights.",
              },
              { type: "image", image: imageDataUrl },
            ],
          },
        ],
        maxTokens: 1000,
        temperature: 0.7,
      })

      return NextResponse.json({ response: text })
    }

    // Handle text-only conversation
    let messages: any[] = []

    if (conversationHistory) {
      try {
        const history = JSON.parse(conversationHistory)
        messages = history.slice(-10).map((msg: any) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        }))
      } catch (error) {
        console.error("Error parsing conversation history:", error)
      }
    }

    messages.push({
      role: "user",
      content: userMessage,
    })

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
      maxTokens: 800,
      temperature: 0.7,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("AgroBot API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
