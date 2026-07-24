

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin,
} from "chart.js";
import { Line } from "react-chartjs-2";

import clsx from "clsx";
import styles from "@/styles/components/chartLine.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type LineChartDataset = {
  label: string;
  data: (number | null)[];
  unit?: string;
  yAxisID?: string;
};

type LineChartProps = {
  labels: string[];
  datasets: LineChartDataset[];
  color?: string;
  yAxisGrace?: number | string;
  gridCount?: number;
  min?: number;
  max?: number;
  showYAxisTicks?: boolean;
};


// CSS 변수를 못 가져왔을 때 대비용 기본 색상
const DEFAULT_COLORS = ["#6557d0", "#dd8f0a", "#34b162", "#3172c7"];


export default function LineChart({
  labels,
  datasets,
  yAxisGrace = "10%",
  gridCount = 5,
  min,
  max,
  showYAxisTicks = false,
}: LineChartProps) {

  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const [colors, setColors] = useState<string[]>([]);
  const [chartStyle, setChartStyle] = useState({
    textColor: "#665F57",
    gridColor: "#D9D9D9",
    borderColor: "#B2B2BA",
    fontFamily: "inherit",
  });
  const [hiddenMap, setHiddenMap] = useState<boolean[]>(
    datasets.map(() => false)
  );


  useEffect(() => {
    const style = getComputedStyle(document.documentElement);

    setColors(
      Array.from({ length: 4 }, (_, i) =>
        style.getPropertyValue(`--chart-color-${i + 1}`).trim()
      )
    );

    setChartStyle({
      textColor: style.getPropertyValue("--color-text-primary").trim(),
      gridColor: style.getPropertyValue("--chart-line-color").trim(),
      borderColor: style.getPropertyValue("--chart-line-dark").trim(),
      fontFamily: style.getPropertyValue("--font-family").trim(),
    });
  }, []);

  // 데이터셋에 들어있는 단위(unit) 목록 및 축별 단위 매핑
  const { uniqueUnits, yAxisUnits } = useMemo(() => {
      const units = Array.from(
        new Set(datasets.map((d) => d.unit).filter(Boolean) as string[])
      );

      // 축 ID별 단위 매핑 (예시: { y: "kg", y1: "cm" })
      const axisUnits: { y?: string; y1?: string } = {
        y: units[0] || "",
        y1: units[1] || "",
      };

      return { uniqueUnits: units, yAxisUnits: axisUnits };
    }, [datasets]);

  // 다중 Y축 사용 여부 (단위가 2개 이상일 때)
  const isMultiAxis = uniqueUnits.length > 1;

  // Chart.js Data 생성
  const data = useMemo(
    () => ({
    labels,
    datasets: datasets.map((dataset, index) => {
      const color = colors[index] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

      // 수동 지정된 yAxisID가 없으면 단위에 따라 y 또는 y1로 자동 매핑
      let yAxisID = dataset.yAxisID;
      if (!yAxisID) {
        if (isMultiAxis && dataset.unit) {
          const unitIndex = uniqueUnits.indexOf(dataset.unit);
          yAxisID = unitIndex === 0 ? "y" : "y1";
        } else {
          yAxisID = "y";
        }
      }


      return {
        label: dataset.label,
        data: dataset.data,
        yAxisID, // Y축 식별자 연결
        borderColor: color,
        backgroundColor: color,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        tension: 0.35,
        fill: false,
      };
    }),
  }), [labels, datasets, colors]
  );

  // Chart.js Options 설정
  const options = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          callbacks: {
            label: (context) => {
              const dataset = datasets[context.datasetIndex];

              const label = dataset?.label ?? "";
              const unit = dataset?.unit ?? "";

              return `${label}: ${context.parsed.y}${unit}`;
            },
          },
        },
      },
      scales: {
        x: {
          offset: true,
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: chartStyle.textColor,
            font: {
              family: chartStyle.fontFamily || "Pretendard",
              size: 12,
            },
          },
        },
        // 왼쪽 Y축
        y: {
          type: "linear",
          grace: yAxisGrace,
          display: true,
          position: "left",
          beginAtZero: false,
          ...(min !== undefined && { min: min }),
          ...(max !== undefined && { max: max }),
          // Y축 타이틀 설정 (상단 표기)
          // title: {
          //   display: !!yAxisUnits.y,
          //   text: yAxisUnits.y ? `${yAxisUnits.y}` : "",
          //   align: "end", // 축 최상단 배치
          //   color: chartStyle.textColor,
          //   font: {
          //     family: chartStyle.fontFamily,
          //     size: 11,
          //   },
          // },
          grid: {
            color: (context) => {
              return context.tick.value === 0
                ? chartStyle.borderColor
                : chartStyle.gridColor;
            },
          },   
          bounds: "ticks",
          ticks: {
            display: showYAxisTicks,
            color: chartStyle.textColor,
            font: {
              family: chartStyle.fontFamily || "Pretendard",
              size: 15
            },
            count: gridCount,
            // Y축 눈금 값 뒤에 unit 붙이기
            // callback: (value: string | number) => {
            //   const unit = yAxisUnits.y1;
            //   return unit ? `${value}${unit}` : value;
            // },
          },
          border: {
            display: false,
          },
        },
        // 오른쪽 Y축 (단위가 다를 때만 활성화)
        ...(isMultiAxis
          ? {
              y1: {
                type: "linear" as const,
                grace: yAxisGrace,
                ...(min !== undefined && { min: min }),
                ...(max !== undefined && { max: max }),
                display: true,
                position: "right" as const,
                beginAtZero: false,
                // 오른쪽 Y축 타이틀 설정 (상단 표기)
                // title: {
                //   display: !!yAxisUnits.y1,
                //   text: yAxisUnits.y1 ? `${yAxisUnits.y1}` : "",
                //   align: "end", // 축 최상단 배치
                //   color: chartStyle.textColor,
                //   font: {
                //     // family: chartStyle.fontFamily,
                //     size: 12,
                //   },
                // },
                grid: {
                  drawOnChartArea: false, // 왼쪽 축 그리드와 겹치지 않도록 차트 내부 그리드 숨김
                },
                bounds: "ticks",
                ticks: {
                  display: false,
                  color: chartStyle.textColor,
                  font: {
                    family: chartStyle.fontFamily,
                    size: 15,
                  },
                  count: gridCount,
                  // Y축 눈금 값 뒤에 unit 붙이기
                  // callback: (value: string | number) => {
                  //   const unit = yAxisUnits.y1;
                  //   return unit ? `${value}${unit}` : value;
                  // },
                },
                border: {
                  display: false,
                },
              },
            }
          : {}),
      },
    }),
    [chartStyle, datasets, isMultiAxis, yAxisUnits]
  );

