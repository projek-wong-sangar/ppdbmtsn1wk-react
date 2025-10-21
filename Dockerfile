# Base image
FROM nginx:alpine

# Copy hasil build
COPY dist/ /usr/share/nginx/html

# Expose port
EXPOSE 3007

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]