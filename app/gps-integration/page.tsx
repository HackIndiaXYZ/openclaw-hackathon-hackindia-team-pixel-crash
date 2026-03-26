"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  MapPin,
  Navigation,
  Target,
  Bookmark,
  Plus,
  Edit,
  Trash2,
  Download,
  Satellite,
  Route,
  Calculator,
  AlertCircle,
  CheckCircle,
  Compass,
  Home,
  Shield,
  Square,
} from "lucide-react"

// Types for GPS integration
interface Location {
  lat: number
  lng: number
}

interface GPSPoint {
  id: string
  name: string
  coordinates: Location
  type: "field" | "water" | "building" | "equipment" | "boundary" | "other"
  description?: string
  area?: number
  created: string
  lastVisited?: string
}

interface FieldBoundary {
  id: string
  name: string
  points: Location[]
  area: number
  crop?: string
  plantingDate?: string
  harvestDate?: string
  notes?: string
}

interface NavigationRoute {
  id: string
  name: string
  start: Location
  end: Location
  waypoints: Location[]
  distance: number
  estimatedTime: number
  purpose: string
  created: string
}

const pointTypes = [
  { value: "field", label: "Field/Plot", icon: "🌾" },
  { value: "water", label: "Water Source", icon: "💧" },
  { value: "building", label: "Building/Structure", icon: "🏠" },
  { value: "equipment", label: "Equipment Storage", icon: "🚜" },
  { value: "boundary", label: "Property Boundary", icon: "📍" },
  { value: "other", label: "Other", icon: "📌" },
]

// Mock data for demonstration
const mockGPSPoints: GPSPoint[] = [
  {
    id: "1",
    name: "North Field",
    coordinates: { lat: 28.6139, lng: 77.209 },
    type: "field",
    description: "Main wheat field - 5 acres",
    area: 5,
    created: "2024-01-15",
    lastVisited: "2024-03-10",
  },
  {
    id: "2",
    name: "Water Pump Station",
    coordinates: { lat: 28.6129, lng: 77.208 },
    type: "water",
    description: "Primary irrigation pump",
    created: "2024-01-20",
    lastVisited: "2024-03-05",
  },
  {
    id: "3",
    name: "Equipment Shed",
    coordinates: { lat: 28.6149, lng: 77.211 },
    type: "equipment",
    description: "Tractor and tools storage",
    created: "2024-02-01",
    lastVisited: "2024-03-08",
  },
]

const mockFieldBoundaries: FieldBoundary[] = [
  {
    id: "1",
    name: "North Field",
    points: [
      { lat: 28.6139, lng: 77.209 },
      { lat: 28.6149, lng: 77.209 },
      { lat: 28.6149, lng: 77.212 },
      { lat: 28.6139, lng: 77.212 },
    ],
    area: 5.2,
    crop: "Wheat",
    plantingDate: "2024-01-15",
    harvestDate: "2024-04-15",
    notes: "High-yield variety planted with drip irrigation",
  },
  {
    id: "2",
    name: "South Vegetable Plot",
    points: [
      { lat: 28.6129, lng: 77.207 },
      { lat: 28.6139, lng: 77.207 },
      { lat: 28.6139, lng: 77.209 },
      { lat: 28.6129, lng: 77.209 },
    ],
    area: 2.8,
    crop: "Mixed Vegetables",
    plantingDate: "2024-02-01",
    harvestDate: "2024-05-01",
    notes: "Tomatoes, peppers, and leafy greens",
  },
]

