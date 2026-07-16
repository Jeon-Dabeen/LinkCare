# LinkCare


# DB 사용법
DBeaver에서 UI로 수정
npx prisma db pull // db의 수정사항을 반영하요 schema.prisma에 새로 덮어쓰기
npx prisma generate // 새로 생성된 schema에 맞춰 prisma client 생성

# 아래 사항은 개발 참고용
추가 설치하지 않도록 설치한 명령어 아래 기입

## 기본 설치 내역
7/16
pnpm i class-validator class-transformer dotenv
pnpm i @prisma/client@6
pnpm i -D prisma@6
pnpm i @nestjs/swagger
