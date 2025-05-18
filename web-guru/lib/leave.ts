"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import type { LeaveRequest } from "@/types/leave"

export async function getLeaveRequests(userId: string) {
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

  const { data, error } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    return []
  }

  return data as LeaveRequest[]
}

export async function createLeaveRequest(
  request: Omit<LeaveRequest, "id" | "status" | "created_at" | "updated_at" | "approved_by">,
) {
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

  const { error } = await supabase.from("leave_requests").insert({
    ...request,
    status: "pending",
  })

  if (error) {
    throw new Error("Failed to create leave request")
  }

  return true
}
