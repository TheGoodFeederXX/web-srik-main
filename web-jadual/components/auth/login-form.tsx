"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { signIn, signOut } from "@/lib/auth"

const formSchema = z.object({
  email: z.string()
    .email({
      message: "Sila masukkan alamat emel yang sah.",
    })
    .refine((email) => email.endsWith("@srialkhairiah.my"), {
      message: "Hanya alamat emel @srialkhairiah.my dibenarkan.",
    }),
  password: z.string().min(6, {
    message: "Kata laluan mestilah sekurang-kurangnya 6 aksara.",
  }),
})

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSSO, setIsSSO] = useState(false)
  
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
      await signIn(values.email, values.password);
      
      toast({
        title: "Berjaya log masuk",
        description: "Anda telah berjaya log masuk ke sistem",
      })
      
      router.push("/dashboard")
      router.refresh()
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ralat log masuk",
        description: error?.message || "Sila cuba lagi kemudian.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSOLogin = async () => {
    setIsSSO(true)
    try {
      const currentURL = window.location.href;
      window.location.href = `${process.env.NEXT_PUBLIC_SSO_SERVER}/api/auth/sso/login?callback=${encodeURIComponent(currentURL)}`;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ralat SSO",
        description: "Sila cuba lagi kemudian.",
      });
      setIsSSO(false);
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleSSOLogin}
        disabled={isSSO || isLoading}
      >
        {isSSO ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sedang log masuk dengan SSO...
          </>
        ) : (
          "Log Masuk dengan SSO"
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Atau log masuk dengan kata laluan
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email</Label>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="contoh@srialkhairiah.my"
                    type="email"
                    autoComplete="email"
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
                <Label htmlFor="password">Kata Laluan</Label>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading || isSSO}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sedang log masuk...
              </>
            ) : (
              "Log Masuk"
            )}
          </Button>
        </form>
      </Form>
    </Card>
  )
}
