"use client";

import { useState } from "react";
import { Dayjs } from "dayjs";
import clsx from "clsx";

import { useBaseDate } from "@/app/_providers/BaseDateProvider";

import { StatusType } from "@/types/statusType";
import { getCalendarDays, isAvailableDate } from "./date";

import WeekHeader from "./Weeks";

import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/styles/components/calendar.module.css";

type MonthCalendarProps = {
  // 현재 선택된 날짜 없으면 오늘 기준
  selectedDate?: Dayjs;
  data?: Record<
    string,
    {
      status: StatusType;
    }
  >;
  onDateClick?: (date: Dayjs) => void;
  onMonthChange?: (month: string) => void;
};

export default function MonthCalendar({
  selectedDate,
  data = {},
  onDateClick,
  onMonthChange,
}: MonthCalendarProps) {
  const { baseDate } = useBaseDate();

  // 달력 최초 표시 기준
  // 선택 날짜가 있으면 선택 날짜, 없으면 오늘
  const initialMonth = selectedDate ?? baseDate;

  const [currentMonth, setCurrentMonth] = useState<Dayjs>(initialMonth);

  // 이동 가능한 월 범위
  const minMonth = baseDate.subtract(3, "month").startOf("month");
  const maxMonth = baseDate.startOf("month");

  const isFirstMonth = currentMonth.isSame(minMonth, "month");
  const isLastMonth = currentMonth.isSame(maxMonth, "month");

  const moveMonth = (amount: number) => {
    const nextMonth = currentMonth.add(amount, "month");

    if (
      nextMonth.isBefore(minMonth, "month") ||
      nextMonth.isAfter(maxMonth, "month")
    ) {
      return;
    }

    setCurrentMonth(nextMonth);
    onMonthChange?.(nextMonth.format("YYYY-MM"));
  };

  const days = getCalendarDays(currentMonth);

  return (
    <div>
      <header className={styles.header}>
        {!isFirstMonth && 
          <button onClick={() => moveMonth(-1)} className={styles.buttonPrev}><ChevronLeft /></button>
        }
        <p className={styles.currentMonth}>{currentMonth.format("YYYY년 MM월")}</p>
        {!isLastMonth && 
          <button onClick={() => moveMonth(1)} className={styles.buttonNext}><ChevronRight /></button>
        }
      </header>

      <WeekHeader />

      <div className={styles.days}>
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className={styles.day} />;
          }

          const key = date.format("YYYY-MM-DD");
          const record = data[key];
          const isOtherMonth = !date.isSame(currentMonth, "month");
          const disabled = isOtherMonth || !isAvailableDate(date, baseDate);

          return (
            <div key={key} className={styles.day}>
              {onDateClick ? (
                <button
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) {
                      return;
                    }

                    onDateClick(date);
                  }}
                  className={clsx(
                    styles.daybutton,
                    disabled && styles.disabled,
                    record?.status && styles[record.status],
                  )}
                >
                  {date.date()}
                </button>
              ): (
                <div
                  className={clsx(
                    styles.daybutton,
                    record?.status && styles[record.status],
                  )}
                >
                  {date.date()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
