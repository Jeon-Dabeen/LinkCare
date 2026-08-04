"use client";

import { ENV } from "@/env";

const BASE_URL = ENV.API_URL;

if (!BASE_URL) {
  throw new Error(`NEXT_PUBLIC_API_URL 환경변수가 없습니다.`);
}

export async function logoutApi(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 교환을 위해 반드시 필요!
  });

  if (!res.ok) {
    throw new Error("로그아웃에 실패했어요");
  }
}
