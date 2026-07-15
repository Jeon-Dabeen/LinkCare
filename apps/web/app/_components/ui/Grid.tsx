import { ReactNode } from "react";


import styles from '@/styles/layout/grid.module.css';


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



Grid.ItemFull = GridItemFull;

export default Grid;
