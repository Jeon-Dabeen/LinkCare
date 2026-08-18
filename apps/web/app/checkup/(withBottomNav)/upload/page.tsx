"use client";

import { useState } from "react";
import CheckupUploadForm from "../../_components/CheckupUploadForm";
import { CheckupHistoryItem, UploadedData } from "@/types/checkup";
import CheckupRegistrationForm from "../../_components/CheckupRegistrationFrom";

export default function Page() {
  const [step, setStep] = useState<"upload" | "confirm">("upload");
  const [uploadedData, setUploadedData] = useState<UploadedData>();
  const [isStatePageOpen, setIsStatePageOpen] = useState(false);

  const updateStep = (step: "upload" | "confirm") => {
    setStep(step);
  };

  const updateUploadedData = (data: UploadedData) => {
    setUploadedData(data);
  };

  const handleStageOpenChange = (value: boolean) => {
    setIsStatePageOpen(value);
  };

  const handleInputChange = (
    year: number,
    field: keyof CheckupHistoryItem,
    value: string | number | undefined,
  ) => {
    setUploadedData((prev) => {
      if (!prev) return prev;

      if (value === undefined) return;

      // TODO: 타입에 따른 유효성 검사 추가

      return {
        ...prev,
        checkup_history: prev.checkup_history.map((item) =>
          item.checkup_year === year
            ? { ...item, key: `checkup-${year}`, [field]: value }
            : item,
        ),
      };
    });
  };

  if (step === "upload") {
    return (
      <CheckupUploadForm
        {...{
          updateStep,
          updateUploadedData,
          isStatePageOpen,
          handleStageOpenChange,
        }}
      />
    );
  }
  if (
    step === "confirm" &&
    uploadedData &&
    uploadedData.checkup_history.length > 0
  ) {
    return (
      <CheckupRegistrationForm
        {...{
          uploadedData,
          updateStep,
          isStatePageOpen,
          handleStageOpenChange,
          handleInputChange,
        }}
      />
    );
  }
}
