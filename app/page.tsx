"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Leaf,
  Users,
  ChevronRight,
  Star,
  MapPin,
  BarChart3,
  Smartphone,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Download,
  Play,
  Cloud,
  AlertTriangle, // AlertTriangle imported here
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const [stats, setStats] = useState({
    farmers: 50000,
    crops: 150,
    accuracy: 95,
    satisfaction: 4.8,
  })

  const { toast } = useToast()

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    })
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <Image
            src="/hero-background-new.png"
            alt="Agricultural landscape"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-6xl mx-auto text-center">
            {/* Hero Content */}
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-3 lg:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                  <span className="block mb-2">AI-Powered Decision</span>
                  <span className="block mb-2 text-amber-200">Support System</span>
                  <span className="block">for Modern Farmers</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-green-100 leading-relaxed max-w-4xl mx-auto">
                  Get real-time soil insights, weather alerts, crop recommendations, drone analytics, and market intelligence—all in one platform
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 text-lg cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  asChild
                >
                  <Link href="/features" className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold px-8 py-4 text-lg cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-transparent"
                  asChild
                >
                  <a href="https://www.youtube.com/watch?v=agrogenix-demo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Watch Demo
                  </a>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-6 lg:pt-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-amber-300 border-2 border-white flex items-center justify-center"
                      >
                        <Users className="h-4 w-4 text-amber-800" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium">50,000+ Farmers Trust Us</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-300 text-amber-300" />
                  ))}
                  <span className="text-sm font-medium ml-1">4.8/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Impact Stats Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white via-green-50 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-30 blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-teal-100 to-green-100 rounded-full opacity-30 blur-3xl -ml-48 -mb-48" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Trusted by Farmers Across India
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Join thousands of farmers using AgroGenix to increase yields and maximize profits
            </p>
          </div>
          
          {/* Stats Grid with Interactive Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Farmers Stat */}
            <div className="group cursor-pointer">
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border border-green-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-4xl lg:text-5xl font-bold text-green-600 leading-tight">
                      {(stats.farmers / 1000).toFixed(0)}K+
                    </p>
                    <p className="text-gray-600 font-medium mt-2">Active Farmers</p>
                  </div>
                  <p className="text-sm text-gray-500 pt-2 border-t border-gray-200">Growing community</p>
                </div>
              </div>
            </div>

            {/* Crops Stat */}
            <div className="group cursor-pointer">
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border border-blue-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Leaf className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-4xl lg:text-5xl font-bold text-blue-600 leading-tight">{stats.crops}+</p>
                    <p className="text-gray-600 font-medium mt-2">Crop Varieties</p>
                  </div>
                  <p className="text-sm text-gray-500 pt-2 border-t border-gray-200">Fully supported</p>
                </div>
              </div>
            </div>

            {/* Accuracy Stat */}
            <div className="group cursor-pointer">
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border border-amber-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-4xl lg:text-5xl font-bold text-amber-600 leading-tight">{stats.accuracy}%</p>
                    <p className="text-gray-600 font-medium mt-2">AI Accuracy</p>
                  </div>
                  <p className="text-sm text-gray-500 pt-2 border-t border-gray-200">Proven results</p>
                </div>
              </div>
            </div>

            {/* Rating Stat */}
            <div className="group cursor-pointer">
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border border-pink-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Star className="h-7 w-7 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-4xl lg:text-5xl font-bold text-pink-600 leading-tight">{stats.satisfaction}</p>
                    <p className="text-gray-600 font-medium mt-2">User Rating</p>
                  </div>
                  <p className="text-sm text-gray-500 pt-2 border-t border-gray-200">Customer satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Style */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Everything You Need for Smart Farming
            </h2>
            <p className="text-lg text-gray-700">
              8 powerful tools designed to help farmers increase yields, reduce costs, and maximize profits
            </p>
            <Link href="/features">
              <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 cursor-pointer">
                Explore All Features →
              </Button>
            </Link>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {/* Soil Intelligence - Featured */}
            <Link href="/soil-intelligence">
              <div className="group cursor-pointer relative bg-gradient-to-br from-amber-400 via-amber-300 to-orange-400 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full p-8 md:col-span-1 md:row-span-2 flex flex-col">
                {/* Animated background */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transform transition-transform">
                    <Leaf className="h-7 w-7 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Soil Intelligence</h3>
                    <p className="text-white/90 text-sm mb-6 leading-relaxed">
                      Complete soil analysis with NPK tracking, fertilizer recommendations, and health reports
                    </p>
                  </div>
                  
                  <ul className="space-y-2 mb-8">
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      NPK Analysis
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Fertilizer Tips
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Health Reports
                    </li>
                  </ul>
                  
                  <button className="w-full bg-white text-amber-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all transform group-hover:scale-105 flex items-center justify-center gap-2">
                    Explore Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Link>

            {/* AI Crop Advisory */}
            <Link href="/crop-suggestions">
              <div className="group cursor-pointer relative bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden p-8 flex flex-col">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transform transition-transform">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Crop Advisory</h3>
                  <p className="text-white/90 text-sm mb-6 flex-1">Smart recommendations based on soil and market</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Crop Suggestions
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Yield Prediction
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Disease Prevention
                    </li>
                  </ul>
                  <button className="w-full bg-white text-green-600 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-all">Explore →</button>
                </div>
              </div>
            </Link>

            {/* Drone Analytics */}
            <Link href="/drone-analytics">
              <div className="group cursor-pointer relative bg-gradient-to-br from-blue-400 via-cyan-400 to-sky-400 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden p-8 flex flex-col">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transform transition-transform">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Drone Analytics</h3>
                  <p className="text-white/90 text-sm mb-6 flex-1">Disease detection & crop health scoring</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Image Analysis
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Disease Detection
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Health Score
                    </li>
                  </ul>
                  <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-all">Explore →</button>
                </div>
              </div>
            </Link>

            {/* Market Linkage */}
            <Link href="/market-analysis">
              <div className="group cursor-pointer relative bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden p-8 flex flex-col">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transform transition-transform">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Market Linkage</h3>
                  <p className="text-white/90 text-sm mb-6 flex-1">Price intelligence & direct buyer links</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Price Trends
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Best Markets
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Buyer Links
                    </li>
                  </ul>
                  <button className="w-full bg-white text-orange-600 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-all">Explore →</button>
                </div>
              </div>
            </Link>

            {/* Weather Intelligence */}
            <Link href="/weather">
              <div className="group cursor-pointer relative bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden p-8 flex flex-col">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transform transition-transform">
                    <Cloud className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Weather Intelligence</h3>
                  <p className="text-white/90 text-sm mb-6 flex-1">7-day forecast with farming insights</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Real-time Updates
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Rainfall Alerts
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Temp Warnings
                    </li>
                  </ul>
                  <button className="w-full bg-white text-cyan-600 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-all">Explore →</button>
                </div>
              </div>
            </Link>

            {/* AgriCare Alerts */}
            <Link href="/agricare">
              <div className="group cursor-pointer relative bg-gradient-to-br from-red-400 via-pink-400 to-rose-400 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden p-8 flex flex-col">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transform transition-transform">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">AgriCare Alerts</h3>
                  <p className="text-white/90 text-sm mb-6 flex-1">Weather, pest & price alerts</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Weather Risk
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Pest Warnings
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Price Alerts
                    </li>
                  </ul>
                  <button className="w-full bg-white text-red-600 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-all">Explore →</button>
                </div>
              </div>
            </Link>

            {/* AI Assistant */}
            <Link href="/agro-bot">
              <div className="group cursor-pointer relative bg-gradient-to-br from-purple-400 via-violet-400 to-indigo-400 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden p-8 flex flex-col">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transform transition-transform">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Assistant</h3>
                  <p className="text-white/90 text-sm mb-6 flex-1">Expert advice available 24/7</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      24/7 Available
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Expert Knowledge
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Personalized Help
                    </li>
                  </ul>
                  <button className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-all">Chat Now →</button>
                </div>
              </div>
            </Link>

            {/* Government Services */}
            <Link href="/kisan-setu">
              <div className="group cursor-pointer relative bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden p-8 flex flex-col">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transform transition-transform">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Government Services</h3>
                  <p className="text-white/90 text-sm mb-6 flex-1">Schemes, subsidies & direct benefits</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Schemes Info
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Subsidies
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="h-4 w-4 text-white" />
                      Direct Benefits
                    </li>
                  </ul>
                  <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-all">Explore →</button>
                </div>
              </div>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Quick Results</h4>
                  <p className="text-sm text-gray-700">Get actionable insights in minutes, not days</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Secure & Private</h4>
                  <p className="text-sm text-gray-700">Your farm data is encrypted and protected</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Always Available</h4>
                  <p className="text-sm text-gray-700">Access your farm dashboard anytime, anywhere</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy removed - old Marketplace section */}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-700">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer text-sm" asChild>
                  <Link href="/shop" className="flex items-center justify-center gap-2">
                    Shop Now
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-green-800 leading-tight">
                  Take Agriculture Intelligence Everywhere
                </h2>
                <p className="text-lg lg:text-xl text-green-700 leading-relaxed">
                  Download our mobile app and access all features on the go. Get real-time notifications, weather
                  alerts, and expert advice right in your pocket.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-green-800">Mobile Optimized</div>
                    <div className="text-sm text-green-600 truncate">Works on all devices</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-green-800">Offline Access</div>
                    <div className="text-sm text-green-600 truncate">Works without internet</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
                  asChild
                >
                  <Link href="#" className="flex items-center gap-3">
                    <Download className="h-5 w-5" />
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
                  asChild
                >
                  <Link href="#" className="flex items-center gap-3">
                    <Download className="h-5 w-5" />
                    <div className="text-left">
                      <div className="text-xs">Get it on</div>
                      <div className="font-semibold">Google Play</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute inset-4 bg-white rounded-2xl overflow-hidden">
                    <Image src="/screenshot-dashboard.png" alt="Mobile app screenshot" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-green-800 mb-4 leading-tight">
              What Farmers Say About Us
            </h2>
            <p className="text-lg lg:text-xl text-green-700 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied farmers who have transformed their agricultural practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-green-700 mb-4 leading-relaxed">
                  "AgroGenix has completely transformed my farming approach. The weather predictions are incredibly
                  accurate, and the crop suggestions have increased my yield by 30%."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-green-800">Rajesh Kumar</div>
                    <div className="text-sm text-green-600 truncate">Wheat Farmer, Punjab</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-green-700 mb-4 leading-relaxed">
                  "The market analysis feature helped me sell my crops at the right time. I made 25% more profit
                  compared to last season. Highly recommended!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-green-800">Priya Sharma</div>
                    <div className="text-sm text-green-600 truncate">Vegetable Farmer, Maharashtra</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-green-700 mb-4 leading-relaxed">
                  "The AI assistant is like having an agricultural expert available 24/7. It has helped me solve many
                  farming challenges quickly and effectively."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-green-800">Amit Patel</div>
                    <div className="text-sm text-green-600 truncate">Cotton Farmer, Gujarat</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
              Stay Updated with Agricultural Insights
            </h2>
            <p className="text-lg lg:text-xl text-green-100 mb-8 lg:mb-12 leading-relaxed">
              Get weekly tips, market updates, and farming best practices delivered to your inbox
            </p>

            <form onSubmit={handleNewsletterSignup} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-white/90 border-0 text-green-800 placeholder:text-green-600 focus:bg-white cursor-text"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <p className="text-sm text-green-200 mt-4">
                Join 10,000+ farmers who trust our insights. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-green-800 leading-tight">
                  Get in Touch
                </h2>
                <p className="text-lg lg:text-xl text-green-700 leading-relaxed">
                  Have questions or need support? Our team of agricultural experts is here to help you succeed.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-green-800">Phone Support</div>
                    <div className="text-green-600">+91 1800-123-4567</div>
                    <div className="text-sm text-green-500">Mon-Fri, 9 AM - 6 PM</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-green-800">Email Support</div>
                    <div className="text-green-600">support@agrogenix.com</div>
                    <div className="text-sm text-green-500">24/7 response time</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-green-800">Office Address</div>
                    <div className="text-green-600">123 Agriculture Hub, New Delhi</div>
                    <div className="text-sm text-green-500">Visit us anytime</div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-800">Follow Us</h3>
                <div className="flex gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-green-300 text-green-600 hover:bg-green-50 cursor-pointer transform hover:scale-110 transition-all duration-300 bg-transparent"
                    asChild
                  >
                    <Link href="#" aria-label="Facebook">
                      <Facebook className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-green-300 text-green-600 hover:bg-green-50 cursor-pointer transform hover:scale-110 transition-all duration-300 bg-transparent"
                    asChild
                  >
                    <Link href="#" aria-label="Twitter">
                      <Twitter className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-green-300 text-green-600 hover:bg-green-50 cursor-pointer transform hover:scale-110 transition-all duration-300 bg-transparent"
                    asChild
                  >
                    <Link href="#" aria-label="Instagram">
                      <Instagram className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-green-300 text-green-600 hover:bg-green-50 cursor-pointer transform hover:scale-110 transition-all duration-300 bg-transparent"
                    asChild
                  >
                    <Link href="#" aria-label="YouTube">
                      <Youtube className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-green-800">Send us a Message</CardTitle>
                <CardDescription className="text-green-600">We'll get back to you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-green-800">First Name</label>
                      <Input
                        placeholder="Enter your first name"
                        className="border-green-200 focus:border-green-400 cursor-text"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-green-800">Last Name</label>
                      <Input
                        placeholder="Enter your last name"
                        className="border-green-200 focus:border-green-400 cursor-text"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-800">Email</label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="border-green-200 focus:border-green-400 cursor-text"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-800">Subject</label>
                    <Input
                      placeholder="What's this about?"
                      className="border-green-200 focus:border-green-400 cursor-text"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-800">Message</label>
                    <Textarea
                      placeholder="Tell us more about your inquiry..."
                      rows={4}
                      className="border-green-200 focus:border-green-400 resize-none cursor-text"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Send Message
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
