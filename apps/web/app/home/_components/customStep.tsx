import { ReactNode } from "react";


import styles from "@/styles/home/customStep.module.css";


type CustomStepProps = {
  question?: string;
  children: ReactNode;
}

type CustomStepItemProps = {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function CustomStep({
  question,
  children,

}: CustomStepProps){

  return (
    <div className={styles.wrapper}>
      {question && <p className={styles.question}>{question}</p>}
      {children}
    </div>
  )
}

export function CustomStepItem({
  title,
  icon,
  children,

}: CustomStepItemProps){

  return (
    <div className={styles.items}>
      {title && <div className={styles.titleWrap}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.title}>{title}</span>
      </div>}
      {children}
    </div>
  )
}



CustomStep.Item = CustomStepItem;

export default CustomStep;

