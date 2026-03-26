"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Truck, Clock, ArrowLeft, MapPin, Package, Calendar } from "lucide-react"
import Link from "next/link"

export default function LogisticsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/features" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Link>
        </Button>
      </div>

      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Truck className="w-16 h-16 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Farm-to-Market Logistics</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Integrated supply chain and transportation management system for efficient farm-to-market delivery
        </p>

        <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="w-3 h-3 mr-1" />
          In Development - 60% Complete
        </Badge>
      </div>

      {/* Development Progress */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Development Progress
          </CardTitle>
          <CardDescription>Current status and expected completion timeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>60%</span>
            </div>
            <Progress value={60} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="font-medium">Expected Release</span>
              </div>
              <p className="text-sm text-gray-600">Q3 2024</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Route Optimization</span>
              </div>
              <p className="text-sm text-gray-600">70% Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transportation Network</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Connect with verified transporters and logistics partners for reliable and cost-effective delivery of
              agricultural products to markets.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Route Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              AI-powered route planning that considers traffic, weather, and delivery schedules to minimize
              transportation costs and delivery time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Real-time Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Track your shipments in real-time with GPS monitoring, delivery notifications, and automated updates to
              buyers and sellers.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Development Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Development Milestones</CardTitle>
          <CardDescription>Key achievements and upcoming targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Partner Network Establishment</div>
                <div className="text-sm text-gray-600">Partnerships with 25+ logistics providers established</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Route Optimization Engine</div>
                <div className="text-sm text-gray-600">Developing AI algorithms for optimal route planning</div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                In Progress
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Mobile Tracking App</div>
                <div className="text-sm text-gray-600">Real-time tracking interface for farmers and buyers</div>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                Upcoming
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Integration Testing</div>
                <div className="text-sm text-gray-600">End-to-end testing with pilot farmers and markets</div>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                Upcoming
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