export default function GPSIntegrationPage() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [gpsPoints, setGpsPoints] = useState<GPSPoint[]>(mockGPSPoints)
  const [fieldBoundaries, setFieldBoundaries] = useState<FieldBoundary[]>(mockFieldBoundaries)
  const [selectedPoint, setSelectedPoint] = useState<GPSPoint | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [trackingPath, setTrackingPath] = useState<Location[]>([])
  const [activeTab, setActiveTab] = useState("map")

  // Form states
  const [newPointName, setNewPointName] = useState("")
  const [newPointType, setNewPointType] = useState<string>("")
  const [newPointDescription, setNewPointDescription] = useState("")
  const [newPointArea, setNewPointArea] = useState("")

  // Field mapping states
  const [mappingMode, setMappingMode] = useState(false)
  const [currentFieldPoints, setCurrentFieldPoints] = useState<Location[]>([])
  const [fieldName, setFieldName] = useState("")
  const [fieldCrop, setFieldCrop] = useState("")
  const [fieldNotes, setFieldNotes] = useState("")

  const watchId = useRef<number | null>(null)
  const { toast } = useToast()

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setCurrentLocation(location)
        setLocationError(null)
        toast({
          title: "Location Updated",
          description: `Current location: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
        })
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`)
        toast({
          title: "Location Error",
          description: error.message,
          variant: "destructive",
        })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }, [toast])

  // Start location tracking
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "GPS Not Available",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      })
      return
    }

    setIsTracking(true)
    setTrackingPath([])

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setCurrentLocation(location)
        setTrackingPath((prev) => [...prev, location])
      },
      (error) => {
        setLocationError(`Tracking error: ${error.message}`)
        setIsTracking(false)
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 },
    )
  }, [toast])

  // Stop location tracking
  const stopTracking = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
    setIsTracking(false)
    toast({
      title: "Tracking Stopped",
      description: `Tracked ${trackingPath.length} points`,
    })
  }, [trackingPath.length, toast])

  // Add a new GPS point
  const addGPSPoint = () => {
    if (!currentLocation) {
      toast({
        title: "Location Required",
        description: "Please get your current location first",
        variant: "destructive",
      })
      return
    }

    if (!newPointName || !newPointType) {
      toast({
        title: "Missing Information",
        description: "Please fill in point name and type",
        variant: "destructive",
      })
      return
    }

    const newPoint: GPSPoint = {
      id: Date.now().toString(),
      name: newPointName,
      coordinates: currentLocation,
      type: newPointType as GPSPoint["type"],
      description: newPointDescription,
      area: newPointArea ? Number.parseFloat(newPointArea) : undefined,
      created: new Date().toISOString().split("T")[0],
    }

    setGpsPoints([...gpsPoints, newPoint])

    // Reset form
    setNewPointName("")
    setNewPointType("")
    setNewPointDescription("")
    setNewPointArea("")

    toast({
      title: "Point Added",
      description: `${newPoint.name} has been added to your GPS points`,
    })
  }

  // Delete a GPS point
  const deleteGPSPoint = (id: string) => {
    setGpsPoints(gpsPoints.filter((point) => point.id !== id))
    toast({
      title: "Point Deleted",
      description: "GPS point has been removed",
    })
  }

  // Start field mapping mode
  const startFieldMapping = () => {
    if (!currentLocation) {
      toast({
        title: "Location Required",
        description: "Please get your current location first",
        variant: "destructive",
      })
      return
    }

    setMappingMode(true)
    setCurrentFieldPoints([currentLocation])
    toast({
      title: "Field Mapping Started",
      description: "Walk around the field boundary and click 'Add Point' at each corner",
    })
  }

  // Add point to current field mapping
  const addFieldPoint = () => {
    if (!currentLocation) return

    setCurrentFieldPoints([...currentFieldPoints, currentLocation])
    toast({
      title: "Boundary Point Added",
      description: `Point ${currentFieldPoints.length + 1} added`,
    })
  }

  // Complete field mapping
  const completeFieldMapping = () => {
    if (currentFieldPoints.length < 3) {
      toast({
        title: "Insufficient Points",
        description: "A field boundary needs at least 3 points",
        variant: "destructive",
      })
      return
    }

    if (!fieldName) {
      toast({
        title: "Field Name Required",
        description: "Please enter a name for this field",
        variant: "destructive",
      })
      return
    }

    // Calculate approximate area (simplified polygon area calculation)
    const area = calculatePolygonArea(currentFieldPoints)

    const newField: FieldBoundary = {
      id: Date.now().toString(),
      name: fieldName,
      points: currentFieldPoints,
      area: area,
      crop: fieldCrop,
      notes: fieldNotes,
    }

    setFieldBoundaries([...fieldBoundaries, newField])

    // Reset mapping state
    setMappingMode(false)
    setCurrentFieldPoints([])
    setFieldName("")
    setFieldCrop("")
    setFieldNotes("")

    toast({
      title: "Field Mapped Successfully",
      description: `${newField.name} (${area.toFixed(2)} acres) has been added`,
    })
  }

  // Calculate polygon area (simplified Shoelace formula)
  const calculatePolygonArea = (points: Location[]): number => {
    if (points.length < 3) return 0

    let area = 0
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length
      area += points[i].lat * points[j].lng
      area -= points[j].lat * points[i].lng
    }

    area = Math.abs(area) / 2

    // Convert from degrees² to acres (very rough approximation)
    // This should use proper geodetic calculations in production
    return area * 247.105 // 1 degree² ≈ 247.105 acres at equator
  }

  // Calculate distance between two points
  const calculateDistance = (point1: Location, point2: Location): number => {
    const R = 6371000 // Earth's radius in meters
    const φ1 = (point1.lat * Math.PI) / 180
    const φ2 = (point2.lat * Math.PI) / 180
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  // Export GPS data
  const exportGPSData = () => {
    const data = {
      points: gpsPoints,
      fields: fieldBoundaries,
      exported: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `farm-gps-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Data Exported",
      description: "GPS data has been downloaded as JSON file",
    })
  }

  // Initialize location on component mount
  useEffect(() => {
    getCurrentLocation()
  }, [getCurrentLocation])

  // Cleanup tracking on unmount
  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current)
      }
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">GPS Integration</h1>
          <p className="text-muted-foreground mt-2">
            Advanced GPS mapping and navigation tools for your farm management
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={getCurrentLocation} variant="outline">
            <Target className="h-4 w-4 mr-2" />
            Get Location
          </Button>
          <Button onClick={exportGPSData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Current Location Display */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Location</p>
                {currentLocation ? (
                  <p className="font-mono text-sm">
                    {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </p>
                ) : (
                  <p className="text-sm text-red-600">Location not available</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Satellite className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GPS Status</p>
                <div className="flex items-center gap-1">
                  {isTracking ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-sm font-medium text-green-600">Active</p>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <p className="text-sm text-gray-600">Standby</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <Route className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tracking Points</p>
                <p className="font-semibold">{trackingPath.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <Bookmark className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saved Points</p>
                <p className="font-semibold">{gpsPoints.length}</p>
              </div>
            </div>
          </div>

          {locationError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-700">{locationError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="points" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            GPS Points
          </TabsTrigger>
          <TabsTrigger value="fields" className="flex items-center gap-2">
            <Compass className="h-4 w-4" />
            Field Mapping
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Path Tracking
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Navigation
          </TabsTrigger>
        </TabsList>

        {/* Map View Tab */}
        <TabsContent value="map">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Farm Map</CardTitle>
                <CardDescription>Interactive map showing your GPS points and field boundaries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Satellite className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500 mt-2">
                      In production, this would show an interactive map with your GPS points and field boundaries
                    </p>
                    {currentLocation && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium">Current Location:</p>
                        <p className="font-mono text-sm">
                          {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={getCurrentLocation} className="w-full bg-transparent" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Update Location
                  </Button>
                  <Button
                    onClick={isTracking ? stopTracking : startTracking}
                    className="w-full"
                    variant={isTracking ? "destructive" : "default"}
                  >
                    {isTracking ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Stop Tracking
                      </>
                    ) : (
                      <>
                        <Route className="h-4 w-4 mr-2" />
                        Start Tracking
                      </>
                    )}
                  </Button>
                  <Button onClick={startFieldMapping} className="w-full bg-transparent" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Map New Field
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Points */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gpsPoints.slice(-3).map((point) => {
                      const typeInfo = pointTypes.find((t) => t.value === point.type)
                      return (
                        <div key={point.id} className="flex items-center gap-3 p-2 border rounded-lg">
                          <span className="text-lg">{typeInfo?.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{point.name}</p>
                            <p className="text-xs text-muted-foreground">{typeInfo?.label}</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedPoint(point)}>
                            <MapPin className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* GPS Points Tab */}
        <TabsContent value="points">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>GPS Points</CardTitle>
                <CardDescription>Manage your saved GPS points and locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gpsPoints.map((point) => {
                    const typeInfo = pointTypes.find((t) => t.value === point.type)
                    const distance = currentLocation ? calculateDistance(currentLocation, point.coordinates) : 0

                    return (
                      <div key={point.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{typeInfo?.icon}</span>
                            <div>
                              <h3 className="font-semibold">{point.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {typeInfo?.label}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => setSelectedPoint(point)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => deleteGPSPoint(point.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Coordinates</p>
                            <p className="font-mono">
                              {point.coordinates.lat.toFixed(6)}, {point.coordinates.lng.toFixed(6)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Distance</p>
                            <p>{distance > 1000 ? `${(distance / 1000).toFixed(2)} km` : `${distance.toFixed(0)} m`}</p>
                          </div>
                          {point.area && (
                            <div>
                              <p className="text-muted-foreground">Area</p>
                              <p>{point.area} acres</p>
                            </div>
                          )}
                          <div>
                            <p className="text-muted-foreground">Created</p>
                            <p>{point.created}</p>
                          </div>
                        </div>

                        {point.description && <p className="text-sm text-muted-foreground mt-3">{point.description}</p>}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add GPS Point</CardTitle>
                <CardDescription>Save your current location as a GPS point</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pointName">Point Name *</Label>
                  <Input
                    id="pointName"
                    value={newPointName}
                    onChange={(e) => setNewPointName(e.target.value)}
                    placeholder="Enter point name"
                  />
                </div>

                <div>
                  <Label htmlFor="pointType">Point Type *</Label>
                  <Select value={newPointType} onValueChange={setNewPointType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select point type" />
                    </SelectTrigger>
                    <SelectContent>
                      {pointTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pointDescription">Description</Label>
                  <Textarea
                    id="pointDescription"
                    value={newPointDescription}
                    onChange={(e) => setNewPointDescription(e.target.value)}
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="pointArea">Area (acres)</Label>
                  <Input
                    id="pointArea"
                    type="number"
                    step="0.1"
                    value={newPointArea}
                    onChange={(e) => setNewPointArea(e.target.value)}
                    placeholder="Optional area size"
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Current Location:</div>
                  {currentLocation ? (
                    <div className="font-mono text-xs bg-gray-50 p-2 rounded">
                      {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                    </div>
                  ) : (
                    <div className="text-sm text-red-600">Location not available</div>
                  )}
                </div>

                <Button onClick={addGPSPoint} disabled={!currentLocation} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Point
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Field Mapping Tab */}
        <TabsContent value="fields">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Field Boundaries</CardTitle>
                <CardDescription>Map and manage your field boundaries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fieldBoundaries.map((field) => (
                    <div key={field.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{field.name}</h3>
                          <p className="text-sm text-muted-foreground">{field.area.toFixed(2)} acres</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground">Crop</p>
                          <p>{field.crop || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Boundary Points</p>
                          <p>{field.points.length} points</p>
                        </div>
                        {field.plantingDate && (
                          <div>
                            <p className="text-muted-foreground">Planting Date</p>
                            <p>{field.plantingDate}</p>
                          </div>
                        )}
                        {field.harvestDate && (
                          <div>
                            <p className="text-muted-foreground">Harvest Date</p>
                            <p>{field.harvestDate}</p>
                          </div>
                        )}
                      </div>

                      {field.notes && <p className="text-sm text-muted-foreground">{field.notes}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{mappingMode ? "Field Mapping in Progress" : "Map New Field"}</CardTitle>
                <CardDescription>
                  {mappingMode
                    ? "Walk around the field boundary and add points at each corner"
                    : "Start mapping a new field boundary"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mappingMode ? (
                  <>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <p className="text-sm font-medium text-blue-700">Mapping Active</p>
                      </div>
                      <p className="text-xs text-blue-600">Points recorded: {currentFieldPoints.length}</p>
                    </div>

                    <div>
                      <Label htmlFor="fieldName">Field Name *</Label>
                      <Input
                        id="fieldName"
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        placeholder="Enter field name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fieldCrop">Crop Type</Label>
                      <Input
                        id="fieldCrop"
                        value={fieldCrop}
                        onChange={(e) => setFieldCrop(e.target.value)}
                        placeholder="What crop is planted here?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fieldNotes">Notes</Label>
                      <Textarea
                        id="fieldNotes"
                        value={fieldNotes}
                        onChange={(e) => setFieldNotes(e.target.value)}
                        placeholder="Field notes and observations"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={addFieldPoint} className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Point
                      </Button>
                      <Button onClick={completeFieldMapping} variant="default" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    </div>

                    <Button
                      onClick={() => {
                        setMappingMode(false)
                        setCurrentFieldPoints([])
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Cancel Mapping
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center py-6">
                      <Compass className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Walk to the first corner of your field and start mapping
                      </p>
                      <Button onClick={startFieldMapping} disabled={!currentLocation}>
                        <Target className="h-4 w-4 mr-2" />
                        Start Mapping
                      </Button>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-xs text-yellow-700">
                        💡 <strong>Tip:</strong> For best results, walk slowly around the field boundary and add a point
                        at each corner or direction change.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Path Tracking Tab */}
        <TabsContent value="tracking">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Path Tracking</CardTitle>
                <CardDescription>Track your movement across the farm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Real-time Tracking</p>
                      <p className="text-sm text-muted-foreground">
                        {isTracking ? "Currently tracking your path" : "Tracking is stopped"}
                      </p>
                    </div>
                    <Switch checked={isTracking} onCheckedChange={setIsTracking} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 border rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{trackingPath.length}</p>
                      <p className="text-xs text-muted-foreground">Points Tracked</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {trackingPath.length > 1
                          ? (
                              trackingPath.reduce((total, point, index) => {
                                if (index === 0) return 0
                                return total + calculateDistance(trackingPath[index - 1], point)
                              }, 0) / 1000
                            ).toFixed(2)
                          : "0.00"}
                      </p>
                      <p className="text-xs text-muted-foreground">Distance (km)</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {isTracking && trackingPath.length > 0
                          ? Math.floor((Date.now() - new Date(trackingPath[0].toString()).getTime()) / 60000)
                          : 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Duration (min)</p>
                    </div>
                  </div>

                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Route className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Path Visualization</p>
                      <p className="text-xs text-gray-500">
                        Your tracked path would be displayed here on an interactive map
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tracking Frequency</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (every 10s)</SelectItem>
                      <SelectItem value="medium">Medium (every 5s)</SelectItem>
                      <SelectItem value="high">High (every 1s)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Auto-save Tracks</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Save tracks automatically</span>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export Current Track
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Track Data
                  </Button>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-700">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    Track data is stored locally and can be exported for analysis
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Navigation & Routing</CardTitle>
                <CardDescription>Navigate to your GPS points and plan routes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Quick Navigation */}
                  <div>
                    <h3 className="font-semibold mb-3">Quick Navigation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {gpsPoints.slice(0, 6).map((point) => {
                        const typeInfo = pointTypes.find((t) => t.value === point.type)
                        const distance = currentLocation ? calculateDistance(currentLocation, point.coordinates) : 0

                        return (
                          <div key={point.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{typeInfo?.icon}</span>
                              <div>
                                <p className="font-medium text-sm">{point.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {distance > 1000 ? `${(distance / 1000).toFixed(1)} km` : `${distance.toFixed(0)} m`}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Navigation className="h-3 w-3 mr-1" />
                              Navigate
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Route Planning */}
                  <div>
                    <h3 className="font-semibold mb-3">Route Planning</h3>
                    <div className="border rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Start: Current Location</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                            <SelectContent>
                              {gpsPoints.map((point) => (
                                <SelectItem key={point.id} value={point.id}>
                                  {pointTypes.find((t) => t.value === point.type)?.icon} {point.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1">
                          <Route className="h-4 w-4 mr-2" />
                          Plan Route
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Waypoint
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Navigation Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Navigation Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Compass className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No active navigation</p>
                    <p className="text-xs text-gray-500 mt-2">Select a destination to start navigation</p>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Tools */}
              <Card>
                <CardHeader>
                  <CardTitle>Navigation Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="flex-col h-16 bg-transparent">
                      <Calculator className="h-4 w-4 mb-1" />
                      <span className="text-xs">Area Calc</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-col h-16 bg-transparent">
                      <Route className="h-4 w-4 mb-1" />
                      <span className="text-xs">Distance</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-col h-16 bg-transparent">
                      <Compass className="h-4 w-4 mb-1" />
                      <span className="text-xs">Bearing</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-col h-16 bg-transparent">
                      <Target className="h-4 w-4 mb-1" />
                      <span className="text-xs">Surveying</span>
                    </Button>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Accuracy:</span>
                        <span className="text-green-600 font-medium">±3m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Satellites:</span>
                        <span className="font-medium">12 connected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Signal:</span>
                        <span className="text-green-600 font-medium">Strong</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-600" />
                    Emergency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="destructive" className="w-full">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Emergency SOS
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <MapPin className="h-4 w-4 mr-2" />
                    Share Location
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Emergency features will share your location with emergency contacts
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
