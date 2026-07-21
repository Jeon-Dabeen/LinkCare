
import dayjs, {Dayjs} from "dayjs";


export const getCalendarDays = (currentMonth: dayjs.Dayjs) => {
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");

  const startDay = startOfMonth.day(); // 일요일 = 0

  const totalDays = endOfMonth.date();

  const days = [];

  // 이전 달 빈 칸
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // 현재 달 날짜
  for (let i = 1; i <= totalDays; i++) {
    days.push(currentMonth.date(i));
  }

  return days;
};


export function isAvailableDate(
  date: Dayjs,
  baseDate: Dayjs
) {
  return (
    !date.isBefore(
      baseDate.subtract(3, "month"),
      "day"
    )
    &&
    !date.isAfter(
      baseDate,
      "day"
    )
  );
}
