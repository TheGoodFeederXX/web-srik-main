import { NextResponse } from "next/server"
import { compare } from "bcrypt"
import { z } from "zod"
import { sign } from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401 }
      )
    }

    // Check password
    const passwordValid = await compare(password, admin.password)

    if (!passwordValid) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    )

    return new NextResponse(
      JSON.stringify({
        token,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      })
    )
  } catch (error) {
    console.error("[LOGIN_ERROR]", error)
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    )
  }
}
