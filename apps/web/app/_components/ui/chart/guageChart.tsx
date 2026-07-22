"use client";

import { ReactNode, useEffect, useState, useRef, useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { StatusType } from "@/types/statusType";
import styles from "@/styles/components/chartGuage.module.css";
import clsx from "clsx";

ChartJS.register(ArcElement, Tooltip, Legend);

type GaugeChartProps = {
  levels: StatusType[];
  status?: StatusType;
  value?: ReactNode;
};

export default function GaugeChart({ status, levels, value }: GaugeChartProps) {
  const chartRef = useRef<ChartJS<"doughnut"> | null>(null);

  // 기본값으로 초기화하여 첫 렌더링 깜빡임 방지
  const [colors, setColors] = useState<string[]>([]);
  const disabledColor = "#E5EAE3";
  const barColor = "#968F88";

  // CSS 변수 추출
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);

    const extractedColors = levels.map((level) =>
      style.getPropertyValue(`--color-${level}`).trim()
    );

    setColors(extractedColors);
  }, [levels]);

  const currentIndex = status == null ? -1 : levels.indexOf(status);

  // 배경색 배열 생성 (CSS 변수를 읽어오기 전이라면 기본 처리)
  const backgroundColor = useMemo(() => {
    return levels.map((level, index) => {
      if (level === status) {
        return colors[index] || disabledColor;
      }
      return disabledColor;
    });
  }, [levels, status, colors, disabledColor]);

  // 바늘을 그리는 차트 플러그인
  const needlePlugin = useMemo<Plugin<"doughnut">>(() => ({
    id: "needle",
    afterDraw(chart) {
      if (currentIndex < 0) return;

      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      const arc = meta.data[0];

      if (!arc) return;

      const { x, y } = arc;
      const ratio = (currentIndex + 0.5) / levels.length;
      const angle = ((-90 + ratio * 180) * Math.PI) / 180;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // 삼각형 바늘
      const length = 86;
      const width = 5;
      const radius = 1;

      const p1 = { x: -width, y: 4 };
      const p2 = { x: width, y: 4 };
      const p3 = { x: 0, y: -length };

      ctx.beginPath();
      ctx.moveTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      ctx.arcTo(p2.x, p2.y, p3.x, p3.y, radius);
      ctx.arcTo(p3.x, p3.y, p1.x, p1.y, radius);
      ctx.arcTo(p1.x, p1.y, p2.x, p2.y, radius);

      ctx.fillStyle = barColor;
      ctx.fill();

      // 중앙 원
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = barColor;
      ctx.fill();

      ctx.restore();
    },
  }), [barColor, currentIndex, levels.length]);

  // Props나 상태가 변경될 때 차트를 강제로 다시 그리도록 업데이트 신호 전송
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [status, levels, colors]);

  const data = {
    datasets: [
      {
        data: Array(levels.length).fill(1),
        backgroundColor: backgroundColor,
        hoverBackgroundColor: backgroundColor,
        borderWidth: 0,
        borderRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    rotation: -90,
    circumference: 180,
    layout: {
      padding: {
        bottom: 10,
      },
    },
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const plugins = useMemo(() => [needlePlugin], [needlePlugin]);

  return (
    <div className={styles.wrapper}>
      <Doughnut ref={chartRef} data={data} options={options} plugins={plugins} />
      {value && 
        <div className={clsx(
          styles.value,
          status && styles[status]
        )}>{value}</div>
      }
    </div>
  );
}