'use client';

import { ReactNode } from "react";

import clsx from "clsx";
import styles from "@/styles/components/modal.module.css";

import {ButtonClose} from "@/app/_components/ui/Button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
}: ModalProps){

  return (
    <>
      <div 
        className={clsx(
          styles.modalOverlay,
          open && styles.open)}  
         onClick={onClose}
      />
      <aside className={clsx(
        styles.contentWrapper,
        open && styles.open
      )}>
        <div className={styles.header}>
          <p className={styles.title}>{title}</p>
          <ButtonClose onClick={onClose} />
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </aside>
    </>
  )
}
