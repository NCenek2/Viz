ARG NODE_VERSION=20-alpine
ARG NGINX_VERSION=alpine3.22

# Stage 1: Build
FROM node:${NODE_VERSION} AS builder
ENV REACT_APP_BACKEND_URL=http://localhost:5000

WORKDIR /src

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build
# Stage 2: Production
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the static build output from the build stage to Nginx's default HTML serving directory
COPY --chown=nginx:nginx --from=builder /src/build /usr/share/nginx/html

# Use a built-in non-root user for security best practices
USER nginx

# Expose port 8080 to allow HTTP traffic
# Note: The default Nginx container now listens on port 8080 instead of 80 
EXPOSE 8080

ENV NODE_ENV=production

# Start Nginx directly with custom config
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]