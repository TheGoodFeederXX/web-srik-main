"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSupabase } from "@/components/supabase-provider"

interface FeePaymentListProps {
  student: {
    id: string
    name: string
    student_id: string
  }
  pendingFees: Array<{
    id: string
    amount: number
    description: string
    due_date: string
    is_paid: boolean
  }>
}

export function FeePaymentList({ student, pendingFees }: FeePaymentListProps) {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedFee, setSelectedFee] = useState<(typeof pendingFees)[0] | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const { toast } = useToast()
  const { supabase } = useSupabase()

  const handlePayNow = (fee: (typeof pendingFees)[0]) => {
    setSelectedFee(fee)
    setIsPaymentDialogOpen(true)
  }

  const handleProcessPayment = async () => {
    if (!selectedFee) return

    // Validate payment form
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast({
        title: "Ralat",
        description: "Sila lengkapkan semua maklumat pembayaran.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a random payment reference
      const paymentReference = `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

      // Update payment status in Supabase
      const { error } = await supabase
        .from("fee_payments")
        .update({
          is_paid: true,
          paid_at: new Date().toISOString(),
          payment_reference: paymentReference,
        })
        .eq("id", selectedFee.id)

      if (error) {
        throw error
      }

      toast({
        title: "Pembayaran Berjaya",
        description: "Yuran anda telah berjaya dibayar.",
      })
      setIsPaymentDialogOpen(false)

      // Reset form
      setCardNumber("")
      setCardName("")
      setExpiryDate("")
      setCvv("")

      // Refresh the page to show updated payment status
      window.location.reload()
    } catch (error) {
      toast({
        title: "Ralat",
        description: "Terdapat masalah semasa memproses pembayaran.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (pendingFees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Yuran Tertunggak</CardTitle>
          <CardDescription>Senarai yuran yang perlu dibayar</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Tiada yuran tertunggak. Semua yuran telah dijelaskan.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Calculate total amount due
  const totalDue = pendingFees.reduce((sum, fee) => sum + fee.amount, 0)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Yuran Tertunggak</CardTitle>
          <CardDescription>Senarai yuran yang perlu dibayar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">Jumlah Tertunggak</div>
                <div className="text-2xl font-bold">RM {totalDue.toFixed(2)}</div>
              </div>
              <Button onClick={() => handlePayNow(pendingFees[0])}>Bayar Semua</Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Penerangan</TableHead>
                <TableHead>Tarikh Akhir</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingFees.map((fee) => {
                const dueDate = new Date(fee.due_date)
                const isOverdue = dueDate < new Date()

                return (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">
                      {fee.description}
                      {isOverdue && (
                        <Badge variant="destructive" className="ml-2">
                          Tertunggak
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{format(dueDate, "dd/MM/yyyy")}</TableCell>
                    <TableCell className="text-right">RM {fee.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handlePayNow(fee)}>
                        Bayar
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pembayaran Yuran</DialogTitle>
            <DialogDescription>
              Masukkan maklumat kad untuk membayar yuran sebanyak RM {selectedFee?.amount.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Nombor Kad</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardName">Nama Pada Kad</Label>
              <Input
                id="cardName"
                placeholder="AHMAD BIN ABDULLAH"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Tarikh Luput</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} disabled={isProcessing}>
              Batal
            </Button>
            <Button onClick={handleProcessPayment} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <CreditCard className="mr-2 h-4 w-4 animate-pulse" />
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Bayar Sekarang
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
