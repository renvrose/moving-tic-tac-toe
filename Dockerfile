# Match your devcontainer for consistency
FROM node:20-slim

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy everything else
COPY . .

# FIX: Ensure the node user owns the files and they are executable
RUN chown -R node:node /app && chmod -R 755 /app

# Switch to non-root user for security (standard practice)
USER node

# Expose port 5500
EXPOSE 5500

# Use the 'npx' version we fixed in package.json
CMD ["npm", "start"]