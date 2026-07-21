'use client';


import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";

import styles from "@/styles/meal/viewCalendar.module.css";

import MonthCalendar from "@/app/_components/ui/calendar/MonthCalendar";
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
      <MonthCalendar 
        selectedDate={selectedDate}
        onDateClick={handleDateClick} 
      />

      {/* <MonthCalendar 
        data={{
          "2026-07-01": {
            status: "low",
          },
          "2026-07-02": {
            status: "normal",
          },
          "2026-07-05": {
            status: "caution",
          },
          "2026-07-10": {
            status: "warning",
          },
          "2026-07-12": {
            status: "danger",
          }
        }} 
        onDateClick={handleDateClick} 
      /> */}
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


