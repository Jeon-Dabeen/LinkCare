
import Link from "next/link";
import clsx from "clsx";

import { Bean, BookHeart, CirclePlus, Droplet, FlaskRound, HeartPulse, MessageSquareCheck, Ruler } from "lucide-react"
import commonStyle from "@/styles/common.module.css";
import styles from "@/styles/checkup/checkupDash.module.css";

import Button from "@/app/_components/ui/Button";
import Grid from "@/app/_components/ui/Grid";
import Card from "@/app/_components/ui/Card";
import StatusTag from "@/app/_components/ui/StatusTag";
import GaugeChart from "@/app/_components/ui/chart/guageChart";
import BarChart from "@/app/_components/ui/chart/barChart";


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
            <Card.Body noTopPadding>
              <p className={commonStyle.messageTitle}>면역력에는 운동이 필수죠!</p>
              <div>균형잡힌 식사와 운동으로 정상체중을 유지하시기 바랍니다. 검진결과 LDL 콜레스테롤 수치는 정상입니다. B형간염 항체 양성으로 면역력을 보유하고 있습니다.
              </div>
            </Card.Body>
          </Card>
        </Grid.ItemFull>

        <Grid.ItemFull>
          <Link href="/checkup/basic">
            <Card>
              <Card.Header 
                icon={<BookHeart />}
                title="신체 기본 지표"
              />
              <Card.Body noTopPadding>
                <Card.Grid>
                  <Card.Item>
                    <GaugeChart 
                      key="normal"
                      levels={["low", "normal", "warning", "danger"]}
                      status="normal"
                      value="정상"
                    />
                    <div className={clsx(
                      commonStyle.dataWrapper,
                      commonStyle.jfCenter
                    )}>
                      <span className={commonStyle.dataValue}>22.4</span>
                      <span className={commonStyle.dataUnit}>BMI</span>
                    </div>
                  </Card.Item>
                  <div className={styles.basicValues}>
                    <div className={clsx(
                      commonStyle.dataWrapper,
                      commonStyle.jfEnd,
                    )}>
                      <span className={commonStyle.dataValue}>175.3</span>
                      <span className={commonStyle.dataUnit}>cm</span>
                    </div>
                    <div className={clsx(
                      commonStyle.dataWrapper,
                      commonStyle.jfEnd,
                    )}>
                      <span className={commonStyle.dataValue}>54.42</span>
                      <span className={commonStyle.dataUnit}>kg</span>
                    </div>
                    <div className={clsx(
                      commonStyle.dataWrapper,
                      commonStyle.jfEnd,
                    )}>
                      <span className={commonStyle.dataLabel}>L</span>
                      <span className={commonStyle.dataValue}>1.5</span>
                      <span className={commonStyle.dataSeparator}>/</span>
                      <span className={commonStyle.dataLabel}>R</span>
                      <span className={commonStyle.dataValue}>1.5</span>
                    </div>
                  </div>
                </Card.Grid>
              </Card.Body>
            </Card>
          </Link>
        </Grid.ItemFull>

        <Grid.Link href="/checkup/basic">
          <Card>
            <Card.Header 
              icon={<HeartPulse />}
              title="혈압"
            />
            <Card.Body noTopPadding>
              <GaugeChart 
                key="caution"
                levels={["low", "normal", "caution", "warning", "danger"]}
                status="caution"
                value="주의"
              />
              <div className={clsx(
                commonStyle.dataWrapper,
                commonStyle.jfCenter
              )}>
                <span className={commonStyle.dataValue}>110</span>
                <span className={commonStyle.dataSeparate}>/</span>
                <span className={commonStyle.dataValue}>70</span>
                <span className={commonStyle.dataUnit}>mmHg </span>
                <span className={commonStyle.dataValue}>90</span>
                <span className={commonStyle.dataUnit}>bpm</span>
              </div>
            </Card.Body>
            <StatusTag status="warning" label="위험" />
          </Card>
        </Grid.Link>


        <Grid.Link href="/checkup/basic">
          <Card>
            <Card.Header 
              icon={<Droplet />}
              title="빈혈/혈당"
            />
            <div className={styles.dataList}>
              <dl className={styles.dataItem}>
                <dt className={styles.label}>빈혈</dt>
                <dd className={styles.value}>11</dd>
              </dl>
              <BarChart level="normal" position={45}/>
              <dl className={styles.dataItem}>
                <dt className={styles.label}>혈당</dt>
                <dd className={styles.value}>60</dd>
              </dl>
              <BarChart level="normal" position={45}/>
            </div>
          </Card>
        </Grid.Link>

        <Grid.Link href="/checkup/basic">
          <Card>
            <Card.Header 
              icon={<Bean />}
              title="신장"
            />
            <div className={styles.dataList}>
              <dl className={styles.dataItem}>
                <dt className={styles.label}>여과율</dt>
                <dd className={styles.value}>11</dd>
              </dl>
              <BarChart level="normal" position={45}/>
              <Card.Grid columns={1}>
                <Card.Item title="요단백">
                  <div className={commonStyle.dataWrapper}>
                    <span className={commonStyle.dataValue}>음성</span>
                  </div>
                </Card.Item>
              </Card.Grid>
            </div>
          </Card>
        </Grid.Link>

        <Grid.Link href="/checkup/basic">
          <Card>
            <Card.Header 
              icon={<FlaskRound />}
              title="간"
            />
            <div className={styles.dataList}>
              <dl className={styles.dataItem}>
                <dt className={styles.label}>ALT</dt>
                <dd className={styles.value}>32</dd>
              </dl>
              <BarChart level="caution" position={45}/>
              <Card.Grid columns={2} leftDivider>
                <Card.Item title="AST">
                  <div className={commonStyle.dataWrapper}>
                    <span className={commonStyle.dataValue}>27</span>
                  </div>
                </Card.Item>
                <Card.Item title="y-GTP">
                  <div className={commonStyle.dataWrapper}>
                    <span className={commonStyle.dataValue}>45</span>
                  </div>
                </Card.Item>
              </Card.Grid>
            </div>
            <StatusTag status="caution" label="주의" />
          </Card>
        </Grid.Link>


      </Grid>

    </section>
  )
}
