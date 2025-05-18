import type React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { SiteFooter } from "@/components/site-footer"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <UserNav user={session.user} />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
      <SiteFooter />
    </div>
  )
}
