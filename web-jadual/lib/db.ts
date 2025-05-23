import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL!;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = neon(DATABASE_URL);

export default pool;

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}

export async function initDatabase() {
  try {
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(process.cwd(), 'sql', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await query(schema);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
