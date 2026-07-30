
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
    value: string | number | null
  )=> void;
}

export default function FoodItem({
  foodName,
  calorie,
  canModify = false,
  onDelete,
  onChange,
}: FoodItemProps){

  return (
      <li className={styles.inputItem}>
        {canModify && 
          <ButtonIcon color="secondary" onClick={onDelete}>
            <CircleXIcon/>
          </ButtonIcon>
        }
        <div className={styles.name}>
          <Input type="text" value={foodName} disabled={!canModify} onChange={(e) => onChange('foodName', e.target.value)} />
        </div>
        <div className={styles.unit}>
          <Input type="number" unit="kcal" value={calorie ?? ""} disabled={!canModify} onChange={(e) => onChange('calorie', Number(e.target.value))} />
        </div>
      </li>
  )
}
