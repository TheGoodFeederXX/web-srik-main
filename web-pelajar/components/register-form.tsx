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

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [studentId, setStudentId] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { supabase } = useSupabase()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            student_id: studentId,
          },
        },
      })

      if (authError) {
        toast({
          title: "Ralat Pendaftaran",
          description: authError.message,
          variant: "destructive",
        })
        return
      }

      if (authData.user) {
        // Check if student exists
        const { data: existingStudent } = await supabase
          .from("students")
          .select("*")
          .eq("student_id", studentId)
          .single()

        if (existingStudent) {
          // Update existing student with user_id
          await supabase.from("students").update({ user_id: authData.user.id }).eq("id", existingStudent.id)
        } else {
          // Create new student record
          await supabase.from("students").insert({
            student_id: studentId,
            name: name,
            user_id: authData.user.id,
          })
        }

        // Create profile
        await supabase.from("profiles").insert({
          user_id: authData.user.id,
          full_name: name,
        })

        toast({
          title: "Pendaftaran Berjaya",
          description: "Akaun anda telah berjaya didaftarkan. Sila log masuk.",
        })
        router.push("/login")
      }
    } catch (error) {
      toast({
        title: "Ralat",
        description: "Terdapat masalah semasa pendaftaran. Sila cuba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Penuh</Label>
        <Input id="name" placeholder="Nama Penuh" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
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
        <Label htmlFor="studentId">No. Pelajar</Label>
        <Input
          id="studentId"
          placeholder="SRIK-P-24001"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Kata Laluan</Label>
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
        {isLoading ? "Sedang Mendaftar..." : "Daftar"}
      </Button>
      <div className="text-center text-sm">
        <span className="text-gray-600">Sudah mempunyai akaun? </span>
        <Link href="/login" className="text-green-600 hover:text-green-800">
          Log masuk di sini
        </Link>
      </div>
    </form>
  )
}
