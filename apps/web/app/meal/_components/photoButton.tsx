
import { ReactNode } from "react";
import Image from "next/image";

import styles from "@/styles/meal/photoButton.module.css";

import { MealType, getMealTypeLabel } from "@/types/mealType";
import { Plus, Scan, Utensils } from "lucide-react";
import clsx from "clsx";


type PhotoButtonProps = {
  label: MealType;
  imageUrl?: string | null;
  canModify?: boolean;
  onClick?: () => void;
}


export default function PhotoButton({
  label,
  imageUrl,
  canModify = true,
  onClick
}: PhotoButtonProps) {


  return(
    <div className={styles.wrapper}>
      {canModify ? (
          <button type="button" className={styles.button} onClick={onClick}>
            <span className={styles.label}>{getMealTypeLabel(label)}</span>
            <Plus/>
          </button>
        ):(
          <div></div>
        )
      }
      {imageUrl && 
        <div className={styles.photo}>
          <Image src={imageUrl} alt={`${label} 사진`} width={100} height={100} />
        </div>
      }
    </div>
  )
}



