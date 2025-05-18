import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TeacherStats } from "@/components/teacher-stats"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Selamat datang ke Sistem Pengurusan Guru Sekolah Rendah Islam Al-Khairiah."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TeacherStats />
      </div>
    </DashboardShell>
  )
}
