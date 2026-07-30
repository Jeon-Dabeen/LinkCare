import type { MealType } from "./mealType";

export type MealTiming = "BEFORE" | "AFTER";

//혈당 등록 요청
export interface CreateBloodGlucoseRequest {
  glucose: number;
  mealType: MealType;
  mealTiming: MealTiming;
  bgDate: string;
}

// 혈당 등록 API 응답
export interface CreateBloodGlucoseResponse {
  id: number;
  userId: number;
  glucose: number;
  mealType: MealType;
  mealTiming: MealTiming;
  bgDate: string;
  createdAt: string;
}

// 주간 및 최근 3개월 조회 응답의 한 날짜 데이터
export interface BloodGlucoseRecord {
  bgDate: string;
  before: number | null;
  after: number | null;
}

// 식전·식후 화면 표시용 한글
const mealTimingLabel: Record<MealTiming, string> = {
  BEFORE: "식전",
  AFTER: "식후",
};

export function getMealTimingLabel(mealTiming: MealTiming): string {
  return mealTimingLabel[mealTiming];
}
