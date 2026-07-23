import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

export class CreateCheckupDto {
  @ApiProperty({
    type: () => CheckupDto,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CheckupDto)
  checkup_history: CheckupDto[];
}

export class CheckupDto {
  @ApiProperty({ example: 2023 })
  @IsInt()
  @Min(1)
  checkup_year: number;

  @ApiProperty({ example: "11/16" })
  @IsString()
  @MinLength(1)
  checkup_date: string;

  @ApiProperty({ example: 151.0 })
  @IsNumber()
  @Min(1.0)
  height: number;

  @ApiProperty({ example: 50.0 })
  @IsNumber()
  @Min(1.0)
  weight: number;

  @ApiProperty({ example: 81.0 })
  @IsNumber()
  @Min(1.0)
  waist: number;

  @ApiProperty({ example: 21.9 })
  @IsNumber()
  @Min(1.0)
  bmi: number;

  @ApiProperty({ example: 0.7 })
  @IsNumber()
  visionLeft: number;

  @ApiProperty({ example: 0.2 })
  @IsNumber()
  visionRight: number;

  @ApiProperty({ example: "정상/정상" })
  @IsString()
  @MinLength(1)
  hearing: string;

  @ApiProperty({ example: 110 })
  @IsInt()
  @Min(1)
  bp_systolic: number;

  @ApiProperty({ example: 70 })
  @IsInt()
  @Min(1)
  bp_diastolic: number;

  @ApiProperty({ example: "음성" })
  @IsString()
  @MinLength(1)
  urine_protein: string;

  @ApiProperty({ example: 13.4 })
  @IsNumber()
  hemoglobin: number;

  @ApiProperty({ example: 103 })
  @IsInt()
  @Min(1)
  fbg: number;

  @ApiProperty({ example: 0.58 })
  @IsNumber()
  @Min(0.01)
  creatinine: number;

  @ApiProperty({ example: 98 })
  @IsInt()
  @Min(1)
  egfr: number;

  @ApiProperty({ example: 21 })
  @IsInt()
  @Min(1)
  ast: number;

  @ApiProperty({ example: 17 })
  @IsInt()
  @Min(1)
  alt: number;

  @ApiProperty({ example: 14 })
  @IsInt()
  @Min(1)
  ygtp: number;
}
