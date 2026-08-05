"use client";

import commonStyle from "@/styles/common.module.css";

import DailyShield from "./_components/dailyShield";
import Daily from "./_components/daily";
import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import Greet from "./_components/greet";

export default function Home() {
  const { baseDate, formattedDate } = useBaseDate();
  console.log(`baseDate: ${baseDate}, formattedDate: ${formattedDate}`);

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
