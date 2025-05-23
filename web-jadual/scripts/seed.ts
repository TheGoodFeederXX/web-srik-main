import { initDatabase } from '../lib/db';
import { signUp } from '../lib/auth';

async function seed() {
  try {
    // Initialize database schema
    await initDatabase();
    
    // Create initial admin user
    await signUp(
      'admin@srialkhairiah.my',
      'admin123',
      'Administrator'
    );

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
