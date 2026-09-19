# Stage 1: Build Phase
FROM node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Upgrade npm to v12 to match the package-lock.json lockfile version
RUN npm install -g npm@12

# Copy dependency definition files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for building)
RUN npm ci

# Copy the entire project source code
COPY . .

# Generate the Prisma Client using the local schema
RUN npx prisma generate

# Build the TypeScript NestJS application into compiled JS (placed in /dist)
RUN npm run build

# Remove development dependencies from node_modules to keep it production-only
RUN npm prune --omit=dev

# Stage 2: Production Run Phase
FROM node:22-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy dependency definition files
COPY package*.json ./

# Copy the pruned node_modules from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy the compiled JS from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the Prisma schema and migrations directory
COPY --from=builder /usr/src/app/prisma ./prisma

# Expose the backend port
EXPOSE 3001

# Command to run the application (in production mode)
CMD ["node", "dist/main"]
