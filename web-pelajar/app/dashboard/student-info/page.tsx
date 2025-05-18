import { redirect } from "next/navigation"
import { StudentProfile } from "@/components/student-profile"
import { StudentIdCard } from "@/components/student-id-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function StudentInfoPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get student information
  const { data: student } = await supabase.from("students").select("*").eq("user_id", session.user.id).single()

  if (!student) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Maklumat Pelajar</h2>
          <p className="text-muted-foreground">Maklumat pelajar tidak ditemui. Sila hubungi pentadbir.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Maklumat Pelajar</h2>
        <p className="text-muted-foreground">Lihat dan kemaskini maklumat peribadi pelajar</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profil Pelajar</TabsTrigger>
          <TabsTrigger value="id-card">Kad Pengenalan Pelajar</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <StudentProfile student={student} />
        </TabsContent>
        <TabsContent value="id-card">
          <StudentIdCard student={student} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
