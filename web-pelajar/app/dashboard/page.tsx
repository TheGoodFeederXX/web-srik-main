import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BookOpen, Calendar, CreditCard, User } from "lucide-react"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get student information
  const { data: student } = await supabase
    .from("students")
    .select(`
      *,
      fee_payments!inner(*)
    `)
    .eq("user_id", session.user.id)
    .single()

  // Check for pending fees
  const hasPendingFees = student?.fee_payments.some(
    (payment: any) => !payment.is_paid && new Date(payment.due_date) < new Date(),
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Selamat datang ke Portal Pelajar Sekolah Rendah Islam Al-Khairiah</p>
      </div>

      {hasPendingFees && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Amaran</AlertTitle>
          <AlertDescription>
            Anda mempunyai yuran tertunggak. Sila jelaskan pembayaran untuk mengakses semua fungsi portal.{" "}
            <Link href="/dashboard/fee-payment" className="font-medium underline">
              Bayar sekarang
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/student-info">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maklumat Pelajar</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Lihat dan kemaskini maklumat peribadi pelajar</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/academic-info">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maklumat Akademik</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Lihat kelas, jadual dan keputusan peperiksaan</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/leave-application">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permohonan Cuti</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Mohon cuti dan semak status permohonan</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/fee-payment">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pembayaran Yuran</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Bayar dan semak status pembayaran yuran</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
