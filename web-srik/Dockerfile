FROM node:18-alpine

# Install pnpm and system dependencies
RUN apk add --no-cache netcat-openbsd && \
    npm install -g pnpm && \
    pnpm config set store-dir /root/.local/share/pnpm/store

WORKDIR /app

# Copy the package files and prisma schema first
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Copy the rest of the application
COPY . .

# Build the Next.js application with telemetry disabled
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build

# Copy and set up entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Start the application
CMD ["docker-entrypoint.sh"]
