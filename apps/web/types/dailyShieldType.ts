export type DailyShieldState = {
  id: number,
  feel: number | null,
  energy: number | null,
  exerciseTime: string,
  exerciseType: string,
  waterCup: number | null,
  supplementType: string,
  dailyDate: string,
  lastExerciseTime: string,
  lastExerciseType: string,
  lastWaterCup: number | null,
  lastSupplementType: string
}

export type ShieldPayload = Omit<
  DailyShieldState,
  'id' | 'lastExerciseTime' | 'lastExerciseType' | 'lastWaterCup' | 'lastSupplementType'
>;

