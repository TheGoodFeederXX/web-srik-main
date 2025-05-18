"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { generateAITimetable } from "@/lib/ai/timetable-generator"

export async function createTimetableEntry(formData: FormData) {
  const supabase = createClient()

  const teacherId = formData.get("teacher_id") as string
  const subjectId = Number.parseInt(formData.get("subject_id") as string)
  const classroomId = Number.parseInt(formData.get("classroom_id") as string)
  const dayId = Number.parseInt(formData.get("day_id") as string)
  const timeSlotId = Number.parseInt(formData.get("time_slot_id") as string)
  const termId = Number.parseInt(formData.get("term_id") as string)

  // Check for conflicts
  const { data: teacherConflicts } = await supabase
    .from("timetable_entries")
    .select("*")
    .eq("teacher_id", teacherId)
    .eq("day_id", dayId)
    .eq("time_slot_id", timeSlotId)
    .eq("term_id", termId)

  if (teacherConflicts && teacherConflicts.length > 0) {
    throw new Error("Guru sudah mempunyai kelas pada masa ini")
  }

  const { data: classroomConflicts } = await supabase
    .from("timetable_entries")
    .select("*")
    .eq("classroom_id", classroomId)
    .eq("day_id", dayId)
    .eq("time_slot_id", timeSlotId)
    .eq("term_id", termId)

  if (classroomConflicts && classroomConflicts.length > 0) {
    throw new Error("Kelas sudah mempunyai guru pada masa ini")
  }

  // Check for special events
  const { data: specialEvents } = await supabase
    .from("special_events")
    .select("*")
    .eq("day_id", dayId)
    .eq("time_slot_id", timeSlotId)

  if (specialEvents && specialEvents.length > 0) {
    throw new Error(`Slot masa ini dikhaskan untuk ${specialEvents[0].name}`)
  }

  const { error } = await supabase.from("timetable_entries").insert({
    teacher_id: teacherId,
    subject_id: subjectId,
    classroom_id: classroomId,
    day_id: dayId,
    time_slot_id: timeSlotId,
    term_id: termId,
  })

  if (error) {
    throw new Error(`Gagal mencipta entri jadual: ${error.message}`)
  }

  revalidatePath("/timetable")
  redirect("/timetable")
}

