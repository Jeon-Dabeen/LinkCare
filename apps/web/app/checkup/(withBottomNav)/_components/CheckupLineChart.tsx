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
}

export function CheckupLineChart({ lineChartData }: CheckupLineChartData) {
  return lineChartData.reverse().map((d) => (
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
          min={30}
          max={200}
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
