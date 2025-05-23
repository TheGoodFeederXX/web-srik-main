import { hash } from 'bcrypt';
import pool from '../web-srik/lib/db';

async function main() {
  try {
    // Create admin user
    const hashedPassword = await hash('admin123', 10);
    
    const userResult = await pool.query(
      `INSERT INTO users (email, password, name) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      ['admin@srialkhairiah.my', hashedPassword, 'Admin']
    );

    const userId = userResult.rows[0].id;

    // Assign admin role
    await pool.query(
      `INSERT INTO user_roles (user_id, role) 
       VALUES ($1, $2)`,
      [userId, 'admin']
    );

    // Create admin profile
    await pool.query(
      `INSERT INTO profiles (user_id, full_name, phone) 
       VALUES ($1, $2, $3)`,
      [userId, 'System Administrator', '+60123456789']
    );

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await pool.end();
  }
}

main();
