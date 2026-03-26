import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const language = (formData.get("language") as string) || "en"

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 })
    }

    // Convert language code to Whisper-supported format
    const whisperLanguage =
      language === "hi"
        ? "hi"
        : language === "mr"
          ? "mr"
          : language === "gu"
            ? "gu"
            : language === "pa"
              ? "pa"
              : language === "ta"
                ? "ta"
                : language === "te"
                  ? "te"
                  : language === "kn"
                    ? "kn"
                    : language === "bn"
                      ? "bn"
                      : language === "or"
                        ? "or"
                        : "en"

    // Use OpenAI Whisper for speech-to-text
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: whisperLanguage,
      response_format: "json",
      temperature: 0.2,
    })

    return NextResponse.json({
      text: transcription.text,
      language: language,
    })
  } catch (error) {
    console.error("Voice processing error:", error)
    return NextResponse.json({ error: "Failed to process voice input" }, { status: 500 })
  }
}
