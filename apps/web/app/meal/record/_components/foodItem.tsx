import { CircleXIcon } from "lucide-react";
import styles from "@/styles/meal/record.module.css";

import { ButtonIcon } from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";

interface FoodItemProps {
  id?: number;
  foodName?: string;
  calorie?: number | null;
  canModify: boolean;
  onDelete: () => void;
  onChange: (
    field: "foodName" | "calorie",
    value: string | number | null,
  ) => void;
}

export default function FoodItem({
  foodName,
  calorie,
  canModify = false,
  onDelete,
  onChange,
}: FoodItemProps) {

  const MAX_UINT_CALORIE = 6000;

  const onChangeCalorie = (e:React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // 빈 값이 입력된 경우
    if(val == ""){
      onChange("calorie", "");
      return;
    }

    // 00 or 000
    if(Number(val) === 0 && val.includes("0")){
      onChange("calorie", "");
      return;
    }

    const numericValue = Number(val);

    // 최대값 제한
    const clampedValue = Math.min(numericValue, MAX_UINT_CALORIE);

    onChange("calorie", clampedValue);
  }


  return (
    <li className={styles.inputItem}>
      {canModify && (
        <ButtonIcon color="secondary" onClick={onDelete}>
          <CircleXIcon />
        </ButtonIcon>
      )}
      <div className={styles.name}>
        <Input
          type="text"
          value={foodName}
          disabled={!canModify}
          onChange={(e) => onChange("foodName", e.target.value)}
        />
      </div>
      <div className={styles.unit}>
        <Input
          type="number"
          unit="kcal"
          value={calorie ?? ""}
          disabled={!canModify}
          onChange={onChangeCalorie}
        />
      </div>
    </li>
  );
}
