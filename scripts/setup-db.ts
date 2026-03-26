import { executeQuery, initDatabase } from "../lib/db"
import { v4 as uuidv4 } from "uuid"

async function setupDatabase() {
  try {
    console.log("Initializing database tables...")
    await initDatabase()

    console.log("Checking for admin user...")
    const adminUsers = await executeQuery<any[]>({
      query: "SELECT * FROM users WHERE email = ?",
      values: ["admin@agrogenix.com"],
    })

    if (adminUsers.length === 0) {
      console.log("Creating admin user...")
      const adminId = uuidv4()
      // Simple base64 encoding for demo purposes
      const adminPassword = Buffer.from("admin123").toString("base64")

      await executeQuery({
        query: `
          INSERT INTO users (id, email, password, name, role)
          VALUES (?, ?, ?, ?, 'ADMIN')
        `,
        values: [adminId, "admin@agrogenix.com", adminPassword, "Admin User"],
      })

      console.log("Admin user created successfully")
    } else {
      console.log("Admin user already exists")
    }

    console.log("Checking for test user...")
    const testUsers = await executeQuery<any[]>({
      query: "SELECT * FROM users WHERE email = ?",
      values: ["user@example.com"],
    })

    if (testUsers.length === 0) {
      console.log("Creating test user...")
      const userId = uuidv4()
      // Simple base64 encoding for demo purposes
      const userPassword = Buffer.from("user123").toString("base64")

      await executeQuery({
        query: `
          INSERT INTO users (id, email, password, name, role)
          VALUES (?, ?, ?, ?, 'USER')
        `,
        values: [userId, "user@example.com", userPassword, "Test User"],
      })

      console.log("Test user created successfully")
    } else {
      console.log("Test user already exists")
    }

    console.log("Database setup completed successfully")
  } catch (error) {
    console.error("Database setup error:", error)
  }
}

setupDatabase()
