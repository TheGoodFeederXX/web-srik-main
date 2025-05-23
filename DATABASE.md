# Database Migration Guide

This guide explains how to set up the Neon database and import the initial schema.

## Prerequisites

1. Create a Neon account at https://neon.tech
2. Create a new project in Neon
3. Get your database connection string from the Neon dashboard

## Setup Instructions

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Neon database credentials:
   ```env
   NEON_DATABASE_URL=postgresql://your-username:your-password@your-neon-host/your-database
   JWT_SECRET=generate-a-secure-random-string
   ```

3. Import the database schema:
   ```powershell
   $env:PGPASSWORD='your-password'
   psql -h your-neon-host -U your-username -d your-database -f migrations/001_create_auth_tables.sql
   ```

4. Create the initial admin user:
   ```powershell
   pnpm tsx scripts/seed-neon-admin.ts
   ```

## Database Schema

The database includes the following tables:

### users
- `id`: UUID (Primary Key)
- `email`: VARCHAR(255) (Unique)
- `password`: VARCHAR(255)
- `name`: VARCHAR(255)
- `image`: VARCHAR(255)
- `created_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE

### user_roles
- `user_id`: UUID (Foreign Key)
- `role`: ENUM ('admin', 'teacher', 'student')
- `created_at`: TIMESTAMP WITH TIME ZONE

### profiles
- `user_id`: UUID (Foreign Key)
- `full_name`: VARCHAR(255)
- `phone`: VARCHAR(20)
- `address`: TEXT
- `created_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE

## Default Admin Credentials

After running the seed script, you can log in with:
- Email: admin@srialkhairiah.my
- Password: admin123

Make sure to change these credentials after first login.
