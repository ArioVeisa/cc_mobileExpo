# Use Node.js 18 as base image
FROM node:18-alpine

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S expo -u 1001
USER expo

# Expose Expo port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8081 || exit 1

# Start Expo development server
CMD ["npx", "expo", "start", "--lan"]
