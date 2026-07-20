

import styles from "@/styles/home/stepSelector.module.css";
import { ReactNode } from "react";


type StepSelectorProps = {
  type?: "checkbox" | "radio";
  name: string;
  id: string;
  checked: boolean;
  onChange: () => void;
  value: string;
  label: string;
}


export default function StepSelector({
  type = "checkbox",
  name,
  id,
  checked,
  onChange,
  value,
  label,
  ...props
}: StepSelectorProps){

  return (
    <label className={styles.wrapper}>
      <input 
        type={type} 
        id={id} 
        name={name} 
        value={value} 
        checked={checked}className={styles.input}
        onChange={onChange}
        {...props}
      />
      <span className={styles.label}>{label}</span>
    </label>
  )
}

