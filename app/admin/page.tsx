"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

type LoginRecord = {
  id: string
  user_id: string
  email: string
  timestamp: string
  ip_address: string
  user_agent: string
  success: boolean
  user?: {
    email: string
    name: string
  }
}

type Booking = {
  id: string
  user_id: string
  user_email: string
  user_name: string
  farm_id: string
  farm_name: string
  date: string
  time_slot: string
  adults: number
  children: number
  total_price: number
  activities: string[]
  special_requests: string | null
  status: string
  created_at: string
}

export default function AdminPage() {
  const [loginRecords, setLoginRecords] = useState<LoginRecord[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (!response.ok || !data.success || data.user?.role !== "ADMIN") {
          toast({
            title: "Access Denied",
            description: "You do not have permission to access this page.",
            variant: "destructive",
          })
          router.push("/login")
          return
        }

        // Fetch login records
        fetchLoginRecords()

        // Fetch bookings
        fetchBookings()
      } catch (error) {
        setError("Failed to verify admin status")
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router, toast])

  const fetchLoginRecords = async () => {
    try {
      const response = await fetch("/api/admin/login-records")

      if (!response.ok) {
        throw new Error("Failed to fetch login records")
      }

      const data = await response.json()
      setLoginRecords(data)
    } catch (error) {
      setError("Failed to fetch login records")
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings")

      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }

      const data = await response.json()
      setBookings(data)
    } catch (error) {
      setError("Failed to fetch bookings")
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update booking status")
      }

      // Refresh bookings
      fetchBookings()

      toast({
        title: "Status Updated",
        description: "Booking status updated successfully",
      })
    } catch (error) {
      // Error handled silently
      toast({
        title: "Update Failed",
        description: "Failed to update booking status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-green-500 border-b-green-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4 w-full" onClick={() => router.push("/")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="bookings">
        <TabsList className="mb-6">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="login-records">Login Records</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>Manage all farm tour bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No bookings found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Farm</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            {new Date(booking.date).toLocaleDateString()}
                            <div className="text-xs text-gray-500">{booking.time_slot}</div>
                          </TableCell>
                          <TableCell>{booking.farm_name}</TableCell>
                          <TableCell>
                            {booking.user_name}
                            <div className="text-xs text-gray-500">{booking.user_email}</div>
                          </TableCell>
                          <TableCell>
                            {booking.adults + booking.children}
                            <div className="text-xs text-gray-500">
                              ({booking.adults} adults, {booking.children} children)
                            </div>
                          </TableCell>
                          <TableCell>${booking.total_price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                booking.status === "Confirmed"
                                  ? "bg-green-500"
                                  : booking.status === "Pending"
                                    ? "bg-yellow-500"
                                    : booking.status === "Cancelled"
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, "Confirmed")}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-50"
                                onClick={() => updateBookingStatus(booking.id, "Cancelled")}
                              >
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login-records">
          <Card>
            <CardHeader>
              <CardTitle>Login Records</CardTitle>
              <CardDescription>View all user login attempts</CardDescription>
            </CardHeader>
            <CardContent>
              {loginRecords.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No login records found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loginRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
                          <TableCell>
                            {record.user ? (
                              <>
                                {record.user.name}
                                <div className="text-xs text-gray-500">{record.user.email}</div>
                              </>
                            ) : (
                              <>
                                <span className="text-gray-500">Unknown User</span>
                                <div className="text-xs text-gray-500">{record.email}</div>
                              </>
                            )}
                          </TableCell>
                          <TableCell>{record.ip_address}</TableCell>
                          <TableCell>
                            <Badge className={record.success ? "bg-green-500" : "bg-red-500"}>
                              {record.success ? "Success" : "Failed"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
