import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateGreetDto {
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
