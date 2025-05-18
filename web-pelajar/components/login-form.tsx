"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useSupabase } from "@/components/supabase-provider"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { supabase } = useSupabase()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Ralat Log Masuk",
          description: error.message,
          variant: "destructive",
        })
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Ralat",
        description: "Terdapat masalah semasa log masuk. Sila cuba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Kata Laluan</Label>
          <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-800">
            Lupa Kata Laluan?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sedang Log Masuk..." : "Log Masuk"}
      </Button>
      <div className="text-center text-sm">
        <span className="text-gray-600">Belum mempunyai akaun? </span>
        <Link href="/register" className="text-green-600 hover:text-green-800">
          Daftar di sini
        </Link>
      </div>
    </form>
  )
}
