import { ReactNode } from "react";

import clsx from "clsx";
import styles from '@/styles/components/card.module.css';


type CardProps = {
  children: ReactNode;
  variant?: "default" | "color";
}

type CardHeaderProps = {
  icon?: ReactNode;
  title?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}

type CardBodyProps = {
  children: ReactNode;
}


export function Card({
  variant = "default",
  children
}: CardProps){


  return (
    <section className={
      clsx(
        styles.cardWrapper,
        styles[variant]
      )
    }>
      {children}
    </section>
  )
}


export function CardHeader({
  icon,
  title,
  left,
  right
}:CardHeaderProps){

  return (
    <div className={styles.cardHeader}>
      <div className={styles.left}>
        <span className={styles.icon}>{icon}</span>
        <h3 className={styles.title}>{title}</h3>
        {left}
      </div>
      <div className={styles.right}>{right}</div>
    </div>
  )
}


export function CardBody({
  children
}:CardBodyProps){

  return (
    <div className={styles.cardBody}>
      {children}
    </div>
  )
}



Card.Header = CardHeader;
Card.Body = CardBody;

export default Card;
