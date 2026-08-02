import dayjs from "dayjs";

export function formatNumber(value?: number | null) {
  return value == null ? "-" : value.toLocaleString();
}

export const formatDate = (
  date: string | Date | null | undefined,
  format: string = "YYYY-MM-DD",
): string => {
  if (!date) return "";

  const parsedDate = dayjs(date);

  // 유효하지 않은 날짜인 경우 빈 문자열 반환
  if (!parsedDate.isValid()) return "";

  return parsedDate.format(format);
};
