"use client";

import { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { Droplet, Pencil } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import style from "@/styles/daily/dash.module.css";
import Tabs from "@/app/_components/ui/Tabs";
import Card from "@/app/_components/ui/Card";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import Button, { ButtonIcon } from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import MonthCalendar from "@/app/_components/ui/calendar/MonthCalendar";
import type { MealType } from "@/types/mealType";
import { bgStatusTypeLabel, StatusType } from "@/types/statusType";
import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import {
  BloodGlucoseRecord,
  CreateBloodGlucoseRequest,
  CreateBloodGlucoseResponse,
  MealTiming,
} from "@/types/bloodGlucose";
import StatePage from "@/app/_components/ui/StatePage";
import BloodGlucoseRegisterForm from "../../_components/BloodGlucoseRegisterForm";
import BloodGlucoseWeekChart from "../../_components/BloodGlucoseWeekChart";
import BarChart from "@/app/_components/ui/chart/barChart";
import StatusTag from "@/app/_components/ui/StatusTag";
import { getBarPercentage } from "@/utils/checkupBarRange";
import { AFTER_BLOOD_GLUCOSE_THRESHOLDS, BEFORE_BLOOD_GLUCOSE_THRESHOLDS, getStatusByThreshold } from "@/utils/dailyStatus";
import { ENV } from "@/env";

interface MonthBloodGlucoseRecord {
  bgDate: string;
  before: number | null;
  after: number | null;
}

//현재 시간을 기준으로 아침/점심/저녁을 반환
function getCurrentMealType(hour: number): MealType {
  if (hour >= 5 && hour < 11) {
    return "BREAKFAST";
  }

  if (hour >= 11 && hour < 17) {
    return "LUNCH";
  }

  return "DINNER";
}

//정상범위 이탈 횟수
function getBgOutCount(records: BloodGlucoseRecord[]): number {
  let count = 0;

  records.forEach((record) => {
    if (record.before != null) {
      const beforeStatus = getStatusByThreshold(
        record.before,
        BEFORE_BLOOD_GLUCOSE_THRESHOLDS,
      );

      //값이 있고 nomal이 아닌경우만 집계
      if (
        beforeStatus &&
        beforeStatus !== "normal"
      ) {
        count += 1;
      }

    }

    if (record.after != null) {
      const afterStatus = getStatusByThreshold(
        record.after,
        AFTER_BLOOD_GLUCOSE_THRESHOLDS,
      );

      if (
        afterStatus &&
        afterStatus !== "normal"
      ) {
        count += 1;
      }
    }
  });

  return count;
}

//달력용 타입
type BgCalendarItem = {
  leftStatus?: StatusType | null;
  rightStatus?: StatusType | null;
};

//달력용 데이터
function getBgCalendarData(
  records: MonthBloodGlucoseRecord[],
): Record<string, BgCalendarItem> {
  const calendarData: Record<string, BgCalendarItem> = {};

  records.forEach((record) => {
    const dateKey = record.bgDate.slice(0, 10);

    const beforeStatus =
      record.before != null
        ? getStatusByThreshold(record.before, BEFORE_BLOOD_GLUCOSE_THRESHOLDS)
        : null;

    const afterStatus =
      record.after != null
        ? getStatusByThreshold(record.after, AFTER_BLOOD_GLUCOSE_THRESHOLDS)
        : null;

    calendarData[dateKey] = {
      leftStatus: beforeStatus,
      rightStatus: afterStatus,
    };
  });
  return calendarData;
}

export default function Page() {
  const { baseDate, formattedDate } = useBaseDate();

  //페이지 들어온 시간대
  const currentMealType = getCurrentMealType(baseDate.hour());

  //선택된 탭
  const [selectedMealType, setSelectedMealType] = useState<MealType>(
    () => currentMealType,
  );

  //해당 시간대의 7일 혈당 기록
  const [weekRecords, setWeekRecords] = useState<BloodGlucoseRecord[]>([]);
  const [weekError, setWeekError] = useState<string | null>(null); //에러
  const [weekLoading, setWeekLoading] = useState(true);

  //월간
  const [monthBloodGlucose, setMonthBloodGlucose] = useState<
    MonthBloodGlucoseRecord[]
  >([]);
  const [monthLoading, setMonthLoading]=useState(true)
  const [monthError, setMonthError] = useState<string | null>(null);

  //월간달력용 데이터
  const calendarData = getBgCalendarData(monthBloodGlucose);

  //1회성 스킵;
  const [skipped, setSkipped] = useState(false);

  //바텀시트
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [newGlucose, setNewGlucose] = useState(""); //바텀시트 혈당입력값
  //바텀시트용 식전인지 식후인지 구분(연필)
  const [selectedMealTiming, setSelectedMealTiming] =
    useState<MealTiming | null>(null);

  //중복클릭 방지
  const [submitting, setSubmitting] = useState(false);

  const [sheetError, setSheetError] = useState<string | null>(null);

  //재조회를 위한 callback
  const fetchWeekBloodGlucose = useCallback(
    async (mealType: MealType) => {
      setWeekLoading(true);
      setWeekError(null);

      try {
        const response = await fetch(
          `${ENV.API_URL}/blood-glucose/week` +
            `?bgDate=${formattedDate}` +
            `&mealType=${mealType}`,
          { credentials: "include" },
        );
        if (!response.ok) {
          throw new Error(`주간 혈당 조회에 실패했어요:${response.status}`);
        }
        const data: BloodGlucoseRecord[] = await response.json();
        setWeekRecords(data);
      } catch (error) {
        console.error("주간 혈당 조회 오류:", error);
        setWeekError("혈당 정보를 불러오지 못했어요.");
      } finally {
        setWeekLoading(false);
      }
    },
    [formattedDate],
  );

  //월간 api 함수
  const fetchMonthBloodGlucose = useCallback(
    async (mealType: MealType) => {
      setMonthLoading(true);
      setMonthBloodGlucose([]);
      setMonthError(null);
      try {
        const response = await fetch(
          `${ENV.API_URL}/blood-glucose/month?bgDate=${formattedDate}&mealType=${mealType}`,
          { credentials: "include" },
        );

        if (!response.ok) {
          throw new Error(`월간 혈당 조회 실패: ${response.status}`);
        }

        const data: MonthBloodGlucoseRecord[] = await response.json();
        setMonthBloodGlucose(data);
      } catch (error) {
        console.error("월간 혈당 조회 오류:", error);
        setMonthError("월간 혈당 기록을 불러오지 못했어요.");
        setMonthBloodGlucose([]);
      } finally {
        setMonthLoading(false);
      }
    },
    [formattedDate],
  );

  //날짜 변경이나 탭 변경시 조회
  //해당 탭만 조회
  useEffect(() => {
    void fetchWeekBloodGlucose(selectedMealType);
  }, [fetchWeekBloodGlucose, selectedMealType]);

  //월간조회
  useEffect(() => {
    void fetchMonthBloodGlucose(selectedMealType);
  }, [fetchMonthBloodGlucose, selectedMealType]);

  //주간 로딩
  if (weekLoading) {
    return (
      <StatePage
        open={true}
        title="혈당 정보를 불러오고 있어요"
        description={
          <>
            혈당 기록을 불러오고 있어요.
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

  //선택한 탭의 오늘 혈당 기록 찾기
  const todayRecord = weekRecords.find(
    (record) => record.bgDate.slice(0, 10) === formattedDate,
  );

  //오늘의 식전 혈당 상태
 const beforeStatus = getStatusByThreshold(
  todayRecord?.before,
  BEFORE_BLOOD_GLUCOSE_THRESHOLDS,
);

  //식후 혈당
const afterStatus = getStatusByThreshold(
  todayRecord?.after,
  AFTER_BLOOD_GLUCOSE_THRESHOLDS,
);

  //바차트용 퍼센테이지
  const beforePosition =
    todayRecord?.before != null
      ? getBarPercentage(todayRecord.before, BEFORE_BLOOD_GLUCOSE_THRESHOLDS)
      : null;

  //바차트용 퍼센테이지
  const afterPosition =
    todayRecord?.after != null
      ? getBarPercentage(todayRecord.after, AFTER_BLOOD_GLUCOSE_THRESHOLDS)
      : null;

  //7일 차트 혈당 정상 이탈 횟수
  const weekBgOutCount = getBgOutCount(weekRecords);

  //식전 식후가 하나라도 등록되었나 확인
  //둘다 없으면 입력폼을 띄우기 위함
  const hasTodayRecord =
    todayRecord?.before != null || todayRecord?.after != null;

  //입력폼 띄울조건
  const needsRegister = selectedMealType === currentMealType && !hasTodayRecord;

  //날짜가 오늘이면 TODAY 아니라면 날짜
  const headerDate = todayRecord ? "TODAY" : formattedDate.slice(5);

  //바텀시트 무엇을 입력하는시 설명
  const sheetTitle =
    selectedMealTiming === "BEFORE"
      ? "식전 혈당 입력"
      : selectedMealTiming === "AFTER"
        ? "식후 혈당 입력"
        : "혈당 입력";

  //탭변경
  function handleMealTypeChange(value: string) {
    const nextMealType = value as MealType;

    //현재 탭과 같을시 재 조회x
    if (nextMealType === selectedMealType) {
      return;
    }
    setWeekLoading(true);
    setSelectedMealType(nextMealType);
  }

  //기록이 없을때 바텀시트로 기록입력
  function handleOpenBottomSheet(mealTiming: MealTiming) {
    setSelectedMealTiming(mealTiming);
    setNewGlucose(""); //이전 입력값 초기화
    setSheetError(null);
    setOpenBottomSheet(true);
  }

  //바텀시트 닫기
  function handleCloseBottomSheet() {
    setOpenBottomSheet(false);

    setSelectedMealTiming(null);
    setNewGlucose("");
    setSheetError(null);
  }

  //바텀시트 혈당 등록
  async function handleCreateBloodGlucose() {
    //값이 없거나 식전/식후가 없거나 등록 중이면 중단
    if (newGlucose.trim() === "" || selectedMealTiming === null || submitting) {
      return;
    }
    const glucoseNumber = Number(newGlucose);

    //숫자가 아니거나 0이하이면 중단
    if (!Number.isFinite(glucoseNumber) || glucoseNumber <= 0) {
      setSheetError("올바른 혈당값을 입력해주세요.");
      return;
    }

    const requestBody: CreateBloodGlucoseRequest = {
      glucose: glucoseNumber,
      mealType: selectedMealType,
      mealTiming: selectedMealTiming,
      bgDate: formattedDate,
    };
    setSubmitting(true);
    setSheetError(null);
    try {
      const response = await fetch(`${ENV.API_URL}/blood-glucose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      // 이미 같은 기록이 있는 경우
      if (response.status === 409) {
        setSheetError("해당 날짜 해당 시간대의 혈당이 이미 등록되어 있어요.");
        return;
      }

      if (!response.ok) {
        throw new Error(`혈당 등록 실패: ${response.status}`);
      }

      // 바텀시트 닫기
      setOpenBottomSheet(false);

      // 입력값 초기화
      setNewGlucose("");
      setSelectedMealTiming(null);

      //오늘 입력값을 추가하기 위해 재조회
      await fetchWeekBloodGlucose(selectedMealType);
      void fetchMonthBloodGlucose(selectedMealType);
    } catch (error) {
      console.error("혈당 등록 오류:", error);
      setSheetError("혈당 등록 중 문제가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  //입력폼 띄우기
  if (needsRegister && !skipped) {
    return (
      <BloodGlucoseRegisterForm
        formattedDate={formattedDate}
        initialMealType={selectedMealType}
        onSkip={() => {
          //입력폼만 닫고 메인 화면 표시
          setSkipped(true);
        }}
        onSuccess={async (result: CreateBloodGlucoseResponse) => {
          // 최초 입력폼 종료
          setSkipped(true);

          //입력한 기록과, 선택된탭을 일치시킴
          if (result.mealType !== selectedMealType) {
            setWeekLoading(true);
            setSelectedMealType(result.mealType); //입력한 탭으로 변경
            //탭 변경이 되면 재조회된다.
            return;
          }
          //입력한 끼니와 현재 탭이 같은경우
          //수동 재실행
          await Promise.all([
            fetchWeekBloodGlucose(result.mealType),
            fetchMonthBloodGlucose(result.mealType),
          ]);
        }}
      />
    );
  }
  return (
    <section className={commonStyle.mainContent}>
      <Tabs
        defaultValue={selectedMealType}
        value={selectedMealType}
        onChange={handleMealTypeChange}
      >
        <Tabs.Nav>
          <Tabs.NavItem value="BREAKFAST" title="아침" />

          <Tabs.NavItem value="LUNCH" title="점심" />

          <Tabs.NavItem value="DINNER" title="저녁" />
        </Tabs.Nav>

        <Tabs.Content value={selectedMealType}>
          <Card>
            <Card.Header icon={<Droplet />} title="혈당" right={headerDate} />

            <Card.Body noTopPadding>
              <Card.Grid columns={2} leftDivider>
                {/* 식전 혈당 */}
                <Card.Item title="식전">
                  <div className={style.dashWrapper}>
                    <div className={style.current}>
                      <span className={style.value}>
                        {todayRecord?.before ?? "-"}
                      </span>

                      <span className={style.unit}>mg/dL</span>

                      {todayRecord?.before == null && (
                        <div className={style.buttonArea}>
                          <ButtonIcon
                            color="primary"
                            onClick={() => handleOpenBottomSheet("BEFORE")}
                          >
                            <Pencil />
                          </ButtonIcon>
                        </div>
                      )}
                    </div>
                  </div>
                  {beforeStatus && beforePosition != null && (
                    <BarChart level={beforeStatus} position={beforePosition} />
                  )}
                  {beforeStatus && (
                    <StatusTag
                      status={beforeStatus}
                      label={bgStatusTypeLabel[beforeStatus]}
                    />
                  )}
                </Card.Item>

                <Card.Item title="식후">
                  <div className={style.dashWrapper}>
                    <div className={style.current}>
                      <span className={style.value}>
                        {todayRecord?.after ?? "-"}
                      </span>

                      <span className={style.unit}>mg/dL</span>

                      {todayRecord?.after == null && (
                        <div className={style.buttonArea}>
                          <ButtonIcon
                            color="primary"
                            onClick={() => handleOpenBottomSheet("AFTER")}
                          >
                            <Pencil />
                          </ButtonIcon>
                        </div>
                      )}
                    </div>
                  </div>
                  {afterStatus && afterPosition != null && (
                    <BarChart level={afterStatus} position={afterPosition} />
                  )}
                  {afterStatus && (
                    <StatusTag
                      status={afterStatus}
                      label={bgStatusTypeLabel[afterStatus]}
                    />
                  )}
                </Card.Item>
              </Card.Grid>
            </Card.Body>
          </Card>
        </Tabs.Content>
      </Tabs>

      <Card>
        <Card.Header title="이번 주 혈당 추이" />

        <Card.Body noTopPadding>
          <Card.Grid columns={1}>
            <BloodGlucoseWeekChart baseDate={baseDate} records={weekRecords} />
          </Card.Grid>
          <Card.Grid columns={1} topDivider>
            <Card.Item title="이번 주 정상 범위 이탈 횟수">
              <div className={commonStyle.dataWrapper}>
                <span className={commonStyle.dataValue}>{weekBgOutCount}</span>
                <span>회</span>
              </div>
            </Card.Item>
          </Card.Grid>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header title="혈당 기록" />

        <Card.Body noTopPadding>
          {monthLoading ? (
            <p>혈당 기록을 불러오고 있어요.</p>
          ) : monthError ? (
          <p>{monthError}</p>
        ) : (
        <MonthCalendar
        selectedDate={baseDate}
        data={calendarData}
  />
)}
        </Card.Body>
      </Card>

      <BottomSheet
        open={openBottomSheet}
        title={sheetTitle}
        onClose={handleCloseBottomSheet}
      >
        <div className={formStyle.formWrapper}>
          <div className={formStyle.formGroup}>
            <Input
              unit="mg/dL"
              type="number"
              id="newGlucose"
              name="newGlucose"
              placeholder="혈당을 입력해주세요"
              value={newGlucose}
              onChange={(event) => {
                setNewGlucose(event.target.value);

                setSheetError(null);
              }}
              required
            />
          </div>

          {sheetError && <p>{sheetError}</p>}

          <Button
            type="button"
            variant="primary"
            size="large"
            onClick={() => void handleCreateBloodGlucose()}
            disabled={
              newGlucose.trim() === "" ||
              selectedMealTiming === null ||
              submitting
            }
          >
            {submitting ? "저장중..." : "기록"}
          </Button>
        </div>
      </BottomSheet>
    </section>
  );
}
