import { ReactNode } from "react";

import clsx from "clsx";
import commonStyle from "@/styles/common.module.css";
import styles from "@/styles/components/emptyPage.module.css";


type EmptyPageProps = {
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

export default function EmptyPage({
  icon,
  title,
  description,
  children,
}: EmptyPageProps){
  

  return (
    <section className={commonStyle.mainContent}>
      <aside className={clsx(
        styles.emptyPage,
      )}>
        {icon && 
          <div className={styles.icon}>
            {icon}
          </div>
        }
        {title && <p className={styles.title}>{title}</p>}
        {description && <div className={styles.description}>{description}</div>}
        {children && children}
      </aside>
    </section>
  )
}


