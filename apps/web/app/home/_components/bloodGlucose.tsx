import clsx from "clsx";
import { Droplet } from "lucide-react";
import commonStyle from "@/styles/common.module.css";

import Card from "@/app/_components/ui/Card";
import GaugeChart from "@/app/_components/ui/chart/guageChart";
import {
  AFTER_BLOOD_GLUCOSE_THRESHOLDS,
  BEFORE_BLOOD_GLUCOSE_THRESHOLDS,
  getStatusByThreshold,
} from "@/utils/dailyStatus";
import { useEffect, useState } from "react";
import { bgStatusTypeLabel } from "@/types/statusType";

export const mealTimingLabelMap = {
  before: "식전",
  after: "식후",
} as const;

type BpProps = {
  bgDate: string | string;
  glucose: number | string;
  mealTiming?: string | null;
};

export default function BG({ bgDate, glucose, mealTiming }: BpProps) {
  const [bgStatus, setBgStatus] = useState<string>("-");
  const [bgStatusLabel, setBgStatusLabel] = useState<string>("-");

  useEffect(() => {
    if (typeof glucose === "number") {
      if (mealTiming === "BEFORE") {
        setBgStatus(
          getStatusByThreshold(glucose, BEFORE_BLOOD_GLUCOSE_THRESHOLDS) || "-",
        );
        setBgStatusLabel(
          bgStatusTypeLabel[
            getStatusByThreshold(
              glucose,
              BEFORE_BLOOD_GLUCOSE_THRESHOLDS,
            ) as keyof typeof bgStatusTypeLabel
          ] || "-",
        );
      } else if (mealTiming === "AFTER") {
        setBgStatus(
          getStatusByThreshold(glucose, AFTER_BLOOD_GLUCOSE_THRESHOLDS) || "-",
        );
        setBgStatusLabel(
          bgStatusTypeLabel[
            getStatusByThreshold(
              glucose,
              AFTER_BLOOD_GLUCOSE_THRESHOLDS,
            ) as keyof typeof bgStatusTypeLabel
          ] || "-",
        );
      } else {
        setBgStatus("-");
        setBgStatusLabel("-");
      }
    }
  }, [glucose, mealTiming]);

  return (
    <Card>
      <Card.Header icon={<Droplet />} right={bgDate} />
      <Card.Body noTopPadding>
        <GaugeChart
          key={`${glucose}-${mealTiming}`}
          levels={["low", "normal", "warning", "danger"]}
          status={bgStatus as keyof typeof bgStatusTypeLabel}
          value={bgStatusLabel}
        />
        <div className={clsx(commonStyle.dataWrapper, commonStyle.jfCenter)}>
          <span className={commonStyle.dataValue}>{glucose}</span>
          <span className={commonStyle.dataUnit}>mg/dL </span>
        </div>
      </Card.Body>
    </Card>
  );
}
