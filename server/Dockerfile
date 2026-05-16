# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=build /src/dist ./dist
COPY --from=build /src/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 8080
USER node
CMD ["node", "dist/main.js"]