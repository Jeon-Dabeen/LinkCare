'use client';

import { useState } from "react";

import { ArrowDown, HeartPulse, Pencil } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import dashStyle from "@/styles/daily/dash.module.css";

import Card from "@/app/_components/ui/Card";
import Button, { ButtonIcon } from "@/app/_components/ui/Button";
import BottomSheet from "@/app/_components/ui/BottomSheet";

export default function Page(){
  const [open, setOpen] = useState(false);

  function handleOpenSheet() {
    setOpen(true);
  }

  return (
    <section className={commonStyle.mainContent}>

      <Card>
        <Card.Header 
          icon={<HeartPulse />}
          title="체중"
          right="07-16"
        />
        <Card.Body>
          <Card.Grid>
            <div className={dashStyle.dashWrapper}>
              <div className={dashStyle.current}>
                <span className={dashStyle.value}>68.4</span>
                <span className={dashStyle.unit}>kg</span>
                <div className={dashStyle.buttonArea}>
                  <ButtonIcon color="primary">
                    <Pencil />
                  </ButtonIcon>
                </div>
              </div>
              <div className={dashStyle.dashBox}>
                <ArrowDown size={16} />
                <span>목표까지</span>
                <span>-3.4kg</span>
              </div>
            </div>
            <div>chart</div>
          </Card.Grid>
          <Card.Grid topDivider leftDivider>
            <Card.Item title="키">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>173</span>
                <span className={commonStyle.dataUnit}>cm</span>
                <ButtonIcon>
                  <Pencil />
                </ButtonIcon>
              </div>
            </Card.Item>
            <Card.Item title="목표체중">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>65.0</span>
                <span className={commonStyle.dataUnit}>kg</span>
                <ButtonIcon onClick={handleOpenSheet}>
                  <Pencil />
                </ButtonIcon>
              </div>
            </Card.Item>
          </Card.Grid>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header 
          title="이번 주 체중 추이"
        />
        <Card.Body>
          <Card.Grid>
            체중 차트
          </Card.Grid>
          <Card.Grid columns={3} topDivider leftDivider>
            <Card.Item title="키">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>173</span>
                <span className={commonStyle.dataUnit}>kg</span>
              </div>
            </Card.Item>
            <Card.Item title="이전 대비">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>+ 0.8</span>
                <span className={commonStyle.dataUnit}>kg</span>
              </div>
            </Card.Item>
            <Card.Item title="최저/최고">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>62.5</span>
                <span className={commonStyle.dataSeparator}>/</span>
                <span className={commonStyle.dataValue}>64.1</span>
                <span className={commonStyle.dataUnit}>kg</span>
              </div>
            </Card.Item>
          </Card.Grid>
        </Card.Body>
      </Card>

      <div>달력.......</div>
      


      <BottomSheet
        open={open}
        title="목표 체중"
        onClose={() => setOpen(false)}>
          <div className={formStyle.formWrapper}>
            <div className={formStyle.formGroup}>
              <div className={formStyle.formInputWrapper}>
                <input type="number" id="goalWeight" name="goalWeight" className={formStyle.formInput} required />
                <div className={formStyle.formUnit}>kg</div>
              </div>
            </div>
            <Button type="button" variant="primary" size="large" onClick={() => {}} disabled>
              기록
            </Button>
          </div>
      </BottomSheet>
    </section>
  )
}
