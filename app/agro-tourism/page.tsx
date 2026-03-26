"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Star,
  MapPin,
  Tractor,
  Leaf,
  Apple,
  Wheat,
  Users,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Check,
  CreditCard,
  Landmark,
  Wallet,
  Clock,
  IndianRupee,
  FileText,
} from "lucide-react"
import { format, addDays, startOfWeek, addWeeks } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

// Import the enhanced receipt generator
import { downloadReceipt as generateAndDownloadReceipt } from "@/lib/receipt-generator"

// Types for farm experiences
type Activity = {
  name: string
  price: number
  description: string
  duration: string
}

type FarmExperience = {
  id: string
  name: string
  location: string
  state: string
  rating: number
  reviews: number
  description: string
  activities: Activity[]
  basePrice: number
  image: string
  availableDates?: string[]
}

// Enhanced mock data for farm experiences with activity pricing
const farmExperiences: FarmExperience[] = [
  {
    id: "green-valley",
    name: "Green Valley Organic Farm",
    location: "Amritsar",
    state: "Punjab",
    rating: 4.8,
    reviews: 124,
    description:
      "Experience traditional organic farming techniques in a beautiful valley setting. Learn about sustainable agriculture practices and enjoy farm-fresh meals.",
    activities: [
      { name: "Crop harvesting", price: 200, description: "Hands-on harvesting experience", duration: "2 hours" },
      { name: "Tractor rides", price: 150, description: "Scenic farm tour on tractor", duration: "1 hour" },
      {
        name: "Organic cooking class",
        price: 300,
        description: "Learn to cook with farm produce",
        duration: "3 hours",
      },
      { name: "Animal feeding", price: 100, description: "Feed and interact with farm animals", duration: "1 hour" },
      { name: "Farm photography tour", price: 250, description: "Guided photography session", duration: "2 hours" },
      {
        name: "Organic garden workshop",
        price: 350,
        description: "Learn organic gardening techniques",
        duration: "4 hours",
      },
    ],
    basePrice: 500,
    image: "/placeholder-ebl0t.png",
  },
  {
    id: "sunshine-orchard",
    name: "Sunshine Fruit Orchard",
    location: "Shimla",
    state: "Himachal Pradesh",
    rating: 4.6,
    reviews: 98,
    description:
      "Visit our sprawling fruit orchards and pick your own seasonal fruits. Enjoy guided tours explaining fruit cultivation techniques and sample fresh fruit products.",
    activities: [
      {
        name: "Fruit picking",
        price: 180,
        description: "Pick seasonal fruits directly from trees",
        duration: "2 hours",
      },
      { name: "Jam making workshop", price: 280, description: "Make homemade jams and preserves", duration: "3 hours" },
      { name: "Orchard tours", price: 120, description: "Guided tour of fruit orchards", duration: "1.5 hours" },
      { name: "Fruit tasting", price: 80, description: "Sample various seasonal fruits", duration: "30 minutes" },
      {
        name: "Beekeeping demonstration",
        price: 200,
        description: "Learn about honey production",
        duration: "2 hours",
      },
      { name: "Fruit wine tasting", price: 300, description: "Taste locally made fruit wines", duration: "1 hour" },
    ],
    basePrice: 400,
    image: "/placeholder-7ujwc.png",
  },
  {
    id: "heritage-rice",
    name: "Heritage Rice Fields",
    location: "Ludhiana",
    state: "Punjab",
    rating: 4.7,
    reviews: 86,
    description:
      "Discover the art of traditional rice cultivation. Walk through paddy fields, learn transplanting techniques, and participate in harvest festivals.",
    activities: [
      {
        name: "Rice planting",
        price: 220,
        description: "Traditional rice transplanting experience",
        duration: "3 hours",
      },
      { name: "Water buffalo rides", price: 180, description: "Traditional farming transport", duration: "1 hour" },
      { name: "Traditional cooking", price: 250, description: "Cook traditional Punjabi meals", duration: "2.5 hours" },
      { name: "Cultural performances", price: 150, description: "Folk dance and music shows", duration: "1.5 hours" },
      { name: "Rice processing demo", price: 100, description: "Learn rice processing techniques", duration: "1 hour" },
      { name: "Village walk", price: 80, description: "Explore traditional village life", duration: "2 hours" },
    ],
    basePrice: 450,
    image: "/lush-rice-paddy.png",
  },
]

