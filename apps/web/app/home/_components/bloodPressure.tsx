
import clsx from "clsx";
import { HeartPulse } from "lucide-react";
import commonStyle from "@/styles/common.module.css";

import Card from "@/app/_components/ui/Card"


type BpProps = {
  bpDate: string,
  systolic: string,
  diastolic: string,
  pulse: string
}


export default function BP({
  bpDate,
  systolic,
  diastolic,
  pulse
}: BpProps) {
  return (
    <Card>
      <Card.Header 
        icon={<HeartPulse />}
        right={bpDate}
      />
      <Card.Body>
        <div>chart</div>
        <div className={clsx(
          commonStyle.dataWrapper,
          commonStyle.jfCenter
        )}>
          <span className={commonStyle.dataValue}>{systolic}</span>
          <span className={commonStyle.dataSeparate}>/</span>
          <span className={commonStyle.dataValue}>{diastolic}</span>
          <span className={commonStyle.dataUnit}>mmHg </span>
          <span className={commonStyle.dataValue}>{pulse}</span>
          <span className={commonStyle.dataUnit}>bpm</span>
        </div>
      </Card.Body>
    </Card>
  )
}

