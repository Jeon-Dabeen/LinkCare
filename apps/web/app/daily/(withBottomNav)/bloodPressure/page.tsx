"use client";

import { useCallback, useEffect, useState } from "react";

import clsx from "clsx";
import { ArrowDown, HeartPulse, Pencil } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import style from "@/styles/daily/dash.module.css";

import Tabs from "@/app/_components/ui/Tabs";
import Card from "@/app/_components/ui/Card";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import Button, { ButtonIcon } from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import MonthCalendar from "@/app/_components/ui/calendar/MonthCalendar";
import BpChart from "@/app/_components/ui/chart/bpChart";

import { BloodPressureRecord, CreateBloodPressureRequest, CreateBloodPressureResponse, DayPeriod, UpdateBloodPressurePulseRequest } from "@/types/bloodPressureType";
import { bpStatusTypeLabel, StatusType } from "@/types/statusType";
import { getBloodPressureStatus } from "@/utils/dailyStatus";
import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import StatePage from "@/app/_components/ui/StatePage";
import BloodPressureRegisterForm from "../../_components/BloodPressureRegisterForm";
import BloodPressureWeekChart from "../../_components/BloodPressureWeekChart";
import { ENV } from "@/env";

type BottomSheetMode = "CREATE_BLOOD_PRESSURE" | "UPDATE_PULSE" | null;

//월간
type MonthBloodPressureRecord = Omit<BloodPressureRecord, "id">;

//달력
type BloodPressureCalendarItem = {
  status?: StatusType;
};

//시간대
function getCurrentDayPeriod(hour: number): DayPeriod {
  return hour < 17 ? "MORNING" : "EVENING";
}



//이번주 정상 범위 이탈 횟수
function getBloodPressureOutCount(records: BloodPressureRecord[]): number {
  let count = 0;

  records.forEach((record) => {
    const status = getBloodPressureStatus(record.systolic, record.diastolic);
    if (
      status &&
      status !== "normal"
    ) {
      count += 1;
    }
  });
  return count;
}

//달력용 데이터
function getBloodPressureCalendarData(
  records: MonthBloodPressureRecord[],
): Record<string, BloodPressureCalendarItem> {
  const calendarData: Record<string, BloodPressureCalendarItem> = {};

  records.forEach((record) => {
    const dateKey = record.bpDate.slice(0, 10);

    calendarData[dateKey] = {
      status: getBloodPressureStatus(record.systolic, record.diastolic),
    };
  });
  return calendarData;
}

