import type { StatusType } from "@/types/statusType";


//혈압, 혈당용 최소 최대
export type HealthRange = {
  min: number;
  max: number;
};

export type HealthThresholds = Partial<
  Record<StatusType, HealthRange>
>;


//상태별 위험도
const STATUS_PRIORITY: Record<StatusType, number> = {
  normal: 0,
  low: 1,
  caution: 2,
  warning: 3,
  danger: 4,
};

//혈압 혈당 상태 판정
export function getStatusByThreshold(
value: number | null | undefined, thresholds: HealthThresholds,
): StatusType | undefined {
  if (
    value == null|| 
    !Number.isFinite(value)||
    value<0
    ) {
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
//혈당

export const BEFORE_BLOOD_GLUCOSE_THRESHOLDS = {
  low: { min: 0, max: 69 },
  normal: { min: 70, max: 99 },
  warning: { min: 100, max: 125 },
  danger: { min: 126, max: 999 },
} satisfies HealthThresholds;

export const AFTER_BLOOD_GLUCOSE_THRESHOLDS = {
  low: { min: 0, max: 69 },
  normal: { min: 70, max: 139 },
  warning: { min: 140, max: 199 },
  danger: { min: 200, max: 999 },
} satisfies HealthThresholds;

//혈압 

//혈압- sys
export const SYSTOLIC_BLOOD_PRESSURE_THRESHOLDS = {
  low: { min: 0, max: 89 },
  normal: { min: 90, max: 119 },
  caution: { min: 120, max: 129 },
  warning: { min: 130, max: 139 },
  danger: { min: 140, max: 999 },
} satisfies HealthThresholds;

//혈압- dia
export const DIASTOLIC_BLOOD_PRESSURE_THRESHOLDS = {
  low: { min: 0, max: 59 },
  normal: { min: 60, max: 79 },
  warning: { min: 80, max: 89 },
  danger: { min: 90, max: 999 },
} satisfies HealthThresholds;

//혈압- 위험도 비교
export function getBloodPressureStatus(
  systolic: number | null | undefined,
  diastolic: number | null | undefined,
): StatusType | undefined {
  const systolicStatus = getStatusByThreshold(
    systolic,
    SYSTOLIC_BLOOD_PRESSURE_THRESHOLDS,
  );

  const diastolicStatus = getStatusByThreshold(
    diastolic,
    DIASTOLIC_BLOOD_PRESSURE_THRESHOLDS,
  );

  // 둘 중 하나라도 정상적인 수치가 아니면 상태를 판정하지 않음
  if (!systolicStatus || !diastolicStatus) {
    return undefined;
  }

  return STATUS_PRIORITY[systolicStatus] >=
    STATUS_PRIORITY[diastolicStatus]
    ? systolicStatus
    : diastolicStatus;
}

//bmi

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