// Generate available dates for the next 4 weeks
const generateAvailableDates = () => {
  const dates = []
  const today = new Date()

  for (let week = 0; week < 4; week++) {
    const weekStart = addWeeks(startOfWeek(today), week)
    for (let day = 0; day < 7; day++) {
      const date = addDays(weekStart, day)
      if (date >= today) {
        dates.push(format(date, "yyyy-MM-dd"))
      }
    }
  }

  return dates
}

// Enhanced time slots with different pricing
const timeSlots = [
  { time: "8:00 AM", label: "Early Morning", multiplier: 0.9 },
  { time: "9:00 AM", label: "Morning", multiplier: 1.0 },
  { time: "10:00 AM", label: "Late Morning", multiplier: 1.0 },
  { time: "11:00 AM", label: "Pre-Noon", multiplier: 1.0 },
  { time: "1:00 PM", label: "Afternoon", multiplier: 1.1 },
  { time: "2:00 PM", label: "Mid Afternoon", multiplier: 1.1 },
  { time: "3:00 PM", label: "Late Afternoon", multiplier: 1.0 },
  { time: "4:00 PM", label: "Evening", multiplier: 0.95 },
]

// Benefits of agro-tourism
const farmerBenefits = [
  {
    icon: <Leaf className="h-5 w-5 text-green-600" />,
    text: "Additional revenue stream beyond traditional farming",
  },
  {
    icon: <Users className="h-5 w-5 text-green-600" />,
    text: "Opportunity to educate the public about agriculture",
  },
  {
    icon: <Wheat className="h-5 w-5 text-green-600" />,
    text: "Preservation and promotion of agricultural heritage",
  },
]

const visitorBenefits = [
  {
    icon: <Tractor className="h-5 w-5 text-blue-600" />,
    text: "Authentic rural experiences and connection with nature",
  },
  {
    icon: <Apple className="h-5 w-5 text-blue-600" />,
    text: "Educational opportunities about food production",
  },
  {
    icon: <MapPin className="h-5 w-5 text-blue-600" />,
    text: "Support for local farmers and rural communities",
  },
]

// Booking steps
type BookingStep = "farm" | "date" | "visitors" | "activities" | "payment" | "confirmation"

// Booking data type
type BookingData = {
  farmId: string
  date: string
  timeSlot: string
  timeMultiplier: number
  visitors: {
    adults: number
    children: number
  }
  activities: string[]
  contactInfo: {
    name: string
    email: string
    phone: string
  }
  specialRequests: string
  paymentMethod: "credit-card" | "upi" | "net-banking"
  agreedToTerms: boolean
}

// Mock booking data
const initialBookingData: BookingData = {
  farmId: "",
  date: "",
  timeSlot: "",
  timeMultiplier: 1.0,
  visitors: {
    adults: 1,
    children: 0,
  },
  activities: [],
  contactInfo: {
    name: "",
    email: "",
    phone: "",
  },
  specialRequests: "",
  paymentMethod: "credit-card",
  agreedToTerms: false,
}

