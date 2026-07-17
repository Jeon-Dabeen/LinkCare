
import { InputHTMLAttributes, ReactNode } from "react";

import styles from "@/styles/components/formInput.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  unit?: ReactNode;
};


export default function Input ({
  unit,
  ...props
}: InputProps){

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        {...props} 
      />
      {unit && 
        <div className={styles.unit}>{unit}</div>
      }
    </div>
  )
}
