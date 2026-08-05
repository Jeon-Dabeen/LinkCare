"use client";

import { useEffect, useState } from "react";

import clsx from "clsx";
import { Mars, Venus, Check } from "lucide-react";
import formStyle from "@/styles/components/form.module.css";
import styles from "@/styles/mypage/gender.module.css";

import BottomSheet from "@/app/_components/ui/BottomSheet";
import Button from "@/app/_components/ui/Button";
import { GenderType, genderTypeLabel } from "@/types/profileType";

interface SheetProps {
  isOpen: boolean;
  currentValue: GenderType | null;
  onClose: () => void;
  onSave: (newGender: GenderType | null) => void;
  onRefresh?: () => void;
}

export default function BottomSheetGender({
  isOpen,
  currentValue,
  onClose,
  onSave,
  onRefresh,
}: SheetProps) {
  // 초기 상태 설정
  const [selectedGender, setSelectedGender] = useState<GenderType | null>(
    currentValue ?? null,
  );

  // 바텀시트가 열릴 때마다(isOpen: true) 부모 컴포넌트의 currentValue로 상태 동기화
  useEffect(() => {
    if (isOpen) {
      setSelectedGender(currentValue ?? null);
    }
  }, [currentValue, isOpen]);

  // 성별 선택 핸들러
  const handleSelect = (gender: GenderType | null) => {
    setSelectedGender(gender);
  };

  // 기존 값과 달라진 경우에만 저장 버튼 활성화 (null 포함)
  const isValid = selectedGender !== (currentValue ?? null);

  // 저장 처리
  const handleSave = () => {
    if (!isValid) return;

    onSave(selectedGender);
    if (onRefresh) onRefresh();
    onClose();
  };

  return (
    <BottomSheet open={isOpen} title="성별 수정" onClose={onClose}>
      <div className={formStyle.formWrapper}>
        <div className={formStyle.formGroup}>
          <div className={styles.genderGroup}>
            {/* 여성 버튼 */}
            <button
              type="button"
              className={clsx(
                styles.radioButton,
                selectedGender === "F" && styles.active,
              )}
              onClick={() => handleSelect("F")}
            >
              <Venus size={20} className={styles.genderIcon} />
              <span>{genderTypeLabel.F}</span>
              {selectedGender === "F" && (
                <Check size={18} className={styles.checkIcon} />
              )}
            </button>

            {/* 남성 버튼 */}
            <button
              type="button"
              className={clsx(
                styles.radioButton,
                selectedGender === "M" && styles.active,
              )}
              onClick={() => handleSelect("M")}
            >
              <Mars size={20} className={styles.genderIcon} />
              <span>{genderTypeLabel.M}</span>
              {selectedGender === "M" && (
                <Check size={16} className={styles.checkIcon} />
              )}
            </button>

            {/* 선택 안함 버튼 */}
            <button
              type="button"
              className={clsx(
                styles.radioButton,
                selectedGender === null && styles.active,
              )}
              onClick={() => handleSelect(null)}
            >
              <span>{genderTypeLabel.null}</span>
              {selectedGender === null && (
                <Check size={18} className={styles.checkIcon} />
              )}
            </button>
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
