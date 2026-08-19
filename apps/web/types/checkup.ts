import { StatusType } from "@/types/statusType";

export interface CheckupDashBoardResponse {
  id: number;
  year: number;
  body_metrics: {
    height: number;
    weight: number;
    waist: number;
    bmi: number;
    visionLeft: number;
    visionRight: number;
    hearing: number;
  };
  blood_pressure: {
    bp_systolic: number;
    bp_diastolic: number;
  };
  diabetes_anemia: {
    fbg: number;
    hemoglobin: number;
  };
  liver: {
    ast: number;
    alt: number;
    ygtp: number;
  };
  kidney: {
    urine_protein: number;
    creatinine: number;
    egfr: number;
  };
  assessment: {
    id: number;
    bmi: StatusType;
    bp: string;
    urine_protein: StatusType;
    hemoglobin: StatusType;
    fbg: StatusType;
    egfr: StatusType;
    ast: StatusType;
    alt: StatusType;
    ygtp: StatusType;
  };
}

export interface CheckupHistoryItem {
  checkup_year: number;
  checkup_date: string;
  height: number;
  weight: number;
  waist: number;
  bmi: number;
  visionLeft: number;
  visionRight: number;
  hearing: string;
  bp_systolic: number;
  bp_diastolic: number;
  urine_protein: string;
  hemoglobin: number;
  fbg: number;
  creatinine: number;
  egfr: number;
  ast: number;
  alt: number;
  ygtp: number;
}

export interface UploadedData {
  checkup_history: CheckupHistoryItem[];
}
