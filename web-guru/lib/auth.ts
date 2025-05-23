import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import pool from './db';

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface AuthTokenPayload {
  id: string;
  email: string;
  name?: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'auth_token';

export async function signUp(email: string, password: string, name?: string) {
  // Verify the email domain is from srialkhairiah.my
  if (!email.endsWith('@srialkhairiah.my')) {
    throw new Error('Only srialkhairiah.my email addresses are allowed');
  }

  // Check if user exists
  const existingUser = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows[0]) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await hash(password, 10);

  // Create user
  const result = await pool.query(
    'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
    [email, hashedPassword, name]
  );

  const user = result.rows[0];
  const token = generateToken(user);
  setAuthCookie(token);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  };
}

export async function signIn(email: string, password: string) {
  // Verify the email domain is from srialkhairiah.my
  if (!email.endsWith('@srialkhairiah.my')) {
    throw new Error('Only srialkhairiah.my email addresses are allowed');
  }  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);
  setAuthCookie(token);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    }
  };
}

export async function signOut() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!token) {
    return null;
  }

  try {
    const payload = verify(token, JWT_SECRET) as AuthTokenPayload;
    const result = await pool.query(
      'SELECT id, email, name, image FROM users WHERE id = $1',
      [payload.id]
    );

    const user = result.rows[0];
    if (!user) {
      return null;
    }

    return { user };
  } catch {
    return null;
  }
}

function generateToken(user: { id: string; email: string; name?: string }) {
  return sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
}

// Auth State Management
let currentUser: AuthTokenPayload | null = null;

export function setCurrentUser(user: AuthTokenPayload | null) {
  currentUser = user;
}

export function getCurrentUser(): AuthTokenPayload | null {
  return currentUser;
}

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const payload = verify(token, JWT_SECRET) as AuthTokenPayload;
    return !!payload;
  } catch {
    return false;
  }
}

