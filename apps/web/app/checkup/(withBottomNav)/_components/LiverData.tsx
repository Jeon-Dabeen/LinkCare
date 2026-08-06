"use client";

import { ButtonQuestion } from "@/app/_components/ui/Button";
import { Card } from "@/app/_components/ui/Card";
import { Grid } from "@/app/_components/ui/Grid";
import StatusTag from "@/app/_components/ui/StatusTag";
import { Tabs } from "@/app/_components/ui/Tabs";
import Tooltip from "@/app/_components/ui/ToolTip";

import commonStyle from "@/styles/common.module.css";
import style from "@/styles/checkup/checkupDetail.module.css";

import clsx from "clsx";
import { useRef, useState } from "react";

import CheckupRange from "@/utils/checkup-range.json";

import {
  commonStatusTypeLabel,
  getStatusTypeLabel,
  StatusType,
} from "@/types/statusType";
import BarChart from "@/app/_components/ui/chart/barChart";
import { getBarPercentage } from "@/utils/checkupBarRange";

export interface Liver {
  id: number;
  year: number;
  ast: number;
  alt: number;
  ygtp: number;
  CheckupAssessment: [
    {
      id: number;
      ast: string;
      alt: string;
      ygtp: string;
    },
  ];
}

export interface LiverDataProps {
  liverData: Liver;
  gender: string;
}

export function LiverData({ liverData, gender }: LiverDataProps) {
  const altBtnTooltipRef = useRef<HTMLButtonElement>(null);
  const [altTooltipOpen, setAltTooltipOpen] = useState(false);
  const astBtnTooltipRef = useRef<HTMLButtonElement>(null);
  const [astTooltipOpen, setAstTooltipOpen] = useState(false);
  const ygptBtnTooltipRef = useRef<HTMLButtonElement>(null);
  const [ygptTooltipOpen, setYgptTooltipOpen] = useState(false);

  return (
    liverData &&
    (() => {
      const altAssessment = liverData.CheckupAssessment[0].alt as StatusType;
      const astAssessment = liverData.CheckupAssessment[0].ast as StatusType;
      const ygptAssessment = liverData.CheckupAssessment[0].ygtp as StatusType;

      const altBarChartPosition = getBarPercentage(
        liverData.alt,
        CheckupRange.alt,
      );
      const astBarChartPosition = getBarPercentage(
        liverData.ast,
        CheckupRange.ast,
      );
      const ygptBarChartPosition = getBarPercentage(
        liverData.ygtp,
        CheckupRange.ygtp[gender === "M" ? "male" : "female"],
      );

      return (
        <>
          <Tabs.Content value={`year${liverData.year}`}>
            <Grid.ItemFull>
              <Card>
                <Card.Body noTopPadding>
                  <Card.Grid columns={1}>
                    <Card.Item>
                      <Card.Header
                        title="ALT"
                        left={
                          <ButtonQuestion
                            ref={altBtnTooltipRef}
                            onClick={() => setAltTooltipOpen(true)}
                          />
                        }
                      />
                      <div
                        className={clsx(
                          commonStyle.dataWrapper,
                          commonStyle.jfCenter,
                        )}
                      >
                        <span className={commonStyle.dataValue}>
                          {liverData.alt}
                        </span>
                        <span className={commonStyle.dataUnit}>U/L</span>
                      </div>
                      <BarChart
                        level={altAssessment}
                        position={altBarChartPosition}
                      />
                      <StatusTag
                        status={altAssessment}
                        label={getStatusTypeLabel(
                          commonStatusTypeLabel,
                          altAssessment,
                        )}
                      />
                    </Card.Item>
                  </Card.Grid>
                  <Card.Grid topDivider leftDivider>
                    <Card.Item>
                      <Card.Header
                        title="AST"
                        left={
                          <ButtonQuestion
                            ref={astBtnTooltipRef}
                            onClick={() => setAstTooltipOpen(true)}
                          />
                        }
                        noPadding
                      />
                      <div
                        className={clsx(
                          commonStyle.dataWrapper,
                          commonStyle.jfCenter,
                        )}
                      >
                        <span className={commonStyle.dataValue}>
                          {liverData.ast}
                        </span>
                        <span className={commonStyle.dataUnit}>U/L</span>
                      </div>
                      <BarChart
                        level={astAssessment}
                        position={astBarChartPosition}
                      />
                      <StatusTag
                        status={astAssessment}
                        label={getStatusTypeLabel(
                          commonStatusTypeLabel,
                          astAssessment,
                        )}
                      />
                    </Card.Item>
                    <Card.Item>
                      <Card.Header
                        title="y-GPT"
                        left={
                          <ButtonQuestion
                            ref={ygptBtnTooltipRef}
                            onClick={() => setYgptTooltipOpen(true)}
                          />
                        }
                        noPadding
                      />
                      <div
                        className={clsx(
                          commonStyle.dataWrapper,
                          commonStyle.jfCenter,
                        )}
                      >
                        <span className={commonStyle.dataValue}>
                          {liverData.ygtp}
                        </span>
                        <span className={commonStyle.dataUnit}>U/L</span>
                      </div>
                      <BarChart
                        level={ygptAssessment}
                        position={ygptBarChartPosition}
                      />
                      <StatusTag
                        status={ygptAssessment}
                        label={getStatusTypeLabel(
                          commonStatusTypeLabel,
                          ygptAssessment,
                        )}
                      />
                    </Card.Item>
                  </Card.Grid>
                </Card.Body>
              </Card>
            </Grid.ItemFull>
          </Tabs.Content>

          <Tooltip
            targetRef={altBtnTooltipRef}
            open={altTooltipOpen}
            onClose={() => setAltTooltipOpen(false)}
          >
            주로 간에만 있는 효소라서 간 전용 수치라고 볼 수 있어요. 급성 및
            만성 간염, 지방간 등 간 손상을 발견하는 핵심 지표예요.
          </Tooltip>
          <Tooltip
            targetRef={astBtnTooltipRef}
            open={astTooltipOpen}
            onClose={() => setAstTooltipOpen(false)}
          >
            ALT와 다르게 간뿐만 아니라 다른 여러 장기에도 존재하는 효소에요. AST
            수치가 정상이 아니면 근육이나 심장 같은 다른 장기의 문제일 수도
            있어요.
          </Tooltip>
          <Tooltip
            targetRef={ygptBtnTooltipRef}
            open={ygptTooltipOpen}
            onClose={() => setYgptTooltipOpen(false)}
          >
            주로 간과 담도에 있는 단백질 분해 효소예요. 간이 해독 작업을 얼마나
            부담스러워하고 있는지를 보여줘요.
            <br />
            남성은 64 IU/L, 여성은 35 IU/L 이하를 정상 범위
          </Tooltip>
        </>
      );
    })()
  );
}
