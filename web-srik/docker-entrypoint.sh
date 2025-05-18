#!/bin/sh

# Wait for database to be ready with a more robust check
echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
  echo "Database not ready, waiting..."
  sleep 2
done

# Additional wait to ensure Postgres is fully ready
sleep 5

# Initialize database
echo "Initializing database..."
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed

# Start the Next.js application
echo "Starting Next.js application..."
exec pnpm start
