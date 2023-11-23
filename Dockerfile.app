# Use an official Node runtime based on Alpine as a parent image
FROM --platform=linux/arm64/v8  node:16.15.1-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock (or package-lock.json) into the working directory
COPY package*.json ./
COPY yarn.lock ./

COPY ./prisma prisma

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are considered
# where available (npm@5+)
RUN yarn install

# Bundle app source inside the Docker image
COPY . .

COPY .env /app

# Build the app using Babel
RUN yarn build

# Your app binds to port 3000 by default, so use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run the app
CMD [ "yarn", "start"]
