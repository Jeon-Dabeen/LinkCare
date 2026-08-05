"use client";

import formStyle from "@/styles/components/form.module.css";
import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, HeartPulse, Pencil } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import dashStyle from "@/styles/daily/dash.module.css";
import Card from "@/app/_components/ui/Card";
import WeightRegisterForm from "../../_components/WeightRegisterForm";
import StatePage from "@/app/_components/ui/StatePage";
import {
  bmiStatusTypeLabel,
  getStatusTypeLabel,
  type StatusType,
} from "@/types/statusType";
import GaugeChart from "@/app/_components/ui/chart/guageChart";
import WeightWeekChart from "../../_components/WeightWeekChart";
import MonthCalendar from "@/app/_components/ui/calendar/MonthCalendar";
import Button, {
  ButtonIcon,
  ButtonQuestion,
} from "@/app/_components/ui/Button";
import { getBmiStatus } from "@/utils/dailyStatus";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import Input from "@/app/_components/ui/Input";
import { ENV } from "@/env";
import Tooltip from "@/app/_components/ui/ToolTip";
import clsx from "clsx";
import CalendarLegend from "@/app/_components/ui/calendar/CalendarLegend";

interface WeightProfile {
  height: number | null;
  goalWeight: number | null;
  goalWeightState: "-" | "+" | "0" | null;
}

//체중 기록
interface WeightRecord {
  weightDate: string;
  weight: number;
  bmi: number | null;
}

//7일
interface WeekWeightResponse {
  profile: WeightProfile;
  weights: WeightRecord[];
}

//달력
interface MonthWeightRecord {
  weightDate: string;
  bmi: number | null;
}

//달력용 데이터
type CalendarData = { [date: string]: { status: StatusType } };

const BMI_LEVELS: StatusType[] = ["low", "normal", "warning", "danger"];

//달력용 bmi 데이터
function makeCalendarData(records: MonthWeightRecord[]) {
  const result: CalendarData = {};

  records.forEach((record) => {
    const status = getBmiStatus(record.bmi);

    if (!status) {
      return;
    }
    //포멧변환
    const date = record.weightDate.slice(0, 10);

    result[date] = { status };
  });

  return result;
}

