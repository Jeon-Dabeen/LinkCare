'use client';

import {
  createContext,
  InputHTMLAttributes,
  ReactNode,
  useContext,
} from "react";

import clsx from "clsx";
import styles from "@/styles/components/formRadio.module.css";
import { Check } from "lucide-react";


type RadioGroupProps = {
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
};


type RadioItemProps =
  Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    text: string;
  };


type RadioContextProps = {
  value?: string;
  onChange: (value: string) => void;
};


const RadioContext =
  createContext<RadioContextProps | null>(null);



export function useRadioGroup() {
  const context = useContext(RadioContext);

  if (!context) {
    throw new Error(
      "RadioItem must be used inside RadioGroup"
    );
  }

  return context;
}



function RadioGroup({
  value,
  onChange,
  children,
}: RadioGroupProps) {

  return (
    <RadioContext.Provider
      value={{
        value,
        onChange: onChange ?? (() => {}),
      }}
    >
      <div className={styles.group}>
        {children}
      </div>
    </RadioContext.Provider>
  );
}



function RadioItem({
  text,
  value,
  id,
  className,
  ...props
}: RadioItemProps) {

  const {
    value: selectedValue,
    onChange,
  } = useRadioGroup();


  const checked =
    String(selectedValue) === String(value);


  return (
    <>
      <input
        id={id}
        type="radio"
        value={value}
        checked={checked}
        onChange={() => onChange(String(value))}
        className={styles.radioInput}
        {...props}
      />

      <label
        htmlFor={id}
        className={clsx(
          styles.radioButton,
          checked && styles.active,
          className
        )}
      >
        {checked && <Check />}
        {text}
      </label>
    </>
  );
}



const Radio = Object.assign(
  RadioGroup,
  {
    Item: RadioItem,
  }
);


export default Radio;