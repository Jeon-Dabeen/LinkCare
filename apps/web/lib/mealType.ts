
export type MealType = "breakfast" | "lunch" | "dinner";

const mealTypeLabel = {
  breakfast: "아침",
  lunch: "점심",
  dinner: "저녁",
} as const;

export function getMealTypeLabel(mealType?: MealType | null) {
  if (!mealType) {
    return "";
  }

  return mealTypeLabel[mealType];

}