import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsString, Max, Min, MinLength, ValidateNested } from "class-validator";

export class MealFoodDto {
  @ApiProperty({ example: "수제비" })
  @IsString()
  @MinLength(1)
  FoodName: string;

  @ApiProperty({ example: 950 })
  @IsInt()
  @Min(0)
  @Max(9999)
  calorie: number;
}

export class CreateMealFoodDto {
  @ApiProperty({ type: [MealFoodDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealFoodDto)
  foods: MealFoodDto[];
}