export default function AgroTourismPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("explore")
  const [bookingStep, setBookingStep] = useState<BookingStep>("farm")
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData)
  const [selectedFarm, setSelectedFarm] = useState<FarmExperience | null>(null)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingId, setBookingId] = useState("")
  const [myBookings, setMyBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [availableDates] = useState(generateAvailableDates())

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const userData = localStorage.getItem("agro-genix-user")
        if (!userData) {
          const mockUser = {
            id: "demo-user",
            email: "demo@agrogenix.com",
            name: "Demo User",
            createdAt: new Date().toISOString(),
          }
          localStorage.setItem("agro-genix-user", JSON.stringify(mockUser))
        }
        fetchMyBookings()
      }
    }

    checkAuth()
  }, [])

  // Fetch user's bookings from the database
  const fetchMyBookings = async () => {
    if (typeof window === "undefined") return

    try {
      const userData = localStorage.getItem("agro-genix-user")
      if (!userData) {
        const mockUser = {
          id: "demo-user",
          email: "demo@agrogenix.com",
          name: "Demo User",
          createdAt: new Date().toISOString(),
        }
        localStorage.setItem("agro-genix-user", JSON.stringify(mockUser))
        return
      }

      const user = JSON.parse(userData)

      const response = await fetch(`/api/bookings?userId=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          setMyBookings([])
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success && Array.isArray(data.bookings)) {
        setMyBookings(data.bookings)
      } else {
        setMyBookings([])
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setMyBookings([])
    }
  }

  // Handle farm selection
  const handleSelectFarm = (farm: FarmExperience) => {
    setSelectedFarm(farm)
    setBookingData({
      ...initialBookingData,
      farmId: farm.id,
    })
    setBookingStep("farm")
    setBookingComplete(false)
    setBookingDialogOpen(true)
  }

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setBookingData({
      ...bookingData,
      date,
    })
  }

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: string, multiplier: number) => {
    setBookingData({
      ...bookingData,
      timeSlot,
      timeMultiplier: multiplier,
    })
  }

  // Handle visitor count change
  const handleVisitorChange = (type: "adults" | "children", value: number) => {
    if (type === "adults" && value < 1) return
    if (type === "children" && value < 0) return

    setBookingData({
      ...bookingData,
      visitors: {
        ...bookingData.visitors,
        [type]: value,
      },
    })
  }

  // Handle activity selection
  const handleActivityToggle = (activityName: string) => {
    const currentActivities = [...bookingData.activities]
    const activityIndex = currentActivities.indexOf(activityName)

    if (activityIndex === -1) {
      currentActivities.push(activityName)
    } else {
      currentActivities.splice(activityIndex, 1)
    }

    setBookingData({
      ...bookingData,
      activities: currentActivities,
    })
  }

  // Handle contact info change
  const handleContactInfoChange = (field: keyof BookingData["contactInfo"], value: string) => {
    setBookingData({
      ...bookingData,
      contactInfo: {
        ...bookingData.contactInfo,
        [field]: value,
      },
    })
  }

  // Handle special requests change
  const handleSpecialRequestsChange = (value: string) => {
    setBookingData({
      ...bookingData,
      specialRequests: value,
    })
  }

  // Handle payment method selection
  const handlePaymentMethodChange = (method: BookingData["paymentMethod"]) => {
    setBookingData({
      ...bookingData,
      paymentMethod: method,
    })
  }

  // Handle terms agreement
  const handleTermsAgreementChange = (checked: boolean) => {
    setBookingData({
      ...bookingData,
      agreedToTerms: checked,
    })
  }

  // Navigate to next step
  const goToNextStep = () => {
    switch (bookingStep) {
      case "farm":
        setBookingStep("date")
        break
      case "date":
        setBookingStep("visitors")
        break
      case "visitors":
        setBookingStep("activities")
        break
      case "activities":
        setBookingStep("payment")
        break
      case "payment":
        completeBooking()
        break
      default:
        break
    }
  }

  // Navigate to previous step
  const goToPreviousStep = () => {
    switch (bookingStep) {
      case "date":
        setBookingStep("farm")
        break
      case "visitors":
        setBookingStep("date")
        break
      case "activities":
        setBookingStep("visitors")
        break
      case "payment":
        setBookingStep("activities")
        break
      default:
        break
    }
  }

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (bookingStep) {
      case "farm":
        return !!bookingData.farmId
      case "date":
        return !!bookingData.date && !!bookingData.timeSlot
      case "visitors":
        return (
          bookingData.visitors.adults > 0 &&
          bookingData.contactInfo.name.trim() !== "" &&
          bookingData.contactInfo.email.trim() !== "" &&
          bookingData.contactInfo.phone.trim() !== ""
        )
      case "activities":
        return bookingData.activities.length > 0
      case "payment":
        return !!bookingData.paymentMethod && bookingData.agreedToTerms
      default:
        return false
    }
  }

  // Calculate pricing breakdown
  const calculatePricing = () => {
    if (!selectedFarm) return { basePrice: 0, activitiesPrice: 0, timeAdjustment: 0, total: 0 }

    const basePrice =
      selectedFarm.basePrice * bookingData.visitors.adults +
      selectedFarm.basePrice * 0.6 * bookingData.visitors.children

    const activitiesPrice = bookingData.activities.reduce((total, activityName) => {
      const activity = selectedFarm.activities.find((a) => a.name === activityName)
      if (activity) {
        return (
          total + activity.price * bookingData.visitors.adults + activity.price * 0.6 * bookingData.visitors.children
        )
      }
      return total
    }, 0)

    const subtotal = basePrice + activitiesPrice
    const timeAdjustment = subtotal * (bookingData.timeMultiplier - 1)
    const total = subtotal + timeAdjustment

    return { basePrice, activitiesPrice, timeAdjustment, total }
  }

  // Complete booking
  const completeBooking = async () => {
    if (!selectedFarm) return

    if (typeof window === "undefined") return

    const userData = localStorage.getItem("agro-genix-user")
    if (!userData) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a booking.",
        variant: "destructive",
      })
      return
    }

    const user = JSON.parse(userData)
    setIsLoading(true)

    try {
      const pricing = calculatePricing()

      const bookingPayload = {
        farmId: selectedFarm.id,
        farmName: selectedFarm.name,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        adults: bookingData.visitors.adults,
        children: bookingData.visitors.children,
        activities: bookingData.activities,
        specialRequests: bookingData.specialRequests,
        totalPrice: Math.round(pricing.total),
        contactInfo: bookingData.contactInfo,
        paymentMethod: bookingData.paymentMethod,
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error occurred" }))
        throw new Error(errorData.message || "Failed to create booking")
      }

      const result = await response.json()

      if (result.success) {
        setBookingId(result.booking.id)
        setBookingStep("confirmation")
        setBookingComplete(true)

        toast({
          title: "🎉 Booking Confirmed!",
          description: "Your farm experience has been booked successfully. Receipt is ready for download!",
        })

        fetchMyBookings()
      } else {
        throw new Error(result.message || "Failed to create booking")
      }
    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Reset booking
  const resetBooking = () => {
    setBookingData(initialBookingData)
    setSelectedFarm(null)
    setBookingStep("farm")
    setBookingComplete(false)
    setBookingDialogOpen(false)
  }

  // Start a new booking
  const startNewBooking = () => {
    resetBooking()
    setBookingDialogOpen(false)
    setActiveTab("explore")
  }

  // Enhanced downloadReceipt function with comprehensive booking data
  const downloadReceipt = async (booking: any) => {
    try {
      setIsLoading(true)

      // Show loading toast with professional message
      toast({
        title: "📄 Generating Professional Receipt",
        description: "Creating your high-quality digital receipt with clean formatting and QR verification...",
      })

      // Determine booking status based on payment confirmation
      const bookingStatus = booking.paymentConfirmed !== false ? "Confirmed" : "Pending"

      // Use the enhanced receipt generator with complete booking data
      await generateAndDownloadReceipt({
        id: booking.id,
        farmName: booking.farmName,
        date: booking.date,
        timeSlot: booking.timeSlot,
        adults: booking.adults,
        children: booking.children,
        activities: booking.activities || [],
        specialRequests: booking.specialRequests,
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt,
        status: bookingStatus,
        paymentMethod: booking.paymentMethod || "Online Payment",
        transactionId:
          booking.transactionId || `TXN${booking.id?.slice(-8).toUpperCase()}${Date.now().toString().slice(-6)}`,
        contactInfo: {
          name: booking.contactInfo?.name || "Guest User",
          email: booking.contactInfo?.email || "guest@agrogenix.com",
          phone: booking.contactInfo?.phone || "Not provided",
        },
      })

      toast({
        title: "✅ High-Quality Receipt Downloaded!",
        description: "Your professional digital receipt with clean formatting and QR code has been saved successfully.",
      })
    } catch (error) {
      console.error("Error downloading receipt:", error)
      toast({
        title: "❌ Download Failed",
        description: "Failed to generate receipt. Please try again or contact our support team.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Agro Tourism</h1>
      <p className="text-muted-foreground mb-6">
        Explore agricultural experiences with AGRO-GENIX or register your farm in your profile
      </p>

      <Tabs defaultValue="explore" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="explore" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Explore Tours
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            My Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmExperiences.map((farm) => (
              <Card key={farm.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img src={farm.image || "/placeholder.svg"} alt={farm.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-yellow-400 text-black flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {farm.rating} ({farm.reviews})
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold">{farm.name}</h2>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {farm.location}, {farm.state}
                  </div>
                  <p className="text-sm mb-4 line-clamp-3">{farm.description}</p>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Popular Activities:</h3>
                    <div className="flex flex-wrap gap-2">
                      {farm.activities.slice(0, 3).map((activity, index) => (
                        <Badge key={index} variant="outline" className="bg-accent/50 text-xs">
                          {activity.name} (₹{activity.price})
                        </Badge>
                      ))}
                      {farm.activities.length > 3 && (
                        <Badge variant="outline" className="bg-accent/50 text-xs">
                          +{farm.activities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold">₹{farm.basePrice}</div>
                      <div className="text-xs text-muted-foreground">base price per person</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Activities from</div>
                      <div className="text-sm font-semibold">₹{Math.min(...farm.activities.map((a) => a.price))}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => handleSelectFarm(farm)} disabled={isLoading}>
                    {isLoading ? "Loading..." : "Book Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          {myBookings.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Bookings</h2>
              {myBookings.map((booking, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{booking.farmName}</span>
                      <Badge className={booking.status === "Confirmed" ? "bg-green-500" : "bg-yellow-500"}>
                        {booking.status || "Confirmed"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Booking ID: {booking.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Date & Time</p>
                        <p className="text-sm">
                          {new Date(booking.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                          at {booking.timeSlot}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Visitors</p>
                        <p className="text-sm">
                          {booking.adults} Adults{booking.children > 0 && `, ${booking.children} Children`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Amount</p>
                        <p className="text-sm font-bold">₹{booking.totalPrice}</p>
                      </div>
                    </div>
                    {booking.activities && booking.activities.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Selected Activities:</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.activities.map((activity: string, actIndex: number) => (
                            <Badge key={actIndex} variant="outline" className="bg-accent/50">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => downloadReceipt(booking)} disabled={isLoading}>
                      <FileText className="h-4 w-4 mr-2" />
                      {isLoading ? "Generating..." : "Download Receipt"}
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Cancel Booking
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your Bookings</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  You haven't made any bookings yet. Explore available farm experiences and book your agricultural
                  adventure with AGRO-GENIX today!
                </p>
                <Button onClick={() => setActiveTab("explore")}>Explore Tours</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Enhanced Multi-step Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden max-h-[90vh]">
          {!bookingComplete ? (
            <>
              <DialogHeader className="p-6 pb-2">
                <DialogTitle>Book Your Farm Experience</DialogTitle>
                <DialogDescription>
                  {bookingStep === "farm" && "Review farm details and proceed to booking"}
                  {bookingStep === "date" && "Select your preferred date and time"}
                  {bookingStep === "visitors" && "Enter visitor details and contact information"}
                  {bookingStep === "activities" && "Choose activities you'd like to participate in"}
                  {bookingStep === "payment" && "Review your booking and complete payment"}
                </DialogDescription>
              </DialogHeader>

              {/* Progress Indicator */}
              <div className="px-6">
                <div className="flex justify-between mb-2">
                  {["Farm", "Date", "Visitors", "Activities", "Payment"].map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                          index === ["farm", "date", "visitors", "activities", "payment"].indexOf(bookingStep)
                            ? "bg-primary text-primary-foreground"
                            : index < ["farm", "date", "visitors", "activities", "payment"].indexOf(bookingStep)
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        {index + 1}
                      </div>
                      <span className="text-xs mt-1 hidden sm:block">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full bg-muted h-1 mb-6 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300 ease-in-out"
                    style={{
                      width: `${
                        (["farm", "date", "visitors", "activities", "payment"].indexOf(bookingStep) + 1) * 20
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="px-6 max-h-[50vh] overflow-y-auto">
                {/* Farm Details Step */}
                {bookingStep === "farm" && selectedFarm && (
                  <div className="space-y-4 py-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="sm:w-1/3">
                        <img
                          src={selectedFarm.image || "/placeholder.svg"}
                          alt={selectedFarm.name}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                      <div className="sm:w-2/3">
                        <h3 className="text-lg font-semibold">{selectedFarm.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {selectedFarm.location}, {selectedFarm.state}
                        </div>
                        <div className="flex items-center text-sm mb-2">
                          <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                          <span>
                            {selectedFarm.rating} ({selectedFarm.reviews} reviews)
                          </span>
                        </div>
                        <p className="text-sm">{selectedFarm.description}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Available Activities:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedFarm.activities.map((activity, index) => (
                          <div key={index} className="border rounded-md p-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-sm font-medium">{activity.name}</div>
                                <div className="text-xs text-muted-foreground">{activity.description}</div>
                                <div className="text-xs text-muted-foreground flex items-center mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {activity.duration}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold">₹{activity.price}</div>
                                <div className="text-xs text-muted-foreground">per person</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">Pricing:</h4>
                      <div className="text-sm">
                        <div>Base Price: ₹{selectedFarm.basePrice} per adult</div>
                        <div>Children (below 12): ₹{Math.round(selectedFarm.basePrice * 0.6)} per child</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          * Activity prices are additional and vary by time slot
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Selection Step */}
                {bookingStep === "date" && selectedFarm && (
                  <div className="space-y-4 py-2">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Select Date:</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-48 overflow-y-auto">
                        {availableDates.map((date) => (
                          <Button
                            key={date}
                            variant={bookingData.date === date ? "default" : "outline"}
                            className={cn(
                              "h-auto py-2 px-2 flex flex-col items-center justify-center text-xs",
                              bookingData.date === date ? "border-primary" : "",
                            )}
                            onClick={() => handleDateSelect(date)}
                          >
                            <span className="text-xs">
                              {new Date(date).toLocaleDateString("en-IN", { weekday: "short" })}
                            </span>
                            <span className="text-sm font-semibold">
                              {new Date(date).toLocaleDateString("en-IN", { day: "numeric" })}
                            </span>
                            <span className="text-xs">
                              {new Date(date).toLocaleDateString("en-IN", { month: "short" })}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Select Time Slot:</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={bookingData.timeSlot === slot.time ? "default" : "outline"}
                            className={cn(
                              "h-auto py-2 px-2 flex flex-col items-center justify-center",
                              bookingData.timeSlot === slot.time ? "border-primary" : "",
                            )}
                            onClick={() => handleTimeSlotSelect(slot.time, slot.multiplier)}
                          >
                            <span className="text-sm font-semibold">{slot.time}</span>
                            <span className="text-xs text-muted-foreground">{slot.label}</span>
                            {slot.multiplier !== 1.0 && (
                              <span className="text-xs text-primary">
                                {slot.multiplier > 1
                                  ? `+${Math.round((slot.multiplier - 1) * 100)}%`
                                  : `${Math.round((slot.multiplier - 1) * 100)}%`}
                              </span>
                            )}
                          </Button>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        * Time slot pricing adjustments apply to total booking amount
                      </div>
                    </div>
                  </div>
                )}

                {/* Visitors and Contact Info Step */}
                {bookingStep === "visitors" && (
                  <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="adults">Adults</Label>
                        <div className="flex items-center mt-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => handleVisitorChange("adults", bookingData.visitors.adults - 1)}
                            disabled={bookingData.visitors.adults <= 1}
                          >
                            -
                          </Button>
                          <span className="mx-3 w-8 text-center">{bookingData.visitors.adults}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => handleVisitorChange("adults", bookingData.visitors.adults + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="children">Children (below 12 years)</Label>
                        <div className="flex items-center mt-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => handleVisitorChange("children", bookingData.visitors.children - 1)}
                            disabled={bookingData.visitors.children <= 0}
                          >
                            -
                          </Button>
                          <span className="mx-3 w-8 text-center">{bookingData.visitors.children}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => handleVisitorChange("children", bookingData.visitors.children + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Contact Information:</h3>
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={bookingData.contactInfo.name}
                          onChange={(e) => handleContactInfoChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingData.contactInfo.email}
                          onChange={(e) => handleContactInfoChange("email", e.target.value)}
                          placeholder="Enter your email address"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={bookingData.contactInfo.phone}
                          onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                          placeholder="Enter your phone number"
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Activities Selection Step */}
                {bookingStep === "activities" && selectedFarm && (
                  <div className="space-y-4 py-2">
                    <h3 className="text-sm font-medium">Select Activities:</h3>
                    <div className="space-y-3">
                      {selectedFarm.activities.map((activity, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id={`activity-${index}`}
                              checked={bookingData.activities.includes(activity.name)}
                              onCheckedChange={() => handleActivityToggle(activity.name)}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <label
                                    htmlFor={`activity-${index}`}
                                    className="text-sm font-medium leading-none cursor-pointer"
                                  >
                                    {activity.name}
                                  </label>
                                  <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {activity.duration}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold flex items-center">
                                    <IndianRupee className="h-3 w-3" />
                                    {activity.price}
                                  </div>
                                  <div className="text-xs text-muted-foreground">per person</div>
                                  {bookingData.visitors.children > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                      ₹{Math.round(activity.price * 0.6)} per child
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <Label htmlFor="special-requests">Special Requests (Optional)</Label>
                      <Textarea
                        id="special-requests"
                        value={bookingData.specialRequests}
                        onChange={(e) => handleSpecialRequestsChange(e.target.value)}
                        placeholder="Any special requirements or requests?"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Step */}
                {bookingStep === "payment" && selectedFarm && (
                  <div className="space-y-4 py-2">
                    <div className="bg-muted p-4 rounded-md mb-4">
                      <h3 className="text-sm font-medium mb-3">Booking Summary:</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Farm:</span>
                          <span className="font-medium">{selectedFarm.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-medium">
                            {new Date(bookingData.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-medium">{bookingData.timeSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Visitors:</span>
                          <span className="font-medium">
                            {bookingData.visitors.adults} Adults
                            {bookingData.visitors.children > 0 && `, ${bookingData.visitors.children} Children`}
                          </span>
                        </div>

                        <div className="border-t pt-2 mt-3">
                          <h4 className="font-medium mb-2">Pricing Breakdown:</h4>
                          {(() => {
                            const pricing = calculatePricing()
                            return (
                              <>
                                <div className="flex justify-between">
                                  <span>Base Price:</span>
                                  <span>₹{Math.round(pricing.basePrice)}</span>
                                </div>
                                {pricing.activitiesPrice > 0 && (
                                  <div className="flex justify-between">
                                    <span>Activities ({bookingData.activities.length} selected):</span>
                                    <span>₹{Math.round(pricing.activitiesPrice)}</span>
                                  </div>
                                )}
                                {pricing.timeAdjustment !== 0 && (
                                  <div className="flex justify-between">
                                    <span>Time Slot Adjustment:</span>
                                    <span className={pricing.timeAdjustment > 0 ? "text-red-600" : "text-green-600"}>
                                      {pricing.timeAdjustment > 0 ? "+" : ""}₹{Math.round(pricing.timeAdjustment)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t">
                                  <span>Total Amount:</span>
                                  <span>₹{Math.round(pricing.total)}</span>
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Select Payment Method:</h3>
                      <RadioGroup
                        value={bookingData.paymentMethod}
                        onValueChange={(value) => handlePaymentMethodChange(value as BookingData["paymentMethod"])}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2 border rounded-md p-3">
                          <RadioGroupItem value="credit-card" id="payment-credit-card" />
                          <Label htmlFor="payment-credit-card" className="flex items-center gap-2 cursor-pointer">
                            <CreditCard className="h-4 w-4" />
                            Credit/Debit Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-3">
                          <RadioGroupItem value="upi" id="payment-upi" />
                          <Label htmlFor="payment-upi" className="flex items-center gap-2 cursor-pointer">
                            <Wallet className="h-4 w-4" />
                            UPI Payment
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-3">
                          <RadioGroupItem value="net-banking" id="payment-net-banking" />
                          <Label htmlFor="payment-net-banking" className="flex items-center gap-2 cursor-pointer">
                            <Landmark className="h-4 w-4" />
                            Net Banking
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={bookingData.agreedToTerms}
                        onCheckedChange={(checked) => handleTermsAgreementChange(checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the terms and conditions
                        </label>
                        <p className="text-xs text-muted-foreground">
                          By proceeding, you agree to our cancellation policy and farm visit guidelines.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="p-6 pt-2">
                <div className="flex justify-between w-full">
                  {bookingStep !== "farm" ? (
                    <Button variant="outline" onClick={goToPreviousStep} disabled={isLoading}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => setBookingDialogOpen(false)} disabled={isLoading}>
                      Cancel
                    </Button>
                  )}
                  <Button onClick={goToNextStep} disabled={!isCurrentStepValid() || isLoading}>
                    {bookingStep === "payment" ? (
                      isLoading ? (
                        "Processing..."
                      ) : (
                        "Complete Booking"
                      )
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">🎉 Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-4">
                Your booking has been successfully confirmed. We've sent a confirmation email to{" "}
                <span className="font-medium">{bookingData.contactInfo.email}</span>.
              </p>

              <div className="bg-muted p-4 rounded-md mb-6 text-left">
                <h3 className="text-sm font-medium mb-2">Booking Details:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Booking ID:</span>
                    <span className="font-medium">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Farm:</span>
                    <span className="font-medium">{selectedFarm?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span className="font-medium">
                      {new Date(bookingData.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      at {bookingData.timeSlot}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-medium">₹{Math.round(calculatePricing().total)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() =>
                    downloadReceipt({
                      id: bookingId,
                      farmName: selectedFarm?.name,
                      date: bookingData.date,
                      timeSlot: bookingData.timeSlot,
                      adults: bookingData.visitors.adults,
                      children: bookingData.visitors.children,
                      activities: bookingData.activities,
                      specialRequests: bookingData.specialRequests,
                      totalPrice: Math.round(calculatePricing().total),
                      createdAt: new Date().toISOString(),
                      contactInfo: bookingData.contactInfo,
                      paymentMethod: bookingData.paymentMethod,
                      status: "Confirmed",
                    })
                  }
                  disabled={isLoading}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isLoading ? "Generating..." : "Download Receipt"}
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("bookings")}>
                  View My Bookings
                </Button>
                <Button onClick={startNewBooking}>Book Another Experience</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Why Agro Tourism Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-2">Why AGRO-GENIX Tourism?</h2>
        <p className="text-muted-foreground mb-6">Benefits for farmers and visitors</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Tractor className="h-5 w-5 mr-2" />
              For Farmers
            </h3>
            <ul className="space-y-4">
              {farmerBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">{benefit.icon}</div>
                  <span>{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              For Visitors
            </h3>
            <ul className="space-y-4">
              {visitorBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">{benefit.icon}</div>
                  <span>{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
