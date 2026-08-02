import { mealtype, mealstatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from "class-validator";

export class CreateMealDto {
  @ApiProperty({ example: "2026-08-10" })
  @IsDateString()
  mealDate: string;

  @ApiProperty({ example: "breakfast" })
  @IsEnum(mealtype)
  mealType: string;

  @ApiProperty({ example: 2000 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6000)
  goalCalorie?: number;

  @ApiProperty({ example: 950 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(9999)
  unitCalorie?: number;

  @ApiProperty({ example: "" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  photoUrl?: string;

  @ApiProperty({ example: "PENDING" })
  @IsEnum(mealstatus)
  mealStatus: string;
}
