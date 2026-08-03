"use client";

import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { Ear, Eye, Hospital } from "lucide-react";
import commonStyle from "@/styles/common.module.css";

import Tabs from "@/app/_components/ui/Tabs";
import Card from "@/app/_components/ui/Card";
import { ButtonQuestion } from "@/app/_components/ui/Button";
import StatusTag from "@/app/_components/ui/StatusTag";
import Tooltip from "@/app/_components/ui/ToolTip";
import GaugeChart from "@/app/_components/ui/chart/guageChart";
import LineChart from "@/app/_components/ui/chart/lineChart";

import { ENV } from "@/env";
import {
  bmiStatusTypeLabel,
  getStatusTypeLabel,
  StatusType,
  waistStatusTypeLabel,
} from "@/types/statusType";

interface bodyMetricsData {
  id: number;
  year: number;
  height: number;
  weight: number;
  waist: number;
  bmi: number;
  visionLeft: number;
  visionRight: number;
  hearing: string;
  CheckupAssessment: [
    {
      id: number;
      waist: string;
      bmi: string;
    },
  ];
}

export default function Page() {
  const btnTooltipRef = useRef<HTMLButtonElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [selectedYear, setSelectYear] = useState<number>();
  const [bodyMetricsData, setBodyMetricsData] = useState<bodyMetricsData[]>();

  useEffect(() => {
    async function fetchData() {
      try {
        const yearsResponse = await fetch(`${ENV.API_URL}/checkup/years`, {
          credentials: "include",
        });
        if (!yearsResponse.ok) throw new Error("연도 조회에 실패했습니다.");
        const yearsJson = await yearsResponse.json();
        const years: number[] = yearsJson.data;

        setSelectYear(years[0]);
        console.log(years);

        const dataResponse = await fetch(
          `${ENV.API_URL}/checkup/body-metrics?years=${years.join(",")}`,
          {
            credentials: "include",
          },
        );
        if (!dataResponse.ok) throw new Error("신체 지표 조회에 실패했습니다");
        const dataJson = await dataResponse.json();
        console.log(dataJson);

        setBodyMetricsData(dataJson.data);
      } catch (e) {
        console.error(e);
      }
    }

    fetchData();
  }, []);

  const years = bodyMetricsData?.map((d) => d.year).reverse() ?? [];

  const weights: number[] =
    bodyMetricsData?.map((d) => d.weight).reverse() ?? [];
  const waists: number[] = bodyMetricsData?.map((d) => d.waist).reverse() ?? [];

  const handleYearChange = (value: string) => {
    if (!value && value === undefined) return;
    setSelectYear(Number(value.replace("year", "")));
  };

  return (
    <section className={commonStyle.mainContent}>
      <header className={commonStyle.pageTitleWrapper}>
        <div className={commonStyle.left}>
          <h2 className={commonStyle.pageTitle}>신체 지표</h2>
        </div>
      </header>
      {years && (
        <>
          <Tabs
            defaultValue={`year${selectedYear}`}
            value={`year${selectedYear}`}
            onChange={handleYearChange}
          >
            <Tabs.Nav>
              {[...years].map((y) => (
                <Tabs.NavItem key={y} value={`year${y}`} title={`${y}`} />
              ))}
            </Tabs.Nav>

            <Tabs.Content value={`year${selectedYear}`}>
              {(() => {
                const data = bodyMetricsData?.find(
                  (d) => d.year === selectedYear,
                );

                const bmiStatus = data?.CheckupAssessment[0].bmi as StatusType;
                const waist = data?.CheckupAssessment[0].waist as StatusType;
                const hearing = data?.hearing.split("/");

                return (
                  <Card>
                    <Card.Header
                      icon={<Hospital />}
                      title="BMI"
                      left={
                        <ButtonQuestion
                          ref={btnTooltipRef}
                          onClick={() => setTooltipOpen(true)}
                        />
                      }
                    />
                    <Card.Body noTopPadding>
                      <Card.Grid columns={1}>
                        <Card.Item>
                          <GaugeChart
                            key={data?.bmi}
                            levels={["low", "normal", "warning", "danger"]}
                            status={bmiStatus}
                            value={getStatusTypeLabel(
                              bmiStatusTypeLabel,
                              bmiStatus,
                            )}
                          />
                          <div
                            className={clsx(
                              commonStyle.dataWrapper,
                              commonStyle.jfCenter,
                            )}
                          >
                            <span className={commonStyle.dataValue}>
                              {data?.bmi}
                            </span>
                            <span className={commonStyle.dataUnit}>kg/㎡</span>
                          </div>
                        </Card.Item>
                      </Card.Grid>
                      <Card.Grid columns={3} topDivider leftDivider>
                        <Card.Item title="키">
                          <div className={commonStyle.dataWrapper}>
                            <span className={commonStyle.dataValue}>
                              {data?.height}
                            </span>
                            <span className={commonStyle.dataUnit}>cm</span>
                          </div>
                        </Card.Item>
                        <Card.Item title="체중">
                          <div className={commonStyle.dataWrapper}>
                            <span className={commonStyle.dataValue}>
                              {data?.weight}
                            </span>
                            <span className={commonStyle.dataUnit}>kg</span>
                          </div>
                        </Card.Item>
                        <Card.Item title="허리둘레">
                          <div className={commonStyle.dataWrapper}>
                            <span className={commonStyle.dataValue}>
                              {data?.waist}
                            </span>
                            <span className={commonStyle.dataUnit}>cm</span>
                          </div>
                          <StatusTag
                            status={waist}
                            label={getStatusTypeLabel(
                              waistStatusTypeLabel,
                              waist,
                            )}
                          />
                        </Card.Item>
                      </Card.Grid>
                      <Card.Grid topDivider leftDivider>
                        <Card.Item>
                          <Card.Header icon={<Eye />} title="시력" noPadding />
                          <div
                            className={clsx(
                              commonStyle.dataWrapper,
                              commonStyle.jfCenter,
                            )}
                          >
                            <span className={commonStyle.dataLabel}>L</span>
                            <span className={commonStyle.dataValue}>
                              {data?.visionLeft}
                            </span>
                            <span className={commonStyle.dataLabel}>R</span>
                            <span className={commonStyle.dataValue}>
                              {data?.visionRight}
                            </span>
                          </div>
                        </Card.Item>
                        <Card.Item>
                          <Card.Header icon={<Ear />} title="청력" noPadding />
                          <div
                            className={clsx(
                              commonStyle.dataWrapper,
                              commonStyle.jfCenter,
                            )}
                          >
                            <span className={commonStyle.dataLabel}>L</span>
                            <span className={commonStyle.dataValue}>
                              {hearing && hearing[0]}
                            </span>
                            <span className={commonStyle.dataLabel}>R</span>
                            <span className={commonStyle.dataValue}>
                              {hearing && hearing[1]}
                            </span>
                          </div>
                        </Card.Item>
                      </Card.Grid>
                    </Card.Body>
                  </Card>
                );
              })()}
            </Tabs.Content>
          </Tabs>

          <Card>
            <Card.Body>
              <LineChart
                labels={[...years].map((y) => y.toString())}
                datasets={[
                  {
                    label: "체중",
                    data: weights,
                    unit: "kg",
                  },
                  {
                    label: "허리둘레",
                    data: waists,
                    unit: "cm",
                  },
                ]}
                gridCount={4}
                // min={55}
                // max={150}
              />
              <div className={commonStyle.infoBox}>
                체중과 허리둘레 버튼을 클릭하면 각각의 그래프를 껐다켰다 할 수
                있어요!
              </div>
            </Card.Body>
          </Card>

          <Tooltip
            targetRef={btnTooltipRef}
            open={tooltipOpen}
            onClose={() => setTooltipOpen(false)}
          >
            BMI: 체중을 키의 제곱으로 나눈 값이에요. 체지방의 양을 추정하고
            비만도를 평가하는 지표에요.
            <br />
            허리둘레는 체중과 비례하는 경우가 대부분이지만 내장 지방 확인을
            위해서 BMI가 정상이라고 하더라도 확인하시는게 좋아요.
          </Tooltip>
        </>
      )}
    </section>
  );
}
