"use client";

import { Dayjs } from "dayjs";
import LineChart from "@/app/_components/ui/chart/lineChart";

interface WeekWeightRecord {
  weightDate: string;
  weight: number;
}

interface WeightWeekChartProps {
  baseDate: Dayjs;
  weights: WeekWeightRecord[];
}


export default function WeightWeekChart({
  baseDate,
  weights,
}: WeightWeekChartProps) {
  const labels: string[] = [];
  const weightValues: (number | null)[] = [];

  for (let index = 6; index >= 0; index -= 1) {
    const date = baseDate.subtract(index, "day");

    const dateString = date.format("YYYY-MM-DD");

    labels.push(date.format("M/D"));

    //해당 날짜의 체중 찾기
    const record = weights.find(
      (weight) => weight.weightDate.slice(0, 10) === dateString,
    );

    if (record) {
      weightValues.push(record.weight);
    } else {
      // 기록이 없는 날짜도 X축에는 남겨두고 데이터만 비운다.
      weightValues.push(null);
    }
  }

  return (
    <LineChart
      labels={labels}
      datasets={[
        {
          label: "체중",
          data: weightValues,
          unit: "kg",
        },
      ]}
      yAxisGrace="10%"
      gridCount={5}
      showYAxisTicks={false}
    />
  );
}
