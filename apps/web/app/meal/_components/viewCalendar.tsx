"use client";

import { useRouter } from "next/navigation";
import { Dayjs } from "dayjs";

import commonStyle from "@/styles/common.module.css";
import styles from "@/styles/meal/viewCalendar.module.css";

import MealMonthCalendar from "@/app/meal/_components/mealMonthCalendar";
import WeekCalendar from "@/app/_components/ui/calendar/WeekCalendar";
import { ButtonClose } from "@/app/_components/ui/Button";
import clsx from "clsx";

type ViewCalendarProps = {
  open: boolean;
  selectedDate?: Dayjs;
  onClose: () => void;
};

export function ViewCalendar({
  open,
  selectedDate,
  onClose,
}: ViewCalendarProps) {
  const router = useRouter();

  const handleDateClick = (date: Dayjs) => {
    onClose();
    router.push(`/meal?date=${date.format("YYYY-MM-DD")}`);
  };

  return (
    <div className={clsx(styles.wrapper, open && styles.open)}>
      <div className={styles.header}>
        <ButtonClose onClick={onClose} />
      </div>
      <div className={styles.monthlyWrapper}>
        <MealMonthCalendar
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
        />
      </div>
      <div className={styles.infoBox}>
        <div className={commonStyle.infoBox}>
          <p className={commonStyle.textInfo}>오늘 기준으로 최대 3개월 이전의 기록만 조회할 수 있어요</p>
        </div>
      </div>
    </div>
  );
}

type WeekCalendarProps = {
  selectedDate: Dayjs;
};

export function ViewWeek({ selectedDate }: WeekCalendarProps) {
  const router = useRouter();

  const handleDateClick = (date: Dayjs) => {
    router.push(`/meal?date=${date.format("YYYY-MM-DD")}`);
  };

  return (
    <div>
      <WeekCalendar selectedDate={selectedDate} onDateClick={handleDateClick} />
    </div>
  );
}
