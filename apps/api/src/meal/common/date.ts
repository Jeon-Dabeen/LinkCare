/**
 * 1. 어떤 형태의 날짜든 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
 */
export function formatDateToString(date: Date | string | number): string {
  const d = new Date(date);
  
  // 유효하지 않은 날짜일 경우 예외 처리
  if (isNaN(d.getTime())) {
    throw new Error('유효하지 않은 날짜 형식입니다.');
  }

  // toISOString()은 UTC 기준이므로, 로컬 시간 기준 YYYY-MM-DD를 추출하려면 
  // 연, 월, 일을 따로 뽑아서 조합하는 것이 안전합니다.
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 2. 두 날짜가 같은 날(YYYY-MM-DD 기준)인지 비교하는 함수
 */
export function isSameDate(
  date1: Date | string | number | null | undefined, 
  date2: Date | string | number | null | undefined
): boolean {
  // 둘 중 하나라도 값이 없으면 false
  if (!date1 || !date2) return false;

  try {
    const str1 = formatDateToString(date1);
    const str2 = formatDateToString(date2);
    
    return str1 === str2;
  } catch (error) {
    console.error('날짜 비교 실패:', error);
    return false;
  }
}