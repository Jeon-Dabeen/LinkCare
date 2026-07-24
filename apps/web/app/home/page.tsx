'use client'

import Link from "next/link";

import clsx from "clsx";
import { Angry, BatteryCharging, BatteryFull, BatteryLow, BatteryWarning, Dumbbell, Frown, GlassWater, Laugh, Meh, PillBottle, Salad, ShieldCheck, Smile, SportShoe, Volleyball } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import styles from "@/styles/home/home.module.css";

import Grid from "@/app/_components/ui/Grid";
import Card from '@/app/_components/ui/Card';
import Progress from "@/app/_components/ui/Progress";

import { getMealTypeLabel } from "@/types/mealType";
import BP from "./_components/bloodPressure";
import BG from "./_components/bloodGlucose";
import Weight from "./_components/weight";
import Meal from "./_components/meal";
import QuickSelectCard from "./_components/quickSelectCard";
import CustomStep from "./_components/customStep";
import { useState } from "react";
import WaterSelector from "./_components/waterSelector";
import StepIconSelector from "./_components/stepIconSelector";
import StepSelector from "./_components/stepSelector";
import Button from "../_components/ui/Button";


import { useBaseDate } from "@/app/_providers/BaseDateProvider";

// 
type DailyShieldState = {
  feel: number | null
  energy: number | null
  isExercise: boolean
  exerciseTime: string
  exerciseType: string
  isWater: boolean
  waterCup: number | null
  isSupplement: boolean
  supplementType: string
  dailyDate: string
}

type Action =
  | { type: 'SET_FEEL'; value: number }
  | { type: 'SET_ENERGY'; value: number }
  | { type: 'TOGGLE_EXERCISE' }
  | { type: 'SET_EXERCISE_TIME'; value: string }
  | { type: 'SET_EXERCISE_TYPE'; value: string }
  | { type: 'TOGGLE_WATER' }
  | { type: 'SET_WATER_CUP'; value: number }
  | { type: 'TOGGLE_SUPPLEMENT' }
  | { type: 'SET_SUPPLEMENT_TYPE'; value: string }



