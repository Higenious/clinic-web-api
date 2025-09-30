# Single-stage Dockerfile

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching npm install)
COPY package*.json ./

# Install dependencies including devDependencies (needed for TS build)
RUN npm install

# Install type definitions to fix TS errors
RUN npm install --save-dev @types/cors @types/express @types/mongoose

# Copy the rest of the source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "dist/server.js"]
