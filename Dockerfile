# 1. Use the slim image
FROM node:20-slim

# 2. Set the working directory
WORKDIR /app

# 3. INSTALL SERVE FIRST - This will now be cached forever
# Unless you change this line, Docker will never run this again.
RUN npm install -g serve

# 4. Copy ONLY package files
# This allows Docker to cache your 'npm ci' step.
COPY package*.json ./
RUN npm ci

# 5. Copy the rest of your code
# This is the only step that will run when you change your HTML/JS.
COPY . .

# 6. Permissions and User
RUN chown -R node:node /app && chmod -R 755 /app
USER node

# 7. Use the absolute path to the global serve binary
ENV PORT=5500
CMD ["/usr/local/bin/serve", "-s", ".", "-l", "5500"]