export default function Home(){

  const {baseDate, formattedDate} = useBaseDate();
  console.log(baseDate, formattedDate);

  const [water, setWater] = useState(5);

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
                  mealType={getMealTypeLabel("breakfast")}
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

      <Card>
        <Card.Header icon={<ShieldCheck />} title="데일리 쉴드 생성" />
        <Card.Body noTopPadding>
          <div className={styles.dailyShield}>
            <Progress value={1} max={5} isInfo />
            <article className={styles.shieldWrapper}>
              <p className={styles.shieldTitle}>빠른 생성</p>
              <div className={styles.quickWrapper}>
                <QuickSelectCard
                  id="exercise"
                  checked={false}
                  onChange={() => {}}
                  icon={<SportShoe />}
                  title="운동"
                  value="30"
                  unit="min"
                />
                <QuickSelectCard
                  id="water"
                  checked={true}
                  onChange={() => {}}
                  icon={<GlassWater />}
                  title="수분섭취"
                  value="6"
                  unit="cups"
                />
                <QuickSelectCard
                  id="supplement"
                  checked={false}
                  onChange={() => {}}
                  icon={<PillBottle/>}
                  title="영양제"
                  value="비타민C, 오메가3, 프로바이오틱스"
                />
              </div>
            </article>
            <article className={styles.shieldWrapper}>
              <p className={styles.shieldTitle}>맞춤 생성</p>
              <div className={styles.customWrapper}>
                <CustomStep question="오늘의 기분은 어떠세요?">
                  <CustomStep.Item>
                    <div className={styles.customItems}>
                      <StepIconSelector
                        name="feel"
                        id="feel01"
                        checked={false}
                        value="1"
                        icon={<Angry />}
                        label="힘듦"
                        onChange={() => {}}
                      />
                      <StepIconSelector
                        name="feel"
                        id="feel02"
                        checked={true}
                        value="2"
                        icon={<Frown />}
                        label="별로"
                        onChange={() => {}}
                      />
                      <StepIconSelector
                        name="feel"
                        id="feel03"
                        checked={false}
                        value="3"
                        icon={<Meh />}
                        label="보통"
                        onChange={() => {}}
                      />
                      <StepIconSelector
                        name="feel"
                        id="feel04"
                        checked={false}
                        value="4"
                        icon={<Smile />}
                        label="좋음"
                        onChange={() => {}}
                      />
                      <StepIconSelector
                        name="feel"
                        id="feel05"
                        checked={false}
                        value="5"
                        icon={<Laugh />}
                        label="최고"
                        onChange={() => {}}
                      />
                    </div>
                  </CustomStep.Item>
                </CustomStep>
                <CustomStep question="에너지 레벨">
                  <CustomStep.Item>
                    <div className={styles.customItemsRow}>
                      <StepIconSelector
                        name="energy"
                        id="energy01"
                        checked={false}
                        value="1"
                        icon={<BatteryWarning />}
                        label="지침"
                        onChange={() => {}}
                      />
                      <StepIconSelector
                        name="energy"
                        id="energy02"
                        checked={true}
                        value="2"
                        icon={<BatteryLow />}
                        label="부족"
                        onChange={() => {}}
                      />
                      <StepIconSelector
                        name="energy"
                        id="energy03"
                        checked={false}
                        value="3"
                        icon={<BatteryFull />}
                        label="충분"
                        onChange={() => {}}
                      />
                      <StepIconSelector
                        name="energy"
                        id="energy04"
                        checked={false}
                        value="4"
                        icon={<BatteryCharging />}
                        label="활력"
                        onChange={() => {}}
                      />
                    </div>
                  </CustomStep.Item>
                </CustomStep>
                <div className={styles.customButton}>
                  <Button type="button" round>
                    다음
                  </Button>
                </div>
              </div>
              <div className={styles.customWrapper}>
                <CustomStep question="물이 필요한 만큼 수분 충전하세요">
                  <CustomStep.Item icon={<GlassWater />} title="오늘 마신 물">
                    <div>
                      <WaterSelector
                        value={water}
                        max={10}
                        onChange={setWater}
                      />
                    </div>
                  </CustomStep.Item>
                </CustomStep>
                <div className={styles.customButton}>
                  <Button type="button" round>
                    다음
                  </Button>
                </div>
              </div>
              <div className={styles.customWrapper}>
                <CustomStep question="면역력에는 운동이 필수죠!">
                  <CustomStep.Item
                    icon={<Dumbbell />}
                    title="운동을 얼마나 하셨나요?"
                  >
                    <div className={styles.customItems}>
                      <StepSelector
                        type="radio"
                        name="exersiseTime"
                        id="exTime0"
                        checked={false}
                        value="t0"
                        label="0"
                        onChange={() => {}}
                      />
                      <StepSelector
                        type="radio"
                        name="exersiseTime"
                        id="exTime30"
                        checked={true}
                        value="t30"
                        label="30분"
                        onChange={() => {}}
                      />
                      <StepSelector
                        type="radio"
                        name="exersiseTime"
                        id="exTime60"
                        checked={false}
                        value="t60"
                        label="1시간"
                        onChange={() => {}}
                      />
                      <StepSelector
                        type="radio"
                        name="exersiseTime"
                        id="exTime120"
                        checked={false}
                        value="t120"
                        label="2시간"
                        onChange={() => {}}
                      />
                    </div>
                  </CustomStep.Item>
                  <CustomStep.Item
                    icon={<Volleyball />}
                    title="어떤 운동을 하셨나요?"
                  >
                    <div className={styles.customItems}>
                      <StepSelector
                        name="exersiseType"
                        id="exType01"
                        checked={false}
                        value="exType01"
                        label="걷기"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="exersiseType"
                        id="exType02"
                        checked={true}
                        value="exType02"
                        label="달리기"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="exersiseType"
                        id="exType03"
                        checked={false}
                        value="exType03"
                        label="요가"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="exersiseType"
                        id="exType04"
                        checked={false}
                        value="exType04"
                        label="스트레칭"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="exersiseType"
                        id="exType05"
                        checked={true}
                        value="exType05"
                        label="필라테스"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="exersiseType"
                        id="exType06"
                        checked={false}
                        value="exType06"
                        label="수영"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="exersiseType"
                        id="exType07"
                        checked={false}
                        value="exType07"
                        label="헬스"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="exersiseType"
                        id="exType08"
                        checked={false}
                        value="exType08"
                        label="크로스핏"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="exersiseType"
                        id="exType09"
                        checked={false}
                        value="exType09"
                        label="자전거"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="exersiseType"
                        id="exType10"
                        checked={false}
                        value="exType10"
                        label="기타"
                        onChange={() => {}}
                      />
                    </div>
                  </CustomStep.Item>
                </CustomStep>
                <div className={styles.customButton}>
                  <Button type="button" round>
                    다음
                  </Button>
                </div>
              </div>
              <div className={styles.customWrapper}>
                <CustomStep>
                  <CustomStep.Item
                    icon={<PillBottle />}
                    title="영양제로 보충해요"
                  >
                    <div className={styles.customItems}>
                      <StepSelector
                        name="supplementType"
                        id="spType01"
                        checked={false}
                        value="spType01"
                        label="종합비타민"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="supplementType"
                        id="spType02"
                        checked={true}
                        value="spType02"
                        label="비타민C"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="supplementType"
                        id="spType03"
                        checked={false}
                        value="spType03"
                        label="프로바이오틱스(유산균)"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="supplementType"
                        id="spType04"
                        checked={true}
                        value="spType04"
                        label="코엔자임Q10"
                        onChange={() => {}}
                      />
                      <StepSelector
                        name="supplementType"
                        id="spType05"
                        checked={false}
                        value="spType05"
                        label="멜라토닌"
                        onChange={() => {}}
                      />
                    </div>
                  </CustomStep.Item>
                </CustomStep>
                <div className={styles.customButton}>
                  <Button type="button" full>
                    데일리 쉴드 업데이트
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </Card.Body>
      </Card>
    </section>
  );
}
