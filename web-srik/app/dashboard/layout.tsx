import { DashboardNav } from "@/components/dashboard-nav"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-20 z-30 -ml-2 hidden h-[calc(100vh-80px)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6">
            <DashboardNav />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
