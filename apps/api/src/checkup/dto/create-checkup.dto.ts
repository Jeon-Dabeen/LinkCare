import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

export class CreateCheckupDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CheckupDto)
  checkupList: CheckupDto[];
}

export class CheckupDto {
  @IsDateString()
  checkUpDate: string;

  @IsNumber({ maxDecimalPlaces: 1 })
  height: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  weight: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  waist: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  bmi: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  visionLeft: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  visionRight: number;

  @IsString()
  hearing: string;

  @IsInt()
  bp_systolic: number;

  @IsInt()
  bp_diastolic: number;

  @IsString()
  urine_protein: string;

  @IsNumber({ maxDecimalPlaces: 1 })
  hemoglobin: number;

  @IsInt()
  fbg: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  creatinine: number;

  @IsInt()
  egfr: number;

  @IsInt()
  ast: number;

  @IsInt()
  alt: number;

  @IsInt()
  ygtp: number;
}
