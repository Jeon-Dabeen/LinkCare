"use client";

import Button from "@/app/_components/ui/Button";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import Input from "@/app/_components/ui/Input";

import formStyle from "@/styles/components/form.module.css";

type HeightInputBottomSheetProps = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function HeightBottomSheet({
  open,
  value,
  onChange,
  onClose,
  onSubmit,
}: HeightInputBottomSheetProps) {
  return (
    <BottomSheet open={open} title="키" onClose={onClose}>
      <div className={formStyle.formWrapper}>
        <div className={formStyle.formGroup}>
          <Input
            unit="cm"
            type="number"
            id="newHeight"
            name="newHeight"
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