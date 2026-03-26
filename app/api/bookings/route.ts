import { NextResponse } from "next/server"
import { getBookingsByUserId, createBooking } from "@/lib/file-db"

export async function POST(request: Request) {
  try {
    const bookingData = await request.json()

    // Validate required fields
    if (!bookingData.farmId || !bookingData.date || !bookingData.timeSlot) {
      return NextResponse.json({ success: false, message: "Missing required booking information" }, { status: 400 })
    }

    // Create booking with mock user ID for demo
    const booking = createBooking({
      userId: "demo-user",
      farmId: bookingData.farmId,
      farmName: bookingData.farmName || "Sample Farm",
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      adults: bookingData.adults || 1,
      children: bookingData.children || 0,
      totalPrice: bookingData.totalPrice || 0,
      activities: bookingData.activities || [],
      specialRequests: bookingData.specialRequests || "",
      status: "Confirmed",
    })

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred while processing your booking" },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "demo-user"

    // Get bookings for the user
    const userBookings = getBookingsByUserId(userId)

    return NextResponse.json({ success: true, bookings: userBookings })
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json({ success: false, message: "An error occurred while fetching bookings" }, { status: 500 })
  }
}
