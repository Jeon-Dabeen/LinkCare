'use client';

import Image from "next/image";
import { Salad, Scan, Utensils } from "lucide-react";

import clsx from "clsx";
import styles from "@/styles/home/meal.module.css";


import Progress from "@/app/_components/ui/Progress";

import { formatNumber } from "@/lib/format";


type MealProps = {
  imageUrl?: string | null;
  mealType?: string | null;
  foodName?: string | null;
  foodCalorie?: number | null;
  todayCalorie?: number | 0;
  goalCalorie: number;
}


export default function Meal ({
  imageUrl,
  mealType,
  foodName,
  foodCalorie,
  todayCalorie = 0,
  goalCalorie
}: MealProps){

  return (
    <div className={styles.wrapper}>
      <Progress 
        value={todayCalorie}
        max={goalCalorie}
        unit="kcal"
        isInfo
      />
      <div className={styles.foodWrapper}>
        <div className={styles.photo}>
        {imageUrl ? (
            <Image src={imageUrl} alt={`${foodName} 사진`} width={100} height={100} />
          ): (
            <Scan size={48} strokeWidth={1}>
              <Utensils
                size={8}
                x={8}
                y={8}
                strokeWidth={2.5}
              />
            </Scan>
          )}
        </div>
        <div className={styles.textArea}>
          <p className={styles.type}>{mealType}</p>
          <p className={styles.foodName}>{foodName}</p>
          <p className={styles.foodCalorie}>
            <strong className={styles.calorie}>{formatNumber(foodCalorie)}</strong>
            <span>kcal</span>
          </p>
        </div>
      </div>
    </div>
  )
}


