"use client";

// SSR/서버 환경 체크 헬퍼
const isBrowser = typeof window !== "undefined";

export function getAccessToken() {
  if (!isBrowser) return null;
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  if (!isBrowser) return null;
  return localStorage.getItem("refreshToken");
}

export function setTokens(accessToken: string, refreshToken: string) {
  if (!isBrowser) return;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function logout() {
  if (!isBrowser) return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  window.location.href = "/login";
}