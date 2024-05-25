# Use the official Node.js 14 image.
# Check https://hub.docker.com/_/node to select a different version if needed.
FROM node:20-alpine as common

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY source-nodejs/package.json source-nodejs/package-lock.json ./

# Install dependencies
RUN npm ci

# Bundle app source inside the Docker image
COPY source-nodejs .

# Build

RUN npm run build

FROM common as runtime

# Make the CLI script executable
RUN chmod +x ./dist/run.js

# Set the default command for the container to your CLI's help command.
# This way, running the container without arguments will show the CLI's help.
ENTRYPOINT ["./dist/run.js"]