"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Teacher, Subject, Classroom, Day, TimeSlot, SpecialEvent } from "@/lib/types"

export async function generateAITimetable(
  teachers: Teacher[],
  subjects: Subject[],
  classrooms: Classroom[],
  days: Day[],
  timeSlots: TimeSlot[],
  specialEvents: SpecialEvent[],
  termId: number,
) {
  try {
    // Prepare data for the AI
    const teachersData = teachers
      .filter((teacher) => teacher.subjects && teacher.subjects.length > 0)
      .map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        subjects: teacher.subjects,
      }))

    const subjectsData = subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      code: subject.code,
    }))

    const classroomsData = classrooms.map((classroom) => ({
      id: classroom.id,
      name: classroom.name,
    }))

    const daysData = days.map((day) => ({
      id: day.id,
      name: day.name,
      day_order: day.day_order,
    }))

    const timeSlotsData = timeSlots.map((slot) => ({
      id: slot.id,
      slot_number: slot.slot_number,
      start_time: slot.start_time,
      end_time: slot.end_time,
      is_recess: slot.is_recess,
      is_prayer: slot.is_prayer,
    }))

    const specialEventsData = specialEvents.map((event) => ({
      name: event.name,
      day_id: event.day_id,
      time_slot_id: event.time_slot_id,
    }))

    // Create the prompt for the AI
    const prompt = `
      Saya perlu menjana jadual waktu untuk sekolah. Berikut adalah data yang tersedia:
      
      GURU:
      ${JSON.stringify(teachersData, null, 2)}
      
      SUBJEK:
      ${JSON.stringify(subjectsData, null, 2)}
      
      KELAS:
      ${JSON.stringify(classroomsData, null, 2)}
      
      HARI:
      ${JSON.stringify(daysData, null, 2)}
      
      SLOT MASA:
      ${JSON.stringify(timeSlotsData, null, 2)}
      
      ACARA KHAS (tidak boleh ada kelas pada slot ini):
      ${JSON.stringify(specialEventsData, null, 2)}
      
      Peraturan untuk jadual:
      1. Setiap guru hanya boleh mengajar satu kelas pada satu masa
      2. Setiap kelas hanya boleh diajar oleh satu guru pada satu masa
      3. Guru hanya boleh mengajar subjek yang mereka mahir
      4. Tidak boleh ada kelas semasa rehat (is_recess = true) atau solat (is_prayer = true)
      5. Tidak boleh ada kelas semasa acara khas
      6. Setiap kelas perlu mempunyai sekurang-kurangnya satu sesi untuk setiap subjek dalam seminggu
      7. Setiap guru perlu mempunyai beban kerja yang seimbang
      
      Sila jana jadual dalam format JSON yang mengandungi array objek dengan struktur berikut:
      {
        "teacher_id": string,
        "subject_id": number,
        "classroom_id": number,
        "day_id": number,
        "time_slot_id": number,
        "term_id": ${termId}
      }
      
      Berikan hanya array JSON tanpa penjelasan tambahan.
    `

    // Call the AI to generate the timetable
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 4000,
    })

    // Parse the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("Gagal mendapatkan respons JSON daripada AI")
    }

    const timetableEntries = JSON.parse(jsonMatch[0])

    // Validate the entries
    const validatedEntries = timetableEntries.filter((entry: any) => {
      // Check if all required fields are present
      if (
        !entry.teacher_id ||
        !entry.subject_id ||
        !entry.classroom_id ||
        !entry.day_id ||
        !entry.time_slot_id ||
        !entry.term_id
      ) {
        return false
      }

      // Check if the teacher exists
      const teacher = teachers.find((t) => t.id === entry.teacher_id)
      if (!teacher) return false

      // Check if the subject exists
      const subject = subjects.find((s) => s.id === entry.subject_id)
      if (!subject) return false

      // Check if the teacher can teach this subject
      if (!teacher.subjects?.includes(subject.code)) return false

      // Check if the classroom exists
      if (!classrooms.some((c) => c.id === entry.classroom_id)) return false

      // Check if the day exists
      if (!days.some((d) => d.id === entry.day_id)) return false

      // Check if the time slot exists
      const timeSlot = timeSlots.find((t) => t.id === entry.time_slot_id)
      if (!timeSlot) return false

      // Check if the time slot is not recess or prayer
      if (timeSlot.is_recess || timeSlot.is_prayer) return false

      // Check if there's no special event at this time
      if (specialEvents.some((e) => e.day_id === entry.day_id && e.time_slot_id === entry.time_slot_id)) {
        return false
      }

      return true
    })

    return validatedEntries
  } catch (error) {
    console.error("Error in AI timetable generation:", error)
    throw new Error("Gagal menjana jadual menggunakan AI: " + (error as Error).message)
  }
}
