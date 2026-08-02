export type DayPeriod = "MORNING" | "EVENING";

export interface BloodPressureRecord {
  id?:number;
  systolic: number;
  diastolic: number;
  pulse: number | null;
  dayPeriod: DayPeriod;
  bpDate: string;
}

export interface CreateBloodPressureRequest {
  systolic: number;
  diastolic: number;
  pulse?: number;
  dayPeriod: DayPeriod;
  bpDate: string;
}

export interface CreateBloodPressureResponse {
  id: number;
  userId: number;
  systolic: number;
  diastolic: number;
  pulse: number | null;
  dayPeriod: DayPeriod;
  bpDate: string;
}

export interface UpdateBloodPressurePulseRequest {
  pulse: number;
}
