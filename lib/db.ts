// Database initialization and query execution
import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"

const DATA_DIR = join(process.cwd(), "data")
const DB_FILE = join(DATA_DIR, "database.json")

// Ensure data directory exists
if (typeof window === "undefined") {
  const fs = require("fs")
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export async function initDatabase(): Promise<void> {
  if (typeof window !== "undefined") return

  try {
    if (!existsSync(DB_FILE)) {
      const defaultData = {
        users: [],
        sessions: [],
        loginRecords: [],
        createdAt: new Date().toISOString(),
      }
      writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2))
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

export async function executeQuery(query: string, params?: any[]): Promise<any> {
  if (typeof window !== "undefined") {
    throw new Error("Database queries can only be executed on the server")
  }

  try {
    // For file-based storage, this is a placeholder
    // In a real implementation, this would parse and execute SQL queries
    console.log("Executing query:", query, params)
    return { success: true }
  } catch (error) {
    console.error("Error executing query:", error)
    throw error
  }
}

// Helper function to read database
export function readDatabase(): any {
  if (typeof window !== "undefined") return null

  try {
    if (!existsSync(DB_FILE)) {
      return {
        users: [],
        sessions: [],
        loginRecords: [],
      }
    }
    const data = readFileSync(DB_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return {
      users: [],
      sessions: [],
      loginRecords: [],
    }
  }
}

// Helper function to write database
export function writeDatabase(data: any): void {
  if (typeof window !== "undefined") return

  try {
    writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("Error writing database:", error)
  }
}
