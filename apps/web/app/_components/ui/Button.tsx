'use client';

import styles from "@/styles/components/button.module.css";


import { X } from "lucide-react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "text-primary" | "text-secondary" | "text-tertiary";
  size?: "small" | "medium" | "large";
  full?: boolean,
  round?: boolean
};


// default
export default function Button({
  children,
  className,
  variant = "primary",
  size = "medium",
  full,
  round,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        full && styles.full,
        round && styles.round,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}


// 우측상단 닫기 버튼
export function ButtonClose({
  ...props
}){
  return (
    <button
      className={`
        ${styles.buttonClose}
      `}
      {...props}
    >
      <span className={styles.buttonCloseIcon}>
        <X />
      </span>
    </button>
  )
}



