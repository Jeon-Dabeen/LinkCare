import { useEffect, useState } from "react";

import clsx from "clsx";
import { HeartPulse } from "lucide-react";
import commonStyle from "@/styles/common.module.css";

import Card from "@/app/_components/ui/Card";
import GaugeChart from "@/app/_components/ui/chart/guageChart";
import {
  bpStatusTypeLabel,
  getStatusTypeLabel,
  StatusType,
} from "@/types/statusType";
import { getBloodPressureStatus } from "@/utils/dailyStatus";

type BpProps = {
  bpDate: string;
  systolic: number | string;
  diastolic: number | string;
};

export default function BP({ bpDate, systolic, diastolic }: BpProps) {
  const [bpStatus, setBpStatus] = useState<string>("-");
  const [bpStatusLabel, setBpStatusLabel] = useState<string>("-");

  useEffect(() => {
    if (typeof systolic == "number" && typeof diastolic == "number") {
      setBpStatus(getBloodPressureStatus(systolic, diastolic) || "-");
      console.log("bpStatus: ", getBloodPressureStatus(systolic, diastolic));
      setBpStatusLabel(
        getStatusTypeLabel(bpStatusTypeLabel, bpStatus as StatusType),
      );
    }
  }, [systolic, diastolic]);

  return (
    <Card>
      <Card.Header icon={<HeartPulse />} right={bpDate} />
      <Card.Body noTopPadding>
        <GaugeChart
          key={bpStatus}
          levels={["low", "normal", "caution", "warning", "danger"]}
          status={bpStatus as StatusType}
          value={
            bpStatusLabel || bpStatusLabel === "-"
              ? bpStatusLabel
              : bpStatus
                ? bpStatusTypeLabel[bpStatus as StatusType]
                : "-"
          }
        />
        <div className={clsx(commonStyle.dataWrapper, commonStyle.jfCenter)}>
          <span className={commonStyle.dataValue}>{systolic}</span>
          <span className={commonStyle.dataSeparate}>/</span>
          <span className={commonStyle.dataValue}>{diastolic}</span>
          <span className={commonStyle.dataUnit}>mmHg </span>
        </div>
      </Card.Body>
    </Card>
  );
}
