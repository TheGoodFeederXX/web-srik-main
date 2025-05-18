import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect authenticated users to dashboard, unauthenticated to login
  if (session) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }

  // This won't be reached due to redirects, but needed for TypeScript
  return null
}
