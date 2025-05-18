"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  email: z.string().email({
    message: "Sila masukkan alamat emel yang sah.",
  }),
  password: z.string().min(6, {
    message: "Kata laluan mestilah sekurang-kurangnya 6 aksara.",
  }),
})

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
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
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      })

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Ralat log masuk",
          description: "Emel atau kata laluan tidak sah.",
        })
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ralat log masuk",
        description: "Sila cuba lagi kemudian.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="w-32 h-32 relative mb-4">
          <Image src="/logo.png" alt="Logo Sekolah Rendah Islam Al-Khairiah" fill className="object-contain" />
        </div>
        <CardTitle className="text-2xl text-center">Sekolah Rendah Islam Al-Khairiah</CardTitle>
        <CardDescription className="text-center">Masukkan maklumat log masuk anda untuk akses sistem.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emel</FormLabel>
                  <FormControl>
                    <Input placeholder="contoh@alkhairiah.edu.my" {...field} />
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Log Masuk..." : "Log Masuk"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-xs text-center text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()} Sekolah Rendah Islam Al-Khairiah. Hak Cipta Terpelihara.
        </p>
      </CardFooter>
    </Card>
  )
}
