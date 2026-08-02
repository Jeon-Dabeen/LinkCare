"use client";

import type { Dayjs } from "dayjs";
import LineChart from "@/app/_components/ui/chart/lineChart";
import type { BloodPressureRecord } from "@/types/bloodPressureType";

interface BloodPressureWeekChartProps {
  baseDate: Dayjs;
  records: BloodPressureRecord[];
}

export default function BloodPressureWeekChart({
  baseDate,
  records,
}: BloodPressureWeekChartProps) {
  // x축 날짜
  const labels: string[] = [];

  // 최고혈압 SYS
  const systolicValues: (number | null)[] = [];

  // 최저혈압 DIA
  const diastolicValues: (number | null)[] = [];

  // 오늘 기준 최근 7일 기록
  for (let index = 6; index >= 0; index -= 1) {
    const date = baseDate.subtract(index, "day");

    // 서버 데이터와 비교할 날짜 형식
    const dateString = date.format("YYYY-MM-DD");

    // 화면에 표시할 M/D
    labels.push(date.format("M/D"));

    // 해당 날짜 혈압 기록 찾기
    const record = records.find(
      (item) => item.bpDate.slice(0, 10) === dateString,
    );

    if (record) {
      // 기록이 있으면 SYS, DIA 저장
      systolicValues.push(record.systolic);
      diastolicValues.push(record.diastolic);
    } else {
      // 기록이 없는 날도 x축에 표시
      systolicValues.push(null);
      diastolicValues.push(null);
    }
  }

  return (
    <LineChart
      labels={labels}
      datasets={[
        {
          label: "SYS",
          data: systolicValues,
          unit: "mmHg",
        },
        {
          label: "DIA",
          data: diastolicValues,
          unit: "mmHg",
        },
      ]}
      yAxisGrace="10%"
      gridCount={5}
      showYAxisTicks={false}
    />
  );
}