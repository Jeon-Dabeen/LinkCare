'use client';

import { useState } from "react";

import clsx from "clsx";
import { ArrowDown, Droplet, Pencil } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import style from "@/styles/daily/dash.module.css";

import { MealType, getMealTypeLabel } from "@/types/mealType";

import Tabs from "@/app/_components/ui/Tabs";
import Card from "@/app/_components/ui/Card";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import Button, { ButtonIcon } from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import StatusTag from "@/app/_components/ui/StatusTag";
import BarChart from "@/app/_components/ui/chart/barChart";
import LineChart from "@/app/_components/ui/chart/lineChart";
import MonthCalendar from "@/app/_components/ui/calendar/MonthCalendar";
import Radio from "@/app/_components/ui/Radio";


export default function Page(){

  const [openSheet, setOpenSheet] = useState(false);

  const handleOpenSheet = () => {
    setOpenSheet(true);
  }


  return (
    <section className={commonStyle.mainContent}>

      <Tabs defaultValue="dinner">
        <Tabs.Nav>
          <Tabs.NavItem value="breakfast" title={getMealTypeLabel('breakfast')} />
          <Tabs.NavItem value="lunch" title={getMealTypeLabel('lunch')} />
          <Tabs.NavItem value="dinner" title={getMealTypeLabel('dinner')} />
        </Tabs.Nav>
        <Tabs.Content value="breakfast">
          <Card>
            <Card.Header 
              icon={<Droplet />}
              title="혈당"
              right="TODAY"
            />
            <Card.Body noTopPadding>
              <Card.Grid columns={2} leftDivider>
                <Card.Item title="식전">
                  <div className={style.dashWrapper}>
                    <div className={style.current}>
                      <span className={style.value}>80</span>
                      <span className={style.unit}>mg/dL</span>
                      <div className={style.buttonArea}>
                        <ButtonIcon color="primary"
                          onClick={handleOpenSheet}
                        >
                          <Pencil />
                        </ButtonIcon>
                      </div>
                    </div>
                  </div>
                  <BarChart level="low" position={10}/>
                  <StatusTag status="low" label="낮음" />
                </Card.Item>
                <Card.Item title="식후">
                  <div className={style.dashWrapper}>
                    <div className={style.current}>
                      <span className={style.value}>160</span>
                      <span className={style.unit}>mg/dL</span>
                      <div className={style.buttonArea}>
                        <ButtonIcon color="primary"
                          onClick={handleOpenSheet}
                        >
                          <Pencil />
                        </ButtonIcon>
                      </div>
                    </div>
                  </div>
                  <BarChart level="normal" position={50}/>
                  <StatusTag status="normal" label="정상" />
                </Card.Item>
              </Card.Grid>
            </Card.Body>
          </Card>
        </Tabs.Content>
        <Tabs.Content value="lunch">
          <Card>
            <Card.Header 
              icon={<Droplet />}
              title="혈당"
              right="TODAY"
            />
            <Card.Body noTopPadding>
              <Card.Grid columns={2} leftDivider>
                <Card.Item title="식전">
                  <div className={style.dashWrapper}>
                    <div className={style.current}>
                      <span className={style.value}>-</span>
                      <span className={style.unit}>mg/dL</span>
                      <div className={style.buttonArea}>
                        <ButtonIcon color="primary"
                          onClick={handleOpenSheet}
                        >
                          <Pencil />
                        </ButtonIcon>
                      </div>
                    </div>
                  </div>
                  <BarChart level="" position={0}/>
                  {/* <StatusTag status="caution" label="주의" /> */}
                </Card.Item>
                <Card.Item title="식후">
                  <div className={style.dashWrapper}>
                    <div className={style.current}>
                      <span className={style.value}>180</span>
                      <span className={style.unit}>mg/dL</span>
                      {/* <div className={style.buttonArea}>
                        <ButtonIcon color="primary"
                          onClick={handleOpenSheet}
                        >
                          <Pencil />
                        </ButtonIcon>
                      </div> */}
                    </div>
                  </div>
                  <BarChart level="" position={0}/>
                  <StatusTag status="normal" label="정상" />
                </Card.Item>
              </Card.Grid>
            </Card.Body>
          </Card>
        </Tabs.Content>
        <Tabs.Content value="dinner">
          <Card>
            <Card.Header 
              icon={<Droplet />}
              title="혈당"
              right="TODAY"
            />
            <Card.Body noTopPadding>
              <Card.Grid columns={2} leftDivider>
                <Card.Item title="식전">
                  <div className={style.dashWrapper}>
                    <div className={style.current}>
                      <span className={style.value}>105</span>
                      <span className={style.unit}>mg/dL</span>
                      <div className={style.buttonArea}>
                        <ButtonIcon color="primary"
                          onClick={handleOpenSheet}
                        >
                          <Pencil />
                        </ButtonIcon>
                      </div>
                    </div>
                  </div>
                  <BarChart level="caution" position={87}/>
                </Card.Item>
                <Card.Item title="식후">
                  <div className={style.dashWrapper}>
                    <div className={style.current}>
                      <span className={style.value}>-</span>
                      <span className={style.unit}>mg/dL</span>
                      <div className={style.buttonArea}>
                        <ButtonIcon color="primary"
                          onClick={handleOpenSheet}
                        >
                          <Pencil />
                        </ButtonIcon>
                      </div>
                    </div>
                  </div>
                  <BarChart level="" position={0}/>
                </Card.Item>
              </Card.Grid>
            </Card.Body>
          </Card>
        </Tabs.Content>
      </Tabs>

      <Card>
        <Card.Header 
          title="이번 주 혈당 추이"
        />
        <Card.Body noTopPadding>
          <Card.Grid columns={1}>
            <LineChart
              labels={["07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24"]}
              datasets={[
                {
                  label: "식전",
                  data: [96, null, null, 100, 96, null, 105],
                },
                {
                  label: "식후",
                  data: [129, 130, 102, null, 150, 180, null],
                },
              ]}
              showYAxisTicks
            />
          </Card.Grid>
          <Card.Grid columns={1} topDivider>
            <Card.Item title="이번 주 정상 범위 이탈 횟수">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>2</span>
                <span className={commonStyle.dataUnit}>회</span>
              </div>
            </Card.Item>
          </Card.Grid>
        </Card.Body>
      </Card>

      
      <MonthCalendar 
        data={{
          "2026-06-01": {
            status: "low",
          },
          "2026-06-02": {
            status: "normal",
          },
          "2026-06-05": {
            status: "caution",
          },
          "2026-06-10": {
            status: "warning",
          },
          "2026-06-12": {
            status: "danger",
          },
          "2026-07-01": {
            status: "low",
          },
          "2026-07-02": {
            status: "normal",
          },
          "2026-07-05": {
            status: "caution",
          },
          "2026-07-10": {
            status: "warning",
          },
          "2026-07-12": {
            status: "danger",
          }
        }} 
      />

      <BottomSheet
        open={openSheet}
        title="아침 식전 혈당 입력"
        onClose={() => setOpenSheet(false)}>
          <div className={formStyle.formWrapper}>
            <div className={formStyle.formGroup}>
              <Input unit="mg/dL" type="number" id="newData" name="newData" required />
            </div>
            <Button type="button" variant="primary" size="large" onClick={() => {}} disabled>
              기록
            </Button>
          </div>
      </BottomSheet>
    </section>
  )
}
