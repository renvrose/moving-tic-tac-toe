# Match your devcontainer for consistency
FROM node:20-slim

WORKDIR /app

# Copy package files first to speed up the CI/CD build process
COPY package*.json ./

# Install all dependencies (including Jest for the test step in CI)
RUN npm install

# Copy everything else (including your tests folder)
COPY . .

# Match the port in your GitHub Action / Devcontainer
EXPOSE 5500

# This runs the 'start' script from the package.json above
CMD ["npm", "start"]