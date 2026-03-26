"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  CloudRain,
  Sprout,
  TrendingUp,
  Settings2,
  ShoppingCart,
  MapPin,
  Banknote,
  Users,
  Brain,
  BarChart3,
  Truck,
  Bell,
  Wifi,
  MessageCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
  AlertTriangle,
  ChevronLeft,
  ChevronDown,
} from "lucide-react"

// Define feature categories with their display properties - CORE 8 FEATURES
const featureCategories = [
  {
    name: "Soil Intelligence",
    shortName: "Soil Intelligence",
    description: "Comprehensive soil analysis with NPK, pH, and moisture tracking",
    icon: Sprout,
    status: "integrated",
    url: "/soil-intelligence",
    benefits: ["NPK Analysis", "Fertilizer Tips", "Health Reports"],
    bgColor: "from-yellow-100 to-yellow-50",
    iconBg: "bg-yellow-200",
    borderColor: "border-yellow-300",
    buttonColor: "bg-orange-500 hover:bg-orange-600",
  },
  {
    name: "AI Crop Advisory",
    shortName: "AI Crop Advisory",
    description: "Smart crop recommendations based on soil & market conditions",
    icon: Brain,
    status: "integrated",
    url: "/crop-suggestions",
    benefits: ["Crop Suggestions", "Yield Prediction", "Disease Prevention"],
    bgColor: "from-green-100 to-green-50",
    iconBg: "bg-green-200",
    borderColor: "border-green-300",
    buttonColor: "bg-green-600 hover:bg-green-700",
  },
  {
    name: "Drone Analytics",
    shortName: "Drone Analytics",
    description: "AI-powered disease detection & crop health scoring from images",
    icon: BarChart3,
    status: "integrated",
    url: "/drone-analytics",
    benefits: ["Image Analysis", "Disease Detection", "Health Score"],
    bgColor: "from-blue-100 to-blue-50",
    iconBg: "bg-blue-200",
    borderColor: "border-blue-300",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
  {
    name: "Market Linkage",
    shortName: "Market Linkage",
    description: "Real-time price intelligence & direct connections with buyers",
    icon: TrendingUp,
    status: "integrated",
    url: "/market-analysis",
    benefits: ["Price Trends", "Best Markets", "Buyer Links"],
    bgColor: "from-orange-100 to-orange-50",
    iconBg: "bg-orange-200",
    borderColor: "border-orange-300",
    buttonColor: "bg-orange-500 hover:bg-orange-600",
  },
  {
    name: "Weather Intelligence",
    shortName: "Weather Intelligence",
    description: "7-day forecasts with farming-specific recommendations",
    icon: CloudRain,
    status: "integrated",
    url: "/weather",
    benefits: ["Real-time Updates", "Rainfall Alerts", "Temp Warnings"],
    bgColor: "from-cyan-100 to-cyan-50",
    iconBg: "bg-cyan-200",
    borderColor: "border-cyan-300",
    buttonColor: "bg-cyan-600 hover:bg-cyan-700",
  },
  {
    name: "AgriCare Alerts",
    shortName: "AgriCare Alerts",
    description: "Integrated weather, pest & price alerts with recommendations",
    icon: AlertTriangle,
    status: "integrated",
    url: "/agricare",
    benefits: ["Weather Risk", "Pest Warnings", "Price Alerts"],
    bgColor: "from-red-100 to-red-50",
    iconBg: "bg-red-200",
    borderColor: "border-red-300",
    buttonColor: "bg-red-600 hover:bg-red-700",
  },
  {
    name: "AI Assistant (AgroBot)",
    shortName: "AI Assistant",
    description: "24/7 expert farming guidance with voice & text support",
    icon: MessageCircle,
    status: "integrated",
    url: "/agro-bot",
    benefits: ["24/7 Available", "Expert Knowledge", "Personalized Help"],
    bgColor: "from-purple-100 to-purple-50",
    iconBg: "bg-purple-200",
    borderColor: "border-purple-300",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
  },
  {
    name: "Government Services",
    shortName: "Gov. Services",
    description: "Access schemes, subsidies & direct benefit transfer programs",
    icon: Users,
    status: "integrated",
    url: "/kisan-setu",
    benefits: ["Schemes Info", "Subsidies", "Loan Programs"],
    bgColor: "from-indigo-100 to-indigo-50",
    iconBg: "bg-indigo-200",
    borderColor: "border-indigo-300",
    buttonColor: "bg-indigo-600 hover:bg-indigo-700",
  },
]

// ADDITIONAL ACTIVE FEATURES (beyond core 8)
const additionalFeatures = [
  {
    name: "Smart Irrigation",
    description: "Automated irrigation scheduling based on weather and soil conditions",
    icon: Settings2,
    status: "integrated",
    url: "/smart-irrigation",
    benefits: ["Save up to 40% water", "Reduce labor", "Better crop growth"],
    bgColor: "from-teal-100 to-teal-50",
    iconBg: "bg-teal-200",
    buttonColor: "bg-teal-600 hover:bg-teal-700",
  },
  {
    name: "GPS Field Mapping",
    description: "Precise field mapping and crop tracking with location-based insights",
    icon: MapPin,
    status: "integrated",
    url: "/gps-integration",
    benefits: ["Spot treatments", "Pattern tracking", "Historic records"],
    bgColor: "from-lime-100 to-lime-50",
    iconBg: "bg-lime-200",
    buttonColor: "bg-lime-600 hover:bg-lime-700",
  },
  {
    name: "Farm Shop",
    description: "Quality seeds, fertilizers, and equipment from verified sellers",
    icon: ShoppingCart,
    status: "integrated",
    url: "/shop",
    benefits: ["Verified sellers", "Fair prices", "Fast delivery"],
    bgColor: "from-rose-100 to-rose-50",
    iconBg: "bg-rose-200",
    buttonColor: "bg-rose-600 hover:bg-rose-700",
  },
  {
    name: "Agro Finance",
    description: "Agricultural loans and credit with quick approvals and low rates",
    icon: Banknote,
    status: "integrated",
    url: "/agro-finance",
    benefits: ["Quick approvals", "Lower rates", "Flexible terms"],
    bgColor: "from-emerald-100 to-emerald-50",
    iconBg: "bg-emerald-200",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    name: "Agro Tourism",
    description: "Earn extra income by offering farm experiences to visitors",
    icon: MapPin,
    status: "integrated",
    url: "/agro-tourism",
    benefits: ["Extra revenue", "Farm promotion", "Educational value"],
    bgColor: "from-amber-100 to-amber-50",
    iconBg: "bg-amber-200",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
  },
]

// PLANNED FEATURES (coming soon)
const plannedFeatures = [
  {
    name: "Advanced Price Predictions",
    description: "Machine learning forecasts for future commodity prices",
    icon: BarChart3,
    status: "in-progress",
    progress: 75,
    expectedRelease: "Q1 2026",
    benefits: ["Plan ahead", "Reduce uncertainty", "Better negotiations"],
    bgColor: "from-violet-100 to-violet-50",
    iconBg: "bg-violet-200",
  },
  {
    name: "Real-time Weather Alerts",
    description: "Instant notifications for frost, storms, and extreme weather",
    icon: Bell,
    status: "in-progress",
    progress: 45,
    expectedRelease: "Q1 2026",
    benefits: ["Emergency warnings", "Time to prepare", "Protect investment"],
    bgColor: "from-sky-100 to-sky-50",
    iconBg: "bg-sky-200",
  },
  {
    name: "IoT Device Integration",
    description: "Connect sensors and smart devices for real-time field monitoring",
    icon: Wifi,
    status: "in-progress",
    progress: 30,
    expectedRelease: "Q2 2026",
    benefits: ["Auto data collection", "Real-time monitoring", "No manual work"],
    bgColor: "from-fuchsia-100 to-fuchsia-50",
    iconBg: "bg-fuchsia-200",
  },
  {
    name: "Farm Logistics",
    description: "Transport and supply chain solutions from farm to market",
    icon: Truck,
    status: "in-progress",
    progress: 60,
    expectedRelease: "Q2 2026",
    benefits: ["Reduce transport cost", "Faster delivery", "Track shipments"],
    bgColor: "from-orange-100 to-orange-50",
    iconBg: "bg-orange-200",
  },
  {
    name: "Farmer Community Forum",
    description: "Connect with nearby farmers to share experiences and knowledge",
    icon: MessageCircle,
    status: "in-progress",
    progress: 25,
    expectedRelease: "Q2 2026",
    benefits: ["Local advice", "Best practices", "Build network"],
    bgColor: "from-pink-100 to-pink-50",
    iconBg: "bg-pink-200",
  },
]

// Keep the old features structure for backward compatibility but reorganized
const features = [
  // Soil Intelligence & Health
  {
    category: "Soil Intelligence & Health",
    description: "Know your soil to maximize yields",
    items: [
      {
        name: "Soil Analysis",
        description: "Get detailed NPK, pH, moisture, and nutrients data",
        benefits: ["Precise nutrient levels", "pH and moisture tracking", "Health reports"],
        url: "/soil-intelligence",
        icon: Sprout,
        status: "integrated",
        color: "border-amber-200 bg-amber-50",
      },
      {
        name: "Fertilizer Recommendations",
        description: "Smart recommendations based on soil data",
        benefits: ["Optimize fertilizer use", "Reduce costs", "Increase yields"],
        url: "/soil-analysis/fertilizer",
        icon: Sprout,
        status: "integrated",
        color: "border-amber-200 bg-amber-50",
      },
    ],
  },
  // Crop Advisory & Predictions
  {
    category: "Crop Advisory & Predictions",
    description: "Make better planting decisions with AI guidance",
    items: [
      {
        name: "Smart Crop Recommendations",
        description: "AI suggests best crops for your soil and climate",
        benefits: ["Based on soil data", "Market demand insights", "Seasonal guidance"],
        url: "/crop-suggestions",
        icon: Brain,
        status: "integrated",
        color: "border-green-200 bg-green-50",
      },
      {
        name: "Yield Prediction",
        description: "Forecast expected harvest before planting",
        benefits: ["Plan inventory", "Budget better", "Reduce waste"],
        url: "/yield-prediction",
        icon: BarChart3,
        status: "integrated",
        color: "border-green-200 bg-green-50",
      },
      {
        name: "Disease Prevention",
        description: "Early warnings and prevention tips for crop diseases",
        benefits: ["Prevent crop loss", "Save money on treatments", "Timely action"],
        url: "/crop-advisory/disease-prevention",
        icon: AlertTriangle,
        status: "integrated",
        color: "border-green-200 bg-green-50",
      },
    ],
  },
  // Drone-Powered Field Intelligence
  {
    category: "Drone-Powered Field Intelligence",
    description: "See your field from above - detect problems early",
    items: [
      {
        name: "Crop Health Scoring",
        description: "Drone images analyze field health on a 0-100 scale",
        benefits: ["Spot problem areas", "Monitor growth", "Track changes"],
        url: "/drone-analytics/health",
        icon: BarChart3,
        status: "integrated",
        color: "border-blue-200 bg-blue-50",
      },
      {
        name: "Disease Detection",
        description: "AI identifies diseases and stress patterns in images",
        benefits: ["Catch problems early", "94%+ accuracy", "Action recommendations"],
        url: "/drone-analytics/disease",
        icon: AlertTriangle,
        status: "integrated",
        color: "border-blue-200 bg-blue-50",
      },
      {
        name: "Stress Analysis",
        description: "Detect water, nutrient, or pest stress before it spreads",
        benefits: ["Save time scouting", "Precise treatment areas", "Reduce chemical use"],
        url: "/drone-analytics/stress",
        icon: TrendingUp,
        status: "integrated",
        color: "border-blue-200 bg-blue-50",
      },
    ],
  },
  // Weather & Risk Management
  {
    category: "Weather & Risk Management",
    description: "Stay ahead of weather with alerts and recommendations",
    items: [
      {
        name: "Weather Forecast",
        description: "7-day detailed forecast with farming recommendations",
        benefits: ["Plan irrigation timing", "Avoid crop damage", "Optimize spraying"],
        url: "/weather",
        icon: CloudRain,
        status: "integrated",
        color: "border-cyan-200 bg-cyan-50",
      },
      {
        name: "Weather Alerts",
        description: "Real-time alerts for frost, rain, storms, and extreme heat",
        benefits: ["Emergency warnings", "Time to prepare", "Protect investment"],
        url: "/features/weather-alerts",
        icon: Bell,
        status: "in-progress",
        progress: 45,
        expectedRelease: "Q1 2026",
        color: "border-cyan-200 bg-cyan-50",
      },
      {
        name: "AgriCare Alerts",
        description: "Integrated pest, price, and farming task reminders",
        benefits: ["Never miss crucial dates", "Pest warnings", "Price drop alerts"],
        url: "/agricare",
        icon: AlertTriangle,
        status: "integrated",
        color: "border-cyan-200 bg-cyan-50",
      },
    ],
  },
  // Market Intelligence & Sales
  {
    category: "Market Intelligence & Sales",
    description: "Know prices, find buyers, maximize profit",
    items: [
      {
        name: "Price Trends",
        description: "Track commodity prices across all major markets",
        benefits: ["Know best selling time", "Compare markets", "Plan sales"],
        url: "/market-analysis/price-trends",
        icon: TrendingUp,
        status: "integrated",
        color: "border-purple-200 bg-purple-50",
      },
      {
        name: "Best Market Finder",
        description: "AI finds which market offers highest prices for your crops",
        benefits: ["Maximize income", "Save transport time", "Direct comparisons"],
        url: "/market-analysis/best-markets",
        icon: MapPin,
        status: "integrated",
        color: "border-purple-200 bg-purple-50",
      },
      {
        name: "Direct Buyer Links",
        description: "Connect directly with buyers and exporters",
        benefits: ["Skip middlemen", "Get better prices", "Steady contracts"],
        url: "/market-analysis/buyer-links",
        icon: Users,
        status: "integrated",
        color: "border-purple-200 bg-purple-50",
      },
      {
        name: "Price Predictions",
        description: "AI forecasts future prices to help timing decisions",
        benefits: ["Plan ahead", "Reduce uncertainty", "Better negotiations"],
        url: "/features/price-predictions",
        icon: BarChart3,
        status: "in-progress",
        progress: 75,
        expectedRelease: "Q1 2026",
        color: "border-purple-200 bg-purple-50",
      },
    ],
  },
  // Smart Farming Tools
  {
    category: "Smart Farming Tools",
    description: "Automation and efficiency for modern farming",
    items: [
      {
        name: "Smart Irrigation",
        description: "Automated irrigation scheduling based on weather and soil",
        benefits: ["Save water up to 40%", "Reduce labor", "Better growth"],
        url: "/smart-irrigation",
        icon: Settings2,
        status: "integrated",
        color: "border-teal-200 bg-teal-50",
      },
      {
        name: "GPS Field Mapping",
        description: "Precise field mapping and crop tracking by location",
        benefits: ["Spot apply treatments", "Track patterns", "Historic records"],
        url: "/gps-integration",
        icon: MapPin,
        status: "integrated",
        color: "border-teal-200 bg-teal-50",
      },
      {
        name: "AI Assistant (AgroBot)",
        description: "24/7 expert guidance in your language",
        benefits: ["Ask any question", "Instant answers", "Local knowledge"],
        url: "/agro-bot",
        icon: MessageCircle,
        status: "integrated",
        color: "border-teal-200 bg-teal-50",
      },
      {
        name: "IoT Device Integration",
        description: "Connect soil sensors, weather stations, and smart devices",
        benefits: ["Automatic data collection", "Real-time monitoring", "No manual work"],
        url: "/features/iot-integration",
        icon: Wifi,
        status: "in-progress",
        progress: 30,
        expectedRelease: "Q2 2026",
        color: "border-teal-200 bg-teal-50",
      },
    ],
  },
  // Marketplace & Services
  {
    category: "Marketplace & Services",
    description: "Buy quality products and access financial support",
    items: [
      {
        name: "Farm Shop",
        description: "Quality seeds, fertilizers, and equipment at fair prices",
        benefits: ["Verified sellers", "Competitive prices", "Fast delivery"],
        url: "/shop",
        icon: ShoppingCart,
        status: "integrated",
        color: "border-orange-200 bg-orange-50",
      },
      {
        name: "Government Services",
        description: "Access schemes, subsidies, and direct benefit transfers",
        benefits: ["Easy eligibility check", "Simplified applications", "Track status"],
        url: "/kisan-setu",
        icon: Users,
        status: "integrated",
        color: "border-orange-200 bg-orange-50",
      },
      {
        name: "Agro Finance",
        description: "Loans and credit for farming and equipment needs",
        benefits: ["Quick approvals", "Lower interest rates", "Flexible terms"],
        url: "/agro-finance",
        icon: Banknote,
        status: "integrated",
        color: "border-orange-200 bg-orange-50",
      },
      {
        name: "Farm Logistics",
        description: "Transport and supply chain solutions from farm to market",
        benefits: ["Reduce transport cost", "Faster delivery", "Track shipments"],
        url: "/features/logistics",
        icon: Truck,
        status: "in-progress",
        progress: 60,
        expectedRelease: "Q2 2026",
        color: "border-orange-200 bg-orange-50",
      },
    ],
  },
  // Community & Learning
  {
    category: "Community & Learning",
    description: "Learn from other farmers and share knowledge",
    items: [
      {
        name: "Farmer Forum",
        description: "Connect with nearby farmers and share experiences",
        benefits: ["Get local advice", "Learn best practices", "Build network"],
        url: "/features/community-forum",
        icon: MessageCircle,
        status: "in-progress",
        progress: 25,
        expectedRelease: "Q2 2026",
        color: "border-rose-200 bg-rose-50",
      },
      {
        name: "Agro Tourism",
        description: "Earn extra income by offering farm experiences",
        benefits: ["Additional revenue", "Promote your farm", "Education"],
        url: "/agro-tourism",
        icon: MapPin,
        status: "integrated",
        color: "border-rose-200 bg-rose-50",
      },
    ],
  },
]



export default function FeaturesPage() {
  const totalActive = featureCategories.length + additionalFeatures.length
  const totalPlanned = plannedFeatures.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-green-700 hover:text-green-800 hover:bg-green-100 mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Complete Platform Features</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Explore all available features and upcoming enhancements designed to maximize your farming success
          </p>
          
          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8 pt-6 border-t border-green-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalActive}</div>
              <div className="text-sm text-gray-600">Active Features Now</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalPlanned}</div>
              <div className="text-sm text-gray-600">Coming Soon</div>
            </div>
          </div>
        </div>

        {/* DEMO FLOW SECTION */}
        <div className="mb-16 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-green-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Guided Demo Tour</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow this recommended path to experience AgroGenix features: Start with soil analysis, get crop recommendations, check field health, receive weather alerts, and explore market opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
            {/* Step 1: Soil Analysis */}
            <div className="relative">
              <div className="bg-white rounded-xl p-4 border-2 border-yellow-300 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center font-bold text-yellow-700">1</div>
                  <h3 className="font-bold text-gray-900">Soil Analysis</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Analyze your soil NPK levels and get fertilizer tips</p>
                <Link href="/soil-analysis">
                  <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                    Analyze Soil
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block absolute -right-2 top-6">
                <div className="text-3xl text-gray-300">→</div>
              </div>
            </div>

            {/* Step 2: Crop Recommendations */}
            <div className="relative">
              <div className="bg-white rounded-xl p-4 border-2 border-green-300 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">2</div>
                  <h3 className="font-bold text-gray-900">Crop Advisor</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Get AI-powered crop recommendations based on your soil</p>
                <Link href="/crop-suggestions">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Get Suggestions
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block absolute -right-2 top-6">
                <div className="text-3xl text-gray-300">→</div>
              </div>
            </div>

            {/* Step 3: Drone Analytics */}
            <div className="relative">
              <div className="bg-white rounded-xl p-4 border-2 border-blue-300 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">3</div>
                  <h3 className="font-bold text-gray-900">Field Health</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Scan your field for disease and crop stress patterns</p>
                <Link href="/drone-analytics">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Analyze Field
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block absolute -right-2 top-6">
                <div className="text-3xl text-gray-300">→</div>
              </div>
            </div>

            {/* Step 4: Weather Alerts */}
            <div className="relative">
              <div className="bg-white rounded-xl p-4 border-2 border-cyan-300 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center font-bold text-cyan-700">4</div>
                  <h3 className="font-bold text-gray-900">Weather</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Get weather forecasts and critical weather alerts</p>
                <Link href="/weather/alerts">
                  <Button size="sm" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                    View Alerts
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block absolute -right-2 top-6">
                <div className="text-3xl text-gray-300">→</div>
              </div>
            </div>

            {/* Step 5: Market Analysis */}
            <div className="relative">
              <div className="bg-white rounded-xl p-4 border-2 border-orange-300 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-700">5</div>
                  <h3 className="font-bold text-gray-900">Market</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Find best prices and connect with buyers directly</p>
                <Link href="/market-analysis">
                  <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    View Prices
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: CORE 8 FEATURES */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Core Platform Features</h2>
            <p className="text-gray-600">Essential tools for soil analysis, crop selection, monitoring, and market access</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCategories.map((category) => (
              <Link key={category.name} href={category.url}>
                <div className="h-full group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300">
                  <div className={`h-24 bg-gradient-to-br ${category.bgColor}`} />
                  <div className="px-6 pb-5 relative -mt-12 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`${category.iconBg} p-4 rounded-xl shadow-md`}>
                        <category.icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-lg">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                    <ul className="space-y-2">
                      {category.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full ${category.buttonColor} text-white font-semibold py-2.5 rounded-lg transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2`}>
                      Explore
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 2: ADDITIONAL ACTIVE FEATURES */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Additional Active Features</h2>
            <p className="text-gray-600">Expanded tools for farming optimization, finance, and community engagement</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {additionalFeatures.map((feature) => (
              <Link key={feature.name} href={feature.url}>
                <div className="h-full group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300">
                  <div className={`h-20 bg-gradient-to-br ${feature.bgColor}`} />
                  <div className="px-5 pb-4 relative -mt-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`${feature.iconBg} p-3 rounded-lg shadow-md`}>
                        <feature.icon className="w-5 h-5 text-gray-700" />
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">Active</Badge>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900">{feature.name}</h3>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                    <ul className="space-y-1">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-xs text-gray-700">
                          <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full ${feature.buttonColor} text-white font-semibold py-2 rounded-lg transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2 text-sm`}>
                      Explore
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 3: PLANNED FEATURES */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Planned Features</h2>
            <p className="text-gray-600">Exciting enhancements currently in development - coming to the platform soon</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {plannedFeatures.map((feature) => (
              <div key={feature.name} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className={`h-20 bg-gradient-to-br ${feature.bgColor}`} />
                <div className="px-5 pb-4 relative -mt-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`${feature.iconBg} p-3 rounded-lg shadow-md`}>
                      <feature.icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">Coming Soon</Badge>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900">{feature.name}</h3>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                  <ul className="space-y-1">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3 h-3 text-blue-600 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Development Progress</span>
                      <span className="text-blue-600 font-semibold">{feature.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${feature.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Available: {feature.expectedRelease}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-16 pt-8 border-t border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Active Features
              </h3>
              <p className="text-sm text-gray-600">
                All features marked with green "Active" badges are available now and ready to use on the AgroGenix platform
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Coming Soon
              </h3>
              <p className="text-sm text-gray-600">
                Features with progress bars are under active development. Track their progress and get notified when they launch
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                User Impact
              </h3>
              <p className="text-sm text-gray-600">
                Click any feature to explore detailed documentation, usage guides, and real-world examples
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
