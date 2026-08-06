"use client";

import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { HeartPulse } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import style from "@/styles/checkup/checkupDetail.module.css";

import Tabs from "@/app/_components/ui/Tabs";
import Card from "@/app/_components/ui/Card";
import { ButtonQuestion } from "@/app/_components/ui/Button";
import StatusTag from "@/app/_components/ui/StatusTag";
import Tooltip from "@/app/_components/ui/ToolTip";
import LineChart from "@/app/_components/ui/chart/lineChart";

import { ENV } from "@/env";
import {
  bpStatusTypeLabel,
  getStatusTypeLabel,
  StatusType,
} from "@/types/statusType";
import BpChart from "@/app/_components/ui/chart/bpChart";
import { toast } from "sonner";

interface BloodPressureData {
  id: number;
  year: number;
  bp_systolic: number;
  bp_diastolic: number;
  CheckupAssessment: [
    {
      id: number;
      bp: string;
    },
  ];
}

export default function Page() {
  const btnTooltipRef = useRef<HTMLButtonElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [selectedYear, setSelectYear] = useState<number>();
  const [bloodPressureData, setBloodPressureData] =
    useState<BloodPressureData[]>();

  useEffect(() => {
    async function fetchData() {
      try {
        const dataResponse = await fetch(
          `${ENV.API_URL}/checkup/blood-pressure`,
          {
            credentials: "include",
          },
        );
        if (!dataResponse.ok) throw new Error("혈압 조회에 실패했습니다");
        const dataJson = await dataResponse.json();
        console.log(dataJson);

        setSelectYear(dataJson.data[0].year);
        setBloodPressureData(dataJson.data);
      } catch (e) {
        console.error(e);
      }
    }

    fetchData();
  }, []);

  const years = bloodPressureData?.map((d) => d.year).reverse() ?? [];

  const systolics: number[] =
    bloodPressureData?.map((d) => d.bp_systolic).reverse() ?? [];
  const diastolics: number[] =
    bloodPressureData?.map((d) => d.bp_diastolic).reverse() ?? [];

  const handleYearChange = (value: string) => {
    if (!value && value === undefined) return;
    setSelectYear(Number(value.replace("year", "")));
  };

  return (
    <section className={commonStyle.mainContent}>
      <header className={commonStyle.pageTitleWrapper}>
        <div className={commonStyle.left}>
          <h2 className={commonStyle.pageTitle}>혈압</h2>
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
                const data = bloodPressureData?.find(
                  (d) => d.year === selectedYear,
                );

                let bpAssessment = "normal";

                if (data) {
                  const bpAssessments = data?.CheckupAssessment[0].bp
                    .split("/")
                    .map((d) => d.slice(4))!;
                  bpAssessment =
                    bpAssessments[0] === "normal"
                      ? (bpAssessments[1] as StatusType)
                      : (bpAssessments[0] as StatusType);
                }

                return (
                  <Card>
                    <Card.Header icon={<HeartPulse />} title="혈압" />
                    <Card.Body noTopPadding>
                      <Card.Grid columns={1}>
                        <div className={style.dashWrapper}>
                          <div className={style.current}>
                            <span className={style.value}>
                              {data?.bp_systolic}
                            </span>

                            <span className={style.separator}>/</span>

                            <span className={style.value}>
                              {data?.bp_diastolic}
                            </span>

                            <span className={style.unit}>mmHg</span>
                          </div>
                        </div>
                        <div
                          className={`${commonStyle.textLight} ${style.detailMessage}`}
                        >
                          혈압은 최저가 60~80, 최고가 90~120이면 정상이에요.
                        </div>
                      </Card.Grid>
                    </Card.Body>
                    <StatusTag
                      status={bpAssessment as StatusType}
                      label={getStatusTypeLabel(
                        bpStatusTypeLabel,
                        bpAssessment as StatusType,
                      )}
                    />
                  </Card>
                );
              })()}
            </Tabs.Content>
          </Tabs>

          <Card>
            <Card.Header
              title="혈압 추이를 확인하세요!"
              right={
                <ButtonQuestion
                  ref={btnTooltipRef}
                  onClick={() => setTooltipOpen(true)}
                />
              }
            />
            <Card.Body noTopPadding>
              <Card.Grid columns={1}>
                <Card.Item>
                  {(() => {
                    if (!bloodPressureData) return;

                    const data = bloodPressureData.find(
                      (d) => d.year === selectedYear,
                    );

                    if (!data) {
                      toast.warning("선택하신 년도의 결과는 존재하지 않아요!");
                      return;
                    }

                    return (
                      <BpChart
                        key={"bpChart"}
                        systolic={data.bp_systolic}
                        diastolic={data.bp_diastolic}
                      />
                    );
                  })()}
                </Card.Item>
              </Card.Grid>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <LineChart
                labels={[...years].map((y) => y.toString())}
                datasets={[
                  {
                    label: "최고 혈압",
                    data: systolics,
                    unit: "mmHg",
                  },
                  {
                    label: "최저 혈압",
                    data: diastolics,
                    unit: "mmHg",
                  },
                ]}
                gridCount={4}
                min={0}
                max={250}
              />
              <div className={commonStyle.infoBox}>
                최고 혈압과 최저 혈압 버튼을 클릭하면 각각의 그래프를 껐다켰다
                할 수 있어요!
              </div>
            </Card.Body>
          </Card>

          <Tooltip
            targetRef={btnTooltipRef}
            open={tooltipOpen}
            onClose={() => setTooltipOpen(false)}
          >
            x축은 최저 혈압의 범위를 보여줘요.
            <br />
            y축은 최고 혈압의 범위를 보여줘요.
          </Tooltip>
        </>
      )}
    </section>
  );
}
