// web/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  // 1. Next.js internal 파일, 정적 파일, API 요청은 미들웨어 통제에서 완전 제외
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. 비로그인 상태로 접근 가능한 퍼블릭 페이지 목록 (/auth/login 으로 경로 통일)
  const isPublicPage =
    pathname === "/auth/login" ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register");

  // 3. 토큰이 없는 비로그인 유저가 보호된 페이지에 접근할 때 -> /auth/login 으로 이동
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url)); // ✅ /auth/login으로 수정
  }

  // 4. 이미 로그인한 유저가 /auth/login 페이지로 접근할 때 -> 메인(/)으로 이동
  if (token && isPublicPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};