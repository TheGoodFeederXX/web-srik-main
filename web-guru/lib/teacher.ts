"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import type { TeacherDetails } from "@/types/teacher"

export async function getTeacherDetails(userId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  const { data, error } = await supabase.from("teacher_details").select("*").eq("id", userId).single()

  if (error) {
    return null
  }

  return data as TeacherDetails
}

export async function updateTeacherDetails(details: Partial<TeacherDetails>) {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

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
