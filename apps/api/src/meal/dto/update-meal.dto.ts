import { PartialType } from '@nestjs/swagger';
import { CreateMealDto } from './create-meal.dto';
import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';
import { CreateMealFoodDto } from './create-meal-food.dto';

export class UpdateMealDto extends PartialType(CreateMealDto) {
  @IsDateString()
  @IsOptional()
  baseDate?: string;
  
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6000)
  goalCalorie?: number;
}
