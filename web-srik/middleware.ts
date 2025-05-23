import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'auth_token';

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
  const token = request.cookies.get(COOKIE_NAME)?.value

  // Verify authentication
  const isAuthenticated = token ? await verifyToken(token) : false

  // Handle protected paths - require authentication
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Handle auth paths - redirect if already authenticated
  if (authPaths.some(path => pathname === path) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // For all other paths, continue as normal
  return NextResponse.next()
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const decoded = verify(token, JWT_SECRET)
    return !!decoded
  } catch {
    return false
  }
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
}
