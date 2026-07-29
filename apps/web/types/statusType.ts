export type StatusType = "low" | "normal" | "caution" | "warning" | "danger";

export const commonStatusTypeLabel = {
  low: "",
  normal: "정상",
  caution: "주의",
  warning: "경고",
  danger: "위험",
} as const;

export const bmiStatusTypeLabel = {
  low: "저체중",
  normal: "정상",
  caution: "",
  warning: "과체중",
  danger: "비만",
} as const;

export const bpStatusTypeLabel = {
  low: "저혈압",
  normal: "정상",
  caution: "주의",
  warning: "경고",
  danger: "고혈압",
} as const;

export function getStatusTypeLabel<T extends StatusType>(
  labelMap: Record<T, string>,
  statusType?: T | null | undefined,
) {
  if (!statusType) return "";

  return labelMap[statusType];
}
