"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Teacher, Subject, Classroom, Day, TimeSlot, AcademicTerm, TimetableEntry } from "@/lib/types"
import { createTimetableEntry, updateTimetableEntry } from "@/lib/actions/timetable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface TimetableFormProps {
  teachers: Teacher[]
  subjects: Subject[]
  classrooms: Classroom[]
  days: Day[]
  timeSlots: TimeSlot[]
  academicTerms: AcademicTerm[]
  specialEvents: { day_id: number; time_slot_id: number; name: string }[]
  entry?: TimetableEntry
  prefillEntry?: {
    day_id: number
    time_slot_id: number
    term_id: number
  }
  mode: "create" | "edit"
}

export function TimetableForm({
  teachers,
  subjects,
  classrooms,
  days,
  timeSlots,
  academicTerms,
  specialEvents,
  entry,
  prefillEntry,
  mode,
}: TimetableFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    teacher_id: entry?.teacher_id || "",
    subject_id: entry?.subject_id?.toString() || "",
    classroom_id: entry?.classroom_id?.toString() || "",
    day_id: entry?.day_id?.toString() || prefillEntry?.day_id?.toString() || "",
    time_slot_id: entry?.time_slot_id?.toString() || prefillEntry?.time_slot_id?.toString() || "",
    term_id:
      entry?.term_id?.toString() ||
      prefillEntry?.term_id?.toString() ||
      academicTerms.find((term) => term.is_current)?.id.toString() ||
      "",
  })

  const [selectedTeacherSubjects, setSelectedTeacherSubjects] = useState<Subject[]>([])

  // Update available subjects when teacher changes
  const handleTeacherChange = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    if (teacher && teacher.subjects) {
      const teacherSubjects = subjects.filter((subject) => teacher.subjects.includes(subject.code))
      setSelectedTeacherSubjects(teacherSubjects)

      // Reset subject if current selection is not valid for this teacher
      if (formData.subject_id && !teacherSubjects.some((s) => s.id.toString() === formData.subject_id)) {
        setFormData((prev) => ({ ...prev, subject_id: "" }))
      }
    } else {
      setSelectedTeacherSubjects([])
    }

    setFormData((prev) => ({ ...prev, teacher_id: teacherId }))
  }

  // Check for special events when the component mounts or when day/time slot changes
  useEffect(() => {
    if (formData.day_id && formData.time_slot_id) {
      const dayId = Number.parseInt(formData.day_id)
      const timeSlotId = Number.parseInt(formData.time_slot_id)

      const isSpecialEvent = specialEvents.some((event) => event.day_id === dayId && event.time_slot_id === timeSlotId)

      if (isSpecialEvent) {
        const event = specialEvents.find((event) => event.day_id === dayId && event.time_slot_id === timeSlotId)

        toast({
          title: "Perhatian",
          description: `Slot masa ini dikhaskan untuk ${event?.name}`,
          variant: "destructive",
        })
      }
    }
  }, [formData.day_id, formData.time_slot_id, specialEvents, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Check if the selected time slot is a special event
      const dayId = Number.parseInt(formData.day_id)
      const timeSlotId = Number.parseInt(formData.time_slot_id)

      const isSpecialEvent = specialEvents.some((event) => event.day_id === dayId && event.time_slot_id === timeSlotId)

      if (isSpecialEvent) {
        const event = specialEvents.find((event) => event.day_id === dayId && event.time_slot_id === timeSlotId)
        throw new Error(`Slot masa ini dikhaskan untuk ${event?.name}`)
      }

      // Create form data for submission
      const submitFormData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value)
      })

      if (mode === "create") {
        await createTimetableEntry(submitFormData)
      } else if (mode === "edit" && entry) {
        await updateTimetableEntry(entry.id, submitFormData)
      }

      toast({
        title: "Berjaya",
        description: `Entri jadual berjaya ${mode === "create" ? "dicipta" : "dikemas kini"}`,
      })

      router.push("/timetable")
    } catch (error) {
      toast({
        title: "Ralat",
        description: error instanceof Error ? error.message : "Ralat telah berlaku",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Cipta" : "Sunting"} Entri Jadual</CardTitle>
        <CardDescription>
          {mode === "create" ? "Tambah kelas baru ke jadual" : "Kemas kini kelas sedia ada dalam jadual"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teacher">Guru</Label>
              <Select value={formData.teacher_id} onValueChange={handleTeacherChange} required>
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Pilih guru" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subjek</Label>
              <Select
                value={formData.subject_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, subject_id: value }))}
                required
                disabled={!formData.teacher_id || selectedTeacherSubjects.length === 0}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Pilih subjek" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTeacherSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.code} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classroom">Kelas</Label>
              <Select
                value={formData.classroom_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, classroom_id: value }))}
                required
              >
                <SelectTrigger id="classroom">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id.toString()}>
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="day">Hari</Label>
              <Select
                value={formData.day_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, day_id: value }))}
                required
              >
                <SelectTrigger id="day">
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day.id} value={day.id.toString()}>
                      {day.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlot">Slot Masa</Label>
              <Select
                value={formData.time_slot_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, time_slot_id: value }))}
                required
              >
                <SelectTrigger id="timeSlot">
                  <SelectValue placeholder="Pilih slot masa" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((timeSlot) => (
                    <SelectItem key={timeSlot.id} value={timeSlot.id.toString()}>
                      {timeSlot.slot_number}: {formatTime(timeSlot.start_time)} - {formatTime(timeSlot.end_time)}
                      {timeSlot.is_recess ? " (Rehat)" : ""}
                      {timeSlot.is_prayer ? " (Solat)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Penggal Akademik</Label>
              <Select
                value={formData.term_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, term_id: value }))}
                required
              >
                <SelectTrigger id="term">
                  <SelectValue placeholder="Pilih penggal" />
                </SelectTrigger>
                <SelectContent>
                  {academicTerms.map((term) => (
                    <SelectItem key={term.id} value={term.id.toString()}>
                      {term.name} {term.is_current ? "(Semasa)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Cipta" : "Kemas kini"} Entri
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(":")
  return `${hours}:${minutes}`
}
