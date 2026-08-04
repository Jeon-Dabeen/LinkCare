"use client";

import { useState } from "react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import Radio from "@/app/_components/ui/Radio";
import {
  CreateBloodPressureRequest,
  CreateBloodPressureResponse,
  DayPeriod,
} from "@/types/bloodPressureType";
import { ENV } from "@/env";

interface BloodPressureRegisterFormProps {
  formattedDate: string;
  initialDayPeriod: DayPeriod;
  onSkip: () => void;
  onSuccess: (result: CreateBloodPressureResponse) => void | Promise<void>;
}

export default function BloodPressureRegisterForm({
  formattedDate,
  initialDayPeriod,
  onSkip,
  onSuccess,
}: BloodPressureRegisterFormProps) {
  //아침 저녁
  const [dayPeriod, setDayPeriod] = useState<DayPeriod>(initialDayPeriod);

  //혈압 입력값
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");

  //요청 중복 방지
  const [submitting, setSubmitting] = useState(false);

  //등록오류
  const [error, setError] = useState<string | null>(null);

  //아침저녁변경
  function handleDayPeriod(value: string) {
    setDayPeriod(value as DayPeriod);
  }

  //수축기 이완기 필수
  const isValueOk = systolic.trim()!== "" && diastolic.trim()!== "";

  async function handleSubmit() {
    if (!isValueOk || submitting) {
      return;
    }
    const systolicNumber = Number(systolic);
    const diastolicNumber = Number(diastolic);

    const pulseNumber = pulse.trim() === "" ? undefined : Number(pulse);

    //검증
    if (
      !Number.isFinite(systolicNumber) ||
      systolicNumber <= 0 ||
      !Number.isFinite(diastolicNumber) ||
      diastolicNumber <= 0
    ) {
      setError("올바른 혈압값을 입력해주세요");
      return;
    }

    //맥박을 입력시에만 추가 검증
    if (
      pulseNumber !== undefined &&
      (!Number.isFinite(pulseNumber) || pulseNumber <= 0)
    ) {
      setError("올바른 맥박값을 입력해주세요.");
      return;
    }

    const requestBody: CreateBloodPressureRequest = {
      systolic: systolicNumber,
      diastolic: diastolicNumber,
      dayPeriod,
      bpDate: formattedDate,

      //맥박을 입력했을 때만 body에 추가
      ...(pulseNumber !== undefined && {
        pulse: pulseNumber,
      }),
    };
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${ENV.API_URL}/blood-pressure/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (response.status === 409) {
        setError("해당 날짜 해당 시간대의 혈압이 이미 등록되어 있어요.");
        return;
      }

      if (!response.ok) {
        throw new Error(`혈압 등록 실패: ${response.status}`);
      }

      const saved: CreateBloodPressureResponse = await response.json();

      //부모 페이지에 저장 결과 전달
      await onSuccess(saved);
    } catch (error) {
      console.error("혈압 등록 오류:", error);
      setError("혈압 등록 중 문제가 발생했어요.");
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
          onSubmit={(event)=>{
            event.preventDefault();
            void handleSubmit();
          }}>
          <div className={formStyle.formGroup}>
            <Radio value={dayPeriod} onChange={handleDayPeriod}>
              <Radio.Item id="morning" value="MORNING" text="아침" />
              <Radio.Item id="evening" value="EVENING" text="저녁" />
            </Radio>
          </div>
          <div className={formStyle.formGroup}>
            <label 
            htmlFor="bpHigh" className={formStyle.formLabel}>
              최고혈압
            </label>
            <Input
              unit="mmHg"
              type="number"
              id="bpHigh"
              name="bpHigh"
              placeholder="SYS 최고혈압"
              min={1}
              max={200}
              value={systolic}
              onChange={(event)=>{
                setSystolic(event.target.value);
                setError(null);
              }}
              required
            />
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="bpLow" className={formStyle.formLabel}>
              최저혈압
            </label>
            <Input
              unit="mmHg"
              type="number"
              id="bpLow"
              name="bpLow"
              placeholder="DIA 최저혈압"
              min={1}
              value={diastolic}
              onChange={(event)=>{
                setDiastolic(event.target.value);
                setError(null)
              }}
              required
            />
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="bpm" className={formStyle.formLabel}>
              맥박
            </label>
            <Input
              unit="bpm"
              type="number"
              id="bpm"
              name="bpm"
              placeholder="PULSE 맥박"
              min={1}
              value={pulse}
              onChange={(event)=>{
                setPulse(event.target.value);
                setError(null)
              }}
            />
          </div>
          {error && <p>{error}</p>}
          <div className={commonStyle.fixedBottom}>
            <div className={commonStyle.fixedBottomInner}>
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
                disabled={!isValueOk || submitting}
                >
                {submitting ? "저장 중 ..." : "기록"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
