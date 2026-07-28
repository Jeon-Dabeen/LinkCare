'use client';

import { CircleOff } from "lucide-react";
import styles from "@/styles/meal/meal.module.css";

import Button from "@/app/_components/ui/Button";
import PhotoButton from "./photoButton";
import { MealItem } from "@/types/meal";
import { apiFetch } from "../_api/apiFetch";
import MealDetail from "./mealDetail";



interface MealDetailListProps {
  mealsList: MealItem[];
  isToday: boolean;
  onNavRecord: (mealType: string, mealId?: number, isSkipped?: boolean) => void;
}

export default function MealDetailList({
  mealsList,
  isToday,
  onNavRecord,
}: MealDetailListProps){

  const breakfast = mealsList.find((m) => m.mealType === 'BREAKFAST');
  const lunch = mealsList.find((m) => m.mealType === 'LUNCH');
  const dinner = mealsList.find((m) => m.mealType === 'DINNER');



  return (
    <MealDetail>
      {breakfast && breakfast.MealFood.length > 0 && 
        <MealDetail.List type="아침" isToday={isToday}
          onClick={isToday && breakfast.mealStatus !== 'SKIPPED'
            ? () => onNavRecord('BREAKFAST', breakfast.id)
            : undefined
          }
        >
          {breakfast.MealFood.map((food) => (
            <MealDetail.Item key={food.id} name={food.FoodName} calorie={food.calorie.toString()} />
          ))}
        </MealDetail.List>
      }
      {lunch && lunch.MealFood.length > 0 && 
        <MealDetail.List type="점심" isToday={isToday} onClick={()=>{}}>
          {lunch.MealFood.map((food) => (
            <MealDetail.Item key={food.id} name={food.FoodName} calorie={food.calorie.toString()} />
          ))}
        </MealDetail.List>
      }
      {dinner && dinner.MealFood.length > 0 && 
        <MealDetail.List type="저녁" isToday={isToday} onClick={()=>{}}>
          {dinner.MealFood.map((food) => (
            <MealDetail.Item key={food.id} name={food.FoodName} calorie={food.calorie.toString()} />
          ))}
        </MealDetail.List>
      }
    </MealDetail>
  )
}
