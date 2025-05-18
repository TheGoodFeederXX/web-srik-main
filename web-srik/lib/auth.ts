// Authentication Token Management
export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}

// JWT Payload Type
export interface JwtPayload {
  id: string
  email: string
  name: string | null
  iat: number
  exp: number
}

// Auth State Management
let currentUser: JwtPayload | null = null

export function setCurrentUser(user: JwtPayload | null) {
  currentUser = user
}

export function getCurrentUser(): JwtPayload | null {
  return currentUser
}

// Auth Check Function
export function isAuthenticated(): boolean {
  const token = getAuthToken()
  if (!token) return false

  try {
    // Simple check for token expiration
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload
    const expiry = payload.exp * 1000 // Convert to milliseconds
    return expiry > Date.now()
  } catch {
    return false
  }
}
