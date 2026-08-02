"use client";

import { FormEvent, useState } from "react";

import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";

interface RegisterResult {
  weight: number;
  weightDate: string;
  bmi: number | null;
  height: number | null;
  goalWeight: number | null;
  goalWeightState: "-" | "+" | "0" | null;
}

interface CreateWeightResponse {
  id: number;
  userId: number;
  weight: number;
  bmi: number | null;
  weightDate: string;
  createdAt: string;
  height: number | null;
  goalWeight: number | null;
  goalWeightState: "-" | "+" | "0" | null;
}

interface RegisterProps {
  formattedDate: string;
  existHeight:number | null; //키와 목표체중이 이미 있다면 받아옴
  existGoalWeight:number | null;
  onSkip: () => void;
  onSuccess: (result: RegisterResult) => void;
}

interface CreateWeightBody {
  weight: number;
  weightDate: string;
  height?: number;
  goalWeight?: number;
}


export default function WeightRegisterForm({
  formattedDate,
  existHeight,
  existGoalWeight,
  onSkip,
  onSuccess,
}: RegisterProps) {
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentHeight, setCurrentHeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]= useState<string | null>(null)

  //DB에 키,목표체중이 없을때만 입력받음
  const needHeight = existHeight === null;
  const needGoalWeight = existGoalWeight === null;

  //값이 있는지 체크
  //체중이 있다면 true
  let isValueOk = currentWeight !=="";
  
  //값이 없을때 버튼 비활성화를 위함
  if(needHeight && currentHeight ===""){
    isValueOk = false;//
  }
  if(needGoalWeight && goalWeight ===""){
    isValueOk= false
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(!isValueOk || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    //체중과 날짜는 항상 전송
    const requestBody:CreateWeightBody={
      weight:Number(currentWeight),
      weightDate:formattedDate,
    }
    if(needHeight){
      requestBody.height =Number(currentHeight);
    }
    if(needGoalWeight){
      requestBody.goalWeight=Number(goalWeight)
    }

    try {
      const response = await fetch(`http://localhost:3001/weight`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );
      if (!response.ok) {
        if (response.status === 409) {
          setError("오늘 체중은 이미 등록되어 있어요");
        } else {
          setError("문제 발생");
        }
        return;
      }
      const saved: CreateWeightResponse = await response.json();

      onSuccess({
        weight: saved.weight,
        weightDate: saved.weightDate,
        bmi: saved.bmi,
        height: saved.height,
        goalWeight: saved.goalWeight,
        goalWeightState: saved.goalWeightState,
      });
    } catch {
      setError("네트워크 오류 발생");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>체중을 입력하세요</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form}  onSubmit={handleSubmit}>
          {needHeight && (
          <div className={formStyle.formGroup}>
            <label htmlFor="currentHeight" className={formStyle.formLabel}>
              키
            </label>
            <Input
              unit="cm"
              type="number"
              id="currentHeight"
              name="currentHeight"
              value={currentHeight}
              onChange={(e) => setCurrentHeight(e.target.value)}
              required
            />
          </div>
          )}
          <div className={formStyle.formGroup}>
            <label htmlFor="currentWeight" className={formStyle.formLabel}>
              체중
            </label>
            <Input
              unit="kg"
              type="number"
              id="currentWeight"
              name="currentWeight"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              required
            />
          </div>
          {needGoalWeight &&(
          <div className={formStyle.formGroup}>
            <label htmlFor="goalWeight" className={formStyle.formLabel}>
              목표체중
            </label>
            <Input
              unit="kg"
              type="number"
              id="goalWeight"
              name="goalWeight"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              required
            />
          </div>)}
          {error && <p>{error}</p>}
          <div className={commonStyle.fixedBottom}>
            <div className={commonStyle.fixedBottomInner}>
              <Button
                type="button"
                variant="secondary"
                onClick={onSkip}
                size="large"
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
          </div>
        </form>
      </div>
    </section>
  );
}
