"use client";

import { Dayjs } from "dayjs";

import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import { isAvailableDate } from "./date";

import WeekHeader from "./Weeks";
import styles from "@/styles/components/calendar.module.css";
import clsx from "clsx";

type WeekCalendarProps = {
  selectedDate: Dayjs;
  onDateClick: (date: Dayjs) => void;
};

export default function WeekCalendar({
  selectedDate,
  onDateClick,
}: WeekCalendarProps) {
  const { baseDate } = useBaseDate();

  const startOfWeek = selectedDate.startOf("week");

  const weekDays = Array.from({ length: 7 }, (_, index) =>
    startOfWeek.add(index, "day"),
  );

  return (
    <div>
      <WeekHeader />

      <div className={styles.days}>
        {weekDays.map((date) => {
          const key = date.format("YYYY-MM-DD");

          const isSelected = date.isSame(selectedDate, "day");

          const disabled = !isAvailableDate(date, baseDate);

          return (
            <div key={key} className={styles.day}>
              <button
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;

                  onDateClick(date);
                }}
                className={clsx(
                  styles.daybutton,
                  isSelected && styles.selected, 
                  disabled && styles.disabled)}
              >
                {date.date()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
