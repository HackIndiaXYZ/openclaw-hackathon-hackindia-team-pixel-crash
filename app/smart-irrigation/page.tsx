"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Droplets,
  Thermometer,
  Gauge,
  Calendar,
  Zap,
  Leaf,
  BarChart3,
  Settings,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react"

export default function SmartIrrigationPage() {
  const [isSystemActive, setIsSystemActive] = useState(true)
  const [selectedZone, setSelectedZone] = useState("zone1")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-blue-100 text-blue-700">Smart Irrigation System</Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Intelligent Water Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Optimize water usage with AI-powered irrigation control that adapts to weather, soil conditions, and crop
            needs
          </p>
        </div>

        {/* System Status */}
        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-6 w-6 text-blue-500" />
                System Status
              </CardTitle>
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    isSystemActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${isSystemActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                  ></div>
                  {isSystemActive ? "Active" : "Inactive"}
                </div>
                <Button
                  onClick={() => setIsSystemActive(!isSystemActive)}
                  variant={isSystemActive ? "destructive" : "default"}
                  size="sm"
                >
                  {isSystemActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isSystemActive ? "Stop" : "Start"} System
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {systemStats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm border">
                  <div className="flex justify-center mb-2">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="zones">Zone Control</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-orange-500" />
                    Current Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentConditions.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <condition.icon className={`h-5 w-5 ${condition.color}`} />
                        <span className="font-medium">{condition.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{condition.value}</div>
                        <div className="text-sm text-gray-500">{condition.status}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Water Usage Today */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Water Usage Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">2,450L</div>
                      <div className="text-sm text-gray-500">Total water used</div>
                    </div>
                    <Progress value={65} className="h-3" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>65% of daily target</span>
                      <span>Target: 3,800L</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">15%</div>
                        <div className="text-sm text-gray-600">Water Saved</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">₹245</div>
                        <div className="text-sm text-gray-600">Cost Today</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                      <div className="flex-1">
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-gray-500">
                          {activity.zone} • {activity.time}
                        </div>
                      </div>
                      <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zones" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {irrigationZones.map((zone) => (
                <Card
                  key={zone.id}
                  className={`cursor-pointer transition-all ${selectedZone === zone.id ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setSelectedZone(zone.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{zone.name}</span>
                      <Badge variant={zone.status === "active" ? "default" : "secondary"}>{zone.status}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Soil Moisture</span>
                        <span className="font-medium">{zone.soilMoisture}%</span>
                      </div>
                      <Progress value={zone.soilMoisture} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Watered</span>
                        <span>{zone.lastWatered}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Next Schedule</span>
                        <span>{zone.nextSchedule}</span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        variant={zone.status === "active" ? "destructive" : "default"}
                      >
                        {zone.status === "active" ? "Stop Irrigation" : "Start Irrigation"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  Irrigation Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduleData.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-bold">{schedule.time}</div>
                          <div className="text-sm text-gray-500">{schedule.day}</div>
                        </div>
                        <div>
                          <div className="font-medium">{schedule.zone}</div>
                          <div className="text-sm text-gray-500">{schedule.duration} minutes</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={schedule.enabled ? "default" : "secondary"}>
                          {schedule.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Water Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">92%</div>
                      <div className="text-sm text-gray-500">Efficiency Score</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Water Saved This Month</span>
                        <span className="font-bold text-green-600">4,250L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost Savings</span>
                        <span className="font-bold text-green-600">₹1,275</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Crop Yield Improvement</span>
                        <span className="font-bold text-green-600">+18%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="font-medium text-yellow-800">{rec.title}</div>
                        <div className="text-sm text-yellow-700">{rec.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Data
const systemStats = [
  { icon: Droplets, value: "2,450L", label: "Water Used Today", color: "text-blue-500" },
  { icon: Zap, value: "92%", label: "System Efficiency", color: "text-green-500" },
  { icon: Thermometer, value: "28°C", label: "Avg Temperature", color: "text-orange-500" },
  { icon: Gauge, value: "65%", label: "Soil Moisture", color: "text-purple-500" },
]

const currentConditions = [
  { icon: Thermometer, label: "Temperature", value: "28°C", status: "Optimal", color: "text-orange-500" },
  { icon: Droplets, label: "Humidity", value: "72%", status: "Good", color: "text-blue-500" },
  { icon: Gauge, label: "Soil Moisture", value: "65%", status: "Adequate", color: "text-green-500" },
  { icon: Leaf, label: "Plant Health", value: "95%", status: "Excellent", color: "text-green-600" },
]

const recentActivities = [
  {
    icon: CheckCircle,
    action: "Irrigation completed",
    zone: "Zone A",
    time: "2 hours ago",
    status: "completed",
    color: "text-green-500",
  },
  {
    icon: Play,
    action: "Irrigation started",
    zone: "Zone B",
    time: "30 minutes ago",
    status: "active",
    color: "text-blue-500",
  },
  {
    icon: AlertTriangle,
    action: "Low soil moisture detected",
    zone: "Zone C",
    time: "1 hour ago",
    status: "alert",
    color: "text-yellow-500",
  },
  {
    icon: Settings,
    action: "Schedule updated",
    zone: "Zone A",
    time: "3 hours ago",
    status: "completed",
    color: "text-gray-500",
  },
]

const irrigationZones = [
  {
    id: "zone1",
    name: "Zone A - Tomatoes",
    status: "active",
    soilMoisture: 65,
    lastWatered: "2 hours ago",
    nextSchedule: "Tomorrow 6:00 AM",
  },
  {
    id: "zone2",
    name: "Zone B - Peppers",
    status: "inactive",
    soilMoisture: 45,
    lastWatered: "6 hours ago",
    nextSchedule: "Today 6:00 PM",
  },
  {
    id: "zone3",
    name: "Zone C - Lettuce",
    status: "inactive",
    soilMoisture: 35,
    lastWatered: "8 hours ago",
    nextSchedule: "Today 4:00 PM",
  },
  {
    id: "zone4",
    name: "Zone D - Herbs",
    status: "inactive",
    soilMoisture: 55,
    lastWatered: "4 hours ago",
    nextSchedule: "Tomorrow 8:00 AM",
  },
]

const scheduleData = [
  { time: "6:00 AM", day: "Daily", zone: "Zone A - Tomatoes", duration: 15, enabled: true },
  { time: "6:00 PM", day: "Daily", zone: "Zone B - Peppers", duration: 20, enabled: true },
  { time: "7:00 AM", day: "Mon, Wed, Fri", zone: "Zone C - Lettuce", duration: 10, enabled: true },
  { time: "8:00 AM", day: "Daily", zone: "Zone D - Herbs", duration: 8, enabled: false },
]

const recommendations = [
  {
    title: "Increase watering for Zone C",
    description: "Soil moisture is below optimal level. Consider increasing irrigation duration.",
  },
  { title: "Weather alert", description: "Rain expected tomorrow. Consider adjusting schedule to avoid overwatering." },
  { title: "Maintenance reminder", description: "Check drip emitters in Zone B for potential clogs." },
]
