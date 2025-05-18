import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { AcademicClassInfo } from "@/components/academic-class-info"
import { ExamResults } from "@/components/exam-results"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function AcademicInfoPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get student information with class and exam results
  const { data: student } = await supabase
    .from("students")
    .select(`
      *,
      classes:class_id (*,
        teachers:teacher_id (*)
      ),
      exam_results (
        *,
        exams:exam_id (*)
      ),
      fee_payments!inner (*)
    `)
    .eq("user_id", session.user.id)
    .single()

  if (!student) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Maklumat Akademik</h2>
          <p className="text-muted-foreground">Maklumat pelajar tidak ditemui. Sila hubungi pentadbir.</p>
        </div>
      </div>
    )
  }

  // Check for pending fees
  const hasPendingFees = student.fee_payments.some(
    (payment: any) => !payment.is_paid && new Date(payment.due_date) < new Date(),
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Maklumat Akademik</h2>
        <p className="text-muted-foreground">Lihat kelas, jadual dan keputusan peperiksaan</p>
      </div>

      {hasPendingFees && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Yuran Tertunggak</AlertTitle>
          <AlertDescription>
            Anda mempunyai yuran tertunggak. Keputusan peperiksaan tidak dapat diakses sehingga yuran dijelaskan.{" "}
            <Link href="/dashboard/fee-payment" className="font-medium underline">
              Bayar sekarang
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="class" className="w-full">
        <TabsList>
          <TabsTrigger value="class">Maklumat Kelas</TabsTrigger>
          <TabsTrigger value="exams">Keputusan Peperiksaan</TabsTrigger>
        </TabsList>
        <TabsContent value="class">
          <AcademicClassInfo student={student} />
        </TabsContent>
        <TabsContent value="exams">
          <ExamResults student={student} hasPendingFees={hasPendingFees} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
