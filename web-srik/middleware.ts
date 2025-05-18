import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

// Define the paths that require authentication
const protectedPaths = ["/admin/panel"]

// Define the paths that should be accessible only when NOT authenticated
const authPaths = ["/admin/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("authToken")?.value

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname === path)

  try {
    if (isProtectedPath) {
      // For protected paths, verify the token
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      verify(token, process.env.JWT_SECRET || "your-secret-key")
      return NextResponse.next()
    }

    if (isAuthPath && token) {
      // For auth paths (login), redirect to admin panel if already authenticated
      verify(token, process.env.JWT_SECRET || "your-secret-key")
      return NextResponse.redirect(new URL("/admin/panel", request.url))
    }

    // For all other paths, continue
    return NextResponse.next()
  } catch (error) {
    // If token verification fails, clear the cookie and redirect to login
    if (isProtectedPath) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.delete("authToken")
      return response
    }

    return NextResponse.next()
  }
}
