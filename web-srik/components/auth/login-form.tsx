"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Sila masukkan alamat emel yang sah." })
    .refine((email) => email.endsWith("@srialkhairiah.my"), {
      message: "Hanya alamat emel @srialkhairiah.my dibenarkan.",
    }),
  password: z.string().min(6, "Kata laluan mestilah sekurang-kurangnya 6 aksara."),
})

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      await signIn(values.email, values.password)
      toast({
        title: "Berjaya log masuk",
        description: "Anda telah berjaya log masuk ke sistem.",
      })
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ralat log masuk",
        description: "Emel atau kata laluan tidak sah.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  placeholder="contoh@srialkhairiah.my"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kata Laluan</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Log masuk..." : "Log masuk"}
        </Button>
      </form>
    </Form>
  )
}
