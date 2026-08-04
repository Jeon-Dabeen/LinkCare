export type MealDailyResponse = {
  userId: number;
  date: string;
  goalCalorie: number;
  totalCalorie: number;
  photoUrl: string | null;
  mealType: string | null;
  foodName: string | null;
  unitCalorie: number;
};

export type DailyResponse = {
  userId: number;
  date: string;
  bloodPressure: {
    bpDate: string | null;
    systolic: number | null;
    diastolic: number | null;
  };
  bloodGlucose: {
    bgDate: string | null;
    glucose: number | null;
    mealTiming: string | null;
  };
  weight: {
    weight: number | null;
    goalWeight: number | null;
  };
};
