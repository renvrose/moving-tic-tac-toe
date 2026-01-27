# Use Node 20 slim for a smaller, faster image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy package files first (helps with build speed)
COPY package*.json ./

# Install the 'serve' package we added to package.json
RUN npm install --production

# Copy all your game files (HTML, CSS, JS) into the container
COPY . .

# Match the port from your devcontainer (5500)
EXPOSE 5500

# This matches the script we just added to package.json
CMD ["npm", "start"]