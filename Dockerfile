# Match your devcontainer for consistency
FROM node:20-slim

WORKDIR /app

# Copy package files first to speed up the CI/CD build process
COPY package*.json ./

# Install all dependencies (including Jest for the GitHub Action test step)
RUN npm ci

# Copy everything else (this includes your 'tests' folder and 'gamelogic.js')
COPY . .

# Expose port 5500 to match your devcontainer/Render settings
EXPOSE 5500

# Runs the start script we just added to package.json
CMD ["npm", "start"]