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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { updateTeacherDetails } from "@/lib/teacher"
import type { TeacherDetails } from "@/types/teacher"

const formSchema = z.object({
  full_name: z.string().min(2, {
    message: "Nama mestilah sekurang-kurangnya 2 aksara.",
  }),
  ic_number: z.string().regex(/^\d{6}-\d{2}-\d{4}$/, {
    message: "Nombor kad pengenalan mestilah dalam format 'XXXXXX-XX-XXXX'.",
  }),
  date_of_birth: z.string().min(1, {
    message: "Sila pilih tarikh lahir.",
  }),
  home_address: z.string().min(5, {
    message: "Alamat mestilah sekurang-kurangnya 5 aksara.",
  }),
  marital_status: z.enum(["Bujang", "Berkahwin", "Bercerai", "Balu/Duda"]),
  spouse_name: z.string().optional(),
  spouse_ic_number: z
    .string()
    .regex(/^\d{6}-\d{2}-\d{4}$/, {
      message: "Nombor kad pengenalan mestilah dalam format 'XXXXXX-XX-XXXX'.",
    })
    .optional(),
  spouse_phone: z
    .string()
    .regex(/^01\d-\d{7,8}$/, {
      message: "Nombor telefon mestilah dalam format '01X-XXXXXXX'.",
    })
    .optional(),
})

interface TeacherProfileFormProps {
  user: User
  teacherDetails?: TeacherDetails | null
}

export function TeacherProfileForm({ user, teacherDetails }: TeacherProfileFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showSpouseFields, setShowSpouseFields] = useState(teacherDetails?.marital_status === "Berkahwin")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user.name || "",
      ic_number: teacherDetails?.ic_number || "",
      date_of_birth: teacherDetails?.date_of_birth
        ? new Date(teacherDetails.date_of_birth).toISOString().split("T")[0]
        : "",
      home_address: teacherDetails?.home_address || "",
      marital_status: teacherDetails?.marital_status || "Bujang",
      spouse_name: teacherDetails?.spouse_name || "",
      spouse_ic_number: teacherDetails?.spouse_ic_number || "",
      spouse_phone: teacherDetails?.spouse_phone || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      await updateTeacherDetails({
        id: user.id,
        ...values,
        date_of_birth: new Date(values.date_of_birth),
      })

      toast({
        title: "Maklumat dikemaskini",
        description: "Maklumat guru telah berjaya dikemaskini.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ralat",
        description: "Gagal mengemaskini maklumat guru. Sila cuba lagi.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maklumat Peribadi</CardTitle>
        <CardDescription>Kemaskini maklumat peribadi anda di sini.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Penuh</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ic_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombor Kad Pengenalan</FormLabel>
                  <FormControl>
                    <Input placeholder="XXXXXX-XX-XXXX" {...field} />
                  </FormControl>
                  <FormDescription>Format: XXXXXX-XX-XXXX</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarikh Lahir</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="home_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Rumah</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marital_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Perkahwinan</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setShowSpouseFields(value === "Berkahwin")
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status perkahwinan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bujang">Bujang</SelectItem>
                      <SelectItem value="Berkahwin">Berkahwin</SelectItem>
                      <SelectItem value="Bercerai">Bercerai</SelectItem>
                      <SelectItem value="Balu/Duda">Balu/Duda</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showSpouseFields && (
              <>
                <FormField
                  control={form.control}
                  name="spouse_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Pasangan</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="spouse_ic_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombor Kad Pengenalan Pasangan</FormLabel>
                      <FormControl>
                        <Input placeholder="XXXXXX-XX-XXXX" {...field} />
                      </FormControl>
                      <FormDescription>Format: XXXXXX-XX-XXXX</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="spouse_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombor Telefon Pasangan</FormLabel>
                      <FormControl>
                        <Input placeholder="01X-XXXXXXX" {...field} />
                      </FormControl>
                      <FormDescription>Format: 01X-XXXXXXX</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mengemaskini..." : "Kemaskini"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
