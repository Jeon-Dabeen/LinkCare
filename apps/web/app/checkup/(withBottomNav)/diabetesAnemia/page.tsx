"use client";

import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { Droplet } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import style from "@/styles/checkup/checkupDetail.module.css";

import Tabs from "@/app/_components/ui/Tabs";
import Grid from "@/app/_components/ui/Grid";
import Card from "@/app/_components/ui/Card";
import { ButtonQuestion } from "@/app/_components/ui/Button";
import StatusTag from "@/app/_components/ui/StatusTag";
import Tooltip from "@/app/_components/ui/ToolTip";
import LineChart from "@/app/_components/ui/chart/lineChart";
import BarChart from "@/app/_components/ui/chart/barChart";

import { ENV } from "@/env";
import {
  commonStatusTypeLabel,
  fbgStatusTypeLabel,
  getStatusTypeLabel,
  StatusType,
} from "@/types/statusType";
import CheckupRange from "@/utils/checkup-range.json";
import { getBarPercentage } from "@/utils/checkupBarRange";

interface DiabetesAnemiaData {
  id: number;
  year: number;
  fbg: number;
  hemoglobin: number;
  CheckupAssessment: [
    {
      id: number;
      fbg: string;
      hemoglobin: string;
    },
  ];
}

export default function Page() {
  const fbgBtnTooltipRef = useRef<HTMLButtonElement>(null);
  const [fgbTooltipOpen, setFbgTooltipOpen] = useState(false);
  const hemoglobinBtnTooltipRef = useRef<HTMLButtonElement>(null);
  const [hemoglobinTooltipOpen, setHemoglobinTooltipOpen] = useState(false);

  const [selectedYear, setSelectYear] = useState<number>();
  const [diabetesAnemiaData, setDiabetesAnemiaData] =
    useState<DiabetesAnemiaData[]>();
  const genderRef = useRef<"male" | "female">("male");

  useEffect(() => {
    async function fetchData() {
      try {
        const genderResponse = await fetch(`${ENV.API_URL}/profile/gender`, {
          credentials: "include",
        });
        if (!genderResponse.ok) throw new Error("성별 조회에 실패했습니다.");

        const genderJson = await genderResponse.json();
        console.log(`사용자 gender: ${genderJson.data.gender}`);
        genderRef.current = genderJson.data.gender === "M" ? "male" : "female";

        const dataResponse = await fetch(
          `${ENV.API_URL}/checkup/diabetes-anemia`,
          {
            credentials: "include",
          },
        );
        if (!dataResponse.ok)
          throw new Error("혈당 & 빈혈 조회에 실패했습니다");
        const dataJson = await dataResponse.json();
        console.log(dataJson);

        setSelectYear(dataJson.data[0].year);
        setDiabetesAnemiaData(dataJson.data);
      } catch (e) {
        console.error(e);
      }
    }

    fetchData();
  }, []);

  const years = diabetesAnemiaData?.map((d) => d.year).reverse() ?? [];

  const fbgs: number[] = diabetesAnemiaData?.map((d) => d.fbg).reverse() ?? [];
  const hemoglobins: number[] =
    diabetesAnemiaData?.map((d) => d.hemoglobin).reverse() ?? [];

  const handleYearChange = (value: string) => {
    if (!value && value === undefined) return;
    setSelectYear(Number(value.replace("year", "")));
  };

  return (
    <section className={commonStyle.mainContent}>
      <header className={commonStyle.pageTitleWrapper}>
        <div className={commonStyle.left}>
          <h2 className={commonStyle.pageTitle}>빈혈 & 혈당</h2>
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
                const data = diabetesAnemiaData?.find(
                  (d) => d.year === selectedYear,
                );

                const fbgBarChartPosition = getBarPercentage(
                  data?.fbg as number,
                  CheckupRange.fbg,
                );
                const hemoglobinBarChartPosition = getBarPercentage(
                  data?.hemoglobin as number,
                  CheckupRange.hemoglobin[genderRef.current],
                );
                const fbgAssessment = data?.CheckupAssessment[0].fbg;
                const hemoglobinAssessment =
                  data?.CheckupAssessment[0].hemoglobin;

                // const bmiStatus = data?.CheckupAssessment[0].bmi as StatusType;
                // const waist = data?.CheckupAssessment[0].waist as StatusType;

                return (
                  <Grid.ItemFull>
                    <Card>
                      <Card.Body noTopPadding>
                        <Card.Grid columns={2} leftDivider>
                          <Card.Item>
                            <Card.Header
                              icon={<Droplet />}
                              title="혈당"
                              left={
                                <ButtonQuestion
                                  ref={fbgBtnTooltipRef}
                                  onClick={() => setFbgTooltipOpen(true)}
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
                                {data?.fbg}
                              </span>
                              <span className={commonStyle.dataUnit}>
                                mg/dL
                              </span>
                            </div>
                            <BarChart
                              level={fbgAssessment}
                              position={fbgBarChartPosition}
                            />
                            <div
                              className={`${commonStyle.textLight} ${style.detailMessage}`}
                            >
                              공복혈당 검사는 당뇨병 위험이 있는지 알려줘요.
                            </div>
                            <StatusTag
                              status={fbgAssessment as StatusType}
                              label={getStatusTypeLabel(
                                fbgStatusTypeLabel,
                                fbgAssessment as StatusType,
                              )}
                            />
                          </Card.Item>
                          <Card.Item>
                            <Card.Header
                              icon={<Droplet />}
                              title="빈혈"
                              left={
                                <ButtonQuestion
                                  ref={hemoglobinBtnTooltipRef}
                                  onClick={() => setHemoglobinTooltipOpen(true)}
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
                                {data?.hemoglobin}
                              </span>
                              <span className={commonStyle.dataUnit}>g/dL</span>
                            </div>
                            <BarChart
                              level={hemoglobinAssessment}
                              position={hemoglobinBarChartPosition}
                            />
                            <div
                              className={`${commonStyle.textLight} ${style.detailMessage}`}
                            >
                              헤모글로빈 수치를 확인하고 빈혈이 있는지 알려줘요.
                            </div>
                            <StatusTag
                              status={hemoglobinAssessment as StatusType}
                              label={getStatusTypeLabel(
                                commonStatusTypeLabel,
                                hemoglobinAssessment as StatusType,
                              )}
                            />
                          </Card.Item>
                        </Card.Grid>
                      </Card.Body>
                    </Card>
                  </Grid.ItemFull>
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
                    label: "공복혈당",
                    data: fbgs,
                    unit: "mg/dL",
                  },
                ]}
                gridCount={4}
                min={30}
                max={200}
              />
              <div className={commonStyle.infoBox}>
                공복혈당 버튼을 클릭하면 각각의 그래프를 껐다켰다 할 수 있어요!
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <LineChart
                labels={[...years].map((y) => y.toString())}
                datasets={[
                  {
                    label: "혈색소",
                    data: hemoglobins,
                    unit: "g/dL",
                  },
                ]}
                gridCount={4}
                min={0}
                max={20}
              />
              <div className={commonStyle.infoBox}>
                혈색소 버튼을 클릭하면 각각의 그래프를 껐다켰다 할 수 있어요!
              </div>
            </Card.Body>
          </Card>

          <Tooltip
            targetRef={fbgBtnTooltipRef}
            open={fgbTooltipOpen}
            onClose={() => setFbgTooltipOpen(false)}
          >
            공복혈당은 최소 8시간 굶은 상태에서 잰 혈당이에요. 혈당은 핏속에
            떠다니는 포도당의 양이라고 생각하시면 돼요. 인슐린이 부족하거나, 제
            역할을 하지 못하면 포도당이 세포로 가지 못하고 혈관에 쌓이게 돼요.
          </Tooltip>
          <Tooltip
            targetRef={hemoglobinBtnTooltipRef}
            open={hemoglobinTooltipOpen}
            onClose={() => setHemoglobinTooltipOpen(false)}
          >
            빈혈 검사는 혈액 속 적혈구, 그중에서도 산소를 운반하는
            헤모글로빈(혈색소) 수치를 측정하는 검사예요. 헤모글로빈이 부족하면
            몸 곳곳에 산소가 충분히 전달되지 못해서 쉽게 피곤하거나 어지러움을
            느낄 수 있어요.
            <br />
            성인 남성: 13.0 g/dL 이상
            <br />
            성인 여성: 12.0 g/dL 이상
            <br />
            임산부: 11.0 g/dL 이상
          </Tooltip>
        </>
      )}
    </section>
  );
}