export async function updateTimetableEntry(id: string, formData: FormData) {
  const supabase = createClient()

  const teacherId = formData.get("teacher_id") as string
  const subjectId = Number.parseInt(formData.get("subject_id") as string)
  const classroomId = Number.parseInt(formData.get("classroom_id") as string)
  const dayId = Number.parseInt(formData.get("day_id") as string)
  const timeSlotId = Number.parseInt(formData.get("time_slot_id") as string)
  const termId = Number.parseInt(formData.get("term_id") as string)

  // Check for conflicts (excluding this entry)
  const { data: teacherConflicts } = await supabase
    .from("timetable_entries")
    .select("*")
    .eq("teacher_id", teacherId)
    .eq("day_id", dayId)
    .eq("time_slot_id", timeSlotId)
    .eq("term_id", termId)
    .neq("id", id)

  if (teacherConflicts && teacherConflicts.length > 0) {
    throw new Error("Guru sudah mempunyai kelas pada masa ini")
  }

  const { data: classroomConflicts } = await supabase
    .from("timetable_entries")
    .select("*")
    .eq("classroom_id", classroomId)
    .eq("day_id", dayId)
    .eq("time_slot_id", timeSlotId)
    .eq("term_id", termId)
    .neq("id", id)

  if (classroomConflicts && classroomConflicts.length > 0) {
    throw new Error("Kelas sudah mempunyai guru pada masa ini")
  }

  // Check for special events
  const { data: specialEvents } = await supabase
    .from("special_events")
    .select("*")
    .eq("day_id", dayId)
    .eq("time_slot_id", timeSlotId)

  if (specialEvents && specialEvents.length > 0) {
    throw new Error(`Slot masa ini dikhaskan untuk ${specialEvents[0].name}`)
  }

  const { error } = await supabase
    .from("timetable_entries")
    .update({
      teacher_id: teacherId,
      subject_id: subjectId,
      classroom_id: classroomId,
      day_id: dayId,
      time_slot_id: timeSlotId,
      term_id: termId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(`Gagal mengemas kini entri jadual: ${error.message}`)
  }

  revalidatePath("/timetable")
  redirect("/timetable")
}

export async function updateTimetableEntryPosition(id: string, dayId: number, timeSlotId: number) {
  const supabase = createClient()

  // Get the entry to update
  const { data: entry } = await supabase.from("timetable_entries").select("*").eq("id", id).single()

  if (!entry) {
    throw new Error("Entri jadual tidak dijumpai")
  }

  // Check for conflicts at the new position
  const { data: teacherConflicts } = await supabase
    .from("timetable_entries")
    .select("*")
    .eq("teacher_id", entry.teacher_id)
    .eq("day_id", dayId)
    .eq("time_slot_id", timeSlotId)
    .eq("term_id", entry.term_id)
    .neq("id", id)

  if (teacherConflicts && teacherConflicts.length > 0) {
    throw new Error("Guru sudah mempunyai kelas pada masa ini")
  }

  const { data: classroomConflicts } = await supabase
    .from("timetable_entries")
    .select("*")
    .eq("classroom_id", entry.classroom_id)
    .eq("day_id", dayId)
    .eq("time_slot_id", timeSlotId)
    .eq("term_id", entry.term_id)
    .neq("id", id)

  if (classroomConflicts && classroomConflicts.length > 0) {
    throw new Error("Kelas sudah mempunyai guru pada masa ini")
  }

  // Check for special events
  const { data: specialEvents } = await supabase
    .from("special_events")
    .select("*")
    .eq("day_id", dayId)
    .eq("time_slot_id", timeSlotId)

  if (specialEvents && specialEvents.length > 0) {
    throw new Error(`Slot masa ini dikhaskan untuk ${specialEvents[0].name}`)
  }

  // Update the entry
  const { error } = await supabase
    .from("timetable_entries")
    .update({
      day_id: dayId,
      time_slot_id: timeSlotId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(`Gagal mengemas kini posisi entri jadual: ${error.message}`)
  }

  revalidatePath("/timetable")
}

export async function deleteTimetableEntry(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("timetable_entries").delete().eq("id", id)

  if (error) {
    throw new Error(`Gagal memadam entri jadual: ${error.message}`)
  }

  revalidatePath("/timetable")
}

export async function generateTimetable(termId: number) {
  const supabase = createClient()

  try {
    // Get all required data
    const { data: teachers } = await supabase.from("users").select("*")
    const { data: subjects } = await supabase.from("subjects").select("*")
    const { data: classrooms } = await supabase.from("classrooms").select("*")
    const { data: days } = await supabase.from("days").select("*").order("day_order")
    const { data: timeSlots } = await supabase.from("time_slots").select("*").order("slot_number")
    const { data: specialEvents } = await supabase.from("special_events").select("*")

    if (!teachers || !subjects || !classrooms || !days || !timeSlots || !specialEvents) {
      throw new Error("Gagal mendapatkan data yang diperlukan")
    }

    // Clear existing timetable for this term
    await supabase.from("timetable_entries").delete().eq("term_id", termId)

    // Use AI to generate the timetable
    const timetableEntries = await generateAITimetable(
      teachers,
      subjects,
      classrooms,
      days,
      timeSlots,
      specialEvents,
      termId,
    )

    // Insert generated timetable entries
    if (timetableEntries.length > 0) {
      const { error } = await supabase.from("timetable_entries").insert(timetableEntries)

      if (error) {
        throw new Error(`Gagal memasukkan entri jadual: ${error.message}`)
      }
    }

    revalidatePath("/timetable")
    redirect("/timetable")
  } catch (error) {
    console.error("Error generating timetable:", error)
    throw error
  }
}
