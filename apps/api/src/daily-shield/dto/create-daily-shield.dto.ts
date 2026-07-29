import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";
import { exercisetime } from "@prisma/client";

export class CreateDailyShieldDto {
  @ApiProperty({ example: "2026-07-27" })
  @IsString()
  @MinLength(4)
  dailyDate: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(0)
  @IsOptional()
  feel: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  energy: number;

  @ApiProperty({ example: "60" })
  @IsString()
  @IsOptional()
  exerciseTime: exercisetime;

  @ApiProperty({ example: "걷기" })
  @IsString()
  @MinLength(0)
  @IsOptional()
  exerciseType: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(0)
  @IsOptional()
  waterCup: number;

  @ApiProperty({ example: "종합비타민" })
  @IsString()
  @MinLength(0)
  @IsOptional()
  supplementType: string;
}
