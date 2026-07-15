

import clsx from "clsx";
import { HeartPulse, Droplet, Salad, ShieldCheck } from "lucide-react";
import commonStyle from "@/styles/common.module.css";

import Grid from "../_components/ui/Grid";
import Card from '@/app/_components/ui/Card';


export default function Home(){


  return (
    <section className={commonStyle.mainContent}>
      HOME


      <Grid>
        <Card>
          <Card.Header 
            icon={<HeartPulse />}
            right="07.07"
          />
          <Card.Body>
            혈압<br/>혈압
          </Card.Body>
        </Card>
        <Card>
          <Card.Header 
            icon={<Droplet />}
            right="TODAY"
          />
          <Card.Body>
            혈당
          </Card.Body>
        </Card>
        <Grid.ItemFull>
          <Card>
            <Card.Header 
              icon={<Salad />}
              title="식사 다이어리"
            />
            <Card.Body>
              test
            </Card.Body>
          </Card>
        </Grid.ItemFull>
      </Grid>

      <Card variant="color">
        <Card.Body>
          체중
        </Card.Body>
      </Card>

      <Card>
        <Card.Header 
          icon={<ShieldCheck />}
          title="데일리 쉴드 생성" 
        />
      </Card>
    </section>
  )
}
