export type CalorieStatus = "LOW" | "NEAR" | "SUCCESS" | "OVER" | "OVER_HIGH";

// 문구 목록 (추천 문구 추가 및 중복 제거)
const messageList: Record<CalorieStatus, string[]> = {
  // 0% ~ 89%
  LOW: [
    "목표를 향해 차근차근 잘 가고 있어요!",
    "오늘도 건강한 하루를 만들어가는 중이에요.",
    "목표 칼로리를 향해 영차영차 달려봐요!",
    "좋은 습관이 쌓여 멋진 변화를 만들 거예요.",
    "오늘 식사도 기분 좋게 기록해 볼까요?",
    "천천히, 그러나 꾸준하게 채워가요!",
  ],
  // 90% ~ 99%
  NEAR: [
    "목표 칼로리까지 얼마 남지 않았어요!",
    "조금만 더 힘내서 목표를 달성해봐요!",
    "오늘의 완성이 바로 눈앞에 있어요, 파이팅!",
    "훌륭해요! 딱 기분 좋은 만큼 채워가고 있네요.",
    "오늘 하루도 멋지게 마무리해 볼까요?",
    "거의 다 왔어요! 알차게 채워가는 중!",
  ],
  // 100% ~ 109%
  SUCCESS: [
    "축하해요! 오늘 목표 칼로리를 달성했어요!",
    "완벽한 하루예요! 나 자신을 칭찬해 주세요!",
    "오늘 필요한 영양을 깔끔하게 완성했어요!",
    "목표 달성 완료! 오늘도 해냈군요!",
    "딱 맞게 채워진 완벽한 식단이에요!",
  ],
  // 110% ~ 149%
  OVER: [
    "오늘 하루 든든하게 잘 챙겨 먹었어요!",
    "충분한 에너지 충전 완료! 에너지가 넘치는 하루예요",
    "조금 넘어도 괜찮아요, 맛있고 행복했다면 성공!",
    "오늘 잘 먹은 에너지는 내일의 활력이 될 거예요!",
    "기분 좋게 먹고 활기차게 움직여봐요!",
  ],
  // 150% 이상
  OVER_HIGH: [
    "오늘은 맛있는 걸로 에너지를 듬뿍 채운 날!",
    "가끔은 든든하게 먹어도 괜찮아요, 내일 다시 조절하면 되죠",
    "잘 먹은 만큼 오늘 하루를 활기차게 보내보아요!",
    "행복한 식사였다면 그걸로 충분해요! 내일도 파이팅!",
    "충전 완료! 맛있는 음식으로 힐링한 하루예요.",
  ],
};

export function getCalorieMessage(totalCalorie: number, goalCalorie: number): string {
  // 0으로 나누기 예외 처리
  if (!goalCalorie || goalCalorie <= 0) {
    return "오늘의 식단을 기록해 보세요!";
  }

  // 소수점 유연 처리를 위해 반올림 계산
  const progress = Math.round((totalCalorie / goalCalorie) * 100);

  // 상태 계산
  let status: CalorieStatus = "LOW";
  if (progress < 90) status = "LOW";
  else if (progress < 100) status = "NEAR";
  else if (progress < 110) status = "SUCCESS";
  else if (progress < 150) status = "OVER";
  else status = "OVER_HIGH";

  // 상태에 따른 문구 배열 가져오기
  const messages = messageList[status];

  // 안전한 랜덤 선택 (항상 string을 반환하도록 처리)
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex] || "오늘의 식단을 기록해 보세요!";
}