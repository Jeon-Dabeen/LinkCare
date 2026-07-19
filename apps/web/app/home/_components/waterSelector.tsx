

import styles from "@/styles/home/waterSelector.module.css";
import clsx from "clsx";

type Props = {
  value: number;
  max?: number;
  onChange: (value: number) => void;
};

export default function WaterSelector({
  value,
  max = 10,
  onChange,
}: Props) {
  return (
    <div className={styles.wrapper}>
      {Array.from({ length: max }, (_, index) => {
        const count = index + 1;
        const selected = count <= value;

        return (
          <button
            key={count}
            type="button"
            className={clsx(
              styles.button,
              selected ? styles.active : styles.inactive
            )}
            onClick={() => onChange(count)}
            aria-label={`${count}잔`}
          >
            <span
              className={selected ? styles.active : styles.inactive}
            />
          </button>
        );
      })}
    </div>
  );
}