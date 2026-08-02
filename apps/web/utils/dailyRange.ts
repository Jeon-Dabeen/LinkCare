import type { StatusType } from "@/types/statusType";


//혈압·혈당 수치 범위
export type HealthRange = {
  min: number;
  max: number;
};

//상태별 수치 범위
export type HealthThresholds = Partial<
  Record<StatusType, HealthRange>
>;

//sys 수축기 기준
export const SYSTOLIC_BLOOD_PRESSURE_THRESHOLDS = {
  low: { min: 0, max: 89 },
  normal: { min: 90, max: 119 },
  caution: { min: 120, max: 129 },
  warning: { min: 130, max: 139 },
  danger: { min: 140, max: 999 },
} satisfies HealthThresholds;

//dia 이완기 기준
export const DIASTOLIC_BLOOD_PRESSURE_THRESHOLDS = {
  low: { min: 0, max: 59 },
  normal: { min: 60, max: 79 },
  warning: { min: 80, max: 89 },
  danger: { min: 90, max: 999 },
} satisfies HealthThresholds;

//혈압 혈당 상태 판정
export function getStatusByThreshold(
  value: number | null | undefined,
  thresholds: HealthThresholds,
): StatusType | undefined {
  if (value == null || !Number.isFinite(value)) {
    return undefined;
  }

  const entries = Object.entries(thresholds) as [
    StatusType,
    HealthRange,
  ][];

  return entries.find(
    ([, range]) =>
      value >= range.min &&
      value <= range.max,
  )?.[0];
}


//BMI 상태가 변경되는 기준값
export const BMI_THRESHOLDS = {
  normalMin: 18.5,
  warningMin: 25,
  dangerMin: 30,
} as const;


//BMI 상태 판정 함수
//소숫점이 나오기에 부등호 사용
export function getBmiStatus(
  bmi: number | null | undefined,
): StatusType | undefined {
  if (
    bmi == null ||
    !Number.isFinite(bmi) ||
    bmi < 0
  ) {
    return undefined;
  }

  if (bmi < BMI_THRESHOLDS.normalMin) {
    return "low";
  }

  if (bmi < BMI_THRESHOLDS.warningMin) {
    return "normal";
  }

  if (bmi < BMI_THRESHOLDS.dangerMin) {
    return "warning";
  }

  return "danger";
}