const toggleDataset = (index: number) => {
  const chart = chartRef.current;
  if (!chart) return;

  const nextHidden = !hiddenMap[index];
  chart.setDatasetVisibility(index, !nextHidden);
  chart.update();

  setHiddenMap((prev) => {
    const copy = [...prev];
    copy[index] = nextHidden;
    return copy;
  });
};

  return (
    <div className={styles.wrapper}>
      <div className={styles.legend}>
        {datasets.map((d, i) => {
          const hidden = hiddenMap[i];
          return (
            <button 
              key={`label${i}`} onClick={() => toggleDataset(i)}
              className={clsx(
                styles.legendButton,
                hidden && styles.hidden
              )}
            >
              <span 
                className={clsx(
                  styles.legendIcon
                )}
                style={{
                  backgroundColor: DEFAULT_COLORS[i]
                }}
              >
                <i style={{
                  borderColor: DEFAULT_COLORS[i]}}></i>
              </span>
              <span className={styles.text}>
                {d.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className={styles.chartWrapper}>
        <Line ref={chartRef} data={data} options={options} style={{height: "150px"}} />
      </div>
    </div>
  );
}


export const dashedGridPlugin: Plugin<"line"> = {
  id: "dashedGrid",

  beforeDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const yScale = scales.y;

    if (!yScale) return;

    ctx.save();

    yScale.ticks.forEach((tick, index) => {
      const y = yScale.getPixelForTick(index);

      // 차트 영역 밖이면 그리지 않음
      if (y < chartArea.top || y > chartArea.bottom) return;

      ctx.beginPath();

      if (Number(tick.value) === 0) {
        // Zero Line
        ctx.setLineDash([]);
        ctx.strokeStyle = "#B2B2BA"; // borderColor
        ctx.lineWidth = 1.5;
      } else {
        // 일반 Grid
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "#D9D9D9"; // gridColor
        ctx.lineWidth = 1;
      }

      ctx.moveTo(chartArea.left, y);
      ctx.lineTo(chartArea.right, y);
      ctx.stroke();
    });

    ctx.restore();
  },
};