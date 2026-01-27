# Use the same version as your devcontainer for consistency
FROM node:20-slim

WORKDIR /app

# Copy package files first to cache layers
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port used by the app (matching Sahana's UI port)
EXPOSE 5500

# Command to run the game
CMD ["npm", "start"]