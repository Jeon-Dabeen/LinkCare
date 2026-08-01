import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Angry, BatteryCharging, BatteryFull, BatteryLow, BatteryWarning, Dumbbell, Frown, GlassWater, Laugh, Meh, PillBottle, Salad, ShieldCheck, Smile, SportShoe, Volleyball } from "lucide-react";
import styles from "@/styles/home/home.module.css";
import Card from '@/app/_components/ui/Card';
import Progress from "@/app/_components/ui/Progress";
import QuickSelectCard from "./quickSelectCard";
import WaterSelector from "./waterSelector";
import StepIconSelector from "./stepIconSelector";
import StepSelector from "./stepSelector";
import CustomStep from "./customStep";
import Button from "../../_components/ui/Button";
import { ButtonIcon } from "../../_components/ui/Button";
import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import { DailyShieldState, ShieldPayload } from "@/types/dailyShieldType";

// 상수 데이터 정의
// ==========================================
const INITIAL_SHIELD_DATA: DailyShieldState = {
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

const FEEL_OPTIONS = [
  { val: 1, icon: <Angry />, label: '힘듦' },
  { val: 2, icon: <Frown />, label: '별로' },
  { val: 3, icon: <Meh />, label: '보통' },
  { val: 4, icon: <Smile />, label: '좋음' },
  { val: 5, icon: <Laugh />, label: '최고' },
];

const ENERGY_OPTIONS = [
  { val: 1, icon: <BatteryWarning />, label: '지침' },
  { val: 2, icon: <BatteryLow />, label: '부족' },
  { val: 3, icon: <BatteryFull />, label: '충분' },
  { val: 4, icon: <BatteryCharging />, label: '활력' },
];

const EXERCISE_TIME_OPTIONS = [
  { val: '10', label: '10분' },
  { val: '30', label: '30분' },
  { val: '60', label: '1시간' },
  { val: '120', label: '2시간' },
  // { val: 'more', label: 'more' },
];

const EXERCISE_TYPES = [
  '걷기', '달리기', '요가', '스트레칭', '필라테스',
  '수영', '헬스', '크로스핏', '자전거', '기타',
];

const SUPPLEMENT_TYPES = [
  '종합비타민', '비타민C', '비타민D', 'MSM', '콘드로이친',
  '프로바이오틱스(유산균)', '코엔자임Q10', '멜라토닌',
];

// 순수 헬퍼 함수
// ==========================================
const extractPayload = (data: DailyShieldState): ShieldPayload => {
  const {
    id,
    lastExerciseTime,
    lastExerciseType,
    lastWaterCup,
    lastSupplementType,
    ...payload
  } = data;
  return payload;
};

const checkIsSelected = (sourceStr: string, targetLabel: string): boolean => {
  if (!sourceStr) return false;
  return sourceStr.split(',').map((s) => s.trim()).includes(targetLabel);
};

const calculateProgress = (formData: DailyShieldState): number => {
  let count = 0;
  if ((formData.feel ?? 0) > 0 && (formData.energy ?? 0) > 0) count += 1;
  if (Number(formData.waterCup ?? 0) > 0) count += 1;
  if (Boolean(formData.exerciseTime?.trim() || formData.exerciseType?.trim())) count += 1;
  if (Boolean(formData.supplementType?.trim())) count += 1;
  return count;
};

// API 함수
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/daily-shield`;

const createDailyShield = async (payload: ShieldPayload) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`생성 실패 (Status: ${response.status})`);
  return response.json();
};

const updateDailyShield = async (id: number, payload: ShieldPayload) => {
  console.log(`updateDailyShield: ${id}`)
  console.log(`${API_BASE_URL}/${id}`)
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`수정 실패 (Status: ${response.status})`);
  return response.json();
};

// 메인 컴포넌트
// ==========================================
export default function DailyShield() {
  const { baseDate, formattedDate } = useBaseDate();

  // 데일리 쉴드
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<DailyShieldState>(INITIAL_SHIELD_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const progressValue = useMemo(() => calculateProgress(formData), [formData]);

  const targetDate = formattedDate;

  // 1. [공통] 데일리 쉴드 데이터 재조회 함수
  const fetchDailyShield = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}?dailyDate=${targetDate}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

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
  }, [targetDate]);

  // 날짜(formattedDate) 변경 시 자동 최초 조회
  useEffect(() => {
    fetchDailyShield();
  }, [fetchDailyShield]);

  // 2. 빠른생성
  const isExercise = Number(formData.exerciseTime ?? 0) > 0;
  const isWater = Number(formData.waterCup ?? 0) > 0;
  const isSupplement = Boolean(formData.supplementType && formData.supplementType.trim().length > 0);

  // 빠른 생성 토글 핸들러
  const handleQuickToggle = async (key: 'exercise' | 'water' | 'supplement') => {
    let updatedPayload: DailyShieldState = { ...formData };

    if (key === 'exercise') {
      const isExerciseActive = Number(formData.exerciseTime ?? 0) > 0;
      const nextTime = isExerciseActive ? '' : (formData.lastExerciseTime?.trim() || '30');
      const nextType = isExerciseActive ? '' : (formData.lastExerciseType?.trim() || '걷기');
      updatedPayload = {
        ...formData,
        exerciseTime: nextTime,
        exerciseType: nextType,
      };
    } else if (key === 'water') {
      const isWaterActive = Number(formData.waterCup ?? 0) > 0;
      const nextCup = isWaterActive ? 0 : (formData.lastWaterCup && formData.lastWaterCup > 0 ? formData.lastWaterCup : 8);
      updatedPayload = {
        ...formData,
        waterCup: nextCup,
      };
    } else if (key === 'supplement') {
      const isSupplementActive = Boolean(formData.supplementType && formData.supplementType.trim().length > 0);
      const nextSupplement = isSupplementActive ? '' : (formData.lastSupplementType?.trim() || '종합비타민');
      updatedPayload = {
        ...formData,
        supplementType: nextSupplement,
      };
    }

    const payload = extractPayload(updatedPayload);
    const isUpdate = Boolean(formData.id && formData.id > 0);

    try {
      if (isUpdate) {
        console.log(`formData.id: ${formData.id}, payload: waterCup=${payload.waterCup}, supplementType=${payload.supplementType}, exerciseTime=${payload.exerciseTime}, exerciseType=${payload.exerciseType}`)
        await updateDailyShield(formData.id, payload);
      } else {
        const newResult = await createDailyShield(payload);
        if (newResult?.id) {
          // 백엔드에서 받아온 생성 ID 반영
          setFormData((prev) => ({ ...prev, id: newResult.id }));
        }
      }

      fetchDailyShield();
    } catch (error) {
      console.error('Quick Toggle Auto-save Error:', error);
      // 저장 실패 시 원래 데이터로 롤백
      await fetchDailyShield();
    }
  };

  // 3. 맞춤생성
  // 다음 단계로 이동하는 함수
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // [수정] 버튼 클릭 시
  const handleStartEdit = () => {
    setIsEditing(true);
    setCurrentStep(1); // Step 1부터 다시 시작
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

      const newList = currentList.includes(itemLabel)
        ? currentList.filter((item) => item !== itemLabel)
        : [...currentList, itemLabel];

      return { ...prev, [field]: newList.join(', ') }; // 걷기, 달리기 형태로 조합해서 return
    });
  };

  // 4. 제출
  const handleSubmit = async () => {
    const payload = extractPayload(formData);
    const isUpdate = Boolean(formData.id && formData.id > 0);

    try {
      if (isUpdate) {
        // 수정 호출
        const result = await updateDailyShield(formData.id, payload);
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

  return (
    <Card>
      <div className={styles.headerWrapper}>
      <Card.Header icon={<ShieldCheck />} title="데일리 쉴드 생성" />
      {formData.id > 0 && !isEditing && (
        <ButtonIcon onClick={handleStartEdit}>
          <Pencil />
        </ButtonIcon>
      )}
      </div>
      <Card.Body noTopPadding>
        <div className={styles.dailyShield}>
          <Progress value={progressValue} max={4} isInfo />

          {/* 빠른 생성 영역 */}
          <article className={styles.shieldWrapper}>
            <p className={styles.shieldTitle}>빠른 생성</p>
            <div className={styles.quickWrapper}>
              <QuickSelectCard
                id="exercise"
                checked={isExercise}
                onChange={() => handleQuickToggle('exercise')}
                icon={<SportShoe />}
                title="운동"
                value={(formData.exerciseTime || formData.lastExerciseTime || '30')}
                unit="min"
              />
              <QuickSelectCard
                id="water"
                checked={isWater}
                onChange={() => handleQuickToggle('water')}
                icon={<GlassWater />}
                title="수분섭취"
                value={String(formData.waterCup || formData.lastWaterCup || 8)}
                unit="cups"
              />
              <QuickSelectCard
                id="supplement"
                checked={isSupplement}
                onChange={() => handleQuickToggle('supplement')}
                icon={<PillBottle />}
                title="영양제"
                value={formData.supplementType || formData.lastSupplementType || '종합비타민'}
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
                        {FEEL_OPTIONS.map((item) => (
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
                            {ENERGY_OPTIONS.map((item) => (
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
                        {EXERCISE_TIME_OPTIONS.map((time) => (
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
                         {EXERCISE_TYPES.map((type, idx) => (
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
                        {SUPPLEMENT_TYPES.map((supp, idx) => (
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
  )
}