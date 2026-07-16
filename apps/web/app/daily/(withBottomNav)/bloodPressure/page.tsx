'use client';


import { ArrowDown, HeartPulse, Pencil } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import dashStyle from "@/styles/daily/dash.module.css";

import Tabs from "@/app/_components/ui/Tabs";
import Card from "@/app/_components/ui/Card";
import { ButtonIcon } from "@/app/_components/ui/Button";
import clsx from "clsx";

export default function Page(){

  return (
    <section className={commonStyle.mainContent}>

      <Tabs defaultValue="evening">
        <Tabs.Nav>
          <Tabs.NavItem value="morning" title="아침" />
          <Tabs.NavItem value="evening" title="저녁" />
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
                <div className={dashStyle.dashWrapper}>
                  <div className={dashStyle.current}>
                    <span className={dashStyle.value}>110</span>
                    <span className={dashStyle.separator}>/</span>
                    <span className={dashStyle.value}>70</span>
                    <span className={dashStyle.unit}>mmHg</span>
                    <div className={dashStyle.buttonArea}>
                      <ButtonIcon color="primary">
                        <Pencil />
                      </ButtonIcon>
                    </div>
                  </div>
                  <div className={clsx(
                    dashStyle.dashStatus,
                    dashStyle.normal
                    // dashStyle.warning 
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
              right="07-11"
            />
            <Card.Body>
                <div>저녁 혈압 수치....</div>
            </Card.Body>
          </Card>
        </Tabs.Content>
      </Tabs>
      
    </section>
  )
}
