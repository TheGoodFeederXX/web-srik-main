"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, signIn as authSignIn, signOut as authSignOut, getSession } from "@/lib/auth"
import { getSSO, getSSOLoginURL, clearSSOCookie } from "@/lib/sso"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User }>
  signOut: () => Promise<void>
  signInWithSSO: () => void
  isSSO: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSSO, setIsSSO] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for SSO session first
        const ssoSession = await getSSO()
        if (ssoSession) {
          setUser({
            id: ssoSession.user.id,
            email: ssoSession.user.email,
            name: ssoSession.user.name,
            image: ssoSession.user.image,
          })
          setIsSSO(true)
          return
        }

        // Fall back to local session
        const session = await getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password)
    setUser(result.user)
    setIsSSO(false)
    return result
  }

  const signOut = async () => {
    await authSignOut()
    if (isSSO) {
      clearSSOCookie()
      setIsSSO(false)
    }
    setUser(null)
  }

  const signInWithSSO = () => {
    const currentURL = window.location.href
    window.location.href = getSSOLoginURL(currentURL)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signInWithSSO, isSSO }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
