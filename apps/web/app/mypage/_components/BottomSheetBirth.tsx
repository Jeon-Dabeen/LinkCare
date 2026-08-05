"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { toast } from "sonner";

import formStyle from "@/styles/components/form.module.css";

import BottomSheet from "@/app/_components/ui/BottomSheet";
import Input from "@/app/_components/ui/Input";
import Button from "@/app/_components/ui/Button";
import { formatDate } from "@/utils/format";

// dayjs 엄격한 날짜 포맷 검증 플러그인 추가
dayjs.extend(customParseFormat);

interface SheetProps {
  isOpen: boolean;
  currentValue: string;
  onClose: () => void;
  onSave: (birthDate: string) => void;
  onRefresh?: () => void;
}

export default function BottomSheetBirth({
  isOpen,
  currentValue,
  onClose,
  onSave,
  onRefresh,
}: SheetProps) {
  // 내부 입력 상태
  const [editingValue, setEditingValue] = useState<string>(currentValue ?? "");

  // 저장버튼 상태 관리
  const [canSave, setCanSave] = useState<boolean>(false);

  // Props가 바뀌거나 바텀시트가 열릴 때 초기화
  useEffect(() => {
    const initialValue = currentValue ?? "";
    setEditingValue(formatDate(initialValue, "YYYY-MM-DD")); // YYYY-MM-DD 형식으로 초기화

    // 초기값이 유효한 YYYY-MM-DD 날짜인지 확인
    setCanSave(validateBirthDate(initialValue));
  }, [currentValue, isOpen]);

  // 날짜 유효성 검증 함수 (dayjs strict mode 사용)
  const validateBirthDate = (dateString: string): boolean => {
    if (dateString.length !== 10) return false;
    // YYYY-MM-DD 포맷과 일치하며 실제 존재하는 날짜(Strict)인지 체크
    return dayjs(dateString, "YYYY-MM-DD", true).isValid();
  };

  // 숫자만 입력받아 YYYY-MM-DD로 포맷팅하는 함수
  const formatBirthDate = (value: string) => {
    // 숫자 이외의 모든 문자(하이픈 포함)를 제거하고 최대 8자리 숫만 남김
    const digits = value.replace(/\D/g, "").slice(0, 8);

    // 자릿수에 맞춰 하이픈(-)을 자동으로 조립
    if (digits.length <= 4) {
      return digits;
    }
    if (digits.length <= 6) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
  };

  // 값 수정 함수
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthDate(e.target.value);
    setEditingValue(formatted);

    // 10자 완구 되었을 때 검증 수행
    if (formatted.length === 10) {
      const isValid = validateBirthDate(formatted);
      setCanSave(isValid);

      if (!isValid) {
        toast.error("올바른 날짜 형식이 아니에요. (예: 1998-05-20)");
      }
    } else {
      setCanSave(false);
    }
  };

  // 저장 버튼 클릭 시 처리
  const handleSave = () => {
    if (!canSave) {
      toast.error("생년월일을 올바르게 입력해 주세요.");
      return;
    }
    onSave(editingValue);
    if (onRefresh) onRefresh();
    onClose();
  };

  return (
    <BottomSheet open={isOpen} title="생년월일 수정" onClose={onClose}>
      <div className={formStyle.formWrapper}>
        <div className={formStyle.formGroup}>
          <div className={formStyle.formInputWrapper}>
            <Input
              type="string"
              id="birthDate"
              name="birthDate"
              value={editingValue}
              placeholder={currentValue.slice(0, 10)}
              onChange={onChangeValue}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="large"
          onClick={handleSave}
          disabled={!canSave}
        >
          저장
        </Button>
      </div>
    </BottomSheet>
  );
}
