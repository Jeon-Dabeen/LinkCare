import { mealtype } from "@prisma/client";
import { IsDateString, IsEnum, IsInt, IsOptional } from "class-validator";

export class MealQueryDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsDateString()
  baseDate?: string;

  @IsOptional()
  @IsEnum(mealtype)
  mealType?: string;

  @IsOptional()
  @IsInt()
  mealId?: number;
}
