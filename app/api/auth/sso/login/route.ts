import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";

const SSO_SECRET = process.env.SSO_SECRET || "your-sso-secret-key";

export async function GET(request: Request) {
  // Check if user is authenticated in web-srik
  if (!isAuthenticated()) {
    const url = new URL("/login", request.url);
    const callback = new URL(request.url).searchParams.get("callback");
    if (callback) {
      url.searchParams.set("callbackUrl", callback);
    }
    return NextResponse.redirect(url);
  }

  // Get user data
  const user = getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Generate SSO token
  const token = sign(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: "teacher", // All web-srik users are teachers
      },
    },
    SSO_SECRET,
    { expiresIn: "1d" }
  );

  // Redirect back to client application with token
  const callback = new URL(request.url).searchParams.get("callback");
  if (!callback) {
    return NextResponse.json({ error: "No callback URL provided" }, { status: 400 });
  }

  const callbackUrl = new URL(callback);
  callbackUrl.searchParams.set("sso_token", token);
  
  return NextResponse.redirect(callbackUrl);
}
