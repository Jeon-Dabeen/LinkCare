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
  noPadding?: boolean;
}

type CardBodyProps = {
  children: ReactNode;
}

type CardGridProps = {
  columns?: 2 | 3;
  topDivider?: boolean;
  leftDivider?: boolean;
  children: ReactNode;
}

type CardItemProps = {
  icon?: ReactNode,
  title?: ReactNode,
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
  right,
  noPadding
}:CardHeaderProps){

  return (
    <div className={clsx(
      styles.cardHeader,
      noPadding && styles.noPadding
    )}
    >
      <div className={styles.left}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {title && <h3 className={styles.title}>{title}</h3>}
        {left && left}
      </div>
      {right && <div className={styles.right}>{right}</div>}
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



export function CardGrid({
  columns = 2,
  topDivider,
  leftDivider,
  children
}:CardGridProps){

  return (
    <div 
      className={clsx(
        styles.cardGrid,
        topDivider && styles.lineTop,
        leftDivider && styles.lineLeft,
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  )
}


export function CardItem({
  icon,
  title,
  children
}:CardItemProps

){
  return (
    <div className={styles.cardItem}>
      <div className={styles.cardItemHeader}>
        {icon && <span className={styles.itemIcon}>{icon}</span>}
        {title && <h3 className={styles.itemTitle}>{title}</h3>}
      </div>
      {children}
    </div>
  )
}


Card.Header = CardHeader;
Card.Body = CardBody;
Card.Grid = CardGrid;
Card.Item = CardItem;

export default Card;
