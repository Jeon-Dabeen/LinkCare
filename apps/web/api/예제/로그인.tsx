
// // app/login/page.tsx 또는 components/LoginForm.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api";
// import { setTokens } from "@/lib/auth";

// interface LoginResponse {
//   accessToken: string;
//   refreshToken: string;
//   user: {
//     id: number;
//     name: string;
//   };
// }

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       // 1. 로그인 API 호출 (auth 옵션 없음 = 인증 불필요)
//       const data = await apiFetch<LoginResponse>("/auth/login", {
//         method: "POST",
//         body: JSON.stringify({ email, password }),
//       });

//       // 2. 받은 토큰을 localStorage에 저장
//       setTokens(data.accessToken, data.refreshToken);

//       alert(`${data.user.name}님 환영합니다!`);
      
//       // 3. 메인 페이지로 이동
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("로그인 실패:", error);
//       alert("이메일 또는 비밀번호가 올바르지 않습니다.");
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <input 
//         type="email" 
//         value={email} 
//         onChange={(e) => setEmail(e.target.value)} 
//         placeholder="이메일" 
//       />
//       <input 
//         type="password" 
//         value={password} 
//         onChange={(e) => setPassword(e.target.value)} 
//         placeholder="비밀번호" 
//       />
//       <button type="submit">로그인</button>
//     </form>
//   );
// }