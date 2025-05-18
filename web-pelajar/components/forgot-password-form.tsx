"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useSupabase } from "@/components/supabase-provider"

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()
  const { supabase } = useSupabase()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        toast({
          title: "Ralat",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setIsSubmitted(true)
        toast({
          title: "Email Dihantar",
          description: "Sila semak email anda untuk pautan menetapkan semula kata laluan.",
        })
      }
    } catch (error) {
      toast({
        title: "Ralat",
        description: "Terdapat masalah semasa menghantar email. Sila cuba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <p className="mb-4">
          Kami telah menghantar pautan menetapkan semula kata laluan ke email anda. Sila semak email anda.
        </p>
        <Link href="/login">
          <Button variant="link">Kembali ke Log Masuk</Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="nama@contoh.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sedang Menghantar..." : "Hantar Pautan Tetapan Semula"}
      </Button>
      <div className="text-center text-sm">
        <Link href="/login" className="text-green-600 hover:text-green-800">
          Kembali ke Log Masuk
        </Link>
      </div>
    </form>
  )
}
