# Stage 1: Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Копируем package.json и yarn.lock для установки зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости строго по lock-файлу (аналог npm ci)
RUN yarn install --frozen-lockfile

# Копируем исходники
COPY . .

# Собираем TypeScript код
RUN yarn build

# Stage 2: Production stage
FROM node:22-alpine

WORKDIR /app

# Копируем package.json и yarn.lock для установки production-зависимостей
COPY package.json yarn.lock ./

# Устанавливаем только production-зависимости
RUN yarn install --frozen-lockfile --production

# Копируем собранные файлы из build-стейджа
COPY --from=build /app/dist ./dist

# Открываем порт, на котором работает приложение (например, 3000)
EXPOSE 3000

# Запускаем приложение
CMD ["node", "dist/server.js"]
