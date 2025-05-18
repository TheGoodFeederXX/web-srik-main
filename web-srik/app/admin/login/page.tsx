"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const loginSchema = z.object({
  email: z.string().email("Sila masukkan emel yang sah"),
  password: z.string().min(6, "Kata laluan mestilah sekurang-kurangnya 6 aksara"),
})

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setError("")
      const response = await fetch("/api/admins/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Emel atau kata laluan tidak sah")
      }

      const result = await response.json()
      
      // Store the token in localStorage or other state management solution
      localStorage.setItem("authToken", result.token)
      
      // Redirect to admin panel
      router.push("/admin/panel")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ralat semasa log masuk")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <Image
                src="/logo.png"
                alt="Logo SRIK"
                fill
                className="object-contain"
                priority
              />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-800">
              Log Masuk Admin
            </CardTitle>
            <CardDescription>
              Log masuk untuk mengurus kandungan laman web
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Emel</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@srik.edu.my"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Kata Laluan</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sedang Masuk..." : "Log Masuk"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
