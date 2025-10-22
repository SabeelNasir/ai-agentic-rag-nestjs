# Stage 1 — Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Build the NestJS app
RUN npm run build

# Stage 2 — Run
FROM node:20-alpine
WORKDIR /app

# Copy only the built app and dependencies
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Expose API port
EXPOSE 3000

# Use NODE_ENV=production
ENV NODE_ENV=production

# Start command
CMD ["node", "dist/main.js"]