'use client'

import Link from "next/link";

import clsx from "clsx";
import { Dumbbell, GlassWater, PillBottle, Salad, ShieldCheck, SportShoe, Volleyball } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import styles from "@/styles/home/home.module.css";

import Grid from "@/app/_components/ui/Grid";
import Card from '@/app/_components/ui/Card';

import { getMealTypeLabel } from "@/lib/mealType";
import BP from "./_components/bloodPressure";
import BG from "./_components/bloodGlucose";
import Weight from "./_components/weight";
import Meal from "./_components/meal";
import Progress from "@/app/_components/ui/Progress";
import QuickSelectCard from "./_components/quickSelectCard";
import CustomStep from "./_components/customStep";
import { useState } from "react";
import WaterSelector from "./_components/waterSelector";
import Button from "../_components/ui/Button";




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

  const [water, setWater] = useState(5);

  return (
    <section className={commonStyle.mainContent}>

      <div className={styles.greetingWrapper}>
        <p className={styles.greeting}>오늘도 반가워요</p>
        <p className={styles.nickname}><strong>하늘을 나는 코끼리</strong>님!</p>
        <div className={styles.aiComment}>협압이 안정적으로 유지되고 있어요, 이렇게만 유지하면 30대 건강한 몸이 부럽지 않아요.</div>
      </div>    

      <Grid>
        <Link href="/daily/bloodPressure">
          <BP 
            bpDate="07-07"
            systolic="110"
            diastolic="70"
            pulse="90"
          />
        </Link>
        <Link href="/daily/bloodGlucose">
          <BG 
            bgDate="TODAY"
            glucose="145"
          />
        </Link>
        <Grid.ItemFull>
          <Link href="/daily/meal">
            <Card>
              <Card.Header 
                icon={<Salad />}
                title="식사 다이어리"
              />
              <Card.Body noTopPadding>
                <Meal
                  imageUrl = "/images/food_sample/cheesy-tokbokki.jpg"
                  mealType = {getMealTypeLabel("breakfast")}
                  foodName = "프렌치토스트"
                  foodCalorie = {1100}
                  todayCalorie = {780}
                  goalCalorie = {1800}
                />
              </Card.Body>
            </Card>
          </Link>
        </Grid.ItemFull>
      </Grid>

      <Link href="/daily/weight">
        <Weight 
          current="57.9"
          goal="55.0"
        />
      </Link>

      <Card>
        <Card.Header 
          icon={<ShieldCheck />}
          title="데일리 쉴드 생성" 
        />
        <Card.Body noTopPadding>
          <div className={styles.dailyShield}>
            <Progress 
              value={1}
              max={5}
              isInfo
            />
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
                  icon={<SportShoe />}
                  title="수분섭취"
                  value="6"
                  unit="cups"
                />
                <QuickSelectCard
                  id="supplement"
                  checked={false}
                  onChange={() => {}}
                  icon={<SportShoe />}
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
                    <div>
                      오늘의 기분 선택
                    </div>
                  </CustomStep.Item>
                </CustomStep>
                <CustomStep question="에너지 레벨">
                  <CustomStep.Item>
                    <div>
                      에너지 레벨 선택
                    </div>
                  </CustomStep.Item>
                </CustomStep>
                <div className={styles.customButton}>
                  <Button type="button"
                    round
                  >
                    다음
                  </Button>
                </div>
              </div>
              <div className={styles.customWrapper}>
                <CustomStep question="물이 필요한 만큼 수분 충전하세요">
                  <CustomStep.Item
                    icon={<GlassWater />}
                    title="오늘 마신 물"
                  >
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
                  <Button type="button"
                    round
                  >
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
                    <div>
                      운동 시간 선택
                    </div>
                  </CustomStep.Item>
                  <CustomStep.Item
                    icon={<Volleyball />}
                    title="어떤 운동을 하셨나요?"
                  >
                    <div>
                      운동 종류 선택
                    </div>
                  </CustomStep.Item>
                </CustomStep>
                <CustomStep question="에너지 레벨">
                  <CustomStep.Item>
                    <div>
                      에너지 레벨 선택
                    </div>
                  </CustomStep.Item>
                </CustomStep>
                <div className={styles.customButton}>
                  <Button type="button"
                    round
                  >
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
                    <div>
                      영양제 선택
                    </div>
                  </CustomStep.Item>
                </CustomStep>
                <div className={styles.customButton}>
                  <Button type="button"
                    full
                  >
                    데일리 쉴드 업데이트
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}
