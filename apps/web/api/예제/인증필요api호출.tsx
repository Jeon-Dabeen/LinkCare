// // app/profile/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch } from "@/lib/api";
// import { logout } from "@/lib/auth";

// interface UserProfile {
//   id: number;
//   email: string;
//   name: string;
// }

// export default function ProfilePage() {
//   const [profile, setProfile] = useState<UserProfile | null>(null);

//   // 예제 A: GET 요청 (인증 필요)
//   useEffect(() => {
//     async function fetchProfile() {
//       try {
//         const data = await apiFetch<UserProfile>("/users/me", {
//           auth: true, // 🔑 Authorization: Bearer <token> 헤더 자동 첨부
//         });
//         setProfile(data);
//       } catch (error) {
//         console.error("프로필 조회 실패:", error);
//       }
//     }

//     fetchProfile();
//   }, []);

//   // 예제 B: POST 요청 (인증 필요 + 데이터 전송)
//   const handleUpdateName = async () => {
//     try {
//       const updatedUser = await apiFetch<UserProfile>("/users/me", {
//         method: "PATCH",
//         auth: true, // 🔑 인증 필요
//         body: JSON.stringify({ name: "새로운 이름" }),
//       });
      
//       setProfile(updatedUser);
//       alert("이름이 수정되었습니다!");
//     } catch (error) {
//       alert("수정에 실패했습니다.");
//     }
//   };

//   if (!profile) return <div>로딩 중...</div>;

//   return (
//     <div>
//       <h1>내 프로필</h1>
//       <p>이메일: {profile.email}</p>
//       <p>이름: {profile.name}</p>
      
//       <button onClick={handleUpdateName}>이름 변경</button>
//       <button onClick={logout}>로그아웃</button>
//     </div>
//   );
// }