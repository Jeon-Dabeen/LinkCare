import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDecimal, IsInt, IsObject, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CheckupResponseDto {
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
  height?: number;

  @ApiProperty({ example: 50.0 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  @Min(1.0)
  weight?: number;

  @ApiProperty({ example: 81.0 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  @Min(1.0)
  waist?: number;

  @ApiProperty({ example: 21.9 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  @Min(1.0)
  bmi?: number;

  @ApiProperty({ example: 0.7 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  visionLeft?: number;

  @ApiProperty({ example: 0.2 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  visionRight?: number;

  @ApiProperty({ example: "정상/정상" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  hearing?: string;
}

export class BloodPressureDto {
  @ApiProperty({ example: 110 })
  @IsOptional()
  @IsInt()
  @Min(1)
  bp_systolic?: number;

  @ApiProperty({ example: 70 })
  @IsOptional()
  @IsInt()
  @Min(1)
  bp_diastolic?: number;
}

export class DiabetesAnemiaDto {
  @ApiProperty({ example: 103 })
  @IsOptional()
  @IsInt()
  @Min(1)
  fbg?: number;

  @ApiProperty({ example: 13.4 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "1" })
  hemoglobin?: number;
}

export class LiverDto {
  @ApiProperty({ example: 21 })
  @IsOptional()
  @IsInt()
  @Min(1)
  ast?: number;

  @ApiProperty({ example: 17 })
  @IsOptional()
  @IsInt()
  @Min(1)
  alt?: number;

  @ApiProperty({ example: 14 })
  @IsOptional()
  @IsInt()
  @Min(1)
  ygtp?: number;
}

export class KidneyDto {
  @ApiProperty({ example: "음성" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  urine_protein?: string;

  @ApiProperty({ example: 0.58 })
  @IsOptional()
  @IsDecimal({ force_decimal: true, decimal_digits: "2" })
  creatinine?: number;

  @ApiProperty({ example: 98 })
  @IsOptional()
  @IsInt()
  @Min(1)
  egfr?: number;
}
