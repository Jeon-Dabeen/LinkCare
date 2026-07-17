import { ReactNode } from "react";

import styles from "@/styles/components/statePage.module.css";
import clsx from "clsx";
import { Loader } from "lucide-react";


type StatePageProps = {
  open: boolean;
  title?: ReactNode;
  description?: ReactNode;
}

export default function StatePage({
  open,
  title,
  description
}: StatePageProps){
  

  return (
    <aside className={clsx(
      styles.statePage,
      open && styles.open
    )}>
      <div className={styles.icon}>
        <Loader size={32} className={styles.loading} />
      </div>
      {title && <p className={styles.title}>{title}</p>}
      {description && <div className={styles.description}>{description}</div>}
    </aside>
  )
}


