"use client";

import Button from "@/app/_components/ui/Button";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import Input from "@/app/_components/ui/Input";

import formStyle from "@/styles/components/form.module.css";

type GoalWeightInputBottomSheetProps = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function GoalWeightInputBottomSheet({
  open,
  value,
  onChange,
  onClose,
  onSubmit,
}: GoalWeightInputBottomSheetProps) {
  return (
    <BottomSheet open={open} title="목표 체중" onClose={onClose}>
      <div className={formStyle.formWrapper}>
        <div className={formStyle.formGroup}>
          <Input
            unit="kg"
            type="number"
            id="goalWeight"
            name="goalWeight"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            required
          />
        </div>

        <Button
          type="button"
          variant="primary"
          size="large"
          onClick={onSubmit}
          disabled={value === ""}
        >
          기록
        </Button>
      </div>
    </BottomSheet>
  );
}