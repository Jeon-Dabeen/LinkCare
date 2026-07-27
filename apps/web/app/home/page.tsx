'use client'

import Link from "next/link";

import clsx from "clsx";
import { Pencil, Angry, BatteryCharging, BatteryFull, BatteryLow, BatteryWarning, Dumbbell, Frown, GlassWater, Laugh, Meh, PillBottle, Salad, ShieldCheck, Smile, SportShoe, Volleyball } from "lucide-react";
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
import { useCallback, useEffect, useState } from "react";
import WaterSelector from "./_components/waterSelector";
import StepIconSelector from "./_components/stepIconSelector";
import StepSelector from "./_components/stepSelector";
import Button from "../_components/ui/Button";
import { ButtonIcon } from "../_components/ui/Button";

import { useBaseDate } from "@/app/_providers/BaseDateProvider";

type DailyShieldState = {
  id: number,
  feel: number | null,
  energy: number | null,
  exerciseTime: string,
  exerciseType: string,
  waterCup: number | null,
  supplementType: string,
  dailyDate: string,
  lastExerciseTime: string,
  lastExerciseType: string,
  lastWaterCup: number | null,
  lastSupplementType: string
}

// mock data
const initialShieldData: DailyShieldState = {
  id: 0,
  feel: 0,
  energy: 0,
  exerciseTime: '',
  exerciseType: '',
  waterCup: 0,
  supplementType: '',
  dailyDate: '',
  lastExerciseTime: "",
  lastExerciseType: '',
  lastWaterCup: 0,
  lastSupplementType: ''
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
  console.log(`baseDate: ${baseDate}, formattedDate: ${formattedDate}`);

  // 데일리 쉴드
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<DailyShieldState>(initialShieldData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const userId = 1;
  const targetDate = formattedDate;

  // 1. [공통] 데일리 쉴드 데이터 재조회 함수 (독립 선언)
  const fetchDailyShield = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3001/daily-shield/${userId}?dailyDate=${targetDate}`
      );

      if (!response.ok) {
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }

      const data: DailyShieldState = await response.json();

      // API 결과를 formData 전체에 세팅 (생성된 id 및 last* 값 포함)
      setFormData(data);
    } catch (error) {
      console.error('DailyShield Fetch Error:', error);
      // TODO: toast 처리 필요
    } finally {
      setIsLoading(false);
    }
  }, [userId, targetDate]);

  // 날짜(formattedDate) 변경 시 자동 최초 조회
  useEffect(() => {
    fetchDailyShield();
  }, [fetchDailyShield]);

  // 2. 빠른생성
  const isExercise = Boolean(formData.exerciseTime && formData.exerciseTime.trim().length > 0);
  const isWater = (formData.waterCup ?? 0) > 0;
  const isSupplement = Boolean(formData.supplementType && formData.supplementType.trim().length > 0);

  // 빠른 생성 토글 핸들러
  const handleQuickToggle = (key: 'exercise' | 'water' | 'supplement') => {
    setFormData((prev) => {
      switch (key) {
        case 'exercise': {
          const isActive = Boolean(prev.exerciseTime && prev.exerciseTime.trim().length > 0);
          return {
            ...prev,
            exerciseTime: isActive ? '' : (prev.lastExerciseTime || 't30'),
            exerciseType: isActive ? '' : (prev.lastExerciseType || '걷기'),
          };
        }

        case 'water': {
          const isActive = (prev.waterCup ?? 0) > 0;
          return { ...prev, waterCup: isActive ? 0 : (prev.lastWaterCup && prev.lastWaterCup > 0 ? prev.lastWaterCup : 8) };
        }

        case 'supplement': {
          const isActive = Boolean(prev.supplementType && prev.supplementType.trim().length > 0);
          return { ...prev, supplementType: isActive ? '' : (prev.lastSupplementType?.trim() || '종합비타민') };
        }

        default:
          return prev;
      }
    });
  };

  // 3. 맞춤생성: 다음 단계로 이동하는 함수
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

  // 4. 제출 (백엔드 전송)
  // [생성] POST API 호출 함수
  const createDailyShield = async (
    payload: Omit<DailyShieldState,
      'id' | 'lastExerciseTime' | 'lastExerciseType' | 'lastWaterCup' | 'lastSupplementType'>
  ) => {
    const response = await fetch('http://localhost:3001/daily-shield', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`생성 실패 (Status: ${response.status})`);
    }

    return response.json();
  };

  // [수정] PATCH API 호출 함수
  const updateDailyShield = async (
    id: number,
    payload: Omit<DailyShieldState, 'id' | 'lastExerciseTime' | 'lastExerciseType' | 'lastWaterCup' | 'lastSupplementType'>
  ) => {
    const response = await fetch(`http://localhost:3001/daily-shield`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`수정 실패 (Status: ${response.status})`);
    }

    return response.json();
  };

  // [제출 이벤트 핸들러] id 값에 따라 해당 함수 호출
  const handleSubmit = async () => {
    const {
      id,
      lastExerciseTime,
      lastExerciseType,
      lastWaterCup,
      lastSupplementType,
      ...payload
    } = formData;

    const isUpdate = Boolean(id && id > 0);

    try {
      if (isUpdate) {
        // 수정 호출
        const result = await updateDailyShield(id, payload);
        console.log('수정 완료:', result);
        alert('데일리 쉴드가 수정되었습니다!');
      } else {
        // 생성 호출
        const result = await createDailyShield(payload);
        console.log('생성 완료:', result);
        alert('데일리 쉴드가 성공적으로 등록되었습니다!');
      }

      setIsEditing(false);
      // 데이터 최신화
      await fetchDailyShield();


    } catch (error) {
      console.error('Submit Error:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // 헬퍼: 특정 항목이 선택되었는지 체크하는 함수
  const isSelectedType = (
    field: 'exerciseType' | 'supplementType',
    label: string
  ) => {
    return formData[field]?.split(',').map((s) => s.trim()).includes(label) ?? false;
  };

  // 프로그레스 바 데이터 입력 완료 항목 개수 계산 (0~4)
  const getProgressValue = (): number => {
    let count = 0;

    // 기분 & 에너지 (둘 다 선택 시 1점)
    if ((formData.feel ?? 0) > 0 && (formData.energy ?? 0) > 0) {
      count += 1;
    }

    // 수분 섭취 (1잔 이상 시 1점)
    if ((formData.waterCup ?? 0) > 0) {
      count += 1;
    }

    // 운동 (시간 또는 운동 종류 입력 시 1점)
    const hasExercise = Boolean(
      (formData.exerciseTime && formData.exerciseTime.trim().length > 0) ||
      (formData.exerciseType && formData.exerciseType.trim().length > 0)
    );
    if (hasExercise) {
      count += 1;
    }

    // 영양제 (영양제 종류 입력 시 1점)
    const hasSupplement = Boolean(
      formData.supplementType && formData.supplementType.trim().length > 0
    );
    if (hasSupplement) {
      count += 1;
    }

    return count;
  };

  // 현재 진행률 (0, 1, 2, 3, 4)
  const progressValue = getProgressValue();

  // 
  // [수정] 버튼 클릭 시
  const handleStartEdit = () => {
    setIsEditing(true);
    setCurrentStep(1); // Step 1부터 다시 시작
  };

  // 저장/수정 완료 처리 (handleSubmit 성공 후 호출)
  const handleFormSubmit = async () => {
    await handleSubmit();
    setIsEditing(false); // 저장 후 완료 모드로 전환
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
        {formData.id > 0 && !isEditing && (
          <ButtonIcon onClick={handleStartEdit}>
            <Pencil />
          </ButtonIcon>
        )}
        <Card.Body noTopPadding>
          <div className={styles.dailyShield}>
            <Progress value={progressValue} max={4} isInfo />
            <article className={styles.shieldWrapper}>
              <p className={styles.shieldTitle}>빠른 생성</p>
              <div className={styles.quickWrapper}>
                <QuickSelectCard
                  id="exercise"
                  checked={isExercise}
                  onChange={() => handleQuickToggle('exercise')}
                  icon={<SportShoe />}
                  title="운동"
                  value={(formData.exerciseTime || formData.lastExerciseTime).replace('t', '')}
                  unit="min"
                />
                <QuickSelectCard
                  id="water"
                  checked={isWater}
                  onChange={() => handleQuickToggle('water')}
                  icon={<GlassWater />}
                  title="수분섭취"
                  value={String(formData.waterCup || formData.lastWaterCup)}
                  unit="cups"
                />
                <QuickSelectCard
                  id="supplement"
                  checked={isSupplement}
                  onChange={() => handleQuickToggle('supplement')}
                  icon={<PillBottle />}
                  title="영양제"
                  value={formData.supplementType || formData.lastSupplementType}
                />
              </div>
            </article>
            {(!formData.id || isEditing) && (
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
                            { val: 't0', label: '0' },
                            { val: 't30', label: '30분' },
                            { val: 't60', label: '1시간' },
                            { val: 't120', label: '2시간' },
                            { val: 'tmore', label: 'more' },
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
            )}
          </div>
        </Card.Body>
      </Card>
    </section>
  );
}
