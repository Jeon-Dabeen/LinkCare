"use client";
import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, HeartPulse, Pencil } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import dashStyle from "@/styles/daily/dash.module.css";
import Card from "@/app/_components/ui/Card";
import Button, { ButtonIcon } from "@/app/_components/ui/Button";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import Input from "@/app/_components/ui/Input";
import WeightRegisterForm from "../../_components/WeightRegisterForm";
import StatePage from "@/app/_components/ui/StatePage";

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

interface WeekWeightResponse {
  profile: WeightProfile;
  weights: WeightRecord[];
}

interface MonthWeightRecord {
  weightDate: string;
  bmi: number | null;
}

const USER_ID = 1;

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

export default function Page() {
  const { formattedDate } = useBaseDate(); //날짜

  //에러
  const [weekError, setWeekError] = useState<string | null>(null);

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
  const [weightError, setWeightError] = useState<string | null>(null);

  //로딩
  const [weekLoading, setWeekLoading] = useState(true);
  const [monthLoading, setMonthLoading] = useState(true);

  //1회성 건너뛰기
  const [skipped, setSkipped] = useState(false);

  //7일+프로필 조회
  useEffect(() => {
    setWeekLoading(true);
    setWeekError(null);
    const fetchWeekWeights = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/weight/week/${USER_ID}?date=${formattedDate}`,
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

    const fetchMonthWeights = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/weight/month/${USER_ID}?date=${formattedDate}`,
        );
        if (!response.ok) {
          throw new Error(`월간 BMI 조회 실패 : ${response.status}`);
        }
        const data: MonthWeightRecord[] = await response.json();
        setMonthWeights(data);
      } catch (error) {
        console.error("월간 BMI 조회 오류:", error);
      } finally {
        setMonthLoading(false);
      }
    };
    fetchMonthWeights();
  }, [formattedDate]);

  //주간과 월간중 하나라도 로딩중이면 true
  const isLoading = weekLoading || monthLoading;

  //로딩화면
  if (isLoading) {
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
        goalMessage = `목표까지 + ${untilGoal}kg`;
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
          (setMonthWeights((prev) =>
            addTodayMonthRecord(prev, {
              weightDate: result.weightDate,
              bmi: result.bmi,
            }),
          ),
            setProfile({
              height: result.height,
              goalWeight: result.goalWeight,
              goalWeightState: result.goalWeightState,
            }));
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
    //체중을 입력하지 않았으면 요청하지않음
    if (newWeight === "") {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/weight/${USER_ID}`, {
        method: "POST",
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
      const result: WeightRecord = await response.json();

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
      //입력한 값을 초기화
      setNewWeight("");
      //바텀시트 닫아주기
      setOpenTodayWeight(false);
    } catch (error) {
      console.error("체중 등록 오류:", error);
    }
  }

  //바텀시트
  //목표체중 PATCH
  async function handleUpdateGoalWeight() {
    if (newGoalWeight === "") {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/weight/profile/${USER_ID}`,
        {
          method: "PATCH",
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
    }
  }

  //바텀시트
  //키 PATCH
  async function handleUpdateHeight() {
    if (newHeight === "") {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/weight/profile/${USER_ID}`,
        {
          method: "PATCH",
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
    }
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
            <div>bmi 차트가 들어갈 자리에요오:{todayWeight?.bmi ?? "-"}</div>
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
          <Card.Grid columns={1}>체중 차트</Card.Grid>
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

      <div>달력.......</div>

      <BottomSheet
        open={openTodayWeight}
        title="체중"
        onClose={() => setOpenTodayWeight(false)}
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
            onClick={handleCreateTodayWeight}
            disabled={newWeight === ""}
          >
            기록
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={openHeight}
        title="키"
        onClose={() => setOpenHeight(false)}
      >
        <div className={formStyle.formWrapper}>
          <div className={formStyle.formGroup}>
            <Input
              unit="cm"
              type="number"
              id="newHeight"
              name="newHeight"
              value={newHeight}
              onChange={(event) => setNewHeight(event.target.value)}
              required
            />
          </div>
          <Button
            type="button"
            variant="primary"
            size="large"
            onClick={handleUpdateHeight}
            disabled={newHeight === ""}
          >
            기록
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={openGoal}
        title="목표 체중"
        onClose={() => setOpenGoal(false)}
      >
        <div className={formStyle.formWrapper}>
          <div className={formStyle.formGroup}>
            <Input
              unit="kg"
              type="number"
              id="goalWeight"
              name={newGoalWeight}
              onChange={(event) => setNewGoalWeight(event.target.value)}
              required
            />
          </div>
          <Button
            type="button"
            variant="primary"
            size="large"
            onClick={handleUpdateGoalWeight}
            disabled={newGoalWeight === ""}
          >
            기록
          </Button>
        </div>
      </BottomSheet>
    </section>
  );
}
