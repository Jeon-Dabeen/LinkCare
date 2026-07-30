
import styles from "@/styles/meal/photoButton.module.css";

import { MealType, getMealTypeLabel } from "@/types/mealType";
import { BeefOff, PaperBag, Plus } from "lucide-react";

type PhotoButtonProps = {
  label: MealType;
  imageUrl?: string | null;
  canModify?: boolean;
  onClick?: () => void;
  isSkipped?: boolean;
}

export default function PhotoButton({
  label,
  imageUrl,
  canModify = true,
  onClick,
  isSkipped,
}: PhotoButtonProps) {

  return(
    <div className={styles.wrapper}>
      {canModify ? (
          <button type="button" className={styles.button} onClick={onClick}>
            <span className={styles.label}>{getMealTypeLabel(label)}</span>
            <Plus/>
          </button>
        ):
          isSkipped 
            ? <div className={styles.notModify}><BeefOff /></div>
            : (<div className={styles.notModify}><PaperBag /></div>)
      }
      {imageUrl && 
        <div className={styles.photo}>
          <img src={imageUrl} alt={`${label} 사진`} width={100} height={100} />
        </div>
      }
    </div>
  )
}
