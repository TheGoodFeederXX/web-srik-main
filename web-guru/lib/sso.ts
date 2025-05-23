import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SSO_SECRET = process.env.SSO_SECRET || 'your-sso-secret-key';
const SSO_COOKIE = 'sso_token';
const SSO_SERVER = process.env.NEXT_PUBLIC_SSO_SERVER || 'http://localhost:3000';

export interface SSOUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: string;
}

export interface SSOTokenPayload {
  user: SSOUser;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export async function verifySSO(token: string): Promise<SSOTokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(SSO_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as SSOTokenPayload;
  } catch (error) {
    console.error('SSO verification error:', error);
    return null;
  }
}

export async function getSSO() {
  const cookieStore = cookies();
  const token = cookieStore.get(SSO_COOKIE)?.value;
  
  if (!token) {
    return null;
  }

  return verifySSO(token);
}

export function getSSOLoginURL(callbackURL: string) {
  const params = new URLSearchParams({
    callback: callbackURL,
  });
  return `${SSO_SERVER}/api/auth/sso/login?${params.toString()}`;
}

export function setSSOCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(SSO_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
}

export function clearSSOCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SSO_COOKIE);
}
