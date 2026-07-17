'use client';

import { ReactNode } from "react";

import clsx from "clsx";
import styles from "@/styles/components/bottomSheet.module.css";

import {ButtonClose} from "@/app/_components/ui/Button";

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
      <div 
        className={clsx(
          styles.bottomSheetOverlay,
          open && styles.open)}  
         onClick={onClose}
      />
      <div className={clsx(
        styles.bottomSheetWrapper,
        open && styles.open)}>
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


