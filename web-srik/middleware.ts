import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Define the paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/admin/panel"
]

// Define the paths that should be accessible only when NOT authenticated
const authPaths = [
  "/login", 
  "/admin/login"
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Handle protected paths - require authentication
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Handle auth paths - redirect if already authenticated
  if (authPaths.some(path => pathname === path) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // For all other paths, continue as normal
  return NextResponse.next()
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
}
