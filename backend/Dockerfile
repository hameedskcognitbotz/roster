# Backend Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Production build
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Use numeric user ID directly (skip user creation for minimal image)
USER 1001

EXPOSE 3000

CMD ["bun", "run", "start"]