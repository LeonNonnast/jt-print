# Use the Node official image
# https://hub.docker.com/_/node
FROM node:25-bullseye-slim

# Create and change to the app directory.
WORKDIR /app

# Copy local code to the container image
COPY . ./

# Install packages
RUN npm install

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm ci --omit=dev

# Serve the app
CMD ["npm", "run", "start:prod"]

# docker build -t ijt-print . 