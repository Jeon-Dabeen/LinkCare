

import styles from "@/styles/home/stepIconSelector.module.css";
import { ReactNode } from "react";


type StepSelectorProps = {
  name: string;
  id: string;
  checked: boolean;
  onChange: () => void;
  value: string;
  icon: ReactNode;
  label: string;
}


export default function StepIconSelector({
  name,
  id,
  checked,
  onChange,
  value,
  icon,
  label,
  ...props
}: StepSelectorProps){

  return (
    <label className={styles.wrapper}>
      <input 
        type="radio"
        id={id} 
        name={name} 
        value={value} 
        checked={checked}className={styles.input}
        onChange={onChange}
        {...props}
      />
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </label>
  )
}

