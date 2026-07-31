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
import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import Greet from "./_components/greet";

export default function Home() {
  const { baseDate, formattedDate } = useBaseDate();
  console.log(`baseDate: ${baseDate}, formattedDate: ${formattedDate}`);

  return (
    <section className={commonStyle.mainContent}>
      {/* AI 인사 */}
      <Greet />

      <Grid>
        <Grid.Link href="/daily/bloodPressure">
          <BP bpDate="07-07" systolic="110" diastolic="70" pulse="90" />
        </Grid.Link>
        <Grid.Link href="/daily/bloodGlucose">
          <BG bgDate="TODAY" glucose="145" />
        </Grid.Link>
        <Grid.ItemFull>
          <Grid.Link href="/meal">
            <Card>
              <Card.Header icon={<Salad />} title="식사 다이어리" />
              <Card.Body noTopPadding>
                <Meal
                  imageUrl="/images/food_sample/cheesy-tokbokki.jpg"
                  mealType={getMealTypeLabel("BREAKFAST")}
                  foodName="프렌치토스트, 오렌지쥬스"
                  foodCalorie={1100}
                  todayCalorie={780}
                  goalCalorie={1800}
                />
              </Card.Body>
            </Card>
          </Grid.Link>
        </Grid.ItemFull>
      </Grid>

      <Grid.Link href="/daily/weight">
        <Weight current="57.9" goal="55.0" />
      </Grid.Link>
      {/* 데일리 쉴드 생성 */}
      <DailyShield />
    </section>
  );
}
