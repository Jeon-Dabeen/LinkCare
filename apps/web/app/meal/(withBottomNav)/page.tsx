"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import { apiFetch } from "@/utils/api/apiFetch";
import { MealItem } from "@/types/meal";

import { CalendarDays } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import styles from "@/styles/meal/meal.module.css";

import Grid from "@/app/_components/ui/Grid";
import Button from "@/app/_components/ui/Button";
import { ViewCalendar, ViewWeek } from "../_components/viewCalendar";
import MealGoalCard from "../_components/mealGoalCard";
import MealPhotoList from "../_components/mealPhotoList";
import MealDetailList from "../_components/mealDetailList";

import { useAlert } from "@/app/_providers/AlertContext";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const { formattedDate } = useBaseDate();
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get("date") ?? formattedDate;

  const { customAlert } = useAlert();

  // 오늘 날짜인지 확인
  const isToday = selectedDate === formattedDate;

  // 전체 식사 데이터 상태
  const [mealData, setMealData] = useState<MealItem[] | null>(null);

  // 캘린더 모달 상태
  const [viewCalendar, setViewCalendar] = useState(false);

  // 데이터 불러오기 함수
  const fetchMeal = useCallback(async () => {
    if (!selectedDate) return;
    try {
      const response = await apiFetch<MealItem[]>(
        `/meal?date=${selectedDate}&baseDate=${formattedDate}`,
      );
      setMealData(response.data);
      console.log("=== data ===", response.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("식사 데이터 로드 실패: ", error.message);
        toast.error(error.message);
      }
    }
  }, [selectedDate, formattedDate]);

  useEffect(() => {
    fetchMeal();
  }, [fetchMeal]);

  // 아침,점심,저녁
  const mealsList = mealData ?? [];
  console.log("mealsList", mealsList);
  const breakfast = mealsList.find((m) => m.mealType === "BREAKFAST");
  const lunch = mealsList.find((m) => m.mealType === "LUNCH");
  const dinner = mealsList.find((m) => m.mealType === "DINNER");

  // 각 타입별 칼로리
  const breakfastCalorie = breakfast?.unitCalorie ?? 0;
  const lunchCalorie = lunch?.unitCalorie ?? 0;
  const dinnerCalorie = dinner?.unitCalorie ?? 0;

  // 오늘 총 섭취 칼로리
  const totalCalorie = breakfastCalorie + lunchCalorie + dinnerCalorie;

  // 목표 칼로리
  const goalCalorie = breakfast?.goalCalorie ?? 2000;

  /***
   * 등록/수정 페이지 이동
   */
  function handleNavRecord(
    mealType: string,
    mealId?: number,
    isSkipped?: boolean,
  ) {
    // 안먹었어요! 상태일 때 수정 불가
    if (isSkipped) {
      customAlert(`'안먹었어요'가 체크된 식사는 수정할 수 없어요`);
      return;
    }
    const upperMealType = mealType.toUpperCase();
    router.push(`/meal/record?mealType=${upperMealType}&mealId=${mealId}`);
  }

  // 달력 모달
  function handleOpenCalendar() {
    setViewCalendar(true);
  }

  return (
    <section className={commonStyle.mainContent}>
      <header className={commonStyle.pageTitleWrapper}>
        <div className={commonStyle.left}>
          <h2 className={commonStyle.pageTitle}>식사 다이어리</h2>
        </div>
        <div className={commonStyle.right}>
          <Button variant="text-primary" onClick={handleOpenCalendar}>
            <CalendarDays />
          </Button>
        </div>
      </header>

      <Grid>
        <Grid.ItemFull>
          <ViewWeek selectedDate={dayjs(selectedDate)} />
        </Grid.ItemFull>

        <Grid.ItemFull>
          <MealGoalCard
            totalCalorie={totalCalorie}
            goalCalorie={goalCalorie}
            onRefresh={fetchMeal}
            isToday={isToday}
          />
        </Grid.ItemFull>

        <Grid.ItemFull>
          <div className={styles.todayCalorie}>
            <strong className={styles.value}>
              {totalCalorie.toLocaleString()}
            </strong>
            <strong className={styles.unit}>kcal</strong>
          </div>
          {/* 아침 / 점심 / 저녁 버튼 영역 */}
          <MealPhotoList
            mealsList={mealsList}
            isToday={isToday}
            formattedDate={selectedDate}
            onNavRecord={handleNavRecord}
            onRefresh={fetchMeal}
          />
        </Grid.ItemFull>

        <Grid.ItemFull>
          <MealDetailList
            mealsList={mealsList}
            isToday={isToday}
            onNavRecord={handleNavRecord}
          />
        </Grid.ItemFull>
      </Grid>

      <ViewCalendar
        open={viewCalendar}
        onClose={() => setViewCalendar(false)}
      />
    </section>
  );
}
