import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import pool from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'auth_token';

export interface User {
  id: string;
  email: string;
  name?: string;
  roles: string[];
}

export async function getUser(): Promise<User | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { id: string };
    
    // Get user with roles
    const result = await pool.query(
      `SELECT u.*, array_agg(ur.role) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [decoded.id]
    );

    if (!result.rows[0]) {
      return null;
    }

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles.filter(Boolean), // Remove null values if any
    };
  } catch {
    return null;
  }
}

export async function requireAuth(roles?: string[]) {
  const user = await getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  if (roles && !roles.some(role => user.roles.includes(role))) {
    throw new Error('Forbidden');
  }

  return user;
}
