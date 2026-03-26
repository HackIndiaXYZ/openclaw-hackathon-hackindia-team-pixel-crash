import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import "./globals.css" // Import globals.css at the top of the file

export const metadata: Metadata = {
  title: "Agro-Genix - Sustainable Agriculture & Eco-Tourism",
  description:
    "Comprehensive agricultural platform with AI-powered crop analysis, weather forecasting, market insights, and eco-tourism experiences.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
