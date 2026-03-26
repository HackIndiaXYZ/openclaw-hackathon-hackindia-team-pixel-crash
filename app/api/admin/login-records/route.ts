import { NextResponse } from "next/server"
import { getUser, isAdmin } from "@/lib/auth"
import { getAllLoginRecords, getAllUsers } from "@/lib/file-storage"

export async function GET() {
  try {
    // Check if user is admin
    const user = getUser()
    if (!user || !isAdmin()) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get login records
    const records = getAllLoginRecords()
    const users = getAllUsers()

    // Format records with user information
    const formattedRecords = records.map((record) => {
      const recordUser = users.find((u) => u.id === record.userId)
      return {
        id: record.id,
        user_id: record.userId,
        email: record.email,
        timestamp: record.timestamp,
        ip_address: record.ipAddress,
        user_agent: record.userAgent,
        success: record.success,
        user: recordUser
          ? {
              email: recordUser.email,
              name: recordUser.name,
            }
          : null,
      }
    })

    return NextResponse.json(formattedRecords)
  } catch (error) {
    console.error("Error fetching login records:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch login records" }, { status: 500 })
  }
}
