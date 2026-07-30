//혈당 범위 
import type { StatusType } from "@/types/statusType";

export type BloodGlucoseRange = {
  min: number;
  max: number;
};

export type BloodGlucoseThresholds = Partial<
  Record<StatusType, BloodGlucoseRange>
>;

export const BEFORE_BLOOD_GLUCOSE_THRESHOLDS = {
  low: { min: 0, max: 69 },
  normal: { min: 70, max: 99 },
  warning: { min: 100, max: 125 },
  danger: { min: 126, max: 999 },
} satisfies BloodGlucoseThresholds;

export const AFTER_BLOOD_GLUCOSE_THRESHOLDS = {
  low: { min: 0, max: 69 },
  normal: { min: 70, max: 139 },
  warning: { min: 140, max: 199 },
  danger: { min: 200, max: 999 },
} satisfies BloodGlucoseThresholds;
