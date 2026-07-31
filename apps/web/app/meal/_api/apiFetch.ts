"use client";

import { ENV } from "@/env";

const BASE_URL = ENV.API_URL;

if(!BASE_URL){
  throw new Error(`NEXT_PUBLIC_API_URL 환경변수가 없습니다.`)
}

interface ApiResponse<T>{
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
}

interface ApiFetchOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<ApiResponse<T>>{

  const { auth = false, headers, body, credentials, ...rest} = options;

  const requestHeaders = new Headers({
    Accept: "application/json",
  });

  if(headers){
    Object.entries(headers).forEach(([key, value]) => {
      requestHeaders.set(key, value);
    });
  }

  // body가 FormData인지 체크
  const isFormData = body instanceof FormData;

  // body가 존재하고, FormData가 아니며, Content-Type이 지정되지 않았을 경우에만 JSON으로 설정
  if (body && !isFormData && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: requestHeaders,
    body,
    credentials: "include",
    ...rest,
  });

  const result = (await response.json()) as ApiResponse<T>;

  // 서버가 400 등 에러 코드를 내려보냈을 때
  if(!response.ok || !result.success){
    throw new Error(result.message ?? 'API 요청에 실패했습니다.');
  }

  return result;
}
