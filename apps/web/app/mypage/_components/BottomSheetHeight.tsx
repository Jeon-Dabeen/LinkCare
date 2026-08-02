"use client";

import { useEffect, useState } from "react";
import formStyle from "@/styles/components/form.module.css";

import BottomSheet from "@/app/_components/ui/BottomSheet";
import Input from "@/app/_components/ui/Input";
import Button from "@/app/_components/ui/Button";

interface SheetProps {
  isOpen: boolean;
  currentValue: number | string | null;
  onClose: () => void;
  onSave: (newHeight: number) => void;
  onRefresh?: () => void;
}

export default function BottomSheetHeight({
  isOpen,
  currentValue,
  onClose,
  onSave,
  onRefresh,
}: SheetProps) {
  // 소수점 입력 중간 과정("175.")을 자연스럽게 보존하기 위해 string 상태로 관리
  const [editingValue, setEditingValue] = useState<string>(
    currentValue ? String(currentValue) : "",
  );

  // 바텀시트가 열리거나 currentValue 변경 시 초기화
  useEffect(() => {
    setEditingValue(currentValue ? String(currentValue) : "");
  }, [currentValue, isOpen]);

  // 소수점 입력 처리 및 유효성 검사
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === "") {
      setEditingValue("");
      return;
    }

    // 숫자 및 소수점 1자리까지만 허용하는 정규식
    const regex = /^\d*(\.\d{0,1})?$/;

    if (regex.test(val)) {
      const numVal = Number(val);
      // 300 이하일 때만 state 업데이트 (300을 넘는 입력 방지)
      if (numVal <= 300) {
        setEditingValue(val);
      }
    }
  };

  // 유효성 검사 (0 초과 ~ 300 이하의 유효한 숫자)
  const numValue = Number(editingValue);
  const isValid =
    editingValue !== "" &&
    !isNaN(numValue) &&
    numValue > 0 &&
    numValue <= 300 &&
    !editingValue.endsWith("."); // "165." 처럼 점으로 끝나는 상태는 저장 불가

  // 저장 처리
  const handleSave = () => {
    if (isValid) {
      // 소수점 1자리 수치로 변환해서 전달
      const formattedHeight = Number(numValue.toFixed(1));
      onSave(formattedHeight);
      if (onRefresh) onRefresh();
      onClose();
    }
  };

  return (
    <BottomSheet open={isOpen} title="키 수정" onClose={onClose}>
      <div className={formStyle.formWrapper}>
        <div className={formStyle.formGroup}>
          <div className={formStyle.formInputWrapper}>
            <Input
              type="text"
              inputMode="decimal"
              id="newHeight"
              name="newHeight"
              value={editingValue}
              placeholder="예: 175.5"
              unit="cm"
              onChange={handleChange}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="large"
          onClick={handleSave}
          disabled={!isValid}
        >
          저장
        </Button>
      </div>
    </BottomSheet>
  );
}
