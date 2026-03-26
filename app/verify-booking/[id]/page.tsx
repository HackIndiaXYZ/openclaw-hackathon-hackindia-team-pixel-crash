"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, MapPin, Users, Calendar, FileText } from "lucide-react"
import Link from "next/link"

interface BookingVerification {
  id: string
  farmName: string
  date: string
  timeSlot: string
  adults: number
  children: number
  activities: string[]
  totalPrice: number
  status: "Confirmed" | "Pending" | "Cancelled"
  contactInfo: {
    name: string
    email: string
    phone: string
  }
  createdAt: string
  paymentMethod: string
  transactionId: string
}

export default function VerifyBookingPage() {
  const params = useParams()
  const bookingId = params.id as string
  const [booking, setBooking] = useState<BookingVerification | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyBooking = async () => {
      try {
        setLoading(true)

        // Simulate API call for booking verification
        // In a real application, this would fetch from your backend
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock booking data for demonstration
        const mockBooking: BookingVerification = {
          id: bookingId,
          farmName: "Green Valley Organic Farm",
          date: "2024-02-15",
          timeSlot: "10:00 AM",
          adults: 2,
          children: 1,
          activities: ["Crop harvesting", "Organic cooking class", "Farm photography tour"],
          totalPrice: 2850,
          status: "Confirmed",
          contactInfo: {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+91-9876543210",
          },
          createdAt: "2024-02-10T10:30:00Z",
          paymentMethod: "Credit Card",
          transactionId: `TXN${bookingId.slice(-8).toUpperCase()}123456`,
        }

        setBooking(mockBooking)
      } catch (err) {
        setError("Failed to verify booking. Please check the booking ID and try again.")
      } finally {
        setLoading(false)
      }
    }

    if (bookingId) {
      verifyBooking()
    }
  }, [bookingId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Verifying Booking</h2>
              <p className="text-muted-foreground">Please wait while we verify your booking details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
              <p className="text-muted-foreground mb-6">
                {error || "We couldn't find a booking with this ID. Please check the booking ID and try again."}
              </p>
              <Link href="/agro-tourism">
                <Button>Back to Agro Tourism</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "Cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500"
      case "Pending":
        return "bg-yellow-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Verification</h1>
          <p className="text-muted-foreground">
            Verified booking details for ID: <span className="font-mono font-semibold">{bookingId}</span>
          </p>
        </div>

        {/* Booking Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Status</span>
              <Badge className={`${getStatusColor(booking.status)} flex items-center gap-2`}>
                {getStatusIcon(booking.status)}
                {booking.status}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Farm</p>
                  <p className="font-semibold">{booking.farmName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-semibold">
                    {new Date(booking.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    at {booking.timeSlot}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Visitors</p>
                  <p className="font-semibold">
                    {booking.adults} Adults{booking.children > 0 && `, ${booking.children} Children`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-lg">₹{booking.totalPrice}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold">{booking.contactInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold">{booking.contactInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-semibold">{booking.contactInfo.phone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Selected Activities */}
        {booking.activities && booking.activities.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Selected Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {booking.activities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>{activity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-semibold">{booking.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="font-semibold font-mono">{booking.transactionId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Booking Date</p>
              <p className="font-semibold">
                {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Verification Footer */}
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Booking Verified Successfully</h3>
            <p className="text-muted-foreground mb-4">
              This booking has been verified and is authentic. Present this verification at the farm for your
              experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/agro-tourism">
                <Button variant="outline">Back to Agro Tourism</Button>
              </Link>
              <Button onClick={() => window.print()}>Print Verification</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
