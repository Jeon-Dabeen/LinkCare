import { clsx } from "clsx";
import styles from "@/styles/components/calendarLegend.module.css";
import { StatusType } from "@/types/statusType";

type CalendarLegendProps = {
  labelMap: Record<StatusType, string>;
};

export default function CalendarLegend({ labelMap }: CalendarLegendProps) {
  return (
    <ul className={styles.legend}>
      {Object.entries(labelMap).map(([key, label]) => {
        if (!label) return null;
        return (
          <li
            key={key}
            className={clsx(styles.legendItem, styles[key as StatusType])}
          >
            {label}
          </li>
        );
      })}
    </ul>
  );
}
