# Stage 0: Setup Environment Variables
ARG NODE_VERSION=25-alpine

# Stage 1: Build
FROM node:${NODE_VERSION} AS build
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Stage 2: Production
FROM node:${NODE_VERSION}
WORKDIR /app
COPY --from=build /src/dist ./dist
COPY --from=build /src/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 5000
USER node
CMD ["node", "dist/main.js"]