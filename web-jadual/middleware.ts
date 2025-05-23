import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'auth_token';

// Define the paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/admin"
]

// Define the paths that should be accessible only when NOT authenticated
const authPaths = [
  "/login"
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle SSO callback
  if (pathname === "/login" && request.nextUrl.searchParams.has("sso_token")) {
    const ssoToken = request.nextUrl.searchParams.get("sso_token");
    if (ssoToken) {
      // Sign in with SSO provider
      const callbackUrl = new URL("/api/auth/callback/sso", request.url);
      callbackUrl.searchParams.set("sso_token", ssoToken);
      return NextResponse.redirect(callbackUrl);
    }
  }
  
  // Verify JWT token from cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = token ? await verifyToken(token) : false;

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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
