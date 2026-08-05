"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Dices } from "lucide-react";
import formStyle from "@/styles/components/form.module.css";

import { apiFetch } from "@/utils/api/apiFetch";

import BottomSheet from "@/app/_components/ui/BottomSheet";
import Input from "@/app/_components/ui/Input";
import Button from "@/app/_components/ui/Button";

interface SheetProps {
  isOpen: boolean;
  currentValue: string | null;
  onClose: () => void;
  onSave: (newNickname: string) => void;
  onRefresh: () => void;
}

export default function BottomSheetNickName({
  isOpen,
  currentValue,
  onClose,
  onSave,
  onRefresh,
}: SheetProps) {
  // 내부 입력 상태
  const [editingValue, setEditingValue] = useState<string | "">(
    currentValue ?? "",
  );

  // 저장버튼 상태 관리
  const [canSave, setCanSave] = useState(false);

  // Props가 바뀌거나 바텀시트가 열릴 때 초기화
  useEffect(() => {
    setEditingValue(currentValue ?? "");
  }, [currentValue, isOpen]);

  // 값 수정 함수
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingValue(e.target.value);
    setCanSave(false);
  };

  // 닉네임 랜덤 생성 함수
  const getRandomNickname = async () => {
    try {
      const result = await apiFetch<string>(`/profile/randomNickname`);
      const data = result.data;
      setEditingValue(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.warning(error.message);
      }
    }
    setCanSave(true);
  };

  // 중복 확인 버튼 클릭 시
  const handleCheckNickname = async () => {
    try {
      const result = await apiFetch<{ isAvailable: boolean }>(
        `/profile/checkNickname`,
        {
          method: "POST",
          body: JSON.stringify({ nickName: editingValue }),
        },
      );
      const data = result.data;
      if (data.isAvailable) {
        toast.success("사용 가능한 닉네임이에요!");
        setCanSave(true);
      } else {
        toast.error("이미 존재하는 닉네임이에요.");
        setCanSave(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        setCanSave(false);
        toast.warning(error.message);
      }
    }
  };

  // 저장 버튼 클릭 시 처리
  const handleSave = () => {
    onSave(editingValue);
    onRefresh();
    onClose();
  };

  return (
    <BottomSheet open={isOpen} title="닉네임 수정" onClose={onClose}>
      <div className={formStyle.formWrapper}>
        <div className={formStyle.formGroup}>
          <div className={formStyle.formInputWrapper}>
            <Input
              type="string"
              id="newNickname"
              name="newNickname"
              value={editingValue}
              placeholder={currentValue || ''}
              onChange={onChangeValue}
            />
            <Button
              type="button"
              variant="secondary"
              size="medium"
              disabled={currentValue == editingValue}
              onClick={handleCheckNickname}
            >
              중복 확인
            </Button>
          </div>
          <div className={formStyle.formInputWrapper}>
            <Button
              variant="text-primary"
              size="small"
              onClick={getRandomNickname}
            >
              <Dices size={16} />
              <span>닉네임 랜덤 생성</span>
            </Button>
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
