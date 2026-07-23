
import clsx from "clsx";
import { Droplet } from "lucide-react";
import commonStyle from "@/styles/common.module.css";

import Card from "@/app/_components/ui/Card"
import GaugeChart from "@/app/_components/ui/chart/guageChart";


type BpProps = {
  bgDate: string,
  glucose: string,
}


export default function BG({
  bgDate,
  glucose,
}: BpProps) {
  return (
    <Card>
      <Card.Header 
        icon={<Droplet />}
        right="TODAY"
      />
      <Card.Body noTopPadding>
        <GaugeChart 
          key="warning"
          levels={["low", "normal", "warning", "danger"]}
          status="warning"
          value="위험"
        />
        <div className={clsx(
          commonStyle.dataWrapper,
          commonStyle.jfCenter
        )}>
          <span className={commonStyle.dataValue}>{glucose}</span>
          <span className={commonStyle.dataUnit}>mg/dL </span>
        </div>
      </Card.Body>
    </Card>
  )
}

