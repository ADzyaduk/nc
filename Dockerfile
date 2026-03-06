# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# URL и anon-ключ нужны при сборке (Nuxt подставляет их в конфиг).
# В Amvera: добавь переменные в «Переменные окружения» — если платформа передаёт их при сборке, билд подхватит.
# Или передай при ручной сборке: docker build --build-arg SUPABASE_URL=... --build-arg SUPABASE_KEY=... .
ARG SUPABASE_URL
ARG SUPABASE_KEY
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
