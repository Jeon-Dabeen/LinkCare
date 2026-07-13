'use client';

import { ReactNode, useState } from "react";
import styles from "@/styles/components/bottomSheet.module.css";

import Button, {ButtonClose} from "@/app/_components/ui/Button";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
}: BottomSheetProps) {

  return (
    <>
      <div className={`${styles.bottomSheetOverlay} ${open ? styles.open : ""}`} />
      <div className={`${styles.bottomSheetWrapper} ${open ? styles.open : ""}`}>
        <div className={styles.bottomSheetHeader}>
          <p className={styles.bottomSheetTitle}>{title}</p>
          <ButtonClose onClick={onClose} />
        </div>
        <div className={styles.bottomSheetContent}>
        {children}
        </div>
      </div>
    </>
  );
}


