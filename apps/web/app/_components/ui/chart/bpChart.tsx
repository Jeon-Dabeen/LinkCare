"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  ChartOptions,
  Plugin,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import styles from "@/styles/components/chartBp.module.css";

ChartJS.register(LinearScale, PointElement, Tooltip);

export type BpChartProps = {
  /** sys 혈압 (Systolic) - Y축 값 */
  systolic: number;
  /** dia 혈압 (Diastolic) - X축 값 */
  diastolic: number;
};

type ZoneColors = {
  low: string;
  normal: string;
  warning: string;
  danger: string;
  dotColor: string;
  textColor: string;
  gridColor: string;
};

// 기본 파스텔톤 불투명 색상 (Fallback)
const DEFAULT_ZONES: ZoneColors = {
  low: "#eafaf1",       // color-low 기반 연한 색
  normal: "#eaf2fb",    // color-normal 기반 연한 색
  warning: "#fdf4e7",   // color-warning 기반 연한 색
  danger: "#fceaea",    // color-danger 기반 연한 색
  dotColor: "#3172C7",
  textColor: "#665F57",
  gridColor: "#E5E5E5",
};

/**
 * HEX 색상을 HSL로 변환 후, 채도(S)를 낮추고 명도(L)를 높여
 * 투명도 없이 연한 연색(파스텔톤 HEX)으로 반환하는 함수
 */
function adjustColorLightness(hex: string, targetSaturation = 50, targetLightness = 92): string {
  const cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length !== 6) return hex;

  let r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  let g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  let b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  if (max !== min) {
    const d = max - min;
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Hue(색상)는 유지하고, Saturation(채도)과 Lightness(명도)를 지정된 비율로 조정
  const s = targetSaturation / 100;
  const l = targetLightness / 100;

  // HSL -> RGB 변환
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  r = hue2rgb(p, q, h + 1 / 3);
  g = hue2rgb(p, q, h);
  b = hue2rgb(p, q, h - 1 / 3);

  const toHex = (x: number) => {
    const hexVal = Math.round(x * 255).toString(16);
    return hexVal.length === 1 ? "0" + hexVal : hexVal;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function BpChart({ systolic, diastolic }: BpChartProps) {
  const chartRef = useRef<ChartJS<"scatter"> | null>(null);
  const [zoneColors, setZoneColors] = useState<ZoneColors>(DEFAULT_ZONES);

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);

    const getVar = (name: string, fallback: string) => {
      const val = style.getPropertyValue(name).trim();
      return val || fallback;
    };

    const lowHex = getVar("--color-low", "#34b162");
    const normalHex = getVar("--color-normal", "#3172c7");
    const warningHex = getVar("--color-warning", "#dd8f0a");
    const dangerHex = getVar("--color-danger", "#e04e4e");

    // 채도를 45~50% 정도로 낮추고, 명도를 92% 수준으로 높여 파스텔 톤 100% 불투명 색상 생성
    setZoneColors({
      low: adjustColorLightness(lowHex, 50, 92),
      normal: adjustColorLightness(normalHex, 50, 92),
      warning: adjustColorLightness(warningHex, 50, 92),
      danger: adjustColorLightness(dangerHex, 50, 92),
      dotColor: getVar("--color-normal", "#3172c7"),
      textColor: getVar("--color-text-primary", "#665f57"),
      gridColor: getVar("--chart-line-color", "#e5e5e5"),
    });
  }, []);

  const data = useMemo(
    () => ({
      datasets: [
        {
          label: "혈압 측정치",
          data: [{ x: diastolic, y: systolic }],
          backgroundColor: zoneColors.dotColor,
          borderColor: "#ffffff",
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    }),
    [diastolic, systolic, zoneColors]
  );

  // 배경 영역을 그려주는 커스텀 플러그인
  const bpBgPlugin: Plugin<"scatter"> = useMemo(
    () => ({
      id: "bpBgPlugin",
      beforeDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        const xScale = scales.x;
        const yScale = scales.y;

        if (!xScale || !yScale) return;

        ctx.save();

        // 0부터 시작하는 중첩 영역 정의
        // Canvas는 뒤에 그려진 구역이 앞에 그려진 구역을 덮어씁니다.
        // 순서: Danger(가장 큼) -> Warning -> Normal -> Low (가장 위로 오게 됨)
        const zones = [
          {
            // 1. 고혈압 / 위험 (Danger) - 가장 넓은 영역
            color: zoneColors.danger,
            xMin: 0,
            xMax: 130,
            yMin: 0,
            yMax: 200,
          },
          {
            // 2. 주의 / 전단계 (Warning)
            color: zoneColors.warning,
            xMin: 0,
            xMax: 90,
            yMin: 0,
            yMax: 140,
          },
          {
            // 3. 정상 (Normal)
            color: zoneColors.normal,
            xMin: 0,
            xMax: 80,
            yMin: 0,
            yMax: 120,
          },
          {
            // 4. 저혈압 (Low) - 가장 작은 영역이자 맨 위
            color: zoneColors.low,
            xMin: 0,
            xMax: 60,
            yMin: 0,
            yMax: 90,
          },
        ];

        zones.forEach((zone) => {
          const left = Math.max(xScale.getPixelForValue(zone.xMin), chartArea.left);
          const right = Math.min(xScale.getPixelForValue(zone.xMax), chartArea.right);
          const top = Math.max(yScale.getPixelForValue(zone.yMax), chartArea.top);
          const bottom = Math.min(yScale.getPixelForValue(zone.yMin), chartArea.bottom);

          if (left < right && top < bottom) {
            ctx.fillStyle = zone.color;
            ctx.fillRect(left, top, right - left, bottom - top);
          }
        });

        ctx.restore();
      },
    }),
    [zoneColors]
  );

  const options = useMemo<ChartOptions<"scatter">>(
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
              const point = context.raw as { x: number; y: number };
              return `sys: ${point.y} mmHg / dia: ${point.x} mmHg`;
            },
          },
        },
      },
      scales: {
        x: {
          type: "linear",
          min: 40,
          max: 130,
          grid: {
            // display: false,
            drawTicks: false, // 축 숫자로 튀어나오는 눈금선(Tick) 제거
            color: zoneColors.gridColor,
          },
          ticks: {
            color: zoneColors.textColor,
            font: {
              size: 11,
            },
            stepSize: 10,
            // count: 4,
          },
          border: {
            display: false,
          },
        },
        y: {
          type: "linear",
          min: 60,
          max: 200,
          grid: {
            // display: false,
            drawTicks: false, // 축 숫자로 튀어나오는 눈금선(Tick) 제거
            drawOnChartArea: true,   // 차트 내부 영역 격자선만 표시
            color: zoneColors.gridColor,
          },
          ticks: {
            // display: false,
            color: zoneColors.textColor,
            font: {
              size: 11,
            },
            stepSize: 50,
          },
          border: {
            display: false,
          },
        },
      },
    }),
    [zoneColors]
  );

  return (
    <div className={styles.wrapper}>
      <Scatter
        ref={chartRef}
        data={data}
        options={options}
        plugins={[bpBgPlugin]}
        style={{ height: "140px", width: "100%" }}
      />
    </div>
  );
}