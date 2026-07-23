import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDecimal, IsInt, IsObject, IsOptional, IsString, Min, MinLength } from "class-validator";

export class DashboardResponseDto {
  @IsInt()
  @Min(1)
  id: number;

  @IsObject()
  @Type(() => BodyMetricsDto)
  body_metrics: BodyMetricsDto;

  @IsObject()
  @Type(() => BloodPressureDto)
  blood_pressure: BloodPressureDto;

  @IsObject()
  @Type(() => DiabetesAnemiaDto)
  diabetes_anemia: DiabetesAnemiaDto;

  @IsObject()
  @Type(() => LiverDto)
  liver: LiverDto;

  @IsObject()
  @Type(() => KidneyDto)
  kidney: KidneyDto;
}

export class BodyMetricsDto {
  @ApiProperty({ example: 151.0 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  @Min(1.0)
  height: number | null;

  @ApiProperty({ example: 50.0 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  @Min(1.0)
  weight: number | null;

  @ApiProperty({ example: 81.0 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  @Min(1.0)
  waist: number | null;

  @ApiProperty({ example: 21.9 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  @Min(1.0)
  bmi: number | null;

  @ApiProperty({ example: 0.7 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  visionLeft: number | null;

  @ApiProperty({ example: 0.2 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  visionRight: number | null;

  @ApiProperty({ example: "정상/정상" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  hearing: string | null;
}

export class BloodPressureDto {
  @ApiProperty({ example: 110 })
  @IsOptional()
  @IsInt()
  @Min(1)
  bp_systolic: number | null;

  @ApiProperty({ example: 70 })
  @IsOptional()
  @IsInt()
  @Min(1)
  bp_diastolic: number | null;
}

export class DiabetesAnemiaDto {
  @ApiProperty({ example: 103 })
  @IsOptional()
  @IsInt()
  @Min(1)
  fbg: number | null;

  @ApiProperty({ example: 13.4 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  hemoglobin: number | null;
}

export class LiverDto {
  @ApiProperty({ example: 21 })
  @IsOptional()
  @IsInt()
  @Min(1)
  ast: number | null;

  @ApiProperty({ example: 17 })
  @IsOptional()
  @IsInt()
  @Min(1)
  alt: number | null;

  @ApiProperty({ example: 14 })
  @IsOptional()
  @IsInt()
  @Min(1)
  ygtp: number | null;
}

export class KidneyDto {
  @ApiProperty({ example: "음성" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  urine_protein: string | null;

  @ApiProperty({ example: 0.58 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "2" })
  @Min(0.01)
  creatinine: number | null;

  @ApiProperty({ example: 98 })
  @IsOptional()
  @IsInt()
  @Min(1)
  egfr: number | null;
}

export class CheckupAssessmentDto {
  @IsInt()
  @Min(1)
  id: number;

  @IsInt()
  @Min(1)
  checkUpId: number;

  @IsString()
  @MinLength(1)
  waist: string;

  @IsString()
  @MinLength(1)
  bmi: string;

  @IsString()
  @MinLength(1)
  bp: string;

  @IsString()
  @MinLength(1)
  urine_protein: string;

  @IsString()
  @MinLength(1)
  hemoglobin: string;

  @IsString()
  @MinLength(1)
  fbg: string;

  @IsString()
  @MinLength(1)
  creatinine: string;

  @IsString()
  @MinLength(1)
  egfr: string;

  @IsString()
  @MinLength(1)
  ast: string;

  @IsString()
  @MinLength(1)
  alt: string;

  @IsString()
  @MinLength(1)
  ygtp: string;
}
