import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Tidak dibenarkan" }, { status: 401 })
    }

    const { studentId, startDate, endDate, reason } = await request.json()

    // Verify that the user is creating a leave application for their own student record
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        userId: session.user.id,
      },
    })

    if (!student) {
      return NextResponse.json({ message: "Tidak dibenarkan atau pelajar tidak ditemui" }, { status: 403 })
    }

    // Create leave application
    const leaveApplication = await prisma.leaveApplication.create({
      data: {
        studentId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        status: "pending", // Default status is pending
      },
    })

    return NextResponse.json(leaveApplication, { status: 201 })
  } catch (error) {
    console.error("Error creating leave application:", error)
    return NextResponse.json({ message: "Ralat semasa membuat permohonan cuti" }, { status: 500 })
  }
}
