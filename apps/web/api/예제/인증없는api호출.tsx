// // components/NoticeList.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch } from "@/lib/api";

// interface Notice {
//   id: number;
//   title: string;
// }

// export default function NoticeList() {
//   const [notices, setNotices] = useState<Notice[]>([]);

//   useEffect(() => {
//     async function loadNotices() {
//       try {
//         // auth 옵션을 넣지 않음 (기본값 false)
//         const data = await apiFetch<Notice[]>("/notices");
//         setNotices(data);
//       } catch (error) {
//         console.error("공지사항 로드 실패", error);
//       }
//     }

//     loadNotices();
//   }, []);

//   return (
//     <ul>
//       {notices.map((n) => (
//         <li key={n.id}>{n.title}</li>
//       ))}
//     </ul>
//   );
// }