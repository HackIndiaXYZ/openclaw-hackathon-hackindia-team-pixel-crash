"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  Check,
  Cloud,
  CreditCard,
  Download,
  Globe,
  HelpCircle,
  Info,
  Languages,
  Lock,
  MapPin,
  Moon,
  Ruler,
  Save,
  Settings,
  Shield,
  Sun,
  Upload,
  User,
  X,
  FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <div className="sticky top-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
            </div>
            <Separator />
            <nav className="flex flex-col space-y-1">
              <Button
                variant={activeTab === "profile" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant={activeTab === "notifications" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button
                variant={activeTab === "appearance" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("appearance")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Appearance
              </Button>
              <Button
                variant={activeTab === "location" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("location")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Location
              </Button>
              <Button
                variant={activeTab === "units" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("units")}
              >
                <Ruler className="mr-2 h-4 w-4" />
                Units
              </Button>
              <Button
                variant={activeTab === "language" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("language")}
              >
                <Languages className="mr-2 h-4 w-4" />
                Language
              </Button>
              <Button
                variant={activeTab === "data" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("data")}
              >
                <Cloud className="mr-2 h-4 w-4" />
                Data Management
              </Button>
              <Button
                variant={activeTab === "privacy" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("privacy")}
              >
                <Shield className="mr-2 h-4 w-4" />
                Privacy & Security
              </Button>
              <Button
                variant={activeTab === "billing" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("billing")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Button>
              <Button
                variant={activeTab === "help" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("help")}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </Button>
            </nav>
          </div>
        </aside>
        <div className="flex-1 lg:max-w-3xl">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your personal information and how it appears to others.
                </p>
              </div>
              <Separator />
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative h-24 w-24 rounded-full bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <User className="h-12 w-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Profile Picture</h4>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                      <Button variant="outline" size="sm">
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+91 98765 43210" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your farming experience"
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    Brief description for your profile. URLs are hyperlinked.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Farming Experience</Label>
                  <Select defaultValue="5-10">
                    <SelectTrigger>
                      <SelectValue placeholder="Select years of experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="2-5">2-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10-20">10-20 years</SelectItem>
                      <SelectItem value="20+">20+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Primary Crops</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="wheat" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="wheat">Wheat</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="rice" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="rice">Rice</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="corn" className="rounded border-gray-300" />
                      <Label htmlFor="corn">Corn</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="cotton" className="rounded border-gray-300" />
                      <Label htmlFor="cotton">Cotton</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sugarcane" className="rounded border-gray-300" />
                      <Label htmlFor="sugarcane">Sugarcane</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="vegetables" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="vegetables">Vegetables</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <RadioGroup defaultValue="private" className="grid grid-cols-2 gap-4">
                    <div>
                      <RadioGroupItem value="public" id="visibility-public" className="peer sr-only" />
                      <Label
                        htmlFor="visibility-public"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Globe className="mb-3 h-6 w-6" />
                        Public
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="private" id="visibility-private" className="peer sr-only" />
                      <Label
                        htmlFor="visibility-private"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Lock className="mb-3 h-6 w-6" />
                        Private
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground">
                    This controls who can see your profile information in the community.
                  </p>
                </div>

                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Configure how you receive notifications from Agro-Genix.
                </p>
              </div>
              <Separator />
              <div className="space-y-6">
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weather-alerts">Weather Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts about severe weather conditions</p>
                    </div>
                    <Switch id="weather-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="market-updates">Market Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive updates about market prices and trends</p>
                    </div>
                    <Switch id="market-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="crop-alerts">Crop Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts about potential crop issues</p>
                    </div>
                    <Switch id="crop-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newsletter">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive our monthly newsletter with tips and updates
                      </p>
                    </div>
                    <Switch id="newsletter" defaultChecked />
                  </div>
                </div>
                <Separator />
                <h4 className="text-sm font-medium">SMS Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-weather">Emergency Weather Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive SMS for severe weather emergencies</p>
                    </div>
                    <Switch id="sms-weather" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-security">Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive SMS for account security issues</p>
                    </div>
                    <Switch id="sms-security" defaultChecked />
                  </div>
                </div>
                <Separator />
                <h4 className="text-sm font-medium">In-App Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-messages">Messages</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications for new messages</p>
                    </div>
                    <Switch id="app-messages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-updates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications for system updates</p>
                    </div>
                    <Switch id="app-updates" defaultChecked />
                  </div>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Notification Preferences
                </Button>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">Customize how Agro-Genix looks on your device.</p>
              </div>
              <Separator />
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <RadioGroup defaultValue="light" className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
                      <Label
                        htmlFor="theme-light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Sun className="mb-3 h-6 w-6" />
                        Light
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
                      <Label
                        htmlFor="theme-dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Moon className="mb-3 h-6 w-6" />
                        Dark
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
                      <Label
                        htmlFor="theme-system"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Settings className="mb-3 h-6 w-6" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <RadioGroup defaultValue="green" className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="green" id="color-green" className="peer sr-only" />
                      <Label
                        htmlFor="color-green"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="h-6 w-6 rounded-full bg-green-600" />
                        <span className="mt-3">Green</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="blue" id="color-blue" className="peer sr-only" />
                      <Label
                        htmlFor="color-blue"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="h-6 w-6 rounded-full bg-blue-600" />
                        <span className="mt-3">Blue</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="amber" id="color-amber" className="peer sr-only" />
                      <Label
                        htmlFor="color-amber"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="h-6 w-6 rounded-full bg-amber-600" />
                        <span className="mt-3">Amber</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduce-motion">Reduce Motion</Label>
                      <p className="text-sm text-muted-foreground">Reduce the motion of UI elements</p>
                    </div>
                    <Switch id="reduce-motion" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="font-size">Larger Text</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase the size of text throughout the application
                      </p>
                    </div>
                    <Switch id="font-size" />
                  </div>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Appearance Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === "location" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Location</h3>
                <p className="text-sm text-muted-foreground">Manage your farm location and regional settings.</p>
              </div>
              <Separator />
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-location">Primary Farm Location</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input id="latitude" placeholder="e.g. 28.6139" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input id="longitude" placeholder="e.g. 77.2090" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This location will be used for weather forecasts and regional recommendations.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Farm address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City/Town</Label>
                    <Input id="city" placeholder="City or town" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Select defaultValue="punjab">
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="haryana">Haryana</SelectItem>
                        <SelectItem value="up">Uttar Pradesh</SelectItem>
                        <SelectItem value="mp">Madhya Pradesh</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="ap">Andhra Pradesh</SelectItem>
                        <SelectItem value="tn">Tamil Nadu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postal">Postal/ZIP Code</Label>
                    <Input id="postal" placeholder="Postal code" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select defaultValue="india">
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="pakistan">Pakistan</SelectItem>
                        <SelectItem value="bangladesh">Bangladesh</SelectItem>
                        <SelectItem value="nepal">Nepal</SelectItem>
                        <SelectItem value="sri-lanka">Sri Lanka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select defaultValue="ist">
                    <SelectTrigger>
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">Indian Standard Time (IST)</SelectItem>
                      <SelectItem value="pst">Pakistan Standard Time (PST)</SelectItem>
                      <SelectItem value="bst">Bangladesh Standard Time (BST)</SelectItem>
                      <SelectItem value="npt">Nepal Time (NPT)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    This will affect how dates and times are displayed throughout the application.
                  </p>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Location Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === "units" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Units</h3>
                <p className="text-sm text-muted-foreground">Configure your preferred measurement units.</p>
              </div>
              <Separator />
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Temperature</Label>
                  <RadioGroup defaultValue="celsius" className="grid grid-cols-2 gap-4">
                    <div>
                      <RadioGroupItem value="celsius" id="temp-celsius" className="peer sr-only" />
                      <Label
                        htmlFor="temp-celsius"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        Celsius (°C)
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="fahrenheit" id="temp-fahrenheit" className="peer sr-only" />
                      <Label
                        htmlFor="temp-fahrenheit"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        Fahrenheit (°F)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Length/Distance</Label>
                  <RadioGroup defaultValue="metric" className="grid grid-cols-2 gap-4">
                    <div>
                      <RadioGroupItem value="metric" id="length-metric" className="peer sr-only" />
                      <Label
                        htmlFor="length-metric"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        Metric (m, km)
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="imperial" id="length-imperial" className="peer sr-only" />
                      <Label
                        htmlFor="length-imperial"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        Imperial (ft, mi)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Area</Label>
                  <RadioGroup defaultValue="hectare" className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="hectare" id="area-hectare" className="peer sr-only" />
                      <Label
                        htmlFor="area-hectare"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        Hectare (ha)
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="acre" id="area-acre" className="peer sr-only" />
                      <Label
                        htmlFor="area-acre"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        Acre
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="bigha" id="area-bigha" className="peer sr-only" />
                      <Label
                        htmlFor="area-bigha"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        Bigha
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Weight</Label>
                  <RadioGroup defaultValue="kg" className="grid grid-cols-2 gap-4">
                    <div>
                      <RadioGroupItem value="kg" id="weight-kg" className="peer sr-only" />
                      <Label
                        htmlFor="weight-kg"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        Metric (kg, tonnes)
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="lb" id="weight-lb" className="peer sr-only" />
                      <Label
                        htmlFor="weight-lb"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        Imperial (lb, tons)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Rainfall</Label>
                  <RadioGroup defaultValue="mm" className="grid grid-cols-2 gap-4">
                    <div>
                      <RadioGroupItem value="mm" id="rain-mm" className="peer sr-only" />
                      <Label
                        htmlFor="rain-mm"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        Millimeters (mm)
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="in" id="rain-in" className="peer sr-only" />
                      <Label
                        htmlFor="rain-in"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        Inches (in)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Unit Preferences
                </Button>
              </div>
            </div>
          )}

          {activeTab === "language" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Language</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred language for the application.</p>
              </div>
              <Separator />
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Primary Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="pa">Punjabi</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="gu">Gujarati</SelectItem>
                      <SelectItem value="kn">Kannada</SelectItem>
                      <SelectItem value="ml">Malayalam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Secondary Language</Label>
                  <Select defaultValue="none">
                    <SelectTrigger>
                      <SelectValue placeholder="Select secondary language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="pa">Punjabi</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="gu">Gujarati</SelectItem>
                      <SelectItem value="kn">Kannada</SelectItem>
                      <SelectItem value="ml">Malayalam</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Secondary language will be used when primary language translation is not available.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="translate-content">Auto-Translate Content</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically translate user-generated content to your preferred language
                      </p>
                    </div>
                    <Switch id="translate-content" defaultChecked />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <RadioGroup defaultValue="dmy" className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="dmy" id="date-dmy" className="peer sr-only" />
                      <Label
                        htmlFor="date-dmy"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        DD/MM/YYYY
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="mdy" id="date-mdy" className="peer sr-only" />
                      <Label
                        htmlFor="date-mdy"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        MM/DD/YYYY
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="ymd" id="date-ymd" className="peer sr-only" />
                      <Label
                        htmlFor="date-ymd"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        YYYY/MM/DD
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Language Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Data Management</h3>
                <p className="text-sm text-muted-foreground">Manage your data, exports, and integrations.</p>
              </div>
              <Separator />
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Export Data</CardTitle>
                    <CardDescription>Download your data in various formats</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        Export Farm Data (CSV)
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        Export Farm Data (JSON)
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        Export Crop History (CSV)
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        Export Weather Data (CSV)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Import Data</CardTitle>
                    <CardDescription>Upload data from external sources</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Farm Data (CSV)
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Crop Data (CSV)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Data Backup</CardTitle>
                    <CardDescription>Backup and restore your data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Cloud className="mr-2 h-4 w-4" />
                        Backup All Data
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Cloud className="mr-2 h-4 w-4" />
                        Restore from Backup
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">Last backup: 3 days ago</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Third-Party Integrations</CardTitle>
                    <CardDescription>Connect with other services and tools</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Globe className="h-6 w-6" />
                          <div>
                            <h4 className="text-sm font-medium">Weather API</h4>
                            <p className="text-xs text-muted-foreground">Connected</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Globe className="h-6 w-6" />
                          <div>
                            <h4 className="text-sm font-medium">Soil Testing Lab</h4>
                            <p className="text-xs text-muted-foreground">Not connected</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Connect
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Globe className="h-6 w-6" />
                          <div>
                            <h4 className="text-sm font-medium">Market Price API</h4>
                            <p className="text-xs text-muted-foreground">Connected</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Data Retention</CardTitle>
                    <CardDescription>Manage how long your data is stored</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Weather Data Retention</Label>
                      <Select defaultValue="1year">
                        <SelectTrigger>
                          <SelectValue placeholder="Select retention period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3months">3 Months</SelectItem>
                          <SelectItem value="6months">6 Months</SelectItem>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="3years">3 Years</SelectItem>
                          <SelectItem value="forever">Forever</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Crop Data Retention</Label>
                      <Select defaultValue="forever">
                        <SelectTrigger>
                          <SelectValue placeholder="Select retention period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="3years">3 Years</SelectItem>
                          <SelectItem value="5years">5 Years</SelectItem>
                          <SelectItem value="forever">Forever</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Data Settings</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Privacy & Security</h3>
                <p className="text-sm text-muted-foreground">Manage your privacy settings and account security.</p>
              </div>
              <Separator />
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Password & Authentication</CardTitle>
                    <CardDescription>Manage your password and authentication methods</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Require a verification code when logging in</p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                    <Button variant="outline">
                      <Shield className="mr-2 h-4 w-4" />
                      Setup Two-Factor Authentication
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control how your information is used and shared</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="share-data">Share Farm Data for Research</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow anonymized farm data to be used for agricultural research
                        </p>
                      </div>
                      <Switch id="share-data" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="public-profile">Public Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to other Agro-Genix users
                        </p>
                      </div>
                      <Switch id="public-profile" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="location-sharing">Location Sharing</Label>
                        <p className="text-sm text-muted-foreground">Share your farm location for regional insights</p>
                      </div>
                      <Switch id="location-sharing" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Data Privacy</CardTitle>
                    <CardDescription>Manage your personal data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download All My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                      <X className="mr-2 h-4 w-4" />
                      Delete My Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Billing</h3>
                <p className="text-sm text-muted-foreground">Manage your subscription and payment methods.</p>
              </div>
              <Separator />
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>You are currently on the Pro plan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">Pro Plan</h3>
                          <p className="text-sm text-muted-foreground">₹1,999/year</p>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              Advanced weather forecasting
                            </li>
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              Market price predictions
                            </li>
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              Unlimited crop recommendations
                            </li>
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              Expert consultation access
                            </li>
                          </ul>
                        </div>
                        <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          Active
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm">
                          Change Plan
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          Cancel Subscription
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm">
                      Your subscription will renew on <span className="font-medium">October 15, 2023</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-full bg-blue-100 p-2">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-xs text-muted-foreground">Expires 12/2024</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>View your past invoices</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border divide-y">
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Pro Plan - Annual</p>
                          <p className="text-xs text-muted-foreground">October 15, 2022</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-medium">₹1,999</p>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Pro Plan - Annual</p>
                          <p className="text-xs text-muted-foreground">October 15, 2021</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-medium">₹1,999</p>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "help" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Help & Support</h3>
                <p className="text-sm text-muted-foreground">Get help with using Agro-Genix.</p>
              </div>
              <Separator />
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Quick answers to common questions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium flex items-center">
                          <Info className="mr-2 h-4 w-4 text-blue-500" />
                          How do I add a new farm?
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Go to the Profile page and click on "Add Farm" button. Fill in the required details about your
                          farm location, size, and crops.
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium flex items-center">
                          <Info className="mr-2 h-4 w-4 text-blue-500" />
                          How accurate are the weather forecasts?
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Our weather forecasts are sourced from multiple meteorological services and have an accuracy
                          rate of approximately 85-90% for 3-day forecasts.
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium flex items-center">
                          <Info className="mr-2 h-4 w-4 text-blue-500" />
                          Can I export my farm data?
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Yes, you can export your farm data in CSV or JSON format from the Data Management section in
                          Settings.
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View All FAQs
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>Get help from our support team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="support-subject">Subject</Label>
                      <Input id="support-subject" placeholder="Enter the subject of your query" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="support-message">Message</Label>
                      <Textarea
                        id="support-message"
                        placeholder="Describe your issue in detail"
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <RadioGroup defaultValue="medium" className="grid grid-cols-3 gap-4">
                        <div>
                          <RadioGroupItem value="low" id="priority-low" className="peer sr-only" />
                          <Label
                            htmlFor="priority-low"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            Low
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="medium" id="priority-medium" className="peer sr-only" />
                          <Label
                            htmlFor="priority-medium"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            Medium
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="high" id="priority-high" className="peer sr-only" />
                          <Label
                            htmlFor="priority-high"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            High
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button>Send Support Request</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation</CardTitle>
                    <CardDescription>Access user guides and documentation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        User Guide
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        API Documentation
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Farming Best Practices
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Troubleshooting Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
