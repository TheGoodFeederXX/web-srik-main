import { redirect } from "next/navigation"
import { FeePaymentList } from "@/components/fee-payment-list"
import { FeePaymentHistory } from "@/components/fee-payment-history"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function FeePaymentPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get student information with fee payments
  const { data: student } = await supabase
    .from("students")
    .select(`
      *,
      fee_payments (*)
    `)
    .eq("user_id", session.user.id)
    .order("due_date", { referencedTable: "fee_payments", ascending: false })
    .single()

  if (!student) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pembayaran Yuran</h2>
          <p className="text-muted-foreground">Maklumat pelajar tidak ditemui. Sila hubungi pentadbir.</p>
        </div>
      </div>
    )
  }

  // Separate pending and paid fees
  const pendingFees = student.fee_payments.filter((fee: any) => !fee.is_paid)
  const paidFees = student.fee_payments.filter((fee: any) => fee.is_paid)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pembayaran Yuran</h2>
        <p className="text-muted-foreground">Bayar dan semak status pembayaran yuran</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeePaymentList student={student} pendingFees={pendingFees} />
        <FeePaymentHistory paidFees={paidFees} />
      </div>
    </div>
  )
}
