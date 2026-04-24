# Use Node 24 as base
FROM node:24-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Shared types support (if needed in Docker build)
# Since the server code currently uses a simplified index.ts without shared imports to avoid ESM issues,
# we don't strictly need to copy the shared folder here, but it's good practice.
# WORKDIR /shared
# COPY ../shared .
# WORKDIR /app

EXPOSE 3004

CMD ["npm", "run", "dev"]
