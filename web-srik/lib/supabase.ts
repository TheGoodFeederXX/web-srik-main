// Simple Supabase client for direct usage
// This file exists for backward compatibility
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Your project's URL and Key are required to create a Supabase client!\n\nCheck your Supabase project's API settings to find these values"
  )
}

// Create a simple Supabase client
export const supabase = createSupabaseClient(
  supabaseUrl, 
  supabaseAnonKey
)
