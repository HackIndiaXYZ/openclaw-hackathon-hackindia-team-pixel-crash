// Simple in-memory storage for demo purposes
const users: any[] = [
  {
    id: "1",
    email: "admin@agrogenix.com",
    password: "Admin123!",
    name: "Admin User",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user@example.com",
    password: "Password123!",
    name: "Test User",
    role: "USER",
    createdAt: new Date().toISOString(),
  },
]

const loginRecords: any[] = []
const bookings: any[] = []

// User functions
export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email)
}

export function findUserById(id: string) {
  return users.find((user) => user.id === id)
}

export function createUser(userData: any) {
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  return newUser
}

export function getAllUsers() {
  return users.map(({ password, ...user }) => user)
}

// Simple password verification (in production, use proper hashing)
export function verifyPassword(inputPassword: string, storedPassword: string): boolean {
  return inputPassword === storedPassword
}

export function hashPassword(password: string): string {
  // In production, use proper hashing like bcrypt
  return password
}

// Login record functions
export function createLoginRecord(record: any) {
  const newRecord = {
    id: Date.now().toString(),
    ...record,
    timestamp: new Date().toISOString(),
  }
  loginRecords.push(newRecord)
  return newRecord
}

export function getAllLoginRecords() {
  return loginRecords
}

// Booking functions
export function createBooking(booking: any) {
  const newBooking = {
    id: Date.now().toString(),
    ...booking,
    createdAt: new Date().toISOString(),
  }
  bookings.push(newBooking)
  return newBooking
}

export function getAllBookings() {
  return bookings
}

export function updateBookingStatus(id: string, status: string) {
  const booking = bookings.find((b) => b.id === id)
  if (booking) {
    booking.status = status
    booking.updatedAt = new Date().toISOString()
  }
  return booking
}
