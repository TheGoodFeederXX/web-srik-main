import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText } from "lucide-react"
import { format } from "date-fns"

interface FeePaymentHistoryProps {
  paidFees: Array<{
    id: string
    amount: number
    description: string
    due_date: string
    is_paid: boolean
    paid_at?: string | null
    payment_reference?: string | null
  }>
}

export function FeePaymentHistory({ paidFees }: FeePaymentHistoryProps) {
  if (paidFees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sejarah Pembayaran</CardTitle>
          <CardDescription>Senarai pembayaran yuran yang telah dibuat</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>Tiada sejarah pembayaran ditemui.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sejarah Pembayaran</CardTitle>
        <CardDescription>Senarai pembayaran yuran yang telah dibuat</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Penerangan</TableHead>
              <TableHead>Tarikh Bayar</TableHead>
              <TableHead>Rujukan</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paidFees.map((fee) => (
              <TableRow key={fee.id}>
                <TableCell className="font-medium">{fee.description}</TableCell>
                <TableCell>{fee.paid_at ? format(new Date(fee.paid_at), "dd/MM/yyyy") : "-"}</TableCell>
                <TableCell>{fee.payment_reference || "-"}</TableCell>
                <TableCell className="text-right">RM {fee.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
