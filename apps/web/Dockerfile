# -----------------------------------------------
# 1. Base Stage
# -----------------------------------------------
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# -----------------------------------------------
# 2. Builder Stage
# -----------------------------------------------
FROM base AS builder

# 모노레포 설정 파일 및 전체 package.json 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
# 모노레포 공통 패키지들의 package.json 복사 (존재할 경우)
COPY packages ./packages

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스코드 전체 및 apps/web 복사
COPY apps/web ./apps/web

# 빌드 시점에 필요한 NEXT_PUBLIC 환경변수 선언
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GEMINI_API_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GEMINI_API_KEY=$NEXT_PUBLIC_GEMINI_API_KEY
ENV NEXT_TELEMETRY_DISABLED=1

# Web 앱 빌드
RUN pnpm --filter web build

# -----------------------------------------------
# 3. Runner Stage
# -----------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 비루트 사용자 설정 (보안 모범 사례)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 빌드 결과물 복사
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 실행 경로 지정
CMD ["node", "apps/web/server.js"]