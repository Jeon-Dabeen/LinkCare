



'use client';


import { Ear, Eye, HeartPulse, Hospital } from "lucide-react";
import commonStyle from "@/styles/common.module.css";

import Tabs from "@/app/_components/ui/Tabs";
import Card from "@/app/_components/ui/Card";
import { ButtonQuestion } from "@/app/_components/ui/Button";
import StatusTag from "@/app/_components/ui/StatusTag";
import clsx from "clsx";
import Tooltip from "@/app/_components/ui/ToolTip";
import { useRef, useState } from "react";

export default function Page(){

  const btnTooltipRef = useRef<HTMLButtonElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);



  return (
    <section className={commonStyle.mainContent}>

      <header className={commonStyle.pageTitleWrapper}>
        <div className={commonStyle.left}>
          <h2 className={commonStyle.pageTitle}>신체 기본 지표</h2>
        </div>
      </header>

      <Tabs defaultValue="year2026">
        <Tabs.Nav>
          <Tabs.NavItem value="year2024" title="2024" />
          <Tabs.NavItem value="year2025" title="2025" />
          <Tabs.NavItem value="year2026" title="2026" />
        </Tabs.Nav>

        <Tabs.Content value="year2025">
          <Card>
            <Card.Header 
              icon={<Hospital />}
              title="BMI"
              left={<ButtonQuestion ref={btnTooltipRef} />}
            />
            <Card.Body>
              <div>22.4 BMI & chart</div>
            </Card.Body>
          </Card>
        </Tabs.Content>
        
        <Tabs.Content value="year2026">
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
            <Card.Body>
              <Card.Grid>
                <div>
                  22.4 BMI &&&&
                  chart
                </div>
              </Card.Grid>
              <Card.Grid columns={3} topDivider leftDivider>
                <Card.Item title="키">
                  <div className={commonStyle.dataWrapper}>
                    <span className={commonStyle.dataValue}>173</span>
                    <span className={commonStyle.dataUnit}>cm</span>
                  </div>
                </Card.Item>
                <Card.Item title="체중">
                  <div className={commonStyle.dataWrapper}>
                    <span className={commonStyle.dataValue}>62.5</span>
                    <span className={commonStyle.dataUnit}>kg</span>
                  </div>
                  <StatusTag />
                </Card.Item>
                <Card.Item title="허리둘레">
                  <div className={commonStyle.dataWrapper}>
                    <span className={commonStyle.dataValue}>55.8</span>
                    <span className={commonStyle.dataUnit}>cm</span>
                  </div>
                  <StatusTag status="warning" />
                </Card.Item>
              </Card.Grid>
              <Card.Grid topDivider leftDivider>
                <Card.Item>
                  <Card.Header
                    icon={<Eye />}
                    title="시력"
                    noPadding
                  />
                  <div className={clsx(
                    commonStyle.dataWrapper,
                    commonStyle.jfCenter
                  )}>
                    <span className={commonStyle.dataLabel}>L</span>
                    <span className={commonStyle.dataValue}>1.0</span>
                    <span className={commonStyle.dataLabel}>R</span>
                    <span className={commonStyle.dataValue}>0.8</span>
                  </div>
                </Card.Item>
                <Card.Item>
                  <Card.Header
                    icon={<Ear />}
                    title="청력"
                    noPadding
                  />
                  <div className={clsx(
                    commonStyle.dataWrapper,
                    commonStyle.jfCenter
                  )}>
                    <span className={commonStyle.dataLabel}>L</span>
                    <span className={commonStyle.dataValue}>정상</span>
                    <span className={commonStyle.dataLabel}>R</span>
                    <span className={commonStyle.dataValue}>정상</span>
                  </div>
                </Card.Item>
              </Card.Grid>
            </Card.Body>
          </Card>
        </Tabs.Content>
      </Tabs>
      
      <Card>
        <Card.Body>
          <div>chart 들어갈거예용</div>
          <div className={commonStyle.infoBox}>체중과 허리둘레 버튼을 클릭하면 각각의 그래프를 껐다켰다 할 수 있어요!</div>
        </Card.Body>
      </Card>


      <Tooltip
        targetRef={btnTooltipRef}
        open={tooltipOpen}
        onClose={() => setTooltipOpen(false)}
      >
        BMI: 체중을 키의 제곱으로 나눈 값이에요. 체지방의 양을 추정하고 비만도를 평가하는 지표에요.
        <br/>
        허리둘레는 체중과 비례하는 경우가 대부분이지만 내장 지방 확인을 위해서 BMI가 정상이라고 하더라도 확인하시는게 좋아요.
      </Tooltip>
    </section>
  )
}
