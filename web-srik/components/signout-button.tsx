"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  
  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ callbackUrl: "/" })
  }
  
  return (
    <Button 
      variant="outline" 
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </Button>
  )
}
