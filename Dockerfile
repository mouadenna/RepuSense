FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY dashboard/package.json dashboard/package-lock.json ./
RUN npm ci

# Copy the rest of the dashboard application
COPY dashboard/ ./

# Build the Next.js application
RUN npm run build

# Expose the port that Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 