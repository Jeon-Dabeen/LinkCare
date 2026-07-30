"use client";

import { useState } from "react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import Radio from "@/app/_components/ui/Radio";
import type { MealType } from "@/types/mealType";
import type {
  CreateBloodGlucoseRequest,
  CreateBloodGlucoseResponse,
  MealTiming,
} from "@/types/bloodGlucose";

interface BloodGlucoseRegisterFormProps {
  formattedDate: string;
  initialMealType:MealType;
  onSkip: () => void;
  onSuccess: (result: CreateBloodGlucoseResponse) => void | Promise<void>
}

export default function BloodGlucoseRegisterForm({
  formattedDate,
  initialMealType,
  onSkip,
  onSuccess,
}: BloodGlucoseRegisterFormProps) {
  const [mealType, setMealType] = useState<MealType>(initialMealType);
  const [mealTiming, setMealTiming] = useState<MealTiming>("BEFORE");
  const [glucose, setGlucose] = useState("");

  //요청중인지 확인
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //아침/점심/저녁 변경
  const handleMealType = (value: string) => {
    setMealType(value as MealType);
  };
  //식전 식후 변경
  const handleMealTiming = (value: string) => {
    setMealTiming(value as MealTiming);
  };

  //혈당 값이 입력되어 있는지 확인
  const isValueOk = glucose.trim() !== "";

  async function handleSubmit() {
    //입력값이 없거나 이미 저장중인 경우 요청하지않음
    if (!isValueOk || submitting) {
      return;
    }
    setSubmitting(true);
    setError(null);

    const requestBody: CreateBloodGlucoseRequest = {
      glucose: Number(glucose),
      mealType,
      mealTiming,
      bgDate: formattedDate,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/blood-glucose/`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json",},
          credentials: "include",
          body: JSON.stringify(requestBody),
        },
      );
      if (!response.ok) {
        if (response.status === 409) {
          setError("해당 날짜 해당 시간대의 혈당이 이미 등록되어 있어요.");
        } else {
          setError("혈당 등록 중 문제가 발생했어요.");
        }
        return;
      }

      const saved: CreateBloodGlucoseResponse = await response.json();

      //부모로 등록 결과 전달
      await onSuccess(saved);
    } catch (error) {
      console.error("혈당 등록 오류:", error);
      setError("네트워크 오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>오늘 측정한 혈당을 입력하세요</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form} onSubmit={(event)=>{event.preventDefault(); void handleSubmit()}}>
          <div className={formStyle.formGroup}>
            <Radio value={mealType} onChange={handleMealType}>
              <Radio.Item id="breakfast" value="BREAKFAST" text="아침" />
              <Radio.Item id="lunch" value="LUNCH" text="점심" />
              <Radio.Item id="dinner" value="DINNER" text="저녁" />
            </Radio>
          </div>
          <div className={formStyle.formGroup}>
            <Radio value={mealTiming} onChange={handleMealTiming}>
              <Radio.Item id="before" value="BEFORE" text="식전" />
              <Radio.Item id="after" value="AFTER" text="식후" />
            </Radio>
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="glucose" className={formStyle.formLabel}>
              혈당
            </label>
            <Input
              unit="mg/dL"
              type="number"
              id="glucose"
              name="glucose"
              placeholder="혈당을 입력하세요"
              value={glucose}
              onChange={(event)=>{
                setGlucose(
                  event.target.value,
                )
                setError(null)
              }}
              required
            />
          </div>
          {error && <p>{error}</p>}

          <div className={formStyle.formButtonWrapper}>
            <Button
              type="button"
              variant="secondary"
              size="large"
              onClick={onSkip}
              disabled={submitting}
            >
              건너뛰기
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="large"
              onClick={handleSubmit}
              disabled={!isValueOk || submitting}
            >
              {submitting ? "저장중 ..." : "기록"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
