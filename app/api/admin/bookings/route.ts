import { NextResponse } from "next/server"
import { getUser, isAdmin } from "@/lib/auth"
import { getAllBookings, getAllUsers, updateBookingStatus } from "@/lib/file-storage"

export async function GET() {
  try {
    // Check if user is admin
    const user = getUser()
    if (!user || !isAdmin()) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get all bookings
    const bookings = getAllBookings()
    const users = getAllUsers()

    // Format bookings with user information
    const formattedBookings = bookings.map((booking) => {
      const bookingUser = users.find((u) => u.id === booking.userId)
      return {
        id: booking.id,
        user_id: booking.userId,
        user_email: bookingUser?.email || "Unknown",
        user_name: bookingUser?.name || "Unknown",
        farm_id: booking.farmId,
        farm_name: booking.farmName,
        date: booking.date,
        time_slot: booking.timeSlot,
        adults: booking.adults,
        children: booking.children,
        total_price: booking.totalPrice,
        activities: booking.activities,
        special_requests: booking.specialRequests,
        status: booking.status,
        created_at: booking.createdAt,
      }
    })

    return NextResponse.json(formattedBookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Check if user is admin
    const user = getUser()
    if (!user || !isAdmin()) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Update booking status
    const updated = updateBookingStatus(id, status)

    if (updated) {
      return NextResponse.json({ success: true, message: "Booking status updated" })
    } else {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating booking status:", error)
    return NextResponse.json({ success: false, message: "Failed to update booking status" }, { status: 500 })
  }
}
