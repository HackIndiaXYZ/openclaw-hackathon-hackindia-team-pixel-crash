"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Calendar, Award, Tractor, Upload, X, Clock, IndianRupee, Leaf } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Types for farm registration
type FarmType = "Organic" | "Traditional" | "Hydroponic" | "Mixed"
type FarmSize = "Small (1-5 acres)" | "Medium (5-20 acres)" | "Large (20+ acres)"

type FarmRegistrationData = {
  basicInfo: {
    farmName: string
    farmType: FarmType | ""
    farmSize: FarmSize | ""
    location: {
      address: string
      city: string
      state: string
      pincode: string
    }
    description: string
  }
  activities: string[]
  facilities: string[]
  pricing: {
    basePrice: number
    groupDiscount: number
  }
  contact: {
    ownerName: string
    email: string
    phone: string
    alternatePhone: string
  }
  images: File[]
  availability: {
    daysOfWeek: string[]
    timeSlots: string[]
  }
  additionalInfo: {
    specialRequirements: string
    cancellationPolicy: string
    maxVisitors: number
  }
}

const initialFarmData: FarmRegistrationData = {
  basicInfo: {
    farmName: "",
    farmType: "",
    farmSize: "",
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
    description: "",
  },
  activities: [],
  facilities: [],
  pricing: {
    basePrice: 0,
    groupDiscount: 0,
  },
  contact: {
    ownerName: "",
    email: "",
    phone: "",
    alternatePhone: "",
  },
  images: [],
  availability: {
    daysOfWeek: [],
    timeSlots: [],
  },
  additionalInfo: {
    specialRequirements: "",
    cancellationPolicy: "",
    maxVisitors: 50,
  },
}

// Available options
const farmTypes: FarmType[] = ["Organic", "Traditional", "Hydroponic", "Mixed"]
const farmSizes: FarmSize[] = ["Small (1-5 acres)", "Medium (5-20 acres)", "Large (20+ acres)"]

const availableActivities = [
  "Crop harvesting",
  "Tractor rides",
  "Organic cooking class",
  "Animal feeding",
  "Farm photography tour",
  "Organic garden workshop",
  "Fruit picking",
  "Jam making workshop",
  "Orchard tours",
  "Fruit tasting",
  "Beekeeping demonstration",
  "Rice planting",
  "Water buffalo rides",
  "Traditional cooking",
  "Cultural performances",
  "Village walk",
  "Dairy farming experience",
  "Greenhouse tour",
  "Composting workshop",
  "Seed planting activity",
]

