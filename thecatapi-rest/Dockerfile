FROM node:20-slim as build

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 make g++ build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm install --no-audit --no-fund

COPY . .

RUN npm run build

FROM node:20-slim as production

WORKDIR /app

# Install python3 make
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js"]
