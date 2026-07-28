
// 💡 성별/나이에 따른 권장 칼로리 계산 함수
export function calculateDefaultGoalCalorie(gender?: string | null, birthDate?: Date | null): number {
  // 기본값 (성별/나이 둘 다 없는 경우)
  if (!gender) return 2000;

  // 만 나이 계산 (birthDate가 있을 경우)
  let age = 30; // 나이가 없을 때 기본 연령대
  if (birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    age = today.getFullYear() - birth.getFullYear();
  }

  // 여성인 경우
  if (gender.toUpperCase() === 'F') {
    return 1900;
  }

  // 남성인 경우
  if (gender.toUpperCase() === 'M') {
    return 2500;
  }

  return 2000; // 기타 예외 상황
}