export default function Page() {
  const { baseDate, formattedDate } = useBaseDate();
  //현재 시간대 계산
  const currentDayPeriod = getCurrentDayPeriod(baseDate.hour());

  //시간대 탭, 최초선택은 현재 시간대
  const [selectedDayPeriod, setSelectedDayPeriod] = useState<DayPeriod>(
    () => currentDayPeriod,
  );

  const [weekRecords, setWeekRecords] = useState<BloodPressureRecord[]>([]);
  const [weekLoading, setWeekLoading] = useState(true);
  const [weekError, setWeekError] = useState<string | null>(null);

  const [monthRecords, setMonthRecords] = useState<MonthBloodPressureRecord[]>(
    [],
  );

  const [skipped, setSkipped] = useState(false);

  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [bottomSheetMode, setBottomSheetMode] = useState<BottomSheetMode>(null);

  const [newSystolic, setNewSystolic] = useState("");
  const [newDiastolic, setNewDiastolic] = useState("");
  const [newPulse, setNewPulse] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);

  const fetchWeekBloodPressure = useCallback(
    async (dayPeriod: DayPeriod) => {
      (setWeekLoading(true), setWeekError(null));

      try {
        const response = await fetch(
          `${ENV.API_URL}/blood-pressure/week` +
            `?bpDate=${formattedDate}` +
            `&dayPeriod=${dayPeriod}`,
          { credentials: "include" },
        );
        if (!response.ok) {
          throw new Error(`주간 혈압 조회 실패: ${response.status}`);
        }
        const data: BloodPressureRecord[] = await response.json();
        setWeekRecords(data);
      } catch (error) {
        console.error("주간 혈압 조회 오류:", error);
        setWeekError("혈압 정보를 불러오지 못했어요.");
      } finally {
        setWeekLoading(false);
      }
    },
    [formattedDate],
  );

  const fetchMonthBloodPressure = useCallback(
    async (dayPeriod: DayPeriod) => {
      try {
        const response = await fetch(
          `${ENV.API_URL}/blood-pressure/month` +
            `?bpDate=${formattedDate}` +
            `&dayPeriod=${dayPeriod}`,
          { credentials: "include" },
        );

        if (!response.ok) {
          throw new Error(`월간 혈압 조회 실패: ${response.status}`);
        }

        const data: MonthBloodPressureRecord[] = await response.json();
        setMonthRecords(data);
      } catch (error) {
        console.error("월간 혈압 조회 오류:", error);
        setMonthRecords([]);
      }
    },
    [formattedDate],
  );

  //최초진입, 날짜변경, 탭 변경시 주간 조회
  useEffect(() => {
    void fetchWeekBloodPressure(selectedDayPeriod);
  }, [fetchWeekBloodPressure, selectedDayPeriod]);

  //최초진입, 날짜변경, 탭 변경시 월간 조회
  useEffect(() => {
    void fetchMonthBloodPressure(selectedDayPeriod);
  }, [fetchMonthBloodPressure, selectedDayPeriod]);

  if (weekLoading) {
    return (
      <StatePage
        open={true}
        title="혈압 정보를 불러오고 있어요."
        description={
          <>
            혈압 기록을 불러오고 있어요.
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

  const todayRecord = weekRecords.find(
    (record) => record.bpDate.slice(0, 10) === formattedDate,
  );

  //혈압 상태
  const bloodPressureStatus = todayRecord
    ? getBloodPressureStatus(todayRecord.systolic, todayRecord.diastolic)
    : null;

  //혈당 튄 횟수
  const weekOutCount = getBloodPressureOutCount(weekRecords);

  //달력용 가공
  const calendarData = getBloodPressureCalendarData(monthRecords);

  //입력폼 띄우는 조건
  const needsRegister = selectedDayPeriod === currentDayPeriod && !todayRecord;

  //TODAY 띄우기
  const headerDate = todayRecord ? "TODAY" : formattedDate.slice(5);

  //아침·저녁 한글 이름
  const dayPeriodLabel = selectedDayPeriod === "MORNING" ? "오전" : "오후";

  // 바텀시트 제목
  let sheetTitle = `${dayPeriodLabel} 혈압 입력`;

  if (bottomSheetMode === "UPDATE_PULSE") {
    sheetTitle = `${dayPeriodLabel} 맥박 입력`;
  }

  //바텀시트 기록 버튼 비활성화
  const isSubmitDisabled =
    submitting || //저장중이면 비활성화
    bottomSheetMode === null || //바텀시드 모드가 없다면 비활성화
    (bottomSheetMode === "CREATE_BLOOD_PRESSURE" && //값이 비어있따면
      (newSystolic.trim() === "" || newDiastolic.trim() === "")) ||
    (bottomSheetMode === "UPDATE_PULSE" && //맥박입력모드에서 맥박이 비었다면
      newPulse.trim() === "");

  //탭변경
  function handleDayPeriodChange(value: string) {
    const nextDayPeriod = value as DayPeriod;

    //현재 탭일경우 재조회x
    if (nextDayPeriod === selectedDayPeriod) {
      return;
    }

    setWeekLoading(true);
    setSelectedDayPeriod(nextDayPeriod);
  }

  //바텀시트 열기
  function handleOpenBottomSheet(
    mode: "CREATE_BLOOD_PRESSURE" | "UPDATE_PULSE",
  ) {
    setBottomSheetMode(mode);
    setNewSystolic("");
    setNewDiastolic("");
    setNewPulse("");
    setSheetError(null);
    setOpenBottomSheet(true);
  }

  // 바텀시트 닫기
  function handleCloseBottomSheet() {
    setOpenBottomSheet(false);
    setBottomSheetMode(null);
    setNewSystolic("");
    setNewDiastolic("");
    setNewPulse("");
    setSheetError(null);
  }

  //혈압등록-바텀시트버전
  async function handleCreateBloodPressure() {
  
    //수축기·이완기가 없거나 등록 중이면 중단
  if (
    newSystolic.trim() === "" ||
    newDiastolic.trim() === "" ||
    submitting){
    return;
  }

  const systolicNumber = Number(newSystolic);
  const diastolicNumber = Number(newDiastolic);

  // 숫자가 아니거나 0 이하면 중단
  if (
    !Number.isFinite(systolicNumber) ||
    !Number.isFinite(diastolicNumber) ||
    systolicNumber <= 0 ||
    diastolicNumber <= 0) {
    setSheetError("올바른 혈압값을 입력해주세요.");
    return;
  }

  //바텀시트 혈압 POST에는 수축기·이완기만 전송
  const requestBody: CreateBloodPressureRequest = {
    systolic: systolicNumber,
    diastolic: diastolicNumber,
    dayPeriod: selectedDayPeriod,
    bpDate: formattedDate,
  };

  setSubmitting(true);
  setSheetError(null);

  try {
    const response = await fetch(
      `${ENV.API_URL}/blood-pressure/`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      },
    );

    //같은 날짜·시간대 혈압이 이미 있는 경우
    if (response.status === 409) {
      setSheetError(
        "해당 날짜 해당 시간대의 혈압이 이미 등록되어 있어요.",
      );
      return;
    }

    if (!response.ok) {
      throw new Error(`혈압 등록 실패: ${response.status}`);
    }

    handleCloseBottomSheet();

    // 새 혈압 기록을 화면에 보여주기 위해 재조회
    await Promise.all([
      fetchWeekBloodPressure(selectedDayPeriod),
      fetchMonthBloodPressure(selectedDayPeriod),
    ]);
  } catch (error) {
    console.error("혈압 등록 오류:", error);
    setSheetError("혈압 등록 중 문제가 발생했어요.");
  } finally {
    setSubmitting(false);
  }
}

// 맥박 등록 PATCH
async function handleUpdatePulse() {
  //혈압 기록이 없거나 맥박값이 없거나 등록 중이면 중단
  if (!todayRecord || newPulse.trim() === "" || submitting) {
    return;
  }

  const pulseNumber = Number(newPulse);

  // 숫자가 아니거나 0 이하면 중단
  if (
    !Number.isFinite(pulseNumber) ||
    pulseNumber <= 0
  ) {
    setSheetError("올바른 맥박값을 입력해주세요.");
    return;
  }

  //PATCH에는 맥박만 전송
  const requestBody: UpdateBloodPressurePulseRequest = {
    pulse: pulseNumber,
  };

  setSubmitting(true);
  setSheetError(null);

  try {
    const response = await fetch(
      `${ENV.API_URL}/blood-pressure/${todayRecord.id}/pulse`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      },
    );

    if (response.status === 404) {
      setSheetError("혈압 기록을 찾을 수 없어요.");
      return;
    }

    if (!response.ok) {
      throw new Error(`맥박 등록 실패: ${response.status}`);
    }

    //재조회 없이 오늘 기록에 맥박만 합침
    setWeekRecords((previousRecords) => 
    previousRecords.map((record) => record.id === todayRecord.id
          ? { ...record, pulse: pulseNumber,}: record),
    );

    handleCloseBottomSheet();
  } catch (error) {
    console.error("맥박 등록 오류:", error);
    setSheetError("맥박 등록 중 문제가 발생했어요.");
  } finally {
    setSubmitting(false);
  }
}

//바텀시트 기록 버튼
function handleBottomSheetSubmit() {
  if (bottomSheetMode === "CREATE_BLOOD_PRESSURE") {
    void handleCreateBloodPressure();
    return;
  }

  if (bottomSheetMode === "UPDATE_PULSE") {
    void handleUpdatePulse();
  }
}

//최초 입력폼 표시
if (needsRegister && !skipped) {
  return (
    <BloodPressureRegisterForm
      formattedDate={formattedDate}
      initialDayPeriod={currentDayPeriod}
      onSkip={() => {
        // 스킵하면 현재 시간대 탭으로 메인 화면 표시
        setSelectedDayPeriod(currentDayPeriod);
        setSkipped(true);
      }}
      onSuccess={async (
        result: CreateBloodPressureResponse,
      ) => {
        //최초 입력폼 종료
        setSkipped(true);

        //입력한 시간대와 현재 탭이 다르면
        //입력한 시간대 탭으로 이동
        if (result.dayPeriod !== selectedDayPeriod) {
          setWeekLoading(true);
          setSelectedDayPeriod(result.dayPeriod);

          //탭 변경 후 useEffect에서 다시 조회됨
          return;
        }

        //입력한 시간대와 현재 탭이 같으면 직접 재조회
        await Promise.all([
          fetchWeekBloodPressure(result.dayPeriod),
          fetchMonthBloodPressure(result.dayPeriod),
        ]);
      }}
    />
  );
}

return (
  <section className={commonStyle.mainContent}>
    <Tabs
      defaultValue={selectedDayPeriod}
      value={selectedDayPeriod}
      onChange={handleDayPeriodChange}
    >
      <Tabs.Nav>
        <Tabs.NavItem value="MORNING" title="오전" />
        <Tabs.NavItem value="EVENING" title="오후" />
      </Tabs.Nav>

      {/* 오전 탭 */}
      <Tabs.Content value="MORNING">
        <Card>
          <Card.Header
            icon={<HeartPulse />}
            title="혈압"
            right={headerDate}
          />

          <Card.Body>
            <Card.Grid>
              <div className={style.dashWrapper}>
                {/* 최고혈압 / 최저혈압 */}
                <div className={style.current}>
                  <span className={style.value}>
                    {todayRecord?.systolic ?? "-"}
                  </span>

                  <span className={style.separator}>/</span>

                  <span className={style.value}>
                    {todayRecord?.diastolic ?? "-"}
                  </span>

                  <span className={style.unit}>mmHg</span>

                  {/* 혈압 기록이 없으면 혈압 입력 */}
                  {!todayRecord && (
                    <div className={style.buttonArea}>
                      <ButtonIcon
                        color="primary"
                        onClick={() =>
                          handleOpenBottomSheet(
                            "CREATE_BLOOD_PRESSURE",
                          )
                        }
                      >
                        <Pencil />
                      </ButtonIcon>
                    </div>
                  )}
                </div>

                {/* 혈압 상태 */}
                <div
                  className={clsx(
                    style.dashStatus,
                    bloodPressureStatus &&
                      style[bloodPressureStatus],
                  )}
                >
                  {bloodPressureStatus
                    ? bpStatusTypeLabel[bloodPressureStatus]
                    : "-"}
                </div>

                {/* 맥박 */}
                <div className={commonStyle.dataWrapper}>
                  <span className={commonStyle.dataLabel}>
                    맥박
                  </span>

                  <span className={commonStyle.dataValue}>
                    {todayRecord?.pulse ?? "-"}
                  </span>

                  <span className={commonStyle.dataUnit}>
                    bpm
                  </span>

                  {/* 혈압은 있지만 맥박이 없으면 맥박 입력 */}
                  {todayRecord &&
                    todayRecord.pulse == null && (
                      <ButtonIcon
                        color="primary"
                        onClick={() =>
                          handleOpenBottomSheet(
                            "UPDATE_PULSE",
                          )
                        }
                      >
                        <Pencil />
                      </ButtonIcon>
                    )}
                </div>
              </div>

              {/* 혈압 기록이 있을 때만 차트 표시 */}
              {todayRecord ? (
                <BpChart
                  diastolic={todayRecord.diastolic}
                  systolic={todayRecord.systolic}
                />
              ) : (
                <div />
              )}
            </Card.Grid>
          </Card.Body>
        </Card>
      </Tabs.Content>

      {/* 오후 탭 */}
      <Tabs.Content value="EVENING">
        <Card>
          <Card.Header
            icon={<HeartPulse />}
            title="혈압"
            right={headerDate}
          />

          <Card.Body>
            <Card.Grid>
              <div className={style.dashWrapper}>
                {/* 최고혈압 / 최저혈압 */}
                <div className={style.current}>
                  <span className={style.value}>
                    {todayRecord?.systolic ?? "-"}
                  </span>

                  <span className={style.separator}>/</span>

                  <span className={style.value}>
                    {todayRecord?.diastolic ?? "-"}
                  </span>

                  <span className={style.unit}>mmHg</span>

                  {/* 혈압 기록이 없으면 혈압 입력 */}
                  {!todayRecord && (
                    <div className={style.buttonArea}>
                      <ButtonIcon
                        color="primary"
                        onClick={() =>
                          handleOpenBottomSheet(
                            "CREATE_BLOOD_PRESSURE",
                          )
                        }
                      >
                        <Pencil />
                      </ButtonIcon>
                    </div>
                  )}
                </div>

                {/* 혈압 상태 */}
                <div
                  className={clsx(
                    style.dashStatus,
                    bloodPressureStatus &&
                      style[bloodPressureStatus],
                  )}
                >
                  {bloodPressureStatus
                    ? bpStatusTypeLabel[bloodPressureStatus]
                    : "-"}
                </div>

                {/* 맥박 */}
                <div className={commonStyle.dataWrapper}>
                  <span className={commonStyle.dataLabel}>
                    맥박
                  </span>

                  <span className={commonStyle.dataValue}>
                    {todayRecord?.pulse ?? "-"}
                  </span>

                  <span className={commonStyle.dataUnit}>
                    bpm
                  </span>

                  {/* 혈압은 있지만 맥박이 없으면 맥박 입력 */}
                  {todayRecord &&
                    todayRecord.pulse == null && (
                      <ButtonIcon
                        color="primary"
                        onClick={() =>
                          handleOpenBottomSheet(
                            "UPDATE_PULSE",
                          )
                        }
                      >
                        <Pencil />
                      </ButtonIcon>
                    )}
                </div>
              </div>

              {/* 혈압 기록이 있을 때만 차트 표시 */}
              {todayRecord ? (
                <BpChart
                  diastolic={todayRecord.diastolic}
                  systolic={todayRecord.systolic}
                />
              ) : (
                <div />
              )}
            </Card.Grid>
          </Card.Body>
        </Card>
      </Tabs.Content>
    </Tabs>

    {/* 이번 주 혈압 추이 */}
    <Card>
      <Card.Header title="이번 주 혈압 추이" />

      <Card.Body>
        <Card.Grid columns={1}>
        <BloodPressureWeekChart 
          baseDate={baseDate}
          records={weekRecords}/>
        </Card.Grid>

        <Card.Grid columns={1} topDivider>
          <Card.Item title="이번 주 정상 범위 이탈 횟수">
            <div className={commonStyle.dataWrapper}>
              <span className={commonStyle.dataValue}>
                {weekOutCount}
              </span>

              <span className={commonStyle.dataUnit}>회</span>
            </div>
          </Card.Item>
        </Card.Grid>
      </Card.Body>
    </Card>

    {/* 혈압 기록 달력 */}
    <MonthCalendar data={calendarData} />

    {/* 혈압 POST / 맥박 PATCH 바텀시트 */}
    <BottomSheet
      open={openBottomSheet}
      title={sheetTitle}
      onClose={handleCloseBottomSheet}
    >
      <div className={formStyle.formWrapper}>
        {/* 혈압 입력 모드 */}
        {bottomSheetMode === "CREATE_BLOOD_PRESSURE" && (
          <>
            <div className={formStyle.formGroup}>
              <Input
                unit="mmHg"
                type="number"
                id="newSystolic"
                name="newSystolic"
                value={newSystolic}
                placeholder="최고혈압"
                onChange={(event) => {
                  setNewSystolic(event.target.value);
                  setSheetError(null);
                }}
                required
              />
            </div>

            <div className={formStyle.formGroup}>
              <Input
                unit="mmHg"
                type="number"
                id="newDiastolic"
                name="newDiastolic"
                value={newDiastolic}
                placeholder="최저혈압"
                onChange={(event) => {
                  setNewDiastolic(event.target.value);
                  setSheetError(null);
                }}
                required
              />
            </div>
          </>
        )}

        {/* 맥박 입력 모드 */}
        {bottomSheetMode === "UPDATE_PULSE" && (
          <div className={formStyle.formGroup}>
            <Input
              unit="bpm"
              type="number"
              id="newPulse"
              name="newPulse"
              placeholder="PULSE 맥박"
              value={newPulse}
              onChange={(event) => {
                setNewPulse(event.target.value);
                setSheetError(null);
              }}
              required
            />
          </div>
        )}

        {sheetError && <p>{sheetError}</p>}

        <Button
          type="button"
          variant="primary"
          size="large"
          onClick={handleBottomSheetSubmit}
          disabled={isSubmitDisabled}
        >
          {submitting ? "저장 중..." : "기록"}
        </Button>
      </div>
    </BottomSheet>
  </section>
)}