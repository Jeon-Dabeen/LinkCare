"use client";

import { CircleOff, CookingPot } from "lucide-react";
import styles from "@/styles/meal/meal.module.css";

import Button from "@/app/_components/ui/Button";
import PhotoButton from "./photoButton";
import { MealItem } from "@/types/meal";
import { apiFetch } from "../_api/apiFetch";

interface MealPhotoListProps {
  mealsList: MealItem[];
  isToday: boolean;
  formattedDate: string;
  onNavRecord: (mealType: string, mealId?: number, isSkipped?: boolean) => void;
  onRefresh: () => void;
}

export default function MealPhotoList({
  mealsList,
  isToday,
  formattedDate,
  onNavRecord,
  onRefresh,
}: MealPhotoListProps) {
  const breakfast = mealsList.find((m) => m.mealType === "BREAKFAST");
  const lunch = mealsList.find((m) => m.mealType === "LUNCH");
  const dinner = mealsList.find((m) => m.mealType === "DINNER");

  // 안먹었어요 버튼
  async function handleToggleSkip(
    mealId: number,
    currentState: string,
    mealFoodCount: number = 0,
  ) {
    if (currentState !== "SKIPPED" && mealFoodCount > 0) {
      return;
    }

    // 이미 안먹음 상태면 취소, 아니면 SKIPPED로 변경
    const nextStatus = currentState === "SKIPPED" ? "PENDING" : "SKIPPED";

    try {
      await apiFetch(`/meal/${mealId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          mealStatus: nextStatus,
          baseDate: formattedDate,
        }),
      });

      // 화면 데이터를 최신화하기 위해 다시 불러오기
      onRefresh();
    } catch (error) {
      if (error instanceof Error) {
        console.error("안먹었어요 상태 변경 실패: ", error.message);
        alert(error.message);
      }
    }
  }

  const renderMealItem = (
    label: 'BREAKFAST' | 'LUNCH' | 'DINNER',
    meal?: MealItem,
  ) => {
    const isSkipped = meal?.mealStatus === 'SKIPPED';
    const foodCount = meal?.MealFood?.length ?? 0;
    const hasFood = foodCount > 0;
    const canModifyMeal = isToday && !isSkipped;

    // photoButton 클릭 함수
    const handlePhotoClick = () => {
      onNavRecord(label, meal?.id, isSkipped);
    }

    return (
      <div className={styles.photoItem} key={label}>
        <PhotoButton
          label={label}
          imageUrl={meal?.photoUrl ?? undefined}
          onClick={handlePhotoClick}
          canModify={canModifyMeal}
          isSkipped={isSkipped}
        />
        {isToday && meal && !hasFood && (
          <Button
            variant="text-tertiary"
            onClick={() =>
              handleToggleSkip(
                meal.id,
                meal.mealStatus,
                foodCount,
              )
            }
          >
            {isSkipped ? (
              <>
                <CookingPot size={16} />
                <span>식사했어요</span>
              </>
            ) : (
              <>
                <CircleOff size={16} />
                <span>안먹었어요</span>
              </>
            )}
          </Button>
        )}
      </div>
    )
  }

  return (
    <article className={styles.photoList}>
      {renderMealItem('BREAKFAST', breakfast)}
      {renderMealItem('LUNCH', lunch)}
      {renderMealItem('DINNER', dinner)}
    </article>
  );
}
