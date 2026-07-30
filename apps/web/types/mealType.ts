
// MealType
export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";


// 프론트(소문자) -> 백엔드(대문자) 변환
export function toUpperMealType(type: string): MealType {
  return type.toUpperCase() as MealType;
}

// 백엔드(대문자) -> 프론트(소문자) 변환
export function toLowerMealType(type: MealType | string): string {
  return type.toLowerCase();
}

const mealTypeLabel = {
  BREAKFAST: "아침",
  LUNCH: "점심",
  DINNER: "저녁",
} as const;

export function getMealTypeLabel(mealType?: MealType | null) {
  if (!mealType) {
    return "";
  }
  // 대소문자 구분 없이 소문자로 변환하여 매핑 객체에서 조회
  const lowerKey = mealType.toLowerCase() as keyof typeof mealTypeLabel;
  return mealTypeLabel[lowerKey] ?? "";
}


// MealStatus
export type MealStatus = 
| 'PENDING' 
| 'COMPLETED' 
| 'SKIPPED';

