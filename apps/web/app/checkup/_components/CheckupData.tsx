import Link from "next/link";
import clsx from "clsx";

import { Bean, BookHeart, Droplet, FlaskRound, HeartPulse } from "lucide-react";

import commonStyle from "@/styles/common.module.css";
import styles from "@/styles/checkup/checkupDash.module.css";

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
}

export function CheckupData({
  id,
  body_metrics,
  blood_pressure,
  diabetes_anemia,
  liver,
  kidney,
  assessment,
}: CheckupDashBoardResponse) {
  // TODO: Gender 하드코딩 수정해야 함!
  const gender = "female"; // 임시 성별 코드

  // blood pressure (안전성을 위해 Optional Chaining 및 기본값 처리)
  const bp = assessment?.bp
    ? assessment.bp.split("/").map((d: string) => d.split(":")[1])
    : [];
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
    <>
      <Grid.ItemFull>
        <Link href="/checkup/bodyMetrics">
          <Card>
            <Card.Header icon={<BookHeart />} title="신체 지표" />
            <Card.Body noTopPadding>
              <Card.Grid>
                <Card.Item>
                  <GaugeChart
                    key={assessment.bmi}
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
                    <span className={commonStyle.dataUnit}>kg/㎡</span>
                  </div>
                </Card.Item>
                <div className={styles.basicValues}>
                  <div
                    className={clsx(commonStyle.dataWrapper, commonStyle.jfEnd)}
                  >
                    <span className={commonStyle.dataValue}>
                      {body_metrics.height}
                    </span>
                    <span className={commonStyle.dataUnit}>cm</span>
                  </div>
                  <div
                    className={clsx(commonStyle.dataWrapper, commonStyle.jfEnd)}
                  >
                    <span className={commonStyle.dataValue}>
                      {body_metrics.weight}
                    </span>
                    <span className={commonStyle.dataUnit}>kg</span>
                  </div>
                  <div
                    className={clsx(commonStyle.dataWrapper, commonStyle.jfEnd)}
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

      <Grid.Link href="/checkup/bloodPressure">
        <Card>
          <Card.Header icon={<HeartPulse />} title="혈압" />
          <Card.Body noTopPadding>
            <GaugeChart
              key={bpStatus}
              levels={["low", "normal", "caution", "warning", "danger"]}
              status={bpStatus as StatusType}
              value={getStatusTypeLabel(
                bpStatusTypeLabel,
                bpStatus as StatusType,
              )}
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

      <Grid.Link href="/checkup/diabetesAnemia">
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

      <Grid.Link href="/checkup/kidney">
        <Card>
          <Card.Header icon={<Bean />} title="신장" />
          <div className={styles.dataList}>
            <dl className={styles.dataItem}>
              <dt className={styles.mainItemLabel}>여과율</dt>
              <dd className={styles.value}>{kidney.egfr}</dd>
            </dl>
            <BarChart level={assessment.egfr} position={egfrBarChartPosition} />
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
            label={getStatusTypeLabel(commonStatusTypeLabel, kidneyTotalStatus)}
          />
        </Card>
      </Grid.Link>

      <Grid.Link href="/checkup/liver">
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
            label={getStatusTypeLabel(commonStatusTypeLabel, liverTotalStatus)}
          />
        </Card>
      </Grid.Link>
    </>
  );
}
