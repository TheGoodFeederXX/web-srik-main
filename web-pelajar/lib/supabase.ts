// This file exists for backward compatibility
// Please use lib/supabase/client.ts or lib/supabase/server.ts instead
import { createClient as createClientFn } from "./supabase/client"

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Legacy export - use the new pattern instead
export const supabase = createClientFn()
