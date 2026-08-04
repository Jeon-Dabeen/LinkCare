import { MealType, MealStatus } from "./mealType";

export interface MealFoodItem {
  id: number;
  mealId: number;
  FoodName: string;
  calorie: number;
}

export interface MealItem {
  id: number;
  userId: number;
  mealType: MealType;
  mealDate: string;
  goalCalorie: number | null;
  unitCalorie: number | null;
  photoUrl: string | null;
  mealStatus: MealStatus;
  createdAt: string;
  updatedAt: string | null;
  MealFood: MealFoodItem[]; // 등록된 음식 목록
}

export type MealResponse = MealItem[];

export type GoalCalorieResponse = {
  goalCalorie: number;
};

export type MealFoodResponse = {
  mealId: number;
  mealDate: string;
  photoUrl: string;
  mealFood: MealFoodItem[];
};

export type UpdateStateResponse = {
  mealId: number;
  mealState: MealStatus;
};
