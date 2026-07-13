'use client';

import styles from "@/styles/components/button.module.css";


import { X } from "lucide-react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "text-primary" | "text-secondary" | "text-tertiary";
  size?: "small" | "medium" | "large";
};


// default
export default function Button({
  children,
  className,
  variant = "primary",
  size = "medium",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${styles.button}
        ${styles[variant]}
        ${styles[size]}
        ${className ?? ""}
      `}
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



