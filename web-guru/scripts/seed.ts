import { initDatabase } from '@/lib/db';
import { signUp } from '@/lib/auth';

async function seed() {
  try {
    // Initialize database schema
    await initDatabase();
    console.log('Database schema initialized successfully');

    // Create a default admin user
    await signUp(
      'admin@srialkhairiah.my', 
      'admin123', 
      'Administrator'
    );
    console.log('Default admin user created successfully');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed()
  .then(() => {
    console.log('Database seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });
