"use client";
import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, HeartPulse, Pencil } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import dashStyle from "@/styles/daily/dash.module.css";
import Card from "@/app/_components/ui/Card";
import WeightRegisterForm from "../../_components/WeightRegisterForm";
import StatePage from "@/app/_components/ui/StatePage";
import type { StatusType } from "@/types/statusType";
import GaugeChart from "@/app/_components/ui/chart/guageChart";
import WeightWeekChart from "../../_components/WeightWeekChart";
import MonthCalendar from "@/app/_components/ui/calendar/MonthCalendar";
import WeightBottomSheet from "../../_components/WeightBottomSheet";
import HeightBottomSheet from "../../_components/HeightBottomSheet";
import GoalWeightInputBottomSheet from "../../_components/GoalWeightBottomSheet";
import { ButtonIcon } from "@/app/_components/ui/Button";
import { getBmiStatus } from "@/utils/dailyRange";

interface WeightProfile {
  height: number | null;
  goalWeight: number | null;
  goalWeightState: "-" | "+" | "0" | null;
}

//체중
interface WeightRecord {
  weightDate: string;
  weight: number;
  bmi: number | null;
}

interface CreateWeightResponse extends WeightRecord {
  height: number | null;
  goalWeight: number | null;
  goalWeightState: "-" | "+" | "0" | null;
}

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
type CalendarData = {
  [date: string]: {
    status: StatusType;
  };
};

const BMI_LEVELS: StatusType[] = [
  "low",
  "normal",
  "warning",
  "danger",
];

//기존 주간 list에 오늘 체중기록 추가, 오래된날짜부터
function addTodayWeekRecord(
  list: WeightRecord[],
  today: WeightRecord,
): WeightRecord[] {
  return [...list, today].sort((a, b) =>
    a.weightDate.localeCompare(b.weightDate),
  );
}

//월간 list에 오늘 bmi 추가
function addTodayMonthRecord(
  list: MonthWeightRecord[],
  today: MonthWeightRecord,
): MonthWeightRecord[] {
  return [...list, today].sort((a, b) =>
    a.weightDate.localeCompare(b.weightDate),
  );
}

//달력용 데이터
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

