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
      status?: StatusType;
      leftStatus?: StatusType | null;
      rightStatus?: StatusType | null;
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
  const minMonth = baseDate.subtract(2, "month").startOf("month");
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
        {!isFirstMonth && (
          <button onClick={() => moveMonth(-1)} className={styles.buttonPrev}>
            <ChevronLeft />
          </button>
        )}
        <p className={styles.currentMonth}>
          {currentMonth.format("YYYY년 MM월")}
        </p>
        {!isLastMonth && (
          <button onClick={() => moveMonth(1)} className={styles.buttonNext}>
            <ChevronRight />
          </button>
        )}
      </header>

      <WeekHeader />

      <div className={styles.days}>
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className={styles.day} />;
          }

          const key = date.format("YYYY-MM-DD");
          const record = data[key];

          //좌, 우 값 반원
          const leftStatus = record?.leftStatus;
          const rightStatus = record?.rightStatus;

          let fullStatus: StatusType | null = null;
          let isSplit = false; //반가름 여부

          if (leftStatus && rightStatus) {
            if (leftStatus === rightStatus) {
              //상태가 같을시
              fullStatus = leftStatus;
            } //정상+이상혈당 = 이상혈당 원
            else if (leftStatus === "normal") {
              fullStatus = rightStatus; //정상이랑 겹칠시
            } else if (rightStatus === "normal") {
              fullStatus = leftStatus;
            } else {
              isSplit = true;
            }
          } else {
            // 식전 또는 식후 하나만 있거나 기존 페이지 status를 사용하는 경우
            fullStatus = leftStatus ?? rightStatus ?? record?.status ?? null;
          }

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
                    fullStatus && styles[fullStatus],
                    isSplit && styles.split,
                  )}
                >
                  {isSplit && leftStatus && rightStatus && (
                    <>
                      <span
                        className={clsx(
                          styles.splitHalf,
                          styles.leftHalf,
                          styles[leftStatus],
                        )}
                      />
                      <span
                        className={clsx(
                          styles.splitHalf,
                          styles.rightHalf,
                          styles[rightStatus],
                        )}
                      />
                    </>
                  )}

                  <span className={styles.dayNumber}>{date.date()}</span>
                </button>
              ) : (
                <div
                  className={clsx(
                    styles.daybutton,
                    fullStatus && styles[fullStatus],
                    isSplit && styles.split,
                  )}
                >
                  {isSplit && leftStatus && rightStatus && (
                    <>
                      <span
                        className={clsx(
                          styles.splitHalf,
                          styles.leftHalf,
                          styles[leftStatus],
                        )}
                      />
                      <span
                        className={clsx(
                          styles.splitHalf,
                          styles.rightHalf,
                          styles[rightStatus],
                        )}
                      />
                    </>
                  )}

                  <span className={styles.dayNumber}>{date.date()}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
