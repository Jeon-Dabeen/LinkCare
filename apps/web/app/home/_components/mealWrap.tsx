"use client";

import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import { apiFetch } from "@/utils/api/apiFetch";

import { MealDailyResponse } from "@/types/home";
import { getMealTypeLabel } from "@/types/mealType";
import Meal from "./meal";
import { useCallback, useEffect, useState } from "react";

export default function Daily() {
  const { formattedDate } = useBaseDate();

  const [dailyMealData, setDailyMealDate] = useState<MealDailyResponse | null>(null);

  // 데이터 불러오기 함수
  const fetchMealData = useCallback(async() => {
    try{
      const response = await apiFetch<MealDailyResponse>(`/meal/home/meals?date=${formattedDate}`);
      setDailyMealDate(response.data);
    }catch(error){
      if(error instanceof Error){
        console.error('데일리 데이터 로드 실패: ', error.message);
      }
    }
  }, [formattedDate])


  useEffect(() => {
    fetchMealData();
  }, [fetchMealData])

  return (

    <Meal
      imageUrl={dailyMealData?.photoUrl || ''}
      mealType={getMealTypeLabel(dailyMealData?.mealType)}
      foodName={dailyMealData?.foodName || ''}
      foodCalorie={dailyMealData?.unitCalorie || 0}
      todayCalorie={dailyMealData?.totalCalorie || 0}
      goalCalorie={dailyMealData?.goalCalorie || 0}
    />
  )
}
