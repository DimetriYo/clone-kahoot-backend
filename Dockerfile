FROM node:22-alpine AS base

# Установка зависимостей
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock .env.production ./
RUN yarn install --frozen-lockfile

# Сборка приложения
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY prisma ./prisma


# Генерация Prisma Client
RUN yarn prisma generate --schema=./prisma/schema.prisma

# Компиляция TypeScript
RUN yarn build

# Финальный production-образ
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/.env.production /app/package.json ./

EXPOSE 3000

CMD ["yarn", "start"]