// Supabase client setup for both client and server components
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
// Using native supabase-js instead of auth-helpers-nextjs
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type CookieOptions } from "@supabase/ssr"
// Import Database type or use any if not available
// import { Database } from "@/types/database.types"
type Database = any

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Your project's URL and Key are required to create a Supabase client!\n\nCheck your Supabase project's API settings to find these values"
  )
}

// Client for client components
export const createClient = () => {
  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })
}

// Server client with cookies
export function createServerSupabaseClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    }
  )
}

// Legacy client for backward compatibility
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
