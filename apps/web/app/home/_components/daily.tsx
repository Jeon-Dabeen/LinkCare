"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import { apiFetch } from "@/utils/api/apiFetch";

import { Salad } from "lucide-react";
import Grid from "@/app/_components/ui/Grid";
import Card from "@/app/_components/ui/Card";
import BP from "./bloodPressure";
import BG from "./bloodGlucose";
import MealWarp from "./mealWrap";
import Weight from "./weight";
import { DailyResponse } from "@/types/home";

export default function Daily() {
  const { formattedDate } = useBaseDate();
  const pathname = usePathname();

  const [dailyData, setDailyData] = useState<DailyResponse | null>(null);

  const [bpDate, setBpDate] = useState<string>("-");
  const [bgDate, setBgDate] = useState<string>("-");

  // 데이터 불러오기 함수
  const fetchMealData = useCallback(async () => {
    try {
      const response = await apiFetch<DailyResponse>(
        `/meal/home/daily?date=${formattedDate}`,
      );
      setDailyData(response.data);
      console.log("=== data ===", response.data);
      setBpDate(
        response.data.bloodPressure.bpDate === formattedDate
          ? "TODAY"
          : response.data.bloodPressure.bpDate
            ? response.data.bloodPressure.bpDate.slice(5)
            : "-",
      );
      setBgDate(
        response.data.bloodGlucose.bgDate === formattedDate
          ? "TODAY"
          : response.data.bloodGlucose.bgDate
            ? response.data.bloodGlucose.bgDate.slice(5)
            : "-",
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error("데일리 데이터 로드 실패: ", error.message);
      }
    }
  }, [formattedDate]);

  useEffect(() => {
    fetchMealData();
  }, [pathname, formattedDate, fetchMealData]);

  return (
    <>
      <Grid>
        <Grid.Link href="/daily/bloodPressure">
          <BP
            bpDate={bpDate}
            systolic={dailyData?.bloodPressure.systolic || "-"}
            diastolic={dailyData?.bloodPressure.diastolic || "-"}
          />
        </Grid.Link>
        <Grid.Link href="/daily/bloodGlucose">
          <BG
            bgDate={bgDate}
            glucose={dailyData?.bloodGlucose.glucose || "-"}
            mealTiming={dailyData?.bloodGlucose.mealTiming || null}
          />
        </Grid.Link>
        <Grid.ItemFull>
          <Grid.Link href="/meal">
            <Card>
              <Card.Header icon={<Salad />} title="식사 다이어리" />
              <Card.Body noTopPadding>
                {/* MealWrap */}
                <MealWarp />
              </Card.Body>
            </Card>
          </Grid.Link>
        </Grid.ItemFull>
      </Grid>

      <Grid.Link href="/daily/weight">
        <Weight
          current={dailyData?.weight.weight || "-"}
          goal={dailyData?.weight.goalWeight || "-"}
        />
      </Grid.Link>
    </>
  );
}
