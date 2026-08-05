# -----------------------------------------------
# 1. Base Stage (Node.js 24 Alpine 및 pnpm 환경 설정)
# -----------------------------------------------
FROM node:24-alpine AS base
# Alpine 필수 라이브러리 설치 (--no-cache 적용)
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# -----------------------------------------------
# 2. Builder Stage
# -----------------------------------------------
FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

COPY apps/api ./apps/api

RUN pnpm --filter api prisma:generate
RUN pnpm --filter api build

# -----------------------------------------------
# 3. Runner Stage
# -----------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

EXPOSE 3001

CMD ["node", "apps/api/dist/src/main.js"]