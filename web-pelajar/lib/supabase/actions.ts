"use server"

import { createClient } from "./server"
import { revalidatePath } from "next/cache"

/**
 * Get user profile data
 */
export async function getUserProfile(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()
  
  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
  
  return data
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, profileData: any) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("profiles")
    .update(profileData)
    .eq("id", userId)
    .select()
    .single()
  
  if (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: error.message }
  }
  
  // Revalidate paths that might show profile data
  revalidatePath('/profile')
  revalidatePath('/dashboard')
  
  return { success: true, data }
}

/**
 * Check Supabase connection
 */
export async function checkSupabaseConnection() {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.from("profiles").select("count").limit(1)
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    return { success: false, error: errorMessage }
  }
}
