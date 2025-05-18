import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getLeaveRequests } from "@/lib/leave"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { LeaveRequestForm } from "@/components/leave-request-form"
import { LeaveRequestsTable } from "@/components/leave-requests-table"

export default async function LeavePage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const leaveRequests = await getLeaveRequests(session.user.id)

  return (
    <DashboardShell>
      <DashboardHeader heading="Permohonan Cuti" text="Mohon cuti dan lihat status permohonan cuti anda." />
      <div className="grid gap-8">
        <LeaveRequestForm user={session.user} />
        <LeaveRequestsTable leaveRequests={leaveRequests} />
      </div>
    </DashboardShell>
  )
}
