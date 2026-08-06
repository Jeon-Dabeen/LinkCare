# -----------------------------------------------
# 1. Base Stage: pnpm 환경 및 기초 라이브러리 설정
# -----------------------------------------------
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# -----------------------------------------------
# 2. Pruner Stage: Turborepo에서 web 관련 코드만 분리
# -----------------------------------------------
FROM base AS pruner
COPY . .
# web 앱과 의존 관계가 있는 packages만 추출
RUN npx turbo prune --scope=web --docker

# -----------------------------------------------
# 3. Builder Stage: 의존성 설치 및 Next.js 빌드
# -----------------------------------------------
FROM base AS builder
WORKDIR /app

# 추출된 package.json과 lockfile 복사 (의존성 설치 캐싱)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 실제 소스 코드 복사
COPY --from=pruner /app/out/full/ .

# 빌드 시점에 주입받을 환경변수 선언 (Build ARG)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GEMINI_API_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GEMINI_API_KEY=$NEXT_PUBLIC_GEMINI_API_KEY
ENV NEXT_TELEMETRY_DISABLED=1

# Web 앱 빌드
RUN pnpm --filter web build

# -----------------------------------------------
# 4. Runner Stage: 경량화된 프로덕션 실행 환경
# -----------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 보안을 위한 비루트 사용자 설정
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# [수정] Standalone 복사 및 권한 설정
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
# [수정] public 디렉터리 권한 및 복사 (없어도 에러나지 않도록 public 위치 지정)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# [수정] Next.js 서버가 런타임 캐시/이미지 등을 쓸 수 있도록 권한 부여
RUN mkdir -p /app/apps/web/.next && chown -R nextjs:nodejs /app/apps/web/.next

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Next.js Standalone 서버 실행
CMD ["node", "apps/web/server.js"]