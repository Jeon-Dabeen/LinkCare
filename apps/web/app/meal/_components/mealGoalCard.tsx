"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Goal, Pencil } from "lucide-react";
import styles from "@/styles/meal/meal.module.css";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import { apiFetch } from "@/utils/api/apiFetch";
import { GoalCalorieResponse } from "@/types/meal";
import { getCalorieMessage } from "@/utils/getCalorieMessage";
import { Card } from "@/app/_components/ui/Card";
import Button, { ButtonIcon } from "@/app/_components/ui/Button";
import Progress from "@/app/_components/ui/Progress";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import Input from "@/app/_components/ui/Input";

interface MealGoalCardProps {
  totalCalorie: number;
  goalCalorie: number;
  onRefresh: () => void; // 저장 후 화면 갱신용 부모 함수 (fetchMeal),
  isToday: boolean; // 오늘인지 여부 (오늘만 수정 가능)
}

export default function MealGoalCard({
  totalCalorie,
  goalCalorie,
  onRefresh,
  isToday,
}: MealGoalCardProps) {

  // 목표칼로리 수정용 상태
  const [openGoal, setOpenGoal] = useState(false);
  const [inputGoalCalorie, setinputGoalCalorie] = useState<number>(2000);
  const [message, setMessage] = useState<string>(
    "목표를 향해 차근차근 잘 가고 있어요!",
  );

  // 목표칼로리 메시지 업데이트
  useEffect(() => {
    const newMessage = getCalorieMessage(totalCalorie, goalCalorie);
    setMessage(newMessage);
  }, [totalCalorie, goalCalorie]);

  // 바텀시트 열 때 현재 목표 칼로리로 초기화
  function handleOpenGoal() {
    if (goalCalorie) setinputGoalCalorie(goalCalorie);
    setOpenGoal(true);
  }

  // 목표칼로리 최고값
  const MAX_CALORIE = 6000;

  // input 변경
  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    if (value > MAX_CALORIE) {
      setinputGoalCalorie(MAX_CALORIE);
      return;
    }
    setinputGoalCalorie(Number(e.target.value));
  }

  // input 변경사항 유무 및 유효성 체크
  const isButtonDisabled =
    inputGoalCalorie === goalCalorie ||
    !inputGoalCalorie ||
    inputGoalCalorie <= 0 ||
    inputGoalCalorie > MAX_CALORIE;

  // 목표 칼로리 저장하기
  async function handleSaveGoal() {
    try {
      // API 호출
      await apiFetch<GoalCalorieResponse>("/meal/goalCalorie", {
        method: "PATCH",
        body: JSON.stringify({
          goalCalorie: inputGoalCalorie,
        }),
      });
      // 저장 후 성공하면 화면 데이터 재조회(fetchMeal) 및 바텀시트 닫기
      await onRefresh();
      setOpenGoal(false);
    } catch (error) {
      console.error("목표칼로리 변경 중 오류 발생: ", error);
      toast.error("목표칼로리 변경 중 오류가 발생했어요");
    }
  }

  return (
    <>
      <Card variant="color">
        <Card.Header
          icon={<Goal />}
          title={message}
          isLeftFull
          right={
            <div className={styles.goalCalorie}>
              <span className={styles.label}>목표 칼로리: </span>
              <span className={styles.value}>
                {goalCalorie.toLocaleString()}
              </span>
              <span className={styles.unit}>kcal</span>
              {isToday && (
                <ButtonIcon color="tertiary" onClick={handleOpenGoal}>
                  <Pencil />
                </ButtonIcon>
              )}
            </div>
          }
        />
        <Card.Body noTopPadding>
          <Progress value={totalCalorie} max={goalCalorie} unit="kcal" />
        </Card.Body>
      </Card>

      {/* bottomSheet */}
      <BottomSheet
        open={openGoal}
        title="목표 칼로리"
        onClose={() => setOpenGoal(false)}
      >
        <div className={formStyle.formWrapper}>
          <div className={commonStyle.textInfo}>
            성인 하루 권장 칼로리는 보통 여성 1,900~2,000kcal, 남성
            2,500~2,600kcal예요. <br />내 몸에 맞는 목표를 설정해 보세요!
          </div>
          <div className={formStyle.formGroup}>
            <Input
              unit="kcal"
              type="number"
              id="goalCalorie"
              name="goalCalorie"
              value={inputGoalCalorie}
              onChange={handleChangeInput}
            />
          </div>
          <Button
            type="button"
            variant="primary"
            size="large"
            onClick={handleSaveGoal}
            disabled={isButtonDisabled}
          >
            저장
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
