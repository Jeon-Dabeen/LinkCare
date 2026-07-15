'use client';


import { HeartPulse } from "lucide-react";
import commonStyle from "@/styles/common.module.css";

import Tabs from "@/app/_components/ui/Tabs";
import Card from "@/app/_components/ui/Card";

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
          </Card>
        </Tabs.Content>
        <Tabs.Content value="evening">
          저녁 혈압<br />
          110/70 mmHg
        </Tabs.Content>
      </Tabs>
      
    </section>
  )
}
