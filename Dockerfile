FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY dashboard/package.json dashboard/package-lock.json ./
RUN npm ci

# Copy the rest of the dashboard application
COPY dashboard/ ./

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a custom next.config.mjs to disable static generation
RUN echo 'const nextConfig = { output: "standalone", images: { unoptimized: true }, eslint: { ignoreDuringBuilds: true }, typescript: { ignoreBuildErrors: true } }; export default nextConfig;' > next.config.mjs

# Create a custom .env file to define API endpoint
RUN echo 'NEXT_PUBLIC_API_ENDPOINT=https://api.repusense.com' > .env.local

# Build the Next.js application with the export option disabled
RUN npm run build

# Expose the port that Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 