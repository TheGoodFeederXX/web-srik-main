import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/signout-button"
import Link from "next/link"
import { getSession } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getSession()
  
  if (!session) {
    redirect("/login")
  }
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <SignOutButton />
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {session.user.name || session.user.email}</h2>
        <p className="text-muted-foreground mb-4">
          You are signed in and viewing your personal dashboard.
        </p>
        <div className="flex space-x-4">
          <Link href="/supabase-test">
            <Button>View Supabase Test</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">User Information</h3>
          <div className="space-y-2">
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>User ID:</strong> {session.user.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
