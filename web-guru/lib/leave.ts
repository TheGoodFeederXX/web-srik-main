"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import type { LeaveRequest } from "@/types/leave"

export async function getLeaveRequests(userId: string) {
  const supabase = createClient()

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
  const supabase = createClient()

  const { error } = await supabase.from("leave_requests").insert({
    ...request,
    status: "pending",
  })

  if (error) {
    throw new Error("Failed to create leave request")
  }

  return true
}

