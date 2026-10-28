FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates socat && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run prisma:generate && npm run build \
    && chown -R node:node /app/src/generated

# Keep the CLI available for migrations and the separate Studio service.
FROM build AS runtime
ENV NODE_ENV=production
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]
