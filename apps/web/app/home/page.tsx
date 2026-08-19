"use client";

import commonStyle from "@/styles/common.module.css";

import DailyShield from "./_components/dailyShield";
import Daily from "./_components/daily";
import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import Greet from "./_components/greet";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ENV } from "@/env";

export default function Home() {
  const router = useRouter();
  const { baseDate, formattedDate } = useBaseDate();
  console.log(`baseDate: ${baseDate}, formattedDate: ${formattedDate}`);

  useEffect(() => {
    // 2. 홈에 들어오자마자 인증 체크
    fetch(`${ENV.API_URL}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    .then((res) => {
      if (!res.ok) {
        // 인증 실패 시 로그인 페이지로 강제 이동
        router.push("/auth/login");
      }
    })
    .catch(() => {
      router.push("/auth/login");
    });
  }, [router]);

  return (
    <section className={commonStyle.mainContent}>
      {/* AI 인사 */}
      <Greet />

      {/* 데일리(혈압,혈당,식사,체중) */}
      <Daily />

      {/* 데일리 쉴드 생성 */}
      <DailyShield />
    </section>
  );
}
