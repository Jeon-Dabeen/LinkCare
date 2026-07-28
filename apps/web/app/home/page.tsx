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

export default function Home() {
  const { baseDate, formattedDate } = useBaseDate();
  console.log(`baseDate: ${baseDate}, formattedDate: ${formattedDate}`);

  return (
    <section className={commonStyle.mainContent}>
      <div className={styles.greetingWrapper}>
        <p className={styles.greeting}>오늘도 반가워요,</p>
        <p className={styles.nickname}>
          <strong>하늘을 나는 코끼리</strong>님!
        </p>
        <div className={styles.aiComment}>
          오늘은 2시간 크로스핏을 하셨는데 식사를 거의 못 하셔서 회복이 부족할 수 있어요.
          운동 뒤에는 단백질과 탄수화물이 함께 있는 가벼운 식사로 몸을 채워보시는 것을 권장해요.
          이전처럼 혈압이 매우 높게 적힌 점이 걱정돼요. 다시 정확히 재보시고, 두통·어지러움·가슴통증이 있으면 병원에 문의해보세요.
        </div>
      </div>

      <Grid>
        <Grid.Link href="/daily/bloodPressure">
          <BP bpDate="07-07" systolic="110" diastolic="70" pulse="90" />
        </Grid.Link>
        <Grid.Link href="/daily/bloodGlucose">
          <BG bgDate="TODAY" glucose="145" />
        </Grid.Link>
        <Grid.ItemFull>
          <Grid.Link href="/daily/meal">
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

      <DailyShield />
    </section>
  );
}
