import { BookHeart, CirclePlus, Droplet, FlaskRound, HeartPulse, MessageSquareCheck, Ruler } from "lucide-react"
import commonStyle from "@/styles/common.module.css";

import Button from "@/app/_components/ui/Button";
import Grid from "@/app/_components/ui/Grid";
import Card from "@/app/_components/ui/Card";
import StatusTag from "@/app/_components/ui/StatusTag";


export default function Page(){

  return (
    <section className={commonStyle.mainContent}>
      <header className={commonStyle.pageTitleWrapper}>
        <div className={commonStyle.left}>
          <h2 className={commonStyle.pageTitle}>건강검진</h2>
        </div>
        <div className={commonStyle.right}>
          <Button variant="text-primary">
            <CirclePlus />
            <span>건강검진 데이터 추가</span>
          </Button>
        </div>
      </header>

      <Grid>
        <Grid.ItemFull>
          <Card variant="color">
            <Card.Header 
              icon={<MessageSquareCheck />}
            />
            <Card.Body>
              <p className={commonStyle.messageTitle}>면역력에는 운동이 필수죠!</p>
              <div>균형잡힌 식사와 운동으로 정상체중을 유지하시기 바랍니다. 검진결과 LDL 콜레스테롤 수치는 정상입니다. B형간염 항체 양성으로 면역력을 보유하고 있습니다.
              </div>
            </Card.Body>
          </Card>
        </Grid.ItemFull>

        <Grid.ItemFull>
          <Card>
            <Card.Header 
              icon={<BookHeart />}
              title="신체 기본 지표"
            />
            <Card.Body>
              키, 체중, 시력...
            </Card.Body>
          </Card>
        </Grid.ItemFull>

        <Card>
          <Card.Header 
            icon={<Droplet />}
            title="빈혈/혈당"
          />
          <Card.Body>
            빈혈 11, 혈당 60
          </Card.Body>
        </Card>

        <Card>
          <Card.Header 
            icon={<Ruler />}
            title="신장"
          />
          <Card.Body>
            170cm
          </Card.Body>
        </Card>

        <Card>
          <Card.Header 
            icon={<FlaskRound />}
            title="간"
          />
          <Card.Body>
            ALT : 32, AST: 60
          </Card.Body>
          <StatusTag status="normal" />
        </Card>

        <Card>
          <Card.Header 
            icon={<HeartPulse />}
            title="혈압"
          />
          <Card.Body>
            110/70mmHg 90bpm
          </Card.Body>
          <StatusTag status="warning" />
        </Card>

      </Grid>

    </section>
  )
}
