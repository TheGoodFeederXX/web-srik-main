import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getTeacherDetails } from "@/lib/teacher"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TeacherProfileForm } from "@/components/teacher-profile-form"
import { TeacherIdCard } from "@/components/teacher-id-card"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const teacherDetails = await getTeacherDetails(session.user.id)

  return (
    <DashboardShell>
      <DashboardHeader heading="Maklumat Guru" text="Urus maklumat peribadi anda dan lihat kad pengenalan guru." />
      <div className="grid gap-8 md:grid-cols-2">
        <TeacherProfileForm user={session.user} teacherDetails={teacherDetails} />
        <TeacherIdCard user={session.user} teacherDetails={teacherDetails} />
      </div>
    </DashboardShell>
  )
}
