"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { User } from "next-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createLeaveRequest } from "@/lib/leave"

const formSchema = z.object({
  start_date: z.string().min(1, {
    message: "Sila pilih tarikh mula.",
  }),
  end_date: z.string().min(1, {
    message: "Sila pilih tarikh tamat.",
  }),
  reason: z.string().min(5, {
    message: "Sebab mestilah sekurang-kurangnya 5 aksara.",
  }),
})

interface LeaveRequestFormProps {
  user: User
}

export function LeaveRequestForm({ user }: LeaveRequestFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_date: "",
      end_date: "",
      reason: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      await createLeaveRequest({
        user_id: user.id,
        start_date: new Date(values.start_date),
        end_date: new Date(values.end_date),
        reason: values.reason,
      })

      toast({
        title: "Permohonan dihantar",
        description: "Permohonan cuti anda telah berjaya dihantar.",
      })

      form.reset()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ralat",
        description: "Gagal menghantar permohonan cuti. Sila cuba lagi.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permohonan Cuti Baru</CardTitle>
        <CardDescription>Isi borang di bawah untuk memohon cuti.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarikh Mula</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarikh Tamat</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sebab</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormDescription>Sila berikan sebab yang terperinci untuk permohonan cuti anda.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menghantar..." : "Hantar Permohonan"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