export default function Page(){
  const { formattedDate, baseDate } = useBaseDate(); //날짜

  //에러
  const [weekError, setWeekError] = useState<string | null>(null);
  const [monthError,setMonthError]=useState<string|null>(null);
  
  //받아오는 데이터들
  const [profile, setProfile] = useState<WeightProfile | null>(null);
  const [weekWeights, setWeekWeights] = useState<WeightRecord[]>([]);
  const [monthWeights, setMonthWeights] = useState<MonthWeightRecord[]>([]);

  //바텀시트
  const [openHeight, setOpenHeight] = useState(false);
  const [openGoal, setOpenGoal] = useState(false);
  const [openTodayWeight, setOpenTodayWeight] = useState(false);

  //바텀시트에 연결하는 input
  const [newWeight, setNewWeight] = useState("");
  const [newHeight, setNewHeight] = useState("");
  const [newGoalWeight, setNewGoalWeight] = useState("");
  
  //로딩
  const [weekLoading, setWeekLoading] = useState(true);
  const [monthLoading, setMonthLoading] = useState(true);
  //제출중 상태
  const [submitting, setSubmitting] =useState(false);

  //1회성 건너뛰기
  const [skipped, setSkipped] = useState(false);

  //7일+프로필 조회
  useEffect(() => {
    setWeekLoading(true);
    setWeekError(null);
    const fetchWeekWeights = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/weight/week?weightDate=${formattedDate}`,
          {credentials: "include"},
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
    };
    fetchWeekWeights();
  }, [formattedDate]);

  //월간조회
  useEffect(() => {
    setMonthLoading(true);
    setMonthError(null);

    const fetchMonthWeights = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/weight/month?date=${formattedDate}`,
          {credentials: "include"},
        );
        if (!response.ok) {
          throw new Error(`월간 BMI 조회 실패 : ${response.status}`);
        }
        const data: MonthWeightRecord[] = await response.json();
        setMonthWeights(data);
      } catch (error) {
        console.error("월간 BMI 조회 오류:", error);
        setMonthError("BMI 기록을 불러오지 못했어요.")
      } finally {
        setMonthLoading(false);
      }
    };
    fetchMonthWeights();
  }, [formattedDate]);

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
  const weekWeightValues = weekWeights.map((n) => n.weight);

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
  if (needsRegister && !skipped) {
    return (
      <WeightRegisterForm
        formattedDate={formattedDate}
        //키와 목표체중은 db에 있다면 같이 보내주고 입력폼에서 받지않음
        existHeight={profile?.height ?? null}
        existGoalWeight={profile?.goalWeight ?? null}
        onSkip={() => setSkipped(true)} //함수를 RegisterForm으로 보냈음
        onSuccess={(result) => {
          // 새 체중 기록을 기존 주간 기록에 추가
          setWeekWeights((prev) =>
            addTodayWeekRecord(prev, {
              weightDate: result.weightDate,
              weight: result.weight,
              bmi: result.bmi,
            }),
          );
          setMonthWeights((prev) =>
            addTodayMonthRecord(prev, {
              weightDate: result.weightDate,
              bmi: result.bmi,
            }),
          );
          setProfile({
            height: result.height,
            goalWeight: result.goalWeight,
            goalWeightState: result.goalWeightState,
          });
        }}
      />
    );
  }

  //바텀시트
  function handleOpenHeight() {
    setOpenHeight(true);
  }
  function handleOpenGoal() {
    setOpenGoal(true);
  }

  //오늘 체중 바텀시트로 POST
  async function handleCreateTodayWeight() {
    if (submitting || newWeight.trim() === ""){
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3001/weight`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          weight: Number(newWeight),
          weightDate: formattedDate,
        }),
      });
      if (!response.ok) {
        throw new Error(`체중 등록 실패:${response.status}`);
      }
      const result: CreateWeightResponse = await response.json();

      //바텀시트로 오늘 체중 입력시 주간 기록에 추가
      setWeekWeights((prev) =>
        addTodayWeekRecord(prev, {
          weightDate: result.weightDate,
          weight: result.weight,
          bmi: result.bmi,
        }),
      );
      setMonthWeights((prev) =>
        addTodayMonthRecord(prev, {
          weightDate: result.weightDate,
          bmi: result.bmi,
        }),
      );

      //오늘 체중으로 변경된 목표 상태 반영
      setProfile({
        height: result.height,
        goalWeight: result.goalWeight,
        goalWeightState: result.goalWeightState,
      });
      //입력한 값을 초기화
      setNewWeight("");
      //바텀시트 닫아주기
      setOpenTodayWeight(false);
    } catch (error) {
      console.error("체중 등록 오류:", error);
    } finally {
      setSubmitting(false);
    }
  }
  

  //바텀시트
  //목표체중 PATCH
  async function handleUpdateGoalWeight() {
    if( submitting || newGoalWeight.trim() === "") {
    return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:3001/weight/profile`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goalWeight: Number(newGoalWeight),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`목표체중 수정 실패:${response.status}`);
      }
      const updatedProfile: WeightProfile = await response.json();
      //새 목표체중과 state를 반영
      setProfile(updatedProfile);

      setNewGoalWeight("");
      setOpenGoal(false);
    } catch (error) {
      console.error("목표체중 수정 오류:", error);
    }finally {
      setSubmitting(false);
    }
  }

  //바텀시트
  //키 PATCH
  async function handleUpdateHeight() {
    if( submitting || newHeight.trim() === "") {
    return;
  }
    setSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:3001/weight/profile`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            height: Number(newHeight),
          }),
        },
      );
      if (!response.ok) {
        throw new Error(`키 수정 실패: ${response.status}`);
      }
      const updatedProfile: WeightProfile = await response.json();
      setProfile(updatedProfile);
      setNewHeight("");
      setOpenHeight(false);
    } catch (error) {
      console.error("키 수정 오류", error);
    }finally {
      setSubmitting(false);
  }
}

//바텀시트 닫기
function handleCloseWeight() {
  setNewWeight("");
  setOpenTodayWeight(false);
}

function handleCloseHeight() {
  setNewHeight("");
  setOpenHeight(false);
}

function handleCloseGoalWeight() {
  setNewGoalWeight("");
  setOpenGoal(false);
}

  return (
    <section className={commonStyle.mainContent}>
      <Card>
        <Card.Header icon={<HeartPulse />} title="체중" right={headerDate} />
        <Card.Body>
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
                levels={BMI_LEVELS}
                status={bmiStatus}
                value={<span>{todayWeight?.bmi ?? "-"}</span>}
              />
            </div>
          </Card.Grid>
          <Card.Grid topDivider leftDivider>
            <Card.Item title="키">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>
                  {profile?.height ?? "키 를 입력"}
                </span>
                <span className={commonStyle.dataUnit}>cm</span>
                <ButtonIcon onClick={handleOpenHeight}>
                  <Pencil />
                </ButtonIcon>
              </div>
            </Card.Item>
            <Card.Item title="목표체중">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>
                  {profile?.goalWeight ?? "목표 체중을 입력"}
                </span>
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
        <Card.Header title="이번 주 체중 추이" />
        <Card.Body>
          <Card.Grid columns={1}>
            <WeightWeekChart baseDate={baseDate} weights={weekWeights} />
          </Card.Grid>
          <Card.Grid columns={2} topDivider leftDivider>
            <Card.Item title="WeightGap">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>
                  {weightGap?.toFixed(2) ?? "-"}
                </span>
                <span className={commonStyle.dataUnit}>kg</span>
              </div>
            </Card.Item>
            <Card.Item title="최저/최고">
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

      <div>
       <Card>
  <Card.Header title="BMI 기록" />

  <Card.Body>
    {monthLoading ? (
      <p>BMI 기록을 불러오고 있어요.</p>
    ) : monthError ? (
      <p>{monthError}</p>
    ) : (
      <MonthCalendar data={calendarData} />
    )}
  </Card.Body>
</Card>
      </div>
<WeightBottomSheet
  open={openTodayWeight}
  value={newWeight}
  submitting={submitting}
  onChange={setNewWeight}
  onClose={handleCloseWeight}
  onSubmit={handleCreateTodayWeight}
/>

  <HeightBottomSheet
  open={openHeight}
  value={newHeight}
  submitting={submitting}
  onChange={setNewHeight}
  onClose={handleCloseHeight}
  onSubmit={handleUpdateHeight}
/>
<GoalWeightInputBottomSheet
  open={openGoal}
  value={newGoalWeight}
  submitting={submitting}
  onChange={setNewGoalWeight}
  onClose={handleCloseGoalWeight}
  onSubmit={handleUpdateGoalWeight}
/>
    </section>
  )
}
