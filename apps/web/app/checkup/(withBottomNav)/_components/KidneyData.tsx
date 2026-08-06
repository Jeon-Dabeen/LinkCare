"use client";

import { ButtonQuestion } from "@/app/_components/ui/Button";
import { Card } from "@/app/_components/ui/Card";
import { Grid } from "@/app/_components/ui/Grid";
import StatusTag from "@/app/_components/ui/StatusTag";
import { Tabs } from "@/app/_components/ui/Tabs";
import Tooltip from "@/app/_components/ui/ToolTip";
import GaugeChart from "@/app/_components/ui/chart/guageChart";
import { Bean } from "lucide-react";

import commonStyle from "@/styles/common.module.css";
import style from "@/styles/checkup/checkupDetail.module.css";

import clsx from "clsx";
import { useRef, useState } from "react";

import {
  commonStatusTypeLabel,
  getStatusTypeLabel,
  StatusType,
} from "@/types/statusType";

export interface KidneyDataProps {
  id: number;
  year: number;
  urine_protein: string;
  creatinine: number;
  egfr: number;
  CheckupAssessment: [
    {
      id: number;
      urine_protein: string;
      creatinine: string;
      egfr: string;
    },
  ];
}

export function KidneyData(kidneyDataProps: KidneyDataProps) {
  const egfrBtnTooltipRef = useRef<HTMLButtonElement>(null);
  const [egfrTooltipOpen, setEgfrTooltipOpen] = useState(false);
  const urineProteinBtnTooltipRef = useRef<HTMLButtonElement>(null);
  const [urineProteinTooltipOpen, setUrineProteinTooltipOpen] = useState(false);

  return (
    kidneyDataProps &&
    (() => {
      const kidneyAssessment = kidneyDataProps.CheckupAssessment[0]
        .egfr as StatusType;
      const urineProteinAssessment = kidneyDataProps.CheckupAssessment[0]
        .urine_protein as StatusType;

      return (
        <>
          <Tabs.Content value={`year${kidneyDataProps.year}`}>
            <Grid.ItemFull>
              <Card>
                <Card.Body noTopPadding>
                  <Card.Item>
                    <Card.Header icon={<Bean />} title="신사구체여과율" />
                    <GaugeChart
                      key={kidneyDataProps.egfr}
                      levels={["normal", "danger"]}
                      status={kidneyAssessment}
                      value={getStatusTypeLabel(
                        commonStatusTypeLabel,
                        kidneyAssessment,
                      )}
                    />
                    <div
                      className={clsx(
                        commonStyle.dataWrapper,
                        commonStyle.jfCenter,
                      )}
                    >
                      <span className={commonStyle.dataValue}>
                        {kidneyDataProps.egfr}
                      </span>
                      <span className={commonStyle.dataUnit}>mL/min</span>
                    </div>
                    <div
                      className={`${commonStyle.textLight} ${style.detailMessage}`}
                    >
                      신사구체여과율*은 혈청크레아티닌*과 성별, 나이를
                      종합적으로 계산해서 신장이 건강한지 알려줘요.
                    </div>
                    <ButtonQuestion
                      ref={egfrBtnTooltipRef}
                      onClick={() => setEgfrTooltipOpen(true)}
                    />
                    <StatusTag
                      status={kidneyAssessment}
                      label={getStatusTypeLabel(
                        commonStatusTypeLabel,
                        kidneyAssessment,
                      )}
                    />
                  </Card.Item>

                  <Card.Item>
                    <Card.Header title="요단백" />
                    <div
                      className={`${commonStyle.textLight} ${style.detailMessage}`}
                    >
                      소변에 단백질이 섞여 나오는지를 보는 검사에요.
                      <ButtonQuestion
                        ref={urineProteinBtnTooltipRef}
                        onClick={() => setUrineProteinTooltipOpen(true)}
                      />
                    </div>
                    <StatusTag
                      status={urineProteinAssessment}
                      label={getStatusTypeLabel(
                        commonStatusTypeLabel,
                        urineProteinAssessment,
                      )}
                    />
                  </Card.Item>
                </Card.Body>
              </Card>
            </Grid.ItemFull>
          </Tabs.Content>

          <Tooltip
            targetRef={egfrBtnTooltipRef}
            open={egfrTooltipOpen}
            onClose={() => setEgfrTooltipOpen(false)}
          >
            * 신사구체여과율: 신장의 핵심 필터인 '사구체'가 1분 동안 혈액을
            얼마나 걸러낼 수 있는지 나타내는 지표 * 혈청크레아티닌: 근육이
            사용되고 남은 노폐물인 '크레아티닌'의 혈액 내 농도 두 값을 반비례
            관계 랍니다.
          </Tooltip>
          <Tooltip
            targetRef={urineProteinBtnTooltipRef}
            open={urineProteinTooltipOpen}
            onClose={() => setUrineProteinTooltipOpen(false)}
          >
            원래 정상적인 신장 필터는 덩치가 큰 단백질을 통과시키지 않아요.
            단백질이 소변으로 새어나오면 신사구체여과율이 낮아도 문제가 될
            수있어요.
          </Tooltip>
        </>
      );
    })()
  );
}
