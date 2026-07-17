'use client';

import { useState } from "react";

import { ArrowDown, HeartPulse, Pencil } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import dashStyle from "@/styles/daily/dash.module.css";

import Card from "@/app/_components/ui/Card";
import Button, { ButtonIcon } from "@/app/_components/ui/Button";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import Input from "@/app/_components/ui/Input";

export default function Page(){
  const [openHeight, setOpenHeight] = useState(false);
  const [openGoal, setOpenGoal] = useState(false);

  function handleOpenHeight() {
    setOpenHeight(true);
  }
  function handleOpenGoal() {
    setOpenGoal(true);
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
                <ButtonIcon onClick={handleOpenHeight}>
                  <Pencil />
                </ButtonIcon>
              </div>
            </Card.Item>
            <Card.Item title="목표체중">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>65.0</span>
                <span className={commonStyle.dataUnit}>kg</span>
                <ButtonIcon onClick={handleOpenGoal}>
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
          <Card.Grid columns={1}>
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
        open={openHeight}
        title="키"
        onClose={() => setOpenHeight(false)}>
          <div className={formStyle.formWrapper}>
            <div className={formStyle.formGroup}>
              <Input unit="cm" type="number" id="newHeight" name="newHeight" required />
            </div>
            <Button type="button" variant="primary" size="large" onClick={() => {}} disabled>
              기록
            </Button>
          </div>
      </BottomSheet>


      <BottomSheet
        open={openGoal}
        title="목표 체중"
        onClose={() => setOpenGoal(false)}>
          <div className={formStyle.formWrapper}>
            <div className={formStyle.formGroup}>
              <Input unit="kg" type="number" id="goalWeight" name="goalWeight" required />
            </div>
            <Button type="button" variant="primary" size="large" onClick={() => {}} disabled>
              기록
            </Button>
          </div>
      </BottomSheet>
    </section>
  )
}
