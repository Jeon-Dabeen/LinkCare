// MealType
export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";

const mealTypeLabel = {
  BREAKFAST: "아침",
  LUNCH: "점심",
  DINNER: "저녁",
} as const;

export function getMealTypeLabel(mealType?: MealType | string | null) {
  if (!mealType) {
    return "";
  }
  // 대소문자 구분 없이 대문자로 변환하여 매핑 객체에서 조회
  const lowerKey = mealType.toUpperCase() as keyof typeof mealTypeLabel;
  return mealTypeLabel[lowerKey] ?? "";
}

// MealStatus
export type MealStatus = "PENDING" | "COMPLETED" | "SKIPPED";
