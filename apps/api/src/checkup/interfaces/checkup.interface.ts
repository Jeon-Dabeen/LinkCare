export interface CheckupData {
  checkUpDate: string;
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

export interface CheckupResponse {
  height: number | null;
  weight: number | null;
  waist: number | null;
  bmi: number | null;
  visionLeft: number | null;
  visionRight: number | null;
  hearing: string | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  urine_protein: string | null;
  hemoglobin: number | null;
  fbg: number | null;
  creatinine: number | null;
  egfr: number | null;
  ast: number | null;
  alt: number | null;
  ygtp: number | null;
  year: number | null;
  checkUpDate: Date;
  isShow: boolean;
  createdAt: Date;
  id: number;
  userId: number;
}
