import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const SSO_SECRET = process.env.SSO_SECRET || "your-sso-secret-key";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const payload = verify(token, SSO_SECRET);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
