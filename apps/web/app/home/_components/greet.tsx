import styles from "@/styles/home/home.module.css";

export default function Greet() {
  
  return (
    <div className={styles.greetingWrapper}>
        <p className={styles.greeting}>오늘도 반가워요,</p>
        <p className={styles.nickname}>
          <strong>하늘을 나는 코끼리</strong>님!
        </p>
        <div className={styles.aiComment}>
          오늘은 2시간 크로스핏을 하셨는데 식사를 거의 못 하셔서 회복이 부족할 수 있어요.
          운동 뒤에는 단백질과 탄수화물이 함께 있는 가벼운 식사로 몸을 채워보시는 것을 권장해요.
          이전처럼 혈압이 매우 높게 적힌 점이 걱정돼요. 다시 정확히 재보시고, 두통·어지러움·가슴통증이 있으면 병원에 문의해보세요.
        </div>
      </div>
  );
}