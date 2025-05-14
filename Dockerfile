FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files
COPY dashboard/package.json dashboard/package-lock.json ./
RUN npm ci

# Build the Next.js application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY dashboard/ ./

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV NEXT_PUBLIC_API_ENDPOINT https://api.repusense.com
ENV NEXT_PUBLIC_DEFAULT_COMPANY inwi

# Use custom next.config.mjs that disables static generation
RUN echo 'const nextConfig = { output: "standalone", reactStrictMode: true, swcMinify: true, images: { unoptimized: true }, eslint: { ignoreDuringBuilds: true }, typescript: { ignoreBuildErrors: true }, experimental: { serverComponentsExternalPackages: [] } }; export default nextConfig;' > next.config.mjs

# Create a production build
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_API_ENDPOINT https://api.repusense.com
ENV NEXT_PUBLIC_DEFAULT_COMPANY inwi

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variable for listening on all interfaces
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the server
CMD ["node", "server.js"] 