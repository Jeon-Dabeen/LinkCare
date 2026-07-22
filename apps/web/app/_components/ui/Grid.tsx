import { ReactNode } from "react";
import styles from '@/styles/layout/grid.module.css';
import Link from "next/link";

type GridProps = {
  children: ReactNode;
}

type GridItemProps = {
  children: ReactNode;
}


export function Grid({
  children
}: GridProps){


  return (
    <section className={styles.gridLayout}>
      {children}
    </section>
  )
}


export function GridItemFull({
  children
}:GridItemProps){

  return (
    <div 
      className={styles.gridItemFull}>
      {children}
    </div>
  )
}


type GridLinkProps = {
  href?: string;
  children: ReactNode;
}

export function GridLink({
  href = "",
  children
}: GridLinkProps){
  return (
    <Link href={href} className={styles.link}>
      {children}
    </Link>
  )
}


Grid.ItemFull = GridItemFull;
Grid.Link = GridLink;

export default Grid;
