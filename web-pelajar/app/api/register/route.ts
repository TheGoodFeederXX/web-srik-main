import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, email, password, studentId } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ message: "Email sudah didaftarkan" }, { status: 400 })
    }

    // Check if student ID exists
    const existingStudent = await prisma.student.findUnique({
      where: {
        studentId,
      },
    })

    if (existingStudent && existingStudent.userId) {
      return NextResponse.json({ message: "No. Pelajar sudah didaftarkan" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Link student to user if student exists
    if (existingStudent) {
      await prisma.student.update({
        where: {
          id: existingStudent.id,
        },
        data: {
          userId: user.id,
        },
      })
    } else {
      // Create new student record
      await prisma.student.create({
        data: {
          studentId,
          name,
          userId: user.id,
        },
      })
    }

    return NextResponse.json({ message: "Pendaftaran berjaya" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Ralat semasa pendaftaran" }, { status: 500 })
  }
}
