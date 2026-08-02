import type { StatusType } from "@/types/statusType";

export type BloodPressureRange = {
    min :number;
    max:number;
};

//모양 정의
export type BloodPressureThresholds = Partial<Record<StatusType, BloodPressureRange>>

//sys 수축기
export const SYSTOLIC_BLOOD_PRESSURE_THRESHOLDS = {
  low: { min: 0, max: 89 },
  normal: { min: 90, max: 119 },
  caution: { min: 120, max: 129 },
  warning: { min: 130, max: 139 },
  danger: { min: 140, max: 999 },
} satisfies BloodPressureThresholds;

//dia 이완기
export const DIASTOLIC_BLOOD_PRESSURE_THRESHOLDS = {
  low: { min: 0, max: 59 },
  normal: { min: 60, max: 79 },
  warning: { min: 80, max: 89 },
  danger: { min: 90, max: 999 },
} satisfies BloodPressureThresholds;