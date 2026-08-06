"use client";

import { FormEvent, useState } from "react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import { ENV } from "@/env";

interface RegisterProps {
  formattedDate: string;
  existGoalWeight: number | null
  onSkip: () => void;
  onSuccess: () => void | Promise<void>;
}

interface CreateWeightBody {
  weight: number;
  weightDate: string;
  goalWeight?: number; //목표체중이 없는 회원만 전송
}

export default function WeightRegisterForm({
  formattedDate,
  existGoalWeight,
  onSkip,
  onSuccess,
}: RegisterProps) {
  //오늘 체중
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null)

  // DB에 목표체중이 없을때만 입력받음
  const needGoalWeight = existGoalWeight === null;

  // 체중이 있는지 체크
  let isValueOk = currentWeight.trim() !== "";

  // 체중이 없을때 버튼 비활성화를 위함
  if (needGoalWeight && goalWeight.trim() === "") {
    isValueOk = false;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValueOk || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    // 체중과 날짜는 항상 전송
    // 키는 서버 프로필을 조회하여 bmi 계산
    const requestBody: CreateWeightBody = {
      weight: Number(currentWeight),
      weightDate: formattedDate,
    }
    //목표체중이 없다면 함께 전송
    if (needGoalWeight) {
      requestBody.goalWeight = Number(goalWeight)
    }

    try {
      const response = await fetch(`${ENV.API_URL}/weight`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setError("오늘 체중은 이미 등록되어 있어요");
        } else {
          const errorData = await response.json();
          setError(errorData.message || "오류가 발생했습니다.");
        }
        return;
      }
      await onSuccess();
    } catch (error) {
      console.error("체중 등록 오류:", error);
      setError("네트워크 오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>오늘 측정한 혈압을 입력하세요</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form
          className={formStyle.form}
          onSubmit={handleSubmit}
        >
          <div className={formStyle.formGroup}>
            <label
              htmlFor="currentWeight"
              className={formStyle.formLabel}
            >
              체중
            </label>
            <Input
              unit="kg"
              type="number"
              id="currentWeight"
              name="currentWeight"
              placeholder="체중을 입력하세요"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              required
            />
          </div>
          {needGoalWeight && (
            <div className={formStyle.formGroup}>
              <label
                htmlFor="goalWeight"
                className={formStyle.formLabel}
              >
                목표체중
              </label>
              <Input
                unit="kg"
                type="number"
                id="goalWeight"
                name="goalWeight"
                placeholder="목표 체중을 입력하세요"
                value={goalWeight}
                onChange={(e) => setGoalWeight(e.target.value)}
                required
              />
            </div>)}
          {error && <p className={commonStyle.textError}>{error}</p>}
          <div className={formStyle.formButtonWrapper}>
            <Button
              type="button"
              variant="secondary"
              onClick={onSkip}
              size="large"
              disabled={submitting}
            >
              건너뛰기
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={!isValueOk || submitting}
            >
              {submitting ? "저장중..." : "기록"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
