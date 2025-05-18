"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { supabase } = useSupabase()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      toast({
        title: "Ralat",
        description: "Kata laluan tidak sepadan. Sila cuba lagi.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        toast({
          title: "Ralat",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Kata Laluan Dikemaskini",
          description: "Kata laluan anda telah berjaya dikemaskini.",
        })
        router.push("/login")
      }
    } catch (error) {
      toast({
        title: "Ralat",
        description: "Terdapat masalah semasa menetapkan semula kata laluan. Sila cuba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Kata Laluan Baru</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Sahkan Kata Laluan</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sedang Menetapkan Semula..." : "Tetapkan Semula Kata Laluan"}
      </Button>
    </form>
  )
}
