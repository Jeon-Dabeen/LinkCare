
export type GenderType = "M" | "F" | null;

export const genderTypeLabel = {
  F: "여성",
  M: "남성",
  null: "선택안함"
} as const;

export function getGenderTypeLabel(gender?: GenderType | string | null) {
  return genderTypeLabel[gender as keyof typeof genderTypeLabel] || "";
}
