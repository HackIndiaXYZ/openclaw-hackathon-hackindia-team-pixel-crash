"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import {
  AlertTriangle,
  CloudRain,
  Wind,
  Thermometer,
  Zap,
  Snowflake,
  Sun,
  Bell,
  Settings,
  MapPin,
  Clock,
  RefreshCw,
  Loader2,
  Search,
  Navigation,
} from "lucide-react"

interface WeatherAlert {
  id: string
  title: string
  description: string
  severity: "advisory" | "watch" | "warning" | "emergency"
  type: "temperature" | "precipitation" | "wind" | "storm" | "uv" | "frost"
  startTime: string
  endTime: string
  affectedAreas: string[]
  instructions: string[]
  isActive: boolean
  location: string
}

interface NotificationSettings {
  pushNotifications: boolean
  smsAlerts: boolean
  emailAlerts: boolean
  severityLevels: {
    advisory: boolean
    watch: boolean
    warning: boolean
    emergency: boolean
  }
}

const alertIcons = {
  temperature: Thermometer,
  precipitation: CloudRain,
  wind: Wind,
  storm: Zap,
  uv: Sun,
  frost: Snowflake,
}

const severityConfig = {
  advisory: {
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  watch: {
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  warning: {
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  emergency: {
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
}

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
]

const majorCities = [
  "New Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Ahmedabad",
  "Surat",
  "Indore",
  "Bhopal",
  "Patna",
  "Kochi",
]

export default function WeatherAlertsPage() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState("New Delhi, Delhi")
  const [selectedState, setSelectedState] = useState("Delhi")
  const [selectedCity, setSelectedCity] = useState("New Delhi")
  const [customLocation, setCustomLocation] = useState("")
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    smsAlerts: false,
    emailAlerts: true,
    severityLevels: {
      advisory: true,
      watch: true,
      warning: true,
      emergency: true,
    },
  })

  const generateMockAlerts = (location: string): WeatherAlert[] => {
    const alertTypes = ["temperature", "precipitation", "wind", "storm", "uv", "frost"] as const
    const severities = ["advisory", "watch", "warning", "emergency"] as const

    const mockAlerts: WeatherAlert[] = [
      {
        id: "1",
        title: "Heavy Rainfall Warning",
        description: "Heavy rainfall expected with accumulations of 50-75mm over 6 hours",
        severity: "warning",
        type: "precipitation",
        startTime: "2024-01-15T14:00:00Z",
        endTime: "2024-01-15T20:00:00Z",
        affectedAreas: [location, "Surrounding areas"],
        instructions: [
          "Avoid outdoor activities during peak rainfall",
          "Ensure proper drainage in fields",
          "Postpone spraying operations",
          "Secure loose farm equipment",
        ],
        isActive: true,
        location: location,
      },
      {
        id: "2",
        title: "High Wind Advisory",
        description: "Sustained winds of 25-35 km/h with gusts up to 50 km/h expected",
        severity: "advisory",
        type: "wind",
        startTime: "2024-01-16T06:00:00Z",
        endTime: "2024-01-16T18:00:00Z",
        affectedAreas: [location, "Adjacent districts"],
        instructions: [
          "Secure greenhouse structures",
          "Avoid aerial spraying operations",
          "Monitor tall crops for damage",
          "Ensure livestock shelter is secure",
        ],
        isActive: false,
        location: location,
      },
      {
        id: "3",
        title: "Extreme Heat Warning",
        description: "Temperatures expected to reach 45°C with heat index values up to 50°C",
        severity: "emergency",
        type: "temperature",
        startTime: "2024-01-17T10:00:00Z",
        endTime: "2024-01-17T18:00:00Z",
        affectedAreas: [location, "Regional area"],
        instructions: [
          "Increase irrigation frequency",
          "Provide shade for livestock",
          "Avoid midday field work",
          "Monitor crops for heat stress",
          "Ensure adequate water supply",
        ],
        isActive: false,
        location: location,
      },
    ]

    return mockAlerts
  }

  const fetchAlerts = async (location: string) => {
    try {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockAlerts = generateMockAlerts(location)
      setAlerts(mockAlerts)

      toast({
        title: "Alerts Updated",
        description: `Weather alerts loaded for ${location}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch weather alerts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts(selectedLocation)
  }, [selectedLocation])

  const handleLocationChange = (type: "state" | "city" | "custom", value: string) => {
    if (type === "state") {
      setSelectedState(value)
      setSelectedLocation(`${value}, India`)
    } else if (type === "city") {
      setSelectedCity(value)
      setSelectedLocation(`${value}, ${selectedState}`)
    } else if (type === "custom") {
      setSelectedLocation(value)
    }
  }

  const handleCustomLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customLocation.trim()) {
      handleLocationChange("custom", customLocation.trim())
    }
  }

  const detectCurrentLocation = async () => {
    setIsDetectingLocation(true)

    if (!navigator.geolocation) {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      })
      setIsDetectingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Simulate reverse geocoding
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const detectedLocation = "New Delhi, Delhi"
          setSelectedLocation(detectedLocation)
          setSelectedState("Delhi")
          setSelectedCity("New Delhi")

          toast({
            title: "Location Detected",
            description: `Alerts will be shown for: ${detectedLocation}`,
          })
        } catch (error) {
          toast({
            title: "Location Error",
            description: "Failed to get location details",
            variant: "destructive",
          })
        } finally {
          setIsDetectingLocation(false)
        }
      },
      (error) => {
        let errorMessage = "Failed to detect location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }

        toast({
          title: "Location Detection Failed",
          description: errorMessage,
          variant: "destructive",
        })
        setIsDetectingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  const updateNotificationSettings = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: value,
    }))

    toast({
      title: "Settings Updated",
      description: `${key.replace(/([A-Z])/g, " $1").toLowerCase()} ${value ? "enabled" : "disabled"}`,
    })
  }

  const updateSeveritySettings = (severity: keyof NotificationSettings["severityLevels"], value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      severityLevels: {
        ...prev.severityLevels,
        [severity]: value,
      },
    }))

    toast({
      title: "Alert Level Updated",
      description: `${severity} alerts ${value ? "enabled" : "disabled"}`,
    })
  }

  const activeAlerts = alerts.filter((alert) => alert.isActive)
  const upcomingAlerts = alerts.filter((alert) => !alert.isActive)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading weather alerts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Weather Alerts</h1>
          <p className="text-muted-foreground">Stay informed about weather conditions affecting your area</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => fetchAlerts(selectedLocation)} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Location Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Alert Location Settings
          </CardTitle>
          <CardDescription>Select the location for which you want to receive weather alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="font-medium">Current Alert Location:</span>
            <Badge variant="secondary">{selectedLocation}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Auto-detect Location */}
            <div className="space-y-2">
              <Label>Auto-Detect Location</Label>
              <Button
                onClick={detectCurrentLocation}
                disabled={isDetectingLocation}
                variant="outline"
                className="w-full bg-transparent"
              >
                {isDetectingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Navigation className="h-4 w-4 mr-2" />
                )}
                {isDetectingLocation ? "Detecting..." : "Detect Location"}
              </Button>
            </div>

            {/* State Selection */}
            <div className="space-y-2">
              <Label>Select State</Label>
              <Select value={selectedState} onValueChange={(value) => handleLocationChange("state", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose State" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Selection */}
            <div className="space-y-2">
              <Label>Select City</Label>
              <Select value={selectedCity} onValueChange={(value) => handleLocationChange("city", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose City" />
                </SelectTrigger>
                <SelectContent>
                  {majorCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Location Input */}
          <div className="space-y-2">
            <Label>Or Enter Custom Location</Label>
            <form onSubmit={handleCustomLocationSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter city, state, or area name..."
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{activeAlerts.length}</div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{upcomingAlerts.length}</div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{notificationSettings.pushNotifications ? "ON" : "OFF"}</div>
                <div className="text-sm text-muted-foreground">Notifications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{selectedLocation.split(",")[0]}</div>
                <div className="text-sm text-muted-foreground">Alert Area</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Alerts ({activeAlerts.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingAlerts.length})</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
                <p className="text-muted-foreground">
                  There are currently no active weather alerts for {selectedLocation}.
                </p>
              </CardContent>
            </Card>
          ) : (
            activeAlerts.map((alert) => {
              const AlertIcon = alertIcons[alert.type]
              const severityStyle = severityConfig[alert.severity]

              return (
                <Card key={alert.id} className={`${severityStyle.bgColor} ${severityStyle.borderColor} border-l-4 hover:shadow-lg transition-all`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`${severityStyle.color} text-white p-2.5 rounded-lg`}>
                          <AlertIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className={`text-lg ${severityStyle.textColor}`}>{alert.title}</CardTitle>
                          <CardDescription className={severityStyle.textColor}>{alert.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={`${severityStyle.color} text-white font-bold`}>{alert.severity.toUpperCase()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Start:</strong> {new Date(alert.startTime).toLocaleString()}
                      </div>
                      <div>
                        <strong>End:</strong> {new Date(alert.endTime).toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <strong className="text-sm">Affected Areas:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {alert.affectedAreas.map((area) => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong className="text-sm">Safety Instructions:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                        {alert.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Alerts</h3>
                <p className="text-muted-foreground">
                  There are no upcoming weather alerts scheduled for {selectedLocation}.
                </p>
              </CardContent>
            </Card>
          ) : (
            upcomingAlerts.map((alert) => {
              const AlertIcon = alertIcons[alert.type]
              const severityStyle = severityConfig[alert.severity]

              return (
                <Card key={alert.id} className={`${severityStyle.bgColor} ${severityStyle.borderColor} border-l-4`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <AlertIcon className="h-6 w-6" />
                        <div>
                          <CardTitle className="text-lg">{alert.title}</CardTitle>
                          <CardDescription>{alert.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className={severityStyle.textColor}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Expected Start:</strong> {new Date(alert.startTime).toLocaleString()}
                      </div>
                      <div>
                        <strong>Expected End:</strong> {new Date(alert.endTime).toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <strong className="text-sm">Will Affect:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {alert.affectedAreas.map((area) => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong className="text-sm">Preparation Instructions:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                        {alert.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you want to receive weather alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <div className="text-sm text-muted-foreground">Receive instant alerts on your device</div>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => updateNotificationSettings("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-alerts">SMS Alerts</Label>
                    <div className="text-sm text-muted-foreground">Get text messages for critical alerts</div>
                  </div>
                  <Switch
                    id="sms-alerts"
                    checked={notificationSettings.smsAlerts}
                    onCheckedChange={(checked) => updateNotificationSettings("smsAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <div className="text-sm text-muted-foreground">Receive detailed alerts via email</div>
                  </div>
                  <Switch
                    id="email-alerts"
                    checked={notificationSettings.emailAlerts}
                    onCheckedChange={(checked) => updateNotificationSettings("emailAlerts", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Severity Levels</CardTitle>
              <CardDescription>Choose which severity levels you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(severityConfig).map(([severity, config]) => (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${config.color}`}></div>
                    <div className="space-y-0.5">
                      <Label className="capitalize">{severity}</Label>
                      <div className="text-sm text-muted-foreground">
                        {severity === "advisory" && "General weather information and minor concerns"}
                        {severity === "watch" && "Conditions favorable for severe weather development"}
                        {severity === "warning" && "Severe weather is occurring or imminent"}
                        {severity === "emergency" && "Life-threatening weather conditions"}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={
                      notificationSettings.severityLevels[severity as keyof typeof notificationSettings.severityLevels]
                    }
                    onCheckedChange={(checked) =>
                      updateSeveritySettings(severity as keyof typeof notificationSettings.severityLevels, checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
