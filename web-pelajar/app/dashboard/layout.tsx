import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).single()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Sekolah Rendah Islam Al-Khairiah"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <h1 className="text-lg font-bold hidden md:block">Sekolah Rendah Islam Al-Khairiah</h1>
          </Link>
          <UserNav
            user={{
              name: profile?.full_name || session.user.email,
              email: session.user.email,
              image: profile?.avatar_url,
            }}
          />
        </div>
      </header>
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
