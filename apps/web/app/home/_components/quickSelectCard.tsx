'use client';


import { ReactNode } from "react";

import styles from "@/styles/home/quickSelectCard.module.css";


type QuickSelectCardProps = {
  id: string;
  checked: boolean;
  onChange: () => void;
  icon: ReactNode;
  title: string;
  value: string;
  unit?: string;
}

export default function QuickSelectCard({
  id,
  checked,
  onChange,
  icon,
  title,
  value,
  unit,
  ...props
}: QuickSelectCardProps){


  return (
    <label className={styles.card}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        className={styles.input}
        onChange={onChange}
        {...props}
      />
      <span className={styles.icon}>{icon}</span>
      <span className={styles.title}>{title}</span>
      <span className={styles.values}>
        <strong className={styles.value}>{value}</strong>
        {unit && <span className={styles.unit}>{unit}</span>}
      </span>
      <i className={styles.checkedIcon}></i>
    </label>
  )
}

