import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { executeQuery } from "@/lib/db"
import fs from "fs"
import path from "path"

// Function to ensure data directory exists
function ensureDataDirExists() {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir)
  }
  return dataDir
}

// Function to create a file with initial data if it doesn't exist
function createFileIfNotExists(filename: string, initialData: any) {
  const filePath = path.join(ensureDataDirExists(), filename)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2))
  }
}

export async function GET() {
  try {
    // Create data files
    createFileIfNotExists("users.json", [])
    createFileIfNotExists("login-records.json", [])
    createFileIfNotExists("bookings.json", [])

    // Create admin user if it doesn't exist
    const adminId = uuidv4()
    const adminPassword = Buffer.from("admin123").toString("base64") // Simple hash for demo

    try {
      // Check if admin exists in MySQL
      const adminUsers = await executeQuery<any[]>({
        query: "SELECT * FROM users WHERE email = ?",
        values: ["admin@agrogenix.com"],
      })

      if (adminUsers.length === 0) {
        // Create admin in MySQL
        await executeQuery({
          query: `
            INSERT INTO users (id, email, password, name, role)
            VALUES (?, ?, ?, ?, 'ADMIN')
          `,
          values: [adminId, "admin@agrogenix.com", adminPassword, "Admin User"],
        })
      }
    } catch (error) {
      console.error("MySQL error, falling back to file storage:", error)

      // Fallback to file storage
      const usersFilePath = path.join(ensureDataDirExists(), "users.json")
      const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"))

      if (!users.some((user: any) => user.email === "admin@agrogenix.com")) {
        users.push({
          id: adminId,
          email: "admin@agrogenix.com",
          password: adminPassword,
          name: "Admin User",
          role: "ADMIN",
          createdAt: new Date().toISOString(),
        })

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
      }
    }

    // Create test user if it doesn't exist
    const userId = uuidv4()
    const userPassword = Buffer.from("user123").toString("base64") // Simple hash for demo

    try {
      // Check if test user exists in MySQL
      const testUsers = await executeQuery<any[]>({
        query: "SELECT * FROM users WHERE email = ?",
        values: ["user@example.com"],
      })

      if (testUsers.length === 0) {
        // Create test user in MySQL
        await executeQuery({
          query: `
            INSERT INTO users (id, email, password, name, role)
            VALUES (?, ?, ?, ?, 'USER')
          `,
          values: [userId, "user@example.com", userPassword, "Test User"],
        })
      }
    } catch (error) {
      console.error("MySQL error, falling back to file storage:", error)

      // Fallback to file storage
      const usersFilePath = path.join(ensureDataDirExists(), "users.json")
      const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"))

      if (!users.some((user: any) => user.email === "user@example.com")) {
        users.push({
          id: userId,
          email: "user@example.com",
          password: userPassword,
          name: "Test User",
          role: "USER",
          createdAt: new Date().toISOString(),
        })

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
      }
    }

    return NextResponse.json({ success: true, message: "Setup completed successfully" })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ success: false, message: "Setup failed" }, { status: 500 })
  }
}
