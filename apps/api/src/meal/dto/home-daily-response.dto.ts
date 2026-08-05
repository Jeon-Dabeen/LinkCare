export class BloodPressureDto {
  bpDate: string | null;
  systolic: number | null;
  diastolic: number | null;
}

export class BloodGlucoseDto {
  bgDate: string | null;
  glucose: number | null;
  mealTiming: string | null;
}

export class WeightDto {
  weight: number | null;
  goalWeight: number | null;
}

export class HomeDailyResponseDto {
  userId: number;
  date: string;
  bloodPressure: BloodPressureDto;
  bloodGlucose: BloodGlucoseDto;
  weight: WeightDto;
}