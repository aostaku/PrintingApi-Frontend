# Stage 1: Build the application
FROM node:latest AS build-stage

# Set the working directory
WORKDIR /usr/local/app

RUN echo ">>> Setting up the working directory"
#COPY ./ /usr/local/app/

# Copy package.json and install dependencies
COPY package.json package-lock.json ./

RUN npm install

# Copy the application files
COPY . .
RUN echo ">>> Copied application files"

# Build the application
RUN npm run build -- --project=web-pwa --configuration=production

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build-stage /usr/local/app/dist/web-pwa/browser /usr/share/nginx/html
RUN echo ">>> Build output copied to Nginx HTML directory"

# Copy custom Nginx configuration if needed
#COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
