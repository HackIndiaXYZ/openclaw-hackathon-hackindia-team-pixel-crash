"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Bell, Clock, ArrowLeft, AlertTriangle, Smartphone, Calendar } from "lucide-react"
import Link from "next/link"

export default function WeatherAlertsPage() {
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
          <Bell className="w-16 h-16 text-yellow-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Live Weather Alerts</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Real-time weather warnings and emergency notifications to protect crops and livestock
        </p>

        <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="w-3 h-3 mr-1" />
          In Development - 45% Complete
        </Badge>
      </div>

      {/* Development Progress */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Development Progress
          </CardTitle>
          <CardDescription>Current status and expected completion timeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>45%</span>
            </div>
            <Progress value={45} className="h-3" />
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
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Notification System</span>
              </div>
              <p className="text-sm text-gray-600">50% Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Severe Weather Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Instant notifications for severe weather conditions including storms, hail, frost, and extreme
              temperatures that could damage crops.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Multi-Channel Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Receive alerts via SMS, email, push notifications, and in-app messages to ensure you never miss critical
              weather information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customizable Thresholds</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Set personalized alert thresholds based on your crops, location, and farming practices for relevant and
              actionable notifications.
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
                <div className="font-medium">Weather Data Integration</div>
                <div className="text-sm text-gray-600">Connected to multiple weather service providers</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Alert Logic Development</div>
                <div className="text-sm text-gray-600">Building intelligent alert algorithms and thresholds</div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                In Progress
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Notification Infrastructure</div>
                <div className="text-sm text-gray-600">SMS, email, and push notification systems</div>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                Upcoming
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">User Testing</div>
                <div className="text-sm text-gray-600">Testing alert accuracy and user experience</div>
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
