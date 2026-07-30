"use client";

import type { Dayjs } from "dayjs";
import LineChart from "@/app/_components/ui/chart/lineChart";
import type { BloodGlucoseRecord } from "@/types/bloodGlucose";

interface BloodGlucoseWeekChartProps {
  baseDate: Dayjs;
  records: BloodGlucoseRecord[];
}

export default function BloodGlucoseWeekChart({baseDate,records,}: BloodGlucoseWeekChartProps) {
  //x축
  const labels: string[] = [];

  //식전
  const beforeValues: (number | null)[] = [];

  //식후
  const afterValues: (number | null)[] = [];

  //오늘기준 7일기록
  for (let index = 6; index >= 0; index -= 1) {
    const date = baseDate.subtract(index, "day");

    // 서버 데이터와 비교할 날짜 형식
    const dateString = date.format("YYYY-MM-DD");

    // 화면에 표시할 M/D
    labels.push(date.format("M/D"));

    //해당 날짜 혈당 기록 찾기
    const record = records.find(
      (item) => item.bgDate.slice(0, 10) === dateString,
    );

    if (record) {
      //기록이 있다면 저장
      beforeValues.push(record.before);
      afterValues.push(record.after);
    } else {
      //기록이 없는 날도 x축에 표시
      beforeValues.push(null);
      afterValues.push(null);
    }
  }

  return (
    <LineChart
      labels={labels}
      datasets={[
        {
          label: "식전 혈당",
          data: beforeValues,
          unit: "mg/dL",
        },
        {
          label: "식후 혈당",
          data: afterValues,
          unit: "mg/dL",
        },
      ]}
      yAxisGrace="10%"
      gridCount={5}
      showYAxisTicks={false}
    />
  );
}
