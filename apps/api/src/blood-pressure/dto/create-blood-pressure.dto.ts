import { dayperiod } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, Matches, Min } from "class-validator";

export class CreateBloodPressureDto {
  @IsInt()
  @Min(0)
  systolic: number;

  @IsInt()
  @Min(0)
  diastolic: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  pulse?: number;

  @IsEnum(dayperiod)
  dayPeriod: dayperiod;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  bpDate: string;
}
