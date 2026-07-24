'use client';

import { useState } from "react";

import clsx from "clsx";
import { ArrowDown, HeartPulse, Pencil } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import style from "@/styles/daily/dash.module.css";

import Tabs from "@/app/_components/ui/Tabs";
import Card from "@/app/_components/ui/Card";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import Button, { ButtonIcon } from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import MonthCalendar from "@/app/_components/ui/calendar/MonthCalendar";
import BpChart from "@/app/_components/ui/chart/bpChart";
import LineChart from "@/app/_components/ui/chart/lineChart";


export default function Page(){

  const [openSheet, setOpenSheet] = useState(false);

  const handleOpenSheet = () => {
    setOpenSheet(true);
  }


  return (
    <section className={commonStyle.mainContent}>

      <Tabs defaultValue="evening">
        <Tabs.Nav>
          <Tabs.NavItem value="morning" title="오전" />
          <Tabs.NavItem value="evening" title="오후" />
        </Tabs.Nav>
        <Tabs.Content value="morning">
          <Card>
            <Card.Header 
              icon={<HeartPulse />}
              title="혈압"
              right="TODAY"
            />
            <Card.Body>
              <Card.Grid>
                <div className={style.dashWrapper}>
                  <div className={style.current}>
                    <span className={style.value}>110</span>
                    <span className={style.separator}>/</span>
                    <span className={style.value}>70</span>
                    <span className={style.unit}>mmHg</span>
                    <div className={style.buttonArea}>
                      <ButtonIcon color="primary"
                        onClick={handleOpenSheet}
                      >
                        <Pencil />
                      </ButtonIcon>
                    </div>
                  </div>
                  <div className={clsx(
                    style.dashStatus,
                    style.normal
                    // style.warning 
                    // dashSyle.danger
                  )}>
                    정상 범위
                  </div>
                  <div className={commonStyle.dataWrapper}>
                    <span className={commonStyle.dataLabel}>맥박</span>
                    <span className={commonStyle.dataValue}>90</span>
                    <span className={commonStyle.dataUnit}>bpm</span>
                  </div>
                </div>
                <div>chart</div>
              </Card.Grid>
            </Card.Body>
          </Card>
        </Tabs.Content>
        <Tabs.Content value="evening">
          <Card>
            <Card.Header 
              icon={<HeartPulse />}
              title="혈압"
              right="TODAY"
            />
            <Card.Body>
              <Card.Grid>
                <div className={style.dashWrapper}>
                  <div className={style.current}>
                    <span className={style.value}>-</span>
                    <span className={style.separator}>/</span>
                    <span className={style.value}>-</span>
                    <span className={style.unit}>mmHg</span>
                    <div className={style.buttonArea}>
                      <ButtonIcon color="primary"
                        onClick={handleOpenSheet}
                      >
                        <Pencil />
                      </ButtonIcon>
                    </div>
                  </div>
                  <div className={clsx(
                    style.dashStatus,
                    // style.normal
                    // style.warning 
                    // dashSyle.danger
                  )}>
                    -
                  </div>
                  <div className={commonStyle.dataWrapper}>
                    <span className={commonStyle.dataLabel}>맥박</span>
                    <span className={commonStyle.dataValue}>-</span>
                    <span className={commonStyle.dataUnit}>bpm</span>
                  </div>
                </div>
                <BpChart diastolic={80} systolic={120}/>
              </Card.Grid>
            </Card.Body>
          </Card>
        </Tabs.Content>
      </Tabs>

      <Card>
        <Card.Header 
          title="이번 주 혈압 추이"
        />
        <Card.Body>
          <Card.Grid columns={1}>
            <LineChart 
              labels={["07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24"]}
              datasets={[
                {
                  label: "오전 최저혈압",
                  data: [96, 80, 90, 80, 95, 95, 72],
                },
                {
                  label: "오전 최고혈압",
                  data: [120, 110, 102, 120, 150, 180, 150],
                },
                {
                  label: "오후 최저혈압",
                  data: [80, null, null, 100, 96, null, 105],
                },
                {
                  label: "오후 최고혈압",
                  data: [200, null, null, 150, 150, null, 120],
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
        title="오전 혈압 입력"
        onClose={() => setOpenSheet(false)}>
          <div className={formStyle.formWrapper}>
            <div className={formStyle.formGroup}>
              <Input unit="bpm" type="number" id="newBpm" name="newBpm" required />
            </div>
            <Button type="button" variant="primary" size="large" onClick={() => {}} disabled>
              기록
            </Button>
          </div>
      </BottomSheet>
    </section>
  )
}
