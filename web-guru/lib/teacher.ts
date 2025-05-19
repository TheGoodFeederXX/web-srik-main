"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import type { TeacherDetails } from "@/types/teacher"

export async function getTeacherDetails(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("teacher_details").select("*").eq("id", userId).single()

  if (error) {
    return null
  }

  return data as TeacherDetails
}

export async function updateTeacherDetails(details: Partial<TeacherDetails>) {
  const supabase = createClient()

  // Check if teacher details already exist
  const { data: existingData } = await supabase.from("teacher_details").select("id").eq("id", details.id).single()

  if (!existingData) {
    // Generate teacher ID
    const currentYear = new Date().getFullYear().toString().slice(-2)
    const { data: lastTeacher } = await supabase
      .from("teacher_details")
      .select("teacher_id")
      .ilike("teacher_id", `SRIK-G-${currentYear}%`)
      .order("teacher_id", { ascending: false })
      .limit(1)
      .single()

    let newTeacherId = `SRIK-G-${currentYear}001`

    if (lastTeacher) {
      const lastNumber = Number.parseInt(lastTeacher.teacher_id.slice(-3))
      newTeacherId = `SRIK-G-${currentYear}${(lastNumber + 1).toString().padStart(3, "0")}`
    }

    // Insert new teacher details
    const { error } = await supabase.from("teacher_details").insert({
      ...details,
      teacher_id: newTeacherId,
      join_date: new Date(),
    })

    if (error) {
      throw new Error("Failed to create teacher details")
    }
  } else {
    // Update existing teacher details
    const { error } = await supabase
      .from("teacher_details")
      .update({
        ...details,
        updated_at: new Date(),
      })
      .eq("id", details.id)

    if (error) {
      throw new Error("Failed to update teacher details")
    }
  }

  // Update profile
  if (details.full_name) {
    await supabase
      .from("profiles")
      .update({
        full_name: details.full_name,
        updated_at: new Date(),
      })
      .eq("id", details.id)
  }

  return true
}

