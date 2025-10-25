# Use Node.js 18 as base image
FROM node:18-alpine

# Install Expo CLI
RUN npm install -g @expo/cli

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Expo port
EXPOSE 8081

# Start Expo development server
CMD ["npx", "expo", "start", "--tunnel"]
