# Stage 1: Build TypeScript
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install all dependencies (dev + prod) for build
RUN npm install

# Copy all source code
COPY . .

# Build TypeScript to /dist
RUN npm run build

# Stage 2: Run the app
FROM node:18-alpine

WORKDIR /app

# Copy only package.json for production dependencies
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install

# Copy the compiled /dist folder
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
EXPOSE 3000

# Run the app using npm start (ensures TS build + dist/server.js)
CMD ["npm", "run", "start"]
