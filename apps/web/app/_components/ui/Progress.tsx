import { ReactNode } from "react";

import clsx from "clsx";
import styles from "@/styles/components/progress.module.css";


type ProgressProps = {
  value : number;
  max : number;
  isInfo?: Boolean;
  unit?: ReactNode;
}



export default function Progress ({
  value = 0,
  max = 100,
  isInfo = false,
  unit
}: ProgressProps){

const percent = (value / max) * 100;

const greenPercent = Math.min(percent, 100);
const overPercent = Math.max(percent - 100, 0);

  return (
    <div className={styles.wrapper}>
      {isInfo && 
        <div className={styles.info}>
          <span className={styles.value}>{value.toLocaleString('ko-kr')}</span>
          <span className={styles.separete}>/</span>
          <span className={styles.max}>{max.toLocaleString('ko-kr')}{unit}</span>
        </div>
      }<div className={styles.progress}>
        <div
          className={styles.green}
          style={{ width: `${greenPercent}%` }}
        />
        <div
          className={styles.red}
          style={{ width: `${overPercent}%` }}
        />
      </div>
    </div>
  )
}

