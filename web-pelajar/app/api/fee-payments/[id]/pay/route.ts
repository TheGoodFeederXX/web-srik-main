import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Tidak dibenarkan" }, { status: 401 })
    }

    const feePaymentId = params.id
    const { studentId } = await request.json()

    // Verify that the user is paying for their own student record
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        userId: session.user.id,
      },
    })

    if (!student) {
      return NextResponse.json({ message: "Tidak dibenarkan atau pelajar tidak ditemui" }, { status: 403 })
    }

    // Generate a random payment reference
    const paymentReference = `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    // Update fee payment status
    const updatedFeePayment = await prisma.feePayment.update({
      where: {
        id: feePaymentId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentReference,
      },
    })

    return NextResponse.json(updatedFeePayment)
  } catch (error) {
    console.error("Error processing fee payment:", error)
    return NextResponse.json({ message: "Ralat semasa memproses pembayaran yuran" }, { status: 500 })
  }
}
