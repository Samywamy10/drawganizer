FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Create the user and group before using them
# RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Set up config directory and database
# RUN mkdir -p /config && chown nextjs:nodejs /config
# COPY ./config/dev.db /config/dev.db
# RUN chown nextjs:nodejs /config/dev.db

ENV DATABASE_URL=file:/config/dev.db
ENV NEXT_TELEMETRY_DISABLED 1

# Generate Prisma client and run migrations
# USER nextjs
# RUN npx prisma generate
# RUN npx prisma migrate deploy

# Build Next.js without static generation
RUN npm run compile

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Set up directories
# RUN mkdir -p /config && chown nextjs:nodejs /config
RUN mkdir .next

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Install only production dependencies
# RUN npm install --production=true
# RUN npm install @prisma/client
# RUN npx prisma generate

# USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV DATABASE_URL=file:/config/dev.db

# RUN npm run generate

CMD ["node", "server.js"]