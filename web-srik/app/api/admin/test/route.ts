import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"

export async function GET() {
  try {
    // This will throw an error if the user is not authenticated or is not an admin
    const user = await requireAuth(['admin'])

    const data = {
      message: "This is a protected admin route",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message === 'Unauthorized' ? 401 : 
                    error.message === 'Forbidden' ? 403 : 500

      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status }
      )
    }

    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    )
  }
}
