'use client';

import { CircleOff } from "lucide-react";
import styles from "@/styles/meal/meal.module.css";

import Button from "@/app/_components/ui/Button";
import PhotoButton from "./photoButton";
import { MealItem } from "@/types/meal";
import { apiFetch } from "../_api/apiFetch";
import MealDetail from "./mealDetail";
import { getMealTypeLabel } from "@/types/mealType";

interface MealDetailListProps {
  mealsList: MealItem[];
  isToday: boolean;
  onNavRecord: (mealType: string, mealId?: number, isSkipped?: boolean) => void;
}

export default function MealDetailList({
  mealsList,
  isToday,
  onNavRecord,
}: MealDetailListProps){

  const breakfast = mealsList.find((m) => m.mealType === 'BREAKFAST');
  const lunch = mealsList.find((m) => m.mealType === 'LUNCH');
  const dinner = mealsList.find((m) => m.mealType === 'DINNER');

  const renderDetailList = (
    labelKey: 'BREAKFAST' | 'LUNCH' | 'DINNER',
    title: string,
    meal?: MealItem,
  )=> {
    // 음식이 없으면 렌더링하지 않음
    if(!meal || !meal.MealFood || meal.MealFood.length === 0) return null;

    // 수정 가능 조건 : 오늘이면서 SKIPPED 상태가 아닐 때만 클릭 허용
    const isSkippped = meal.mealStatus === 'SKIPPED';
    const canModify = isToday && !isSkippped;
    const handleClick = canModify ? () => onNavRecord(labelKey, meal.id) : undefined;

    return (
      <MealDetail.List 
        key={labelKey}
        type={labelKey} 
        canModify={canModify}
        onClick={handleClick}
      >
        {meal.MealFood.map((food) => (
          <MealDetail.Item key={food.id} name={food.FoodName} calorie={food.calorie} />
        ))}
      </MealDetail.List>
    )
  }

  return (
    <MealDetail>
      {renderDetailList('BREAKFAST', getMealTypeLabel('BREAKFAST'), breakfast)}
      {renderDetailList('LUNCH', getMealTypeLabel('LUNCH'), lunch)}
      {renderDetailList('DINNER', getMealTypeLabel('DINNER'), dinner)}
    </MealDetail>
  )
}
