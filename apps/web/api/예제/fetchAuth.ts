"use client";

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  logout,
} from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface ApiResponse<T> {
  result: string;
  code: number;
  data: T;
}

interface ApiFetchOptions extends RequestInit {
  auth?: boolean;
}

// ----------------------------------------------------
// [동시성 제어용 변수]
// 토큰 재발급 중인지 여부와 대기 중인 요청 큐
// ----------------------------------------------------
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 토큰 재발급 성공 시 대기 중인 요청들에게 새 토큰 전달 후 실행
function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// 토큰 재발급 대기 큐에 추가
function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// 실제 fetch 요청 담당
async function request(path: string, options: ApiFetchOptions = {}) {
  const { auth = false, headers, ...rest } = options;

  const requestHeaders = new Headers({
    Accept: "application/json",
  });

  // Body가 존재하고 Content-Type이 지정되지 않았다면 JSON 기본 지정
  if (rest.body && !(headers as Record<string, string>)?.[
    "Content-Type"
  ]) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      requestHeaders.set(key, value as string);
    });
  }

  // auth: true일 때만 최신 토큰 추가
  if (auth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  return fetch(`${BASE_URL}${path}`, {
    headers: requestHeaders,
    ...rest,
  });
}

// Refresh Token으로 Access Token 갱신
async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Refresh token이 존재하지 않습니다.");
  }

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Refresh token이 만료되었거나 유효하지 않습니다.");
  }

  const body = (await response.json()) as ApiResponse<{
    accessToken: string;
    refreshToken: string;
  }>;

  if (body.result !== "success" || !body.data) {
    throw new Error("토큰 재발급 응답이 올바르지 않습니다.");
  }

  // 새 토큰 저장
  setTokens(body.data.accessToken, body.data.refreshToken);

  return body.data.accessToken;
}

// 메인 apiFetch 함수
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  let response = await request(path, options);

  // 401 Unauthorized 에러 발생 & 인증이 필요한 요청인 경우
  if (response.status === 401 && options.auth) {
    if (!isRefreshing) {
      // 1. 첫 번째로 401을 만난 요청이 리프레시 진행
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        isRefreshing = false;

        // 대기 중이던 다른 요청들 재개
        onRefreshed(newAccessToken);

        // 내 요청도 새 토큰으로 재시도
        response = await request(path, options);
      } catch (error) {
        isRefreshing = false;
        refreshSubscribers = [];
        logout(); // 재발급 실패 시 로그아웃 후 이동
        throw error;
      }
    } else {
      // 2. 이미 리프레시 진행 중이라면, 완료될 때까지 Promise 대기
      const retryOriginalRequest = new Promise<Response>((resolve) => {
        addRefreshSubscriber(() => {
          // 새 토큰 설정이 완료되면 재요청 수행
          resolve(request(path, options));
        });
      });

      response = await retryOriginalRequest;
    }
  }

  // 재요청 후에도 실패하거나 일반 에러인 경우
  if (!response.ok) {
    throw new Error(`${path} API Error Status: ${response.status}`);
  }

  const body = (await response.json()) as ApiResponse<T>;

  if (body.result !== "success") {
    throw new Error(body.result || "API 요청 실패");
  }

  return body.data;
}