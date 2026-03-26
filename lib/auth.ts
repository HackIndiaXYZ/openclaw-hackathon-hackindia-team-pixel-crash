// Simple file-based authentication system
import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"

const DATA_DIR = join(process.cwd(), "data")
const USERS_FILE = join(DATA_DIR, "users.json")
const SESSIONS_FILE = join(DATA_DIR, "sessions.json")

// Ensure data directory exists
if (typeof window === "undefined") {
  const fs = require("fs")
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export interface User {
  id: string
  email: string
  name: string
  password: string
  createdAt: string
}

export interface Session {
  id: string
  userId: string
  createdAt: string
  expiresAt: string
}

// Get current user from localStorage (client-side only)
export function getUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const userData = localStorage.getItem("agro-genix-user")
    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getUser() !== null
}

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false

  try {
    const userData = localStorage.getItem("agro-genix-user")
    if (!userData) return false

    const user = JSON.parse(userData)
    // Check if user has admin role (you can customize this logic)
    return user.role === "admin" || user.email === "admin@agro-genix.com"
  } catch {
    return false
  }
}

// Login user (store in localStorage)
export function loginUser(user: User): void {
  if (typeof window === "undefined") return

  const userWithoutPassword = {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  }

  localStorage.setItem("agro-genix-user", JSON.stringify(userWithoutPassword))
}

// Logout user
export function logout(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("agro-genix-user")
  window.location.href = "/login"
}

// Server-side functions for file operations
export function getUsers(): User[] {
  if (typeof window !== "undefined") return []

  try {
    if (!existsSync(USERS_FILE)) {
      return []
    }
    const data = readFileSync(USERS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveUsers(users: User[]): void {
  if (typeof window !== "undefined") return

  try {
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error("Error saving users:", error)
  }
}

export function createUser(email: string, name: string, password: string): User {
  const user: User = {
    id: Date.now().toString(),
    email,
    name,
    password,
    createdAt: new Date().toISOString(),
  }

  const users = getUsers()
  users.push(user)
  saveUsers(users)

  return user
}

export function findUserByEmail(email: string): User | null {
  const users = getUsers()
  return users.find((user) => user.email === email) || null
}

export function validatePassword(user: User, password: string): boolean {
  return user.password === password
}
