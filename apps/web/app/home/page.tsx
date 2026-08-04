'use client'

import Link from "next/link";
import clsx from "clsx";
import { Pencil, Angry, BatteryCharging, BatteryFull, BatteryLow, BatteryWarning, Dumbbell, Frown, GlassWater, Laugh, Meh, PillBottle, Salad, ShieldCheck, Smile, SportShoe, Volleyball } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import styles from "@/styles/home/home.module.css";
import Grid from "@/app/_components/ui/Grid";
import Card from '@/app/_components/ui/Card';
import { getMealTypeLabel } from "@/types/mealType";
import BP from "./_components/bloodPressure";
import BG from "./_components/bloodGlucose";
import Weight from "./_components/weight";
import Meal from "./_components/meal";
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
