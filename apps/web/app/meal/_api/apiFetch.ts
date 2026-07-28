"use client";

const BASE_URL = "http://localhost:3001";

if(!BASE_URL){
  throw new Error(`NEXT_PUBLIC_API_URL 환경변수가 없습니다.`)
}


interface ApiResponse<T>{
  result: boolean;
  message?: string;
  data: T;
}

interface ApiFetchOptions extends RequestInit {
  auth?: boolean;
}


export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T>{

  const { auth = false, headers, body, ...rest} = options;

  const requestHeaders = new Headers({
    Accept: "application/json",
  });

  if(headers){
    Object.entries(headers).forEach(([key, value]) => {
      requestHeaders.set(key, value);
    });
  }

  // body가 존재하고 Content-Type이 지정되지 않았을 경우 자동 추가
  if (body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  // 인증 필요 API
  if(auth){
    const token = 
      typeof window !== "undefined" 
        ? localStorage.getItem("accessToken")
        : null;

    if(token){
      requestHeaders.set(
        "Authorization", `Bearer ${token}`,
      );
    }
  }
  

  try{
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: requestHeaders,
      body,
      ...rest,
    });

    const result = (await response.json()) as ApiResponse<T>;
    console.log('apiFetch result: ', result);

    if(!response.ok || !result.result){
      throw new Error(result.message ?? 'API 요청에 실패했습니다.');
    }

    return result.data;

  }catch(error){
    console.error(`apiFetch error ${path}`, error);
    if(error instanceof Error) throw error;
    throw new Error(`${path} apiFetch 에러`)
  }

}



// 인증필요없는 api
// const meals = await apiFetch<MealResponse>(
//   "/meal?date=2026-07-24",
// );



// 인증필요한 api
// const profile = await apiFetch<UserResponse>(
//   "/user/profile",
//   {
//     auth: true,
//   },
// );


// 로그인시 토큰 저장
// const result = await apiFetch<LoginResponse>(
//   "/auth/login",
//   {
//     method: "POST",
//     body: JSON.stringify({
//       email,
//       password,
//     }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   },
// );

// localStorage.setItem(
//   "accessToken",
//   result.accessToken,
// );