FROM node:20-alpine as build

WORKDIR /app

# Add build dependencies in case there are any native modules
RUN apk add --no-cache python3 make g++ build-base

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

# Copy the built app to NGINX html directory
COPY --from=build /app/dist/thecatapi-web/browser /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
