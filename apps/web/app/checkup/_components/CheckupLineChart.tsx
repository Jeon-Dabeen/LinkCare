"use client";

import commonStyle from "@/styles/common.module.css";

import Card from "@/app/_components/ui/Card";
import LineChart from "@/app/_components/ui/chart/lineChart";

interface CheckupLineChartData {
  lineChartData: {
    label: string;
    years: number[];
    data: number[];
    unit: string;
  }[];
  related?: boolean;
  max?: number;
  min?: number;
}

export function CheckupLineChart({
  lineChartData,
  related = true,
  max = 200,
  min = 30,
}: CheckupLineChartData) {
  if (related) {
    return (
      <Card>
        <Card.Body>
          <LineChart
            labels={lineChartData[0]!.years.map((y) => y.toString())}
            datasets={lineChartData.map((d) => ({
              label: d.label,
              data: d.data,
              unit: d.unit,
            }))}
            gridCount={4}
            min={min}
            max={max}
          />
          {lineChartData.length > 1 && (
            <div className={commonStyle.infoBox}>
              {lineChartData.map((d) => d.label).join(", ")} 버튼을 클릭하면
              각각의 그래프를 껐다켰다 할 수 있어요!
            </div>
          )}
        </Card.Body>
      </Card>
    );
  } else {
    return lineChartData.map((d) => (
      <Card key={d.label}>
        <Card.Body>
          <LineChart
            labels={[...d.years].map((y) => y.toString())}
            datasets={[
              {
                label: d.label,
                data: d.data,
                unit: d.unit,
              },
            ]}
            gridCount={4}
            min={min}
            max={max}
          />
          {lineChartData.length > 1 && (
            <div className={commonStyle.infoBox}>
              {`${d.label}`} 버튼을 클릭하면 각각의 그래프를 껐다켰다 할 수
              있어요!
            </div>
          )}
        </Card.Body>
      </Card>
    ));
  }
}
