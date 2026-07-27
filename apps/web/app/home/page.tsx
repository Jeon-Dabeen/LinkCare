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

// mock data
const initialShieldData: DailyShieldState = {
  feel: 0,
  energy: 0,
  isExercise: false,
  exerciseTime: '0',
  exerciseType: '',
  isWater: false,
  waterCup: 0,
  isSupplement: false,
  supplementType: '',
  dailyDate: '2026-07-22'
};

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

export default function Home() {
  const { baseDate, formattedDate } = useBaseDate();
  console.log(baseDate, formattedDate);

  // 1. 데일리 쉴드
  // 현재 진행 중인 단계 상태 추가 (기본값: 1단계)
  const [currentStep, setCurrentStep] = useState<number>(1);
  // 전체 데일리 쉴드 폼
  const [formData, setFormData] = useState<DailyShieldState>(initialShieldData);
  
  // 다음 단계로 이동하는 함수
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // 단일 값 변경 핸들러 (기분, 에너지, 운동시간 등)
  const handleFieldChange = <K extends keyof DailyShieldState>(
    field: K,
    value: DailyShieldState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 빠른 생성 토글 핸들러 (운동 / 수분 / 영양제 On/Off)
  const handleQuickToggle = (
    field: 'isExercise' | 'isWater' | 'isSupplement'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // 다중 선택 토글 핸들러 (운동 종류, 영양제 종류 - 쉼표로 구반되는 문자열)
  const handleMultiSelectToggle = (
    field: 'exerciseType' | 'supplementType',
    itemLabel: string
  ) => {
    setFormData((prev) => {
      // 쉼표로 구분된 문자열을 배열로 변환
      const currentList = prev[field]
        ? prev[field].split(',').map((s) => s.trim())
        : [];

      const exists = currentList.includes(itemLabel);
      const newList = exists
        ? currentList.filter((item) => item !== itemLabel)
        : [...currentList, itemLabel];

      return {
        ...prev,
        [field]: newList.join(', '), // 다시 "걷기, 달리기" 형태로 합성
      };
    });
  };

  // 제출 (백엔드 전송)
  const handleSubmit = () => {
    console.log('백엔드로 전송할 데이터:', { dailyShield: formData });
    // TODO: fetch or axios API Call
  };

  // 헬퍼: 특정 항목이 선택되었는지 체크하는 함수
  const isSelectedType = (
    field: 'exerciseType' | 'supplementType',
    label: string
  ) => {
    return formData[field]?.split(',').map((s) => s.trim()).includes(label) ?? false;
  };

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
                  checked={formData.isExercise}
                  onChange={() => handleQuickToggle('isExercise')}
                  icon={<SportShoe />}
                  title="운동"
                  value={formData.exerciseTime || '0'}
                  unit="min"
                />
                <QuickSelectCard
                  id="water"
                  checked={formData.isWater}
                  onChange={() => handleQuickToggle('isWater')}
                  icon={<GlassWater />}
                  title="수분섭취"
                  value={String(formData.waterCup)}
                  unit="cups"
                />
                <QuickSelectCard
                  id="supplement"
                  checked={formData.isSupplement}
                  onChange={() => handleQuickToggle('isSupplement')}
                  icon={<PillBottle />}
                  title="영양제"
                  value={formData.supplementType || ''}
                />
              </div>
            </article>
            <article className={styles.shieldWrapper}>
              <p className={styles.shieldTitle}>맞춤 생성</p>
              {/* Step 1: 기분 & 에너지 */}
              {currentStep === 1 && (
                <div className={styles.customWrapper}>
                  {/* 기분 질문 (항상 보임) */}
                  <CustomStep question="오늘의 기분은 어떠세요?">
                    <CustomStep.Item>
                      <div className={styles.customItems}>
                        {[
                          { val: 1, icon: <Angry />, label: '힘듦' },
                          { val: 2, icon: <Frown />, label: '별로' },
                          { val: 3, icon: <Meh />, label: '보통' },
                          { val: 4, icon: <Smile />, label: '좋음' },
                          { val: 5, icon: <Laugh />, label: '최고' },
                        ].map((item) => (
                          <StepIconSelector
                            key={item.val}
                            name="feel"
                            id={`feel0${item.val}`}
                            checked={formData.feel === item.val}
                            value={String(item.val)}
                            icon={item.icon}
                            label={item.label}
                            onChange={() => handleFieldChange('feel', item.val)}
                          />
                        ))}
                      </div>
                    </CustomStep.Item>
                  </CustomStep>

                  {(formData.feel ?? 0) > 0 && (
                    <>
                      <CustomStep question="에너지 레벨">
                        <CustomStep.Item>
                          <div className={styles.customItemsRow}>
                            {[
                              { val: 1, icon: <BatteryWarning />, label: '지침' },
                              { val: 2, icon: <BatteryLow />, label: '부족' },
                              { val: 3, icon: <BatteryFull />, label: '충분' },
                              { val: 4, icon: <BatteryCharging />, label: '활력' },
                            ].map((item) => (
                              <StepIconSelector
                                key={item.val}
                                name="energy"
                                id={`energy0${item.val}`}
                                checked={formData.energy === item.val}
                                value={String(item.val)}
                                icon={item.icon}
                                label={item.label}
                                onChange={() => handleFieldChange('energy', item.val)}
                              />
                            ))}
                          </div>
                        </CustomStep.Item>
                      </CustomStep>

                      <div className={styles.customButton}>
                        <Button
                          type="button"
                          round
                          disabled={formData.energy === 0} // 선택 안 하면 버튼 비활성화 (선택 사항)
                          onClick={handleNextStep}
                        >
                          다음
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 2: 수분 충전 */}
              {currentStep === 2 && (
                <div className={styles.customWrapper}>
                  <CustomStep question="물이 필요한 만큼 수분 충전하세요">
                    <CustomStep.Item icon={<GlassWater />} title="오늘 마신 물">
                      <div>
                        <WaterSelector
                          value={formData.waterCup || 0}
                          max={10}
                          onChange={(newCup) => handleFieldChange('waterCup', newCup)}
                        />
                      </div>
                    </CustomStep.Item>
                  </CustomStep>
                  <div className={styles.customButton}>
                    <Button type="button" round onClick={handleNextStep}>
                      다음
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: 운동 정보 */}
              {currentStep === 3 && (
                <div className={styles.customWrapper}>
                  <CustomStep question="면역력에는 운동이 필수죠!">
                    <CustomStep.Item
                      icon={<Dumbbell />}
                      title="운동을 얼마나 하셨나요?"
                    >
                      <div className={styles.customItems}>
                        {[
                          { val: '0', label: '0' },
                          { val: '30', label: '30분' },
                          { val: '60', label: '1시간' },
                          { val: '120', label: '2시간' },
                        ].map((time) => (
                          <StepSelector
                            key={time.val}
                            type="radio"
                            name="exerciseTime"
                            id={`exTime${time.val}`}
                            checked={formData.exerciseTime === time.val}
                            value={time.val}
                            label={time.label}
                            onChange={() => handleFieldChange('exerciseTime', time.val)}
                          />
                        ))}
                      </div>
                    </CustomStep.Item>
                    <CustomStep.Item
                      icon={<Volleyball />}
                      title="어떤 운동을 하셨나요?"
                    >
                      <div className={styles.customItems}>
                        {[
                          '걷기', '달리기', '요가', '스트레칭', '필라테스',
                          '수영', '헬스', '크로스핏', '자전거', '기타'
                        ].map((type, idx) => (
                          <StepSelector
                            key={type}
                            name="exerciseType"
                            id={`exType0${idx + 1}`}
                            checked={isSelectedType('exerciseType', type)}
                            value={type}
                            label={type}
                            onChange={() => handleMultiSelectToggle('exerciseType', type)}
                          />
                        ))}
                      </div>
                    </CustomStep.Item>
                  </CustomStep>
                  <div className={styles.customButton}>
                    <Button type="button" round onClick={handleNextStep}>
                      다음
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: 영양제 정보 */}
              {currentStep === 4 && (
                <div className={styles.customWrapper}>
                  <CustomStep>
                    <CustomStep.Item
                      icon={<PillBottle />}
                      title="영양제로 보충해요"
                    >
                      <div className={styles.customItems}>
                        {[
                          '종합비타민', '비타민C', '비타민D', 'MSM', '콘드로이친', '프로바이오틱스(유산균)',
                          '코엔자임Q10', '멜라토닌'
                        ].map((supp, idx) => (
                          <StepSelector
                            key={supp}
                            name="supplementType"
                            id={`spType0${idx + 1}`}
                            checked={isSelectedType('supplementType', supp)}
                            value={supp}
                            label={supp}
                            onChange={() => handleMultiSelectToggle('supplementType', supp)}
                          />
                        ))}
                      </div>
                    </CustomStep.Item>
                  </CustomStep>
                  <div className={styles.customButton}>
                    <Button type="button" full onClick={handleSubmit}>
                      데일리 쉴드 업데이트
                    </Button>
                  </div>
                </div>
              )}
            </article>
          </div>
        </Card.Body>
      </Card>
    </section>
  );
}
