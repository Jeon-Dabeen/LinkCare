
import { InputHTMLAttributes } from "react";

import clsx from "clsx";
import styles from "@/styles/components/formCheck.module.css";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label?: string;
};


export default function CheckBox ({
  id,
  label,
  ...props
}: CheckboxProps){

  return (
    <div className={styles.wrapper}>
      <input
        id={id}
        className={styles.checkbox}
        {...props} 
      />
      {label && (
        <label htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  )
}