export default function Page() {
  const { formattedDate, baseDate } = useBaseDate(); //날짜

  //에러
  const [weekError, setWeekError] = useState<string | null>(null);
  const [monthError, setMonthError] = useState<string | null>(null);

  //받아오는 데이터들
  const [profile, setProfile] = useState<WeightProfile | null>(null);
  const [weekWeights, setWeekWeights] = useState<WeightRecord[]>([]);
  const [monthWeights, setMonthWeights] = useState<MonthWeightRecord[]>([]);

  //바텀시트
  const [openGoal, setOpenGoal] = useState(false);
  const [openTodayWeight, setOpenTodayWeight] = useState(false);

  //바텀시트에 연결하는 input
  const [newWeight, setNewWeight] = useState("");
  const [newGoalWeight, setNewGoalWeight] = useState("");

  // 툴팁
  const btnTooltipRef = useRef<HTMLButtonElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  //로딩
  const [weekLoading, setWeekLoading] = useState(true);
  const [monthLoading, setMonthLoading] = useState(true);
  //제출중 상태
  const [submitting, setSubmitting] = useState(false);

  //1회성 건너뛰기
  const [skipped, setSkipped] = useState(false);

  //7일 조회
  //체중 등록, 목표체중 수정 후에도 다시 사용
  const fetchWeekWeights = useCallback(async () => {
    setWeekLoading(true);
    setWeekError(null);
    try {
      const response = await fetch(
        `${ENV.API_URL}/weight/week?weightDate=${formattedDate}`,
        { credentials: "include" },
      );
      if (!response.ok) {
        throw new Error(`주간 체중 조회 실패: ${response.status}`);
      }
      const data: WeekWeightResponse = await response.json();

      setWeekWeights(data.weights);
      setProfile(data.profile);
    } catch (error) {
      console.error("주간 체중 조회 오류:", error);

      setWeekError("체중 정보를 불러오지 못했어요.");
    } finally {
      setWeekLoading(false);
    }
  }, [formattedDate]);

  //월간조회

  const fetchMonthWeights = useCallback(async () => {
    setMonthLoading(true);
    setMonthError(null);

    try {
      const response = await fetch(
        `${ENV.API_URL}/weight/month?date=${formattedDate}`,
        { credentials: "include" },
      );
      if (!response.ok) {
        throw new Error(`월간 BMI 조회 실패: ${response.status}`);
      }

      const data: MonthWeightRecord[] = await response.json();
      setMonthWeights(data);
    } catch (error) {
      console.error("월간 BMI 조회 오류:", error);

      setMonthError("BMI 기록을 불러오지 못했어요.");
    } finally {
      setMonthLoading(false);
    }
  }, [formattedDate]);

  //날짜가 변경될 때 주간 기록 조회
  useEffect(() => {
    void fetchWeekWeights();
  }, [fetchWeekWeights]);

  //날짜가 변경될 때 월간 기록 조회
  useEffect(() => {
    void fetchMonthWeights();
  }, [fetchMonthWeights]);

  //바텀시트 오늘 체중 등록
  async function handleCreateTodayWeight() {
    if (submitting || newWeight.trim() === "") {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${ENV.API_URL}/weight`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weight: Number(newWeight),
          weightDate: formattedDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`체중 등록 실패: ${response.status}`);
      }

      setNewWeight("");
      setOpenTodayWeight(false);

      //서버에서 주간, 월간 기록 재조회
      await Promise.all([fetchWeekWeights(), fetchMonthWeights()]);
    } catch (error) {
      console.error("체중 등록 오류:", error);
    } finally {
      setSubmitting(false);
    }
  }

  //바텀시트 목표 체중 수정
  async function handleUpdateGoalWeight() {
    if (submitting || newGoalWeight.trim() === "") {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${ENV.API_URL}/weight/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goalWeight: Number(newGoalWeight),
        }),
      });

      if (!response.ok) {
        throw new Error(`목표체중 수정 실패: ${response.status}`);
      }

      setNewGoalWeight("");
      setOpenGoal(false);

      //주간 API에 프로필이 포함되어 있으므로 재조회
      await fetchWeekWeights();
    } catch (error) {
      console.error("목표체중 수정 오류:", error);
    } finally {
      setSubmitting(false);
    }
  }

  //바텀시트 닫기
  function handleCloseWeight() {
    setNewWeight("");
    setOpenTodayWeight(false);
  }

  function handleCloseGoalWeight() {
    setNewGoalWeight("");
    setOpenGoal(false);
  }

  //로딩
  //7일로딩
  if (weekLoading) {
    return (
      <StatePage
        open={true}
        title="체중 정보를 불러오고 있어요"
        description={
          <>
            체중 기록을 불러오고 있어요.
            <br />
            잠시만 기다려주세요.
          </>
        }
      />
    );
  }

  //7일 기록 조회 오류
  if (weekError) {
    return (
      <section className={commonStyle.mainContent}>
        <p>{weekError}</p>
      </section>
    );
  }

  //2026-07-20 형태로 응답을 잘라서 formattedDate와 일치하는것을 찾음
  const todayWeight = weekWeights.find(
    (day) => day.weightDate.slice(0, 10) === formattedDate,
  );

  //bmi차트
  const bmiStatus = getBmiStatus(todayWeight?.bmi);

  //월간bmi를 달력데이터로 변경
  const calendarData = makeCalendarData(monthWeights);

  //입력폼 띄울지 여부
  const needsRegister = !todayWeight;

  //체중 값만 저장
  const weekWeightValues = weekWeights.map(
    (WeightRecord) => WeightRecord.weight,
  );

  //최소, 최대값 계산, 주간기록 없을시 null
  const minWeight =
    weekWeightValues.length > 0 ? Math.min(...weekWeightValues) : null;
  const maxWeight =
    weekWeightValues.length > 0 ? Math.max(...weekWeightValues) : null;

  //최대 최소의 차
  const weightGap =
    maxWeight != null && minWeight != null ? maxWeight - minWeight : null;

  const headerDate = todayWeight ? "TODAY" : formattedDate.slice(5);

  //목표까지 표시
  let goalMessage = "";

  if (todayWeight) {
    const goalWeight = profile?.goalWeight;
    const goalWeightState = profile?.goalWeightState;

    if (goalWeight != null) {
      const untilGoal = Math.abs(goalWeight - todayWeight.weight).toFixed(1);

      if (goalWeightState === "-") {
        goalMessage = `목표까지 -${untilGoal}kg`;
      }
      if (goalWeightState === "+") {
        goalMessage = `목표까지 +${untilGoal}kg`;
      }
      if (goalWeightState === "0") {
        goalMessage = "목표달성";
      }
    }
  }

  //입력폼 띄우기
  //오늘 체중이 없고 건너뛰지 않은 상태
  if (needsRegister && !skipped) {
    return (
      <WeightRegisterForm
        formattedDate={formattedDate}
        existGoalWeight={profile?.goalWeight ?? null}
        onSkip={() => setSkipped(true)} //함수를 RegisterForm으로 보냈음
        onSuccess={async () => {
          //재조회
          await Promise.all([fetchWeekWeights(), fetchMonthWeights()]);
        }}
      />
    );
  }

  return (
    <section className={commonStyle.mainContent}>
      <Card>
        <Card.Header
          icon={<HeartPulse />}
          title="체중"
          left={
            <ButtonQuestion
              ref={btnTooltipRef}
              onClick={() => setTooltipOpen(true)}
            />
          }
          right={headerDate}
        />
        <Card.Body noTopPadding>
          <Card.Grid>
            <div className={dashStyle.dashWrapper}>
              <div className={dashStyle.current}>
                <span className={dashStyle.value}>
                  {todayWeight?.weight ?? "-"}
                </span>
                <span className={dashStyle.unit}>kg</span>
                {!todayWeight && (
                  <div className={dashStyle.buttonArea}>
                    <ButtonIcon
                      color="primary"
                      onClick={() => setOpenTodayWeight(true)}
                    >
                      <Pencil />
                    </ButtonIcon>
                  </div>
                )}
              </div>
              {goalMessage && (
                <div className={dashStyle.dashBox}>
                  {profile?.goalWeightState === "-" && <ArrowDown size={16} />}

                  {profile?.goalWeightState === "+" && <ArrowUp size={16} />}
                  <span>{goalMessage}</span>
                </div>
              )}
            </div>
            <div>
              <GaugeChart
                key={todayWeight?.bmi}
                levels={BMI_LEVELS}
                status={bmiStatus}
                value={getStatusTypeLabel(bmiStatusTypeLabel, bmiStatus)}
              />
              <div
                className={clsx(commonStyle.dataWrapper, commonStyle.jfCenter)}
              >
                <span className={commonStyle.dataValue}>
                  {todayWeight?.bmi}
                </span>
                <span className={commonStyle.dataUnit}>kg/㎡</span>
              </div>
            </div>
          </Card.Grid>
          <Card.Grid topDivider leftDivider>
            <Card.Item title="키">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>
                  {profile?.height ?? "-"}
                </span>
                <span className={commonStyle.dataUnit}>cm</span>
              </div>
            </Card.Item>
            <Card.Item title="목표체중">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>
                  {profile?.goalWeight ?? "-"}
                </span>
                <span className={commonStyle.dataUnit}>kg</span>
                <ButtonIcon onClick={() => setOpenGoal(true)}>
                  <Pencil />
                </ButtonIcon>
              </div>
            </Card.Item>
          </Card.Grid>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header title="이번 주 체중 추이" />
        <Card.Body noTopPadding>
          <Card.Grid columns={1}>
            <WeightWeekChart baseDate={baseDate} weights={weekWeights} />
          </Card.Grid>
          <Card.Grid columns={2} topDivider leftDivider>
            <Card.Item title="체중 변동">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>
                  {weightGap?.toFixed(2) ?? "-"}
                </span>
                <span className={commonStyle.dataUnit}>kg</span>
              </div>
            </Card.Item>
            <Card.Item title="최저 / 최고">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>
                  {minWeight ?? "-"}
                </span>
                <span className={commonStyle.dataSeparator}>/</span>
                <span className={commonStyle.dataValue}>
                  {maxWeight ?? "-"}
                </span>
                <span className={commonStyle.dataUnit}>kg</span>
              </div>
            </Card.Item>
          </Card.Grid>
        </Card.Body>
      </Card>
      {/* 월간 BMI 달력 */}
      <Card>
        <Card.Header title="BMI 기록" />
        <Card.Body noTopPadding>
          {monthLoading ? (
            <p>BMI 기록을 불러오고 있어요.</p>
          ) : monthError ? (
            <p>{monthError}</p>
          ) : (
            <>
              <MonthCalendar data={calendarData} />
              <CalendarLegend labelMap={bmiStatusTypeLabel} />
            </>
          )}
        </Card.Body>
      </Card>

      <BottomSheet
        open={openTodayWeight}
        title="체중"
        onClose={handleCloseWeight}
      >
        <div className={formStyle.formWrapper}>
          <div className={formStyle.formGroup}>
            <Input
              unit="kg"
              type="number"
              id="newWeight"
              name="newWeight"
              value={newWeight}
              onChange={(event) => setNewWeight(event.target.value)}
              required
            />
          </div>

          <Button
            type="button"
            variant="primary"
            size="large"
            onClick={() => void handleCreateTodayWeight()}
            disabled={newWeight.trim() === "" || submitting}
          >
            {submitting ? "저장중..." : "기록"}
          </Button>
        </div>
      </BottomSheet>

      {/* 목표체중 입력·수정 바텀시트 */}
      <BottomSheet
        open={openGoal}
        title="목표 체중"
        onClose={handleCloseGoalWeight}
      >
        <div className={formStyle.formWrapper}>
          <div className={formStyle.formGroup}>
            <Input
              unit="kg"
              type="number"
              id="goalWeight"
              name="goalWeight"
              value={newGoalWeight}
              onChange={(event) => setNewGoalWeight(event.target.value)}
              required
            />
          </div>

          <Button
            type="button"
            variant="primary"
            size="large"
            onClick={() => void handleUpdateGoalWeight()}
            disabled={newGoalWeight.trim() === "" || submitting}
          >
            {submitting ? "저장중..." : "기록"}
          </Button>
        </div>
      </BottomSheet>

      <Tooltip
        targetRef={btnTooltipRef}
        open={tooltipOpen}
        onClose={() => setTooltipOpen(false)}
      >
        BMI: 체중을 키의 제곱으로 나눈 값이에요. 체지방의 양을 추정하고 비만도를
        평가하는 지표에요.
        <br />
        허리둘레는 체중과 비례하는 경우가 대부분이지만 내장 지방 확인을 위해서
        BMI가 정상이라고 하더라도 확인하시는게 좋아요.
      </Tooltip>
    </section>
  );
}
