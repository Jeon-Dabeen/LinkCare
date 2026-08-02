import Link from "next/link";
import clsx from "clsx";

import {
  Bean,
  BookHeart,
  CirclePlus,
  Droplet,
  FlaskRound,
  HeartPulse,
  MessageSquareCheck,
  Ruler,
} from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import styles from "@/styles/checkup/checkupDash.module.css";

import Button from "@/app/_components/ui/Button";
import Grid from "@/app/_components/ui/Grid";
import Card from "@/app/_components/ui/Card";
import StatusTag from "@/app/_components/ui/StatusTag";
import GaugeChart from "@/app/_components/ui/chart/guageChart";
import BarChart from "@/app/_components/ui/chart/barChart";
import {
  bmiStatusTypeLabel,
  bpStatusTypeLabel,
  commonStatusTypeLabel,
  getStatusTypeLabel,
  StatusType,
} from "@/types/statusType";
import {
  getBarPercentage,
  getEgfrBarPercentage,
} from "@/utils/checkupBarRange";

import CheckupRange from "@/utils/checkup-range.json";
import { ENV } from "@/env";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface CheckupDashBoardResponse {
  id: number;
  body_metrics: {
    height: number;
    weight: number;
    waist: number;
    bmi: number;
    visionLeft: number;
    visionRight: number;
    hearing: number;
  };
  blood_pressure: {
    bp_systolic: number;
    bp_diastolic: number;
  };
  diabetes_anemia: {
    fbg: number;
    hemoglobin: number;
  };
  liver: {
    ast: number;
    alt: number;
    ygtp: number;
  };
  kidney: {
    urine_protein: number;
    creatinine: number;
    egfr: number;
  };
  assessment: {
    id: number;
    bmi: StatusType;
    bp: string;
    urine_protein: StatusType;
    hemoglobin: StatusType;
    fbg: StatusType;
    egfr: StatusType;
    ast: StatusType;
    alt: StatusType;
    ygtp: StatusType;
  };
  aiComment?: {
    id: number;
    comment: string;
  };
}

async function fetchCheckupWithRetry(token: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(`${ENV.API_URL}/checkup`, {
      headers: { Cookie: `access_token=${token}` },
    });

    if (response.ok) return response;

    if (response.status === 500 && i < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 0.5초 대기 후 재시도
      continue;
    }

    return response;
  }
}

