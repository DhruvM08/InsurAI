# 1. Base Image for node modules
FROM node:20-alpine AS build

# 2. Set a Working directory
WORKDIR /app

# 3. Copy the Package files and Install dependencies
# Using 'npm ci' is often better for Docker to ensure exact versions
COPY package*.json ./
RUN npm install
a
# 4. Copy rest of Code and Build
COPY . .
RUN npm run build

# 5. Install a simple server to serve the static files
RUN npm install -g serve

# 6. Expose Port
EXPOSE 3000

# 7. Start the application
# IMPORTANT: Vite outputs to 'dist', so we serve that folder
CMD ["serve", "-s", "dist", "-l", "3000"]