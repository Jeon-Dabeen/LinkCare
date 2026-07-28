'use client';

import { CircleOff } from "lucide-react";
import styles from "@/styles/meal/meal.module.css";

import Button from "@/app/_components/ui/Button";
import PhotoButton from "./photoButton";
import { MealItem } from "@/types/meal";
import { apiFetch } from "../_api/apiFetch";



interface MealPhotoListProps {
  mealsList: MealItem[];
  isToday: boolean;
  formattedDate: string;
  onNavRecord: (mealType: string, mealId?: number, isSkipped?: boolean) => void;
  onRefresh: () => void;
}

export default function MealPhotoList({
  mealsList,
  isToday,
  formattedDate,
  onNavRecord,
  onRefresh
}: MealPhotoListProps){

  const breakfast = mealsList.find((m) => m.mealType === 'BREAKFAST');
  const lunch = mealsList.find((m) => m.mealType === 'LUNCH');
  const dinner = mealsList.find((m) => m.mealType === 'DINNER');


  // 안먹었어요 버튼
  async function handleToggleSkip(mealId: number, currentState: string, mealFoodCount: number = 0){
    if(currentState !== 'SKIPPED' && mealFoodCount > 0){
      return;
    }

    // 이미 안먹음 상태면 취소, 아니면 SKIPPED로 변경
    const nextStatus = currentState === 'SKIPPED' ? 'PENDING' : 'SKIPPED';

    try{
      await apiFetch(`meal/${mealId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          mealStatus: nextStatus,
          baseDate: formattedDate,
        })
      });

      // 화면 데이터를 최신화하기 위해 다시 불러오기
      onRefresh();
    }catch(error){
      console.log('안먹었어요 상태 변경 error', error);
      alert('안먹었어요 상태 변경 실패')
    }
  }

  return (
    <article className={styles.photoList}>
            <div className={styles.photoItem}>
              <PhotoButton 
                label="BREAKFAST"
                imageUrl={breakfast?.photoUrl ?? undefined}
                onClick={() => onNavRecord('BREAKFAST', breakfast?.id, breakfast?.mealStatus === 'SKIPPED')}
                canModify= {isToday}
              />
              {isToday && breakfast && (breakfast?.MealFood?.length ?? 0) === 0 && 
                <Button variant="text-tertiary"
                  onClick={() => handleToggleSkip(breakfast.id, breakfast.mealStatus, breakfast.MealFood.length ?? 0)}
                >
                  <CircleOff size={16} /><span>안먹었어요</span>
                </Button>
              }
            </div>
            <div className={styles.photoItem}>
              <PhotoButton 
                label="LUNCH"
                imageUrl={lunch?.photoUrl ?? undefined}
                onClick={() => onNavRecord('LUNCH', lunch?.id, lunch?.mealStatus === 'SKIPPED')}
                canModify= {isToday}
              />
              {isToday && lunch && (lunch?.MealFood?.length ?? 0) === 0 && 
                <Button variant="text-tertiary"
                  onClick={() => handleToggleSkip(lunch.id, lunch.mealStatus, lunch.MealFood.length ?? 0)}
                >
                  <CircleOff size={16} /><span>안먹었어요</span>
                </Button>
              }
            </div>
            <div className={styles.photoItem}>
              <PhotoButton 
                label="DINNER"
                imageUrl={dinner?.photoUrl ?? undefined}
                onClick={() => onNavRecord('DINNER', dinner?.id, dinner?.mealStatus === 'SKIPPED')}
                canModify={isToday}
              />
              {isToday && dinner && (dinner?.MealFood?.length ?? 0) === 0 && 
                <Button variant="text-tertiary"
                  onClick={() => handleToggleSkip(dinner.id, dinner.mealStatus, dinner.MealFood.length ?? 0)}
                >
                  <CircleOff size={16} /><span>안먹었어요</span>
                </Button>
              }
            </div>
          </article>
  )
}
