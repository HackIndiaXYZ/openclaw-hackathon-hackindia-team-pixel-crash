"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Wifi, Clock, ArrowLeft, Cpu, Thermometer, Calendar } from "lucide-react"
import Link from "next/link"

export default function IoTIntegrationPage() {
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
          <Wifi className="w-16 h-16 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">IoT Device Integration</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect and manage smart farming devices and sensors for automated monitoring and control
        </p>

        <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="w-3 h-3 mr-1" />
          In Development - 30% Complete
        </Badge>
      </div>

      {/* Development Progress */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Development Progress
          </CardTitle>
          <CardDescription>Current status and expected completion timeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>30%</span>
            </div>
            <Progress value={30} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="font-medium">Expected Release</span>
              </div>
              <p className="text-sm text-gray-600">Q4 2024</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-red-600" />
                <span className="font-medium">Sensor Protocols</span>
              </div>
              <p className="text-sm text-gray-600">40% Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Smart Sensors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Connect soil moisture, temperature, humidity, and pH sensors for real-time monitoring of field conditions
              and crop health.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Automated Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Integrate with irrigation systems, greenhouse controls, and other automated equipment for intelligent
              farming operations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Advanced analytics and machine learning algorithms process sensor data to provide actionable insights and
              predictions.
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
                <div className="font-medium">Protocol Research</div>
                <div className="text-sm text-gray-600">Researched IoT protocols and device compatibility</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Device Communication Layer</div>
                <div className="text-sm text-gray-600">Building communication protocols for various IoT devices</div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                In Progress
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Dashboard Development</div>
                <div className="text-sm text-gray-600">Real-time monitoring and control interface</div>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                Upcoming
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Field Testing</div>
                <div className="text-sm text-gray-600">Testing with various IoT devices and sensors</div>
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
