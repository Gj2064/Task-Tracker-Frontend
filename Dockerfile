FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the rest of the application code
COPY . .

# Build the application
RUN ng build 

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/demo/browser /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
