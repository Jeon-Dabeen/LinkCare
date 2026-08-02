import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProfileDto {
  @ApiProperty({ example: "M", enum: ["F", "M"] })
  @IsOptional()
  @IsString()
  @IsIn(["F", "M"])
  gender?: string;

  @ApiProperty({ example: "아기 코끼리" })
  @IsOptional()
  @IsString()
  nickName?: string;

  @ApiProperty({ example: "1997-08-10" })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({ example: "175" })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({ example: "80" })
  @IsOptional()
  @IsNumber()
  goalWeight?: number;

  @ApiProperty({ example: "2500" })
  @IsOptional()
  @IsNumber()
  goalCalorie?: number;
}
