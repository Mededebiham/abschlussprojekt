# Use an official Node.js LTS version as the base image
FROM node:lts-alpine AS build

# Set the working directory in the container
WORKDIR /frontend

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code into the container
COPY . .

# Build the application
RUN npm run build

# Use a lightweight Nginx image as the base image for serving static files
FROM nginx:alpine

# Copy the built files from the previous stage into the nginx container
COPY --from=build /frontend/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
