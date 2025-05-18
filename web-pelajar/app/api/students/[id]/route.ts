import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Tidak dibenarkan" }, { status: 401 })
    }

    const studentId = params.id
    const data = await request.json()

    // Verify that the user is updating their own student record
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        userId: session.user.id,
      },
    })

    if (!student) {
      return NextResponse.json({ message: "Tidak dibenarkan atau pelajar tidak ditemui" }, { status: 403 })
    }

    // Update student information
    const updatedStudent = await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        name: data.name,
        birthCertNumber: data.birthCertNumber,
        icNumber: data.icNumber,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        birthPlace: data.birthPlace,
        address: data.address,
        motherName: data.motherName,
        fatherName: data.fatherName,
        motherIcNumber: data.motherIcNumber,
        fatherIcNumber: data.fatherIcNumber,
        motherPhoneNumber: data.motherPhoneNumber,
        fatherPhoneNumber: data.fatherPhoneNumber,
      },
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json({ message: "Ralat semasa mengemaskini maklumat pelajar" }, { status: 500 })
  }
}
