import { redirect } from "next/navigation"
import { LeaveApplicationForm } from "@/components/leave-application-form"
import { LeaveApplicationList } from "@/components/leave-application-list"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function LeaveApplicationPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get student information with leave applications
  const { data: student } = await supabase
    .from("students")
    .select(`
      *,
      leave_applications (*)
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { referencedTable: "leave_applications", ascending: false })
    .single()

  if (!student) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Permohonan Cuti</h2>
          <p className="text-muted-foreground">Maklumat pelajar tidak ditemui. Sila hubungi pentadbir.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Permohonan Cuti</h2>
        <p className="text-muted-foreground">Mohon cuti dan semak status permohonan cuti</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeaveApplicationForm student={student} />
        <LeaveApplicationList applications={student.leave_applications} />
      </div>
    </div>
  )
}
