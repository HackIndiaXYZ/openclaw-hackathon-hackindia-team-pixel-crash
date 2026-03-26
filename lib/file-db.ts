import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Define the data directory
const DATA_DIR = path.join(process.cwd(), "data")

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Define the file paths
const USERS_FILE = path.join(DATA_DIR, "users.json")
const LOGIN_RECORDS_FILE = path.join(DATA_DIR, "login-records.json")
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json")

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]))
}

if (!fs.existsSync(LOGIN_RECORDS_FILE)) {
  fs.writeFileSync(LOGIN_RECORDS_FILE, JSON.stringify([]))
}

if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]))
}

// Types
export type User = {
  id: string
  email: string
  password: string
  name?: string
  role: "USER" | "ADMIN"
  createdAt: string
}

export type LoginRecord = {
  id: string
  userId: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

export type Booking = {
  id: string
  userId: string
  farmId: string
  farmName: string
  date: string
  timeSlot: string
  adults: number
  children: number
  totalPrice: number
  activities: string[]
  specialRequests?: string
  status: string
  createdAt: string
}

// Helper functions
function readFile<T>(filePath: string): T {
  const data = fs.readFileSync(filePath, "utf8")
  return JSON.parse(data) as T
}

function writeFile<T>(filePath: string, data: T): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

// User functions
export function getUsers(): User[] {
  return readFile<User[]>(USERS_FILE)
}

export function getUserById(id: string): User | undefined {
  const users = getUsers()
  return users.find((user) => user.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers()
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

export function createUser(email: string, password: string, name?: string, role: "USER" | "ADMIN" = "USER"): User {
  const users = getUsers()

  const newUser: User = {
    id: uuidv4(),
    email,
    password,
    name,
    role,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  writeFile(USERS_FILE, users)

  return newUser
}

// Login record functions
export function getLoginRecords(): LoginRecord[] {
  return readFile<LoginRecord[]>(LOGIN_RECORDS_FILE)
}

export function createLoginRecord(userId: string, ipAddress?: string, userAgent?: string): LoginRecord {
  const records = getLoginRecords()

  const newRecord: LoginRecord = {
    id: uuidv4(),
    userId,
    timestamp: new Date().toISOString(),
    ipAddress,
    userAgent,
  }

  records.push(newRecord)
  writeFile(LOGIN_RECORDS_FILE, records)

  return newRecord
}

// Booking functions
export function getBookings(): Booking[] {
  return readFile<Booking[]>(BOOKINGS_FILE)
}

export function getBookingsByUserId(userId: string): Booking[] {
  const bookings = getBookings()
  return bookings.filter((booking) => booking.userId === userId)
}

export function createBooking(bookingData: Omit<Booking, "id" | "createdAt">): Booking {
  const bookings = getBookings()

  const newBooking: Booking = {
    ...bookingData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }

  bookings.push(newBooking)
  writeFile(BOOKINGS_FILE, bookings)

  return newBooking
}

// Initialize with admin and test user
export function initializeUsers(): void {
  const users = getUsers()

  // Only add if no users exist
  if (users.length === 0) {
    // Add admin user
    createUser(
      "admin@agrogenix.com",
      "$2a$12$8vxYfAWyUCRJlEbS7yMrA.Xh0dRJCQ7Fl7Ew9aBJmWn4bTcwGuRnK",
      "Admin User",
      "ADMIN",
    )

    // Add test user
    createUser("user@example.com", "$2a$12$Jm3YQTzTnNYT7EsKgRxAO.UJOmCQBZJczGWrUGQ0Ot9xJJMdgvK8y", "Test User", "USER")

    console.log("Users initialized")
  }
}
