

import styles from "@/styles/components/calendar.module.css";



export default function Weeks() {
  return (
    <div className={styles.weeks}>
      {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
        <span key={day} className={styles.weekDay}>{day}</span>
      ))}
    </div>
  );
}
