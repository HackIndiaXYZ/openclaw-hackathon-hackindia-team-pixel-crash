"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Camera,
  X,
  MessageSquare,
  Sparkles,
  Globe,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  language?: string
  hasImage?: boolean
  imageUrl?: string
}

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", nativeName: "हिंदी" },
  { code: "mr", name: "Marathi", flag: "🇮🇳", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳", nativeName: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳", nativeName: "ਪੰਜਾਬੀ" },
  { code: "ta", name: "Tamil", flag: "🇮🇳", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", flag: "🇮🇳", nativeName: "తెలుగు" },
  { code: "kn", name: "Kannada", flag: "🇮🇳", nativeName: "ಕನ್ನಡ" },
  { code: "bn", name: "Bengali", flag: "🇮🇳", nativeName: "বাংলা" },
  { code: "or", name: "Odia", flag: "🇮🇳", nativeName: "ଓଡ଼ିଆ" },
]

export default function AgroBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm AgroBot, your AI-powered agricultural assistant. I can help you with crop management, disease identification, weather advice, and farming best practices. You can chat with me in text, upload images of your crops, or even talk to me using voice commands in your preferred language!",
      timestamp: new Date(),
      language: "en",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        await processVoiceInput(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      toast({
        title: "Recording started",
        description: "Speak now... Click the microphone again to stop.",
      })
    } catch (error) {
      console.error("Error starting recording:", error)
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.wav")
      formData.append("language", selectedLanguage)

      const response = await fetch("/api/agro-bot/voice", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Voice processing failed")
      }

      const data = await response.json()
      if (data.text) {
        setInput(data.text)
        toast({
          title: "Voice recognized",
          description: `Recognized: "${data.text}"`,
        })
      }
    } catch (error) {
      console.error("Voice processing error:", error)
      toast({
        title: "Voice processing failed",
        description: "Could not process voice input. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const speakText = (text: string, language: string) => {
    if ("speechSynthesis" in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang =
        language === "hi"
          ? "hi-IN"
          : language === "mr"
            ? "mr-IN"
            : language === "gu"
              ? "gu-IN"
              : language === "pa"
                ? "pa-IN"
                : language === "ta"
                  ? "ta-IN"
                  : language === "te"
                    ? "te-IN"
                    : language === "kn"
                      ? "kn-IN"
                      : language === "bn"
                        ? "bn-IN"
                        : language === "or"
                          ? "or-IN"
                          : "en-US"

      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage) || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim() || "Image uploaded for analysis",
      timestamp: new Date(),
      language: selectedLanguage,
      hasImage: !!selectedImage,
      imageUrl: imagePreview || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("message", input.trim() || "Analyze this image")
      formData.append("language", selectedLanguage)
      formData.append("conversationHistory", JSON.stringify(messages))

      if (selectedImage) {
        formData.append("image", selectedImage)
      }

      const response = await fetch("/api/agro-bot", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        language: selectedLanguage,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Auto-speak the response if it's not in English
      if (selectedLanguage !== "en" && data.response) {
        setTimeout(() => {
          speakText(data.response, selectedLanguage)
        }, 500)
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to get response from AgroBot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      removeImage()
    }
  }

  const selectedLang = SUPPORTED_LANGUAGES.find((lang) => lang.code === selectedLanguage)

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              AgroBot Assistant
            </h1>
            <p className="text-muted-foreground">AI-powered agricultural guidance with multi-language support</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            Text Chat
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Mic className="w-3 h-3" />
            Voice Input
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Camera className="w-3 h-3" />
            Image Analysis
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            10 Languages
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Language Selector */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span>{selectedLang?.flag}</span>
                    <span className="text-sm">{selectedLang?.nativeName}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4 space-y-2">
              <Label className="text-xs text-muted-foreground">Voice Controls</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={isSpeaking ? stopSpeaking : () => {}}
                  disabled={!isSpeaking}
                  className="flex-1"
                >
                  {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Chat with AgroBot
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            {/* Quick Suggestion Buttons */}
            {messages.length === 1 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">Quick Questions:</p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => setInput("Why are my crop leaves turning yellow?")}
                    className="text-left text-sm p-2 rounded bg-white hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    "Why are my crop leaves turning yellow?"
                  </button>
                  <button
                    onClick={() => setInput("What's the best crop to plant this season?")}
                    className="text-left text-sm p-2 rounded bg-white hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    "What&apos;s the best crop to plant this season?"
                  </button>
                  <button
                    onClick={() => setInput("What fertilizer should I use?")}
                    className="text-left text-sm p-2 rounded bg-white hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    "What fertilizer should I use?"
                  </button>
                  <button
                    onClick={() => setInput("How do I detect crop diseases?")}
                    className="text-left text-sm p-2 rounded bg-white hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    "How do I detect crop diseases?"
                  </button>
                </div>
              </div>
            )}

            <ScrollArea className="h-96 w-full rounded-md border p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                          message.role === "user" ? "bg-blue-500" : "bg-gradient-to-br from-green-500 to-blue-600"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${message.role === "user" ? "bg-blue-500 text-white" : "bg-muted"}`}
                      >
                        {message.hasImage && message.imageUrl && (
                          <div className="mb-2">
                            <Image
                              src={message.imageUrl || "/placeholder.svg"}
                              alt="Uploaded image"
                              width={200}
                              height={150}
                              className="rounded-md object-cover"
                            />
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                          {message.language && message.language !== "en" && (
                            <Badge variant="outline" className="text-xs">
                              {SUPPORTED_LANGUAGES.find((l) => l.code === message.language)?.flag}
                            </Badge>
                          )}
                          {message.role === "assistant" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speakText(message.content, message.language || "en")}
                              className="h-6 w-6 p-0"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-600">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AgroBot is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative inline-block">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  width={150}
                  height={100}
                  className="rounded-md object-cover border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask me anything about farming in ${selectedLang?.nativeName}...`}
                    className="min-h-[60px] resize-none"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="h-[60px] w-12"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {isRecording && (
                    <Badge variant="destructive" className="animate-pulse">
                      <Mic className="w-3 h-3 mr-1" />
                      Recording...
                    </Badge>
                  )}
                  {isSpeaking && (
                    <Badge variant="secondary" className="animate-pulse">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Speaking...
                    </Badge>
                  )}
                </div>

                <Button type="submit" disabled={(!input.trim() && !selectedImage) || isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </form>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
