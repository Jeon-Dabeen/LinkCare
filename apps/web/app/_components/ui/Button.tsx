'use client';

import { ReactNode, forwardRef, ButtonHTMLAttributes } from "react";
import styles from "@/styles/components/button.module.css";
import { X } from "lucide-react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "text-primary" | "text-secondary" | "text-tertiary";
  size?: "small" | "medium" | "large";
  full?: boolean,
  round?: boolean
};

type ButtonIconColor = "primary" | "secondary" | "textLight";

type ButtonIconProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: ButtonIconColor,
  children: ReactNode;
}


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


// 아이콘 버튼
const colorClass = {
  primary: styles.iconPrimary,
  secondary: styles.iconSecondary,
  textLight: styles.iconTextLight,
} as const;

export function ButtonIcon ({
  color = "textLight",
  children,
  ...props
}: ButtonIconProps){
  return (
    <button
      className={clsx(
        styles.buttonIcon,
        colorClass[color]
      )}
      {...props}
    >
      {children}
    </button>
  )
}



// 
type ButtonQuestionProps = 
  ButtonHTMLAttributes<HTMLButtonElement>;


export const ButtonQuestion = forwardRef<
  HTMLButtonElement,
  ButtonQuestionProps
>(function ButtonQuestion ({
  ...props
}, ref){
  return (
    <button
      className={styles.buttonQuestion}
      ref={ref}
      {...props}
    ></button>
  )
})




