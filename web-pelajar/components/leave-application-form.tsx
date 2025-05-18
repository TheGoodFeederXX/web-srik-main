"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useSupabase } from "@/components/supabase-provider"

interface LeaveApplicationFormProps {
  student: {
    id: string
    student_id: string
    name: string
  }
}

export function LeaveApplicationForm({ student }: LeaveApplicationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [reason, setReason] = useState("")
  const { toast } = useToast()
  const { supabase } = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!startDate || !endDate) {
      toast({
        title: "Ralat",
        description: "Sila pilih tarikh mula dan tarikh akhir cuti.",
        variant: "destructive",
      })
      return
    }

    if (startDate > endDate) {
      toast({
        title: "Ralat",
        description: "Tarikh mula cuti tidak boleh selepas tarikh akhir cuti.",
        variant: "destructive",
      })
      return
    }

    if (!reason.trim()) {
      toast({
        title: "Ralat",
        description: "Sila masukkan sebab permohonan cuti.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.from("leave_applications").insert({
        student_id: student.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        reason,
        status: "pending",
      })

      if (error) {
        throw error
      }

      toast({
        title: "Permohonan Berjaya",
        description: "Permohonan cuti anda telah berjaya dihantar.",
      })

      // Reset form
      setStartDate(undefined)
      setEndDate(undefined)
      setReason("")

      // Refresh the page to show the new application
      window.location.reload()
    } catch (error) {
      toast({
        title: "Ralat",
        description: "Terdapat masalah semasa menghantar permohonan.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permohonan Cuti Baru</CardTitle>
        <CardDescription>Isi borang di bawah untuk memohon cuti</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentName">Nama Pelajar</Label>
            <Input id="studentName" value={student.name} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">No. Pelajar</Label>
            <Input id="studentId" value={student.student_id} disabled />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tarikh Mula</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Pilih tarikh"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Tarikh Akhir</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Pilih tarikh"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Sebab Permohonan</Label>
            <Textarea
              id="reason"
              placeholder="Sila nyatakan sebab permohonan cuti"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sedang Menghantar..." : "Hantar Permohonan"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
