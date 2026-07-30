'use client';

import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";

import styles from "@/styles/meal/viewCalendar.module.css";

import MonthCalendarOnly from "@/app/_components/ui/calendar/MonthCalendarOnly";
import WeekCalendar from "@/app/_components/ui/calendar/WeekCalendar";
import { ButtonClose } from "@/app/_components/ui/Button";
import clsx from "clsx";

type ViewCalendarProps = {
  open: boolean;
  selectedDate?: Dayjs;
  onClose: () => void;
}

export function ViewCalendar({
  open,
  selectedDate,
  onClose,
}: ViewCalendarProps){

  const router = useRouter();

  const handleDateClick = (date: Dayjs) => {
    onClose();
    router.push(
      `/meal?date=${date.format("YYYY-MM-DD")}`
    );
  };

  return (
    <div className={clsx(
      styles.wrapper,
      open && styles.open
    )}
    >
      <div className={styles.header}>
        <ButtonClose onClick={onClose} />
      </div>
      <MonthCalendarOnly 
        selectedDate={selectedDate}
        onDateClick={handleDateClick} 
      />
    </div>
  )
}

type WeekCalendarProps = {
  selectedDate: Dayjs;
};

export function ViewWeek({
  selectedDate,
}: WeekCalendarProps){

  const router = useRouter();

  const handleDateClick = (date: Dayjs) => {
    router.push(
      `/meal?date=${date.format("YYYY-MM-DD")}`
    );
  };

  return (
    <div>
      <WeekCalendar
        selectedDate={selectedDate}
        onDateClick={handleDateClick}
      />
    </div>
  )
}
