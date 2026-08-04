import Button from "@/app/_components/ui/Button";
import styles from "@/styles/meal/mealDetail.module.css";
import { getMealTypeLabel } from "@/types/mealType";
import { Pencil } from "lucide-react";
import { ReactNode } from "react";

type MealDetailProps = {
  children: ReactNode;
};

export default function MealDetail({ children }: MealDetailProps) {
  return <article className={styles.wrapper}>{children}</article>;
}

// MealList
type MealListProps = {
  type: string;
  canModify: boolean;
  onClick?: () => void;
  children: ReactNode;
};

export function MealList({
  type,
  canModify,
  onClick,
  children,
}: MealListProps) {
  return (
    <div className={styles.listWrapper}>
      <div className={styles.listHeader}>
        <p className={styles.type}>{getMealTypeLabel(type)}</p>
        {canModify && (
          <Button variant="text-tertiary" size="small" onClick={onClick}>
            <Pencil size={16} />
            <span>수정</span>
          </Button>
        )}
      </div>
      <ul className={styles.list}>{children}</ul>
    </div>
  );
}

// MealItem
type MealItemProps = {
  name: string;
  calorie: number;
};

export function MealItem({ name, calorie }: MealItemProps) {
  return (
    <li className={styles.item}>
      <p className={styles.foodName}>{name}</p>
      <p className={styles.unitCalorie}>
        <strong>{calorie.toLocaleString()}</strong>kcal
      </p>
    </li>
  );
}

MealDetail.List = MealList;
MealDetail.Item = MealItem;