export default async function Page() {
  // TODO: Gender 하드코딩 수정해야 함!
  const gender = "female"; // 임시 성별 코드

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (token === undefined) redirect("/auth/login");

  const response = await fetchCheckupWithRetry(token);

  if (!response) throw new Error("Server Error");

  if (!response.ok) {
    if (response.status === 401) redirect("/auth/login");
    if (response.status === 404) redirect("/checkup/upload");

    throw new Error(`검진 결과 조회 실패: ${response.status}`);
  }

  const json = await response.json();

  if (!json.data) {
    throw new Error("응답에 데이터가 없습니다");
  }

  const data: CheckupDashBoardResponse = json.data;
  const {
    body_metrics,
    blood_pressure,
    diabetes_anemia,
    liver,
    kidney,
    assessment,
    aiComment,
  } = data;

  const comments = aiComment.comment.split("\n\n");

  // blood pressure
  const bp = assessment.bp.split("/").map((d: string) => d.split(":")[1]);
  const bpStatus = bp[0] === "normal" ? bp[1] : bp[0];

  // diabetes & anemia
  const fbgBarChartPosition = getBarPercentage(
    diabetes_anemia.fbg,
    CheckupRange.fbg,
  );

  let hemoglobinAssessment = assessment.hemoglobin;
  if (hemoglobinAssessment === "normal") {
    hemoglobinAssessment =
      diabetes_anemia.hemoglobin > CheckupRange.hemoglobin[gender].normal.max
        ? "danger"
        : hemoglobinAssessment;
  }
  const hemoglobinBarChartPosition = getBarPercentage(
    diabetes_anemia.hemoglobin,
    CheckupRange.hemoglobin[gender],
    true,
  );

  // kidney
  const kidneyTotalStatus =
    assessment.egfr === "danger" ? assessment.egfr : assessment.urine_protein;

  const egfrBarChartPosition = getEgfrBarPercentage(kidney.egfr);

  // liver
  const LIVER_ORDER = ["normal", "warning", "danger"];
  const liverAssessments = {
    ast: assessment.ast,
    alt: assessment.alt,
    ygtp: assessment.ygtp,
  };
  const liverTotalStatus = Object.values(liverAssessments).reduce((worst, g) =>
    LIVER_ORDER.indexOf(g) > LIVER_ORDER.indexOf(worst) ? g : worst,
  );

  const altBarChartPosition = getBarPercentage(liver.alt, CheckupRange.alt);

  return (
    <section className={commonStyle.mainContent}>
      <header className={commonStyle.pageTitleWrapper}>
        <div className={commonStyle.left}>
          <h2 className={commonStyle.pageTitle}>건강검진</h2>
        </div>
        <div className={commonStyle.right}>
          <Link href="/checkup/upload">
            <Button variant="text-primary">
              <CirclePlus />
              <span>건강검진 데이터 추가</span>
            </Button>
          </Link>
        </div>
      </header>

      <Grid>
        <Grid.ItemFull>
          <Card variant="color">
            <Card.Header icon={<MessageSquareCheck />} title={comments[1]} />
            <Card.Body noTopPadding>
              <div className={styles.aiComment}>
                {comments[0].replace("\n", " ")}
              </div>
            </Card.Body>
          </Card>
        </Grid.ItemFull>

        <Grid.ItemFull>
          <Link href="/checkup/basic">
            <Card>
              <Card.Header icon={<BookHeart />} title="신체 기본 지표" />
              <Card.Body noTopPadding>
                <Card.Grid>
                  <Card.Item>
                    <GaugeChart
                      key={body_metrics.bmi}
                      levels={["low", "normal", "warning", "danger"]}
                      status={assessment.bmi}
                      value={getStatusTypeLabel(
                        bmiStatusTypeLabel,
                        assessment.bmi,
                      )}
                    />
                    <div
                      className={clsx(
                        commonStyle.dataWrapper,
                        commonStyle.jfCenter,
                      )}
                    >
                      <span className={commonStyle.dataValue}>
                        {body_metrics.bmi}
                      </span>
                      <span className={commonStyle.dataUnit}>BMI</span>
                    </div>
                  </Card.Item>
                  <div className={styles.basicValues}>
                    <div
                      className={clsx(
                        commonStyle.dataWrapper,
                        commonStyle.jfEnd,
                      )}
                    >
                      <span className={commonStyle.dataValue}>
                        {body_metrics.height}
                      </span>
                      <span className={commonStyle.dataUnit}>cm</span>
                    </div>
                    <div
                      className={clsx(
                        commonStyle.dataWrapper,
                        commonStyle.jfEnd,
                      )}
                    >
                      <span className={commonStyle.dataValue}>
                        {body_metrics.weight}
                      </span>
                      <span className={commonStyle.dataUnit}>kg</span>
                    </div>
                    <div
                      className={clsx(
                        commonStyle.dataWrapper,
                        commonStyle.jfEnd,
                      )}
                    >
                      <span className={commonStyle.dataLabel}>L</span>
                      <span className={commonStyle.dataValue}>
                        {body_metrics.visionLeft}
                      </span>
                      <span className={commonStyle.dataSeparator}>/</span>
                      <span className={commonStyle.dataLabel}>R</span>
                      <span className={commonStyle.dataValue}>
                        {body_metrics.visionRight}
                      </span>
                    </div>
                  </div>
                </Card.Grid>
              </Card.Body>
            </Card>
          </Link>
        </Grid.ItemFull>

        <Grid.Link href="/checkup/basic">
          <Card>
            <Card.Header icon={<HeartPulse />} title="혈압" />
            <Card.Body noTopPadding>
              <GaugeChart
                key={blood_pressure.bp_systolic}
                levels={["low", "normal", "caution", "warning", "danger"]}
                status={bpStatus}
                value={getStatusTypeLabel(bpStatusTypeLabel, bpStatus)}
              />
              <div
                className={clsx(commonStyle.dataWrapper, commonStyle.jfCenter)}
              >
                <span className={commonStyle.dataValue}>
                  {blood_pressure.bp_systolic}
                </span>
                <span className={commonStyle.dataSeparator}>/</span>
                <span className={commonStyle.dataValue}>
                  {blood_pressure.bp_diastolic}
                </span>
                <span className={commonStyle.dataUnit}>mmHg </span>
              </div>
            </Card.Body>
          </Card>
        </Grid.Link>

        <Grid.Link href="/checkup/basic">
          <Card>
            <Card.Header icon={<Droplet />} title="빈혈/혈당" />
            <div className={styles.dataList}>
              <dl className={styles.dataItem}>
                <dt className={styles.label}>빈혈</dt>
                <dd className={styles.value}>{diabetes_anemia.hemoglobin}</dd>
              </dl>
              <BarChart
                level={hemoglobinAssessment}
                position={hemoglobinBarChartPosition}
              />
              <dl className={styles.dataItem}>
                <dt className={styles.label}>혈당</dt>
                <dd className={styles.value}>{diabetes_anemia.fbg}</dd>
              </dl>
              <BarChart level={assessment.fbg} position={fbgBarChartPosition} />
            </div>
          </Card>
        </Grid.Link>

        <Grid.Link href="/checkup/basic">
          <Card>
            <Card.Header icon={<Bean />} title="신장" />
            <div className={styles.dataList}>
              <dl className={styles.dataItem}>
                <dt className={styles.mainItemLabel}>여과율</dt>
                <dd className={styles.value}>{kidney.egfr}</dd>
              </dl>
              <BarChart
                level={assessment.egfr}
                position={egfrBarChartPosition}
              />
              <Card.Grid columns={1}>
                <Card.Item title="요단백">
                  <div className={commonStyle.dataWrapper}>
                    <span className={commonStyle.dataValue}>
                      {kidney.urine_protein}
                    </span>
                  </div>
                </Card.Item>
              </Card.Grid>
            </div>
            <StatusTag
              status={kidneyTotalStatus}
              label={getStatusTypeLabel(
                commonStatusTypeLabel,
                kidneyTotalStatus,
              )}
            />
          </Card>
        </Grid.Link>

        <Grid.Link href="/checkup/basic">
          <Card>
            <Card.Header icon={<FlaskRound />} title="간" />
            <div className={styles.dataList}>
              <dl className={styles.dataItem}>
                <dt className={styles.mainItemLabel}>ALT</dt>
                <dd className={styles.value}>{liver.alt}</dd>
              </dl>
              <BarChart level={assessment.alt} position={altBarChartPosition} />
              <Card.Grid columns={2} leftDivider>
                <Card.Item title="AST">
                  <div className={commonStyle.dataWrapper}>
                    <span className={commonStyle.dataValue}>{liver.ast}</span>
                  </div>
                </Card.Item>
                <Card.Item title="y-GTP">
                  <div className={commonStyle.dataWrapper}>
                    <span className={commonStyle.dataValue}>{liver.ygtp}</span>
                  </div>
                </Card.Item>
              </Card.Grid>
            </div>
            <StatusTag
              status={liverTotalStatus}
              label={getStatusTypeLabel(
                commonStatusTypeLabel,
                liverTotalStatus,
              )}
            />
          </Card>
        </Grid.Link>
      </Grid>
    </section>
  );
}
