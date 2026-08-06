# -----------------------------------------------
# 1. Base Stage
# -----------------------------------------------
FROM node:24-alpine AS base
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# -----------------------------------------------
# 2. Pruner Stage (Turborepo에서 api 앱 의존성만 추출)
# -----------------------------------------------
FROM base AS pruner
COPY . .
# api 앱과 직/간접 연결된 packages만 가볍게 추출
RUN npx turbo prune --scope=api --docker

# -----------------------------------------------
# 3. Builder Stage
# -----------------------------------------------
FROM base AS builder
WORKDIR /app

# lockfile 및 pruned된 package.json, workspace 파일 복사 (캐시 최적화)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 실제 소스코드 및 공통 패키지 전체 복사
COPY --from=pruner /app/out/full/ .

# Prisma Client 생성 및 API 빌드
# (Prisma schema 위치에 맞춰 실행)
RUN pnpm --filter api prisma:generate
RUN pnpm --filter api build

# -----------------------------------------------
# 4. Runner Stage (최종 실행 환경)
# -----------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# 보안을 위한 비루트 사용자 설정
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# workspace 구조 전체 및 node_modules 복사 (심볼릭 링크 보존)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/node_modules ./node_modules

# api 앱 및 공통 packages 결과물 복사
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/packages ./packages

USER nestjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# 실행 경로 (프로젝트 엔트리포인트에 맞게 조정)
CMD ["node", "apps/api/dist/src/main.js"]