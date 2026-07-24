"use client";



import clsx from "clsx";
import styles from "@/styles/components/chartBar.module.css";

import {StatusType} from "@/types/statusType";


type BarChartChart = {
  level?: string;
  position?: number;
}

export default function BarChart({
  level,
  position,
}: BarChartChart){


  return(
    <div className={styles.wrapper}>

      <div className={styles.bar}>
        <div
          className={styles.value}
          style={{
            width: `${position}%`,
            background: `linear-gradient(
              to right,
              var(--color-${level}-light),
              var(--color-${level})
            )`,
          }}
        />
      </div>
    </div>
  )
}




