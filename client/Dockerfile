# Use Node 24 as base
FROM node:24-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

# Run Vite with --host to allow external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