const availableFacilities = [
  "Parking",
  "Restrooms",
  "Dining area",
  "Gift shop",
  "First aid",
  "Wi-Fi",
  "Accommodation",
  "Transportation",
  "Guided tours",
  "Equipment rental",
  "Photography services",
  "Picnic area",
  "Children's play area",
  "Conference hall",
  "Organic store",
]

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const timeSlots = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
]

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
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [userProfile, setUserProfile] = useState({
    name: "Demo User",
    email: "demo@agrogenix.com",
    phone: "+91-9876543210",
    location: "Punjab, India",
    joinDate: "January 2024",
    totalBookings: 5,
    achievements: ["Early Adopter", "Farm Explorer", "Eco Warrior"],
  })
  const [farmData, setFarmData] = useState<FarmRegistrationData>(initialFarmData)
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("agro-genix-user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserProfile((prev) => ({
        ...prev,
        name: user.name || "Demo User",
        email: user.email || "demo@agrogenix.com",
      }))
    }
  }, [])

  // Handle basic info changes
  const handleBasicInfoChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFarmData((prev) => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          [parent]: {
            ...prev.basicInfo[parent as keyof typeof prev.basicInfo],
            [child]: value,
          },
        },
      }))
    } else {
      setFarmData((prev) => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          [field]: value,
        },
      }))
    }
  }

  // Handle activity selection
  const handleActivityToggle = (activity: string) => {
    setFarmData((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity],
    }))
  }

  // Handle facility selection
  const handleFacilityToggle = (facility: string) => {
    setFarmData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }))
  }

  // Handle pricing changes
  const handlePricingChange = (field: keyof FarmRegistrationData["pricing"], value: number) => {
    setFarmData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value,
      },
    }))
  }

  // Handle contact changes
  const handleContactChange = (field: keyof FarmRegistrationData["contact"], value: string) => {
    setFarmData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }))
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length + farmData.images.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 5 images.",
        variant: "destructive",
      })
      return
    }

    setFarmData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }))

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove image
  const removeImage = (index: number) => {
    setFarmData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setImagePreview((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle availability changes
  const handleDayToggle = (day: string) => {
    setFarmData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        daysOfWeek: prev.availability.daysOfWeek.includes(day)
          ? prev.availability.daysOfWeek.filter((d) => d !== day)
          : [...prev.availability.daysOfWeek, day],
      },
    }))
  }

  const handleTimeSlotToggle = (slot: string) => {
    setFarmData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: prev.availability.timeSlots.includes(slot)
          ? prev.availability.timeSlots.filter((s) => s !== slot)
          : [...prev.availability.timeSlots, slot],
      },
    }))
  }

  // Handle additional info changes
  const handleAdditionalInfoChange = (field: keyof FarmRegistrationData["additionalInfo"], value: string | number) => {
    setFarmData((prev) => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [field]: value,
      },
    }))
  }

  // Submit farm registration
  const handleFarmRegistration = async () => {
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!farmData.basicInfo.farmName || !farmData.basicInfo.farmType || !farmData.contact.ownerName) {
        throw new Error("Please fill in all required fields")
      }

      if (farmData.activities.length === 0) {
        throw new Error("Please select at least one activity")
      }

      if (farmData.availability.daysOfWeek.length === 0) {
        throw new Error("Please select available days")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Farm Registration Successful!",
        description:
          "Your farm has been registered successfully. It will be reviewed and activated within 24-48 hours.",
      })

      // Reset form
      setFarmData(initialFarmData)
      setImagePreview([])
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred during registration.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Profile</h1>
      <p className="text-muted-foreground mb-6">Manage your account and farm registration</p>

      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            My Bookings
          </TabsTrigger>
          <TabsTrigger value="register-farm" className="flex items-center gap-2">
            <Tractor className="h-4 w-4" />
            Register Farm
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile((prev) => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile((prev) => ({ ...prev, phone: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={userProfile.location}
                      onChange={(e) => setUserProfile((prev) => ({ ...prev, location: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button className="w-full md:w-auto">Update Profile</Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userProfile.achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="mr-2">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="text-sm font-medium">{userProfile.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total bookings</span>
                    <span className="text-sm font-medium">{userProfile.totalBookings}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* My Bookings Tab */}
        <TabsContent value="bookings" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your Bookings</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                View and manage your farm experience bookings. Go to the Agro Tourism page to see your complete booking
                history.
              </p>
              <Button onClick={() => (window.location.href = "/agro-tourism")}>View All Bookings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Register Farm Tab */}
        <TabsContent value="register-farm" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tractor className="h-5 w-5" />
                Register Your Farm for Tourism
              </CardTitle>
              <CardDescription>
                Join AGRO GENIX tourism network and turn your farm into a destination for agricultural experiences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="farmName">Farm Name *</Label>
                    <Input
                      id="farmName"
                      value={farmData.basicInfo.farmName}
                      onChange={(e) => handleBasicInfoChange("farmName", e.target.value)}
                      placeholder="Enter your farm name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="farmType">Farm Type *</Label>
                    <Select
                      value={farmData.basicInfo.farmType}
                      onValueChange={(value) => handleBasicInfoChange("farmType", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select farm type" />
                      </SelectTrigger>
                      <SelectContent>
                        {farmTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="farmSize">Farm Size</Label>
                    <Select
                      value={farmData.basicInfo.farmSize}
                      onValueChange={(value) => handleBasicInfoChange("farmSize", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select farm size" />
                      </SelectTrigger>
                      <SelectContent>
                        {farmSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maxVisitors">Maximum Visitors</Label>
                    <Input
                      id="maxVisitors"
                      type="number"
                      value={farmData.additionalInfo.maxVisitors}
                      onChange={(e) => handleAdditionalInfoChange("maxVisitors", Number.parseInt(e.target.value) || 0)}
                      placeholder="50"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Farm Description *</Label>
                  <Textarea
                    id="description"
                    value={farmData.basicInfo.description}
                    onChange={(e) => handleBasicInfoChange("description", e.target.value)}
                    placeholder="Describe your farm, its unique features, and what visitors can expect..."
                    className="mt-1"
                    rows={4}
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <h4 className="font-medium">Location Details</h4>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={farmData.basicInfo.location.address}
                      onChange={(e) => handleBasicInfoChange("location.address", e.target.value)}
                      placeholder="Enter complete address"
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={farmData.basicInfo.location.city}
                        onChange={(e) => handleBasicInfoChange("location.city", e.target.value)}
                        placeholder="City"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={farmData.basicInfo.location.state}
                        onValueChange={(value) => handleBasicInfoChange("location.state", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select state" />
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
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={farmData.basicInfo.location.pincode}
                        onChange={(e) => handleBasicInfoChange("location.pincode", e.target.value)}
                        placeholder="123456"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Activities & Facilities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Activities & Facilities</h3>

                <div>
                  <Label>Available Activities *</Label>
                  <p className="text-sm text-muted-foreground mb-3">Select activities you can offer to visitors</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableActivities.map((activity) => (
                      <div key={activity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`activity-${activity}`}
                          checked={farmData.activities.includes(activity)}
                          onCheckedChange={() => handleActivityToggle(activity)}
                        />
                        <Label htmlFor={`activity-${activity}`} className="text-sm cursor-pointer">
                          {activity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Available Facilities</Label>
                  <p className="text-sm text-muted-foreground mb-3">Select facilities available at your farm</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableFacilities.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox
                          id={`facility-${facility}`}
                          checked={farmData.facilities.includes(facility)}
                          onCheckedChange={() => handleFacilityToggle(facility)}
                        />
                        <Label htmlFor={`facility-${facility}`} className="text-sm cursor-pointer">
                          {facility}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <IndianRupee className="h-5 w-5" />
                  Pricing & Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="basePrice">Base Price per Person (₹) *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      value={farmData.pricing.basePrice}
                      onChange={(e) => handlePricingChange("basePrice", Number.parseInt(e.target.value) || 0)}
                      placeholder="500"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupDiscount">Group Discount (%) </Label>
                    <Input
                      id="groupDiscount"
                      type="number"
                      value={farmData.pricing.groupDiscount}
                      onChange={(e) => handlePricingChange("groupDiscount", Number.parseInt(e.target.value) || 0)}
                      placeholder="10"
                      className="mt-1"
                      max="50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      value={farmData.contact.ownerName}
                      onChange={(e) => handleContactChange("ownerName", e.target.value)}
                      placeholder="Enter owner name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={farmData.contact.email}
                      onChange={(e) => handleContactChange("email", e.target.value)}
                      placeholder="farm@example.com"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPhone">Primary Phone *</Label>
                    <Input
                      id="contactPhone"
                      value={farmData.contact.phone}
                      onChange={(e) => handleContactChange("phone", e.target.value)}
                      placeholder="+91-9876543210"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input
                      id="alternatePhone"
                      value={farmData.contact.alternatePhone}
                      onChange={(e) => handleContactChange("alternatePhone", e.target.value)}
                      placeholder="+91-9876543210"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Farm Images
                </h3>

                <div>
                  <Label htmlFor="images">Upload Images (Max 5)</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload high-quality images of your farm, activities, and facilities
                  </p>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1"
                    disabled={farmData.images.length >= 5}
                  />
                </div>

                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Farm image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Availability
                </h3>

                <div>
                  <Label>Available Days *</Label>
                  <p className="text-sm text-muted-foreground mb-3">Select days when your farm is open for visitors</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day}`}
                          checked={farmData.availability.daysOfWeek.includes(day)}
                          onCheckedChange={() => handleDayToggle(day)}
                        />
                        <Label htmlFor={`day-${day}`} className="text-sm cursor-pointer">
                          {day.slice(0, 3)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Available Time Slots</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select time slots when visitors can book experiences
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <div key={slot} className="flex items-center space-x-2">
                        <Checkbox
                          id={`slot-${slot}`}
                          checked={farmData.availability.timeSlots.includes(slot)}
                          onCheckedChange={() => handleTimeSlotToggle(slot)}
                        />
                        <Label htmlFor={`slot-${slot}`} className="text-sm cursor-pointer">
                          {slot}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>

                <div>
                  <Label htmlFor="specialRequirements">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    value={farmData.additionalInfo.specialRequirements}
                    onChange={(e) => handleAdditionalInfoChange("specialRequirements", e.target.value)}
                    placeholder="Any special requirements for visitors (e.g., dress code, age restrictions, etc.)"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                  <Textarea
                    id="cancellationPolicy"
                    value={farmData.additionalInfo.cancellationPolicy}
                    onChange={(e) => handleAdditionalInfoChange("cancellationPolicy", e.target.value)}
                    placeholder="Describe your cancellation and refund policy"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button onClick={handleFarmRegistration} disabled={isSubmitting} className="w-full md:w-auto" size="lg">
                  {isSubmitting ? "Registering..." : "Register Farm"}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  By registering, you agree to our terms and conditions. Your farm will be reviewed within 24-48 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
