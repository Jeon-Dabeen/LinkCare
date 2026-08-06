import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsIn, IsNumber, IsString, Matches, Max, Min, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: "happycare@demo.com" })
  email: string;

  @IsString()
  @ApiProperty({ example: "secret123" })
  @MinLength(6)
  password: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "생년월일은 YYYY-MM-DD 형식이어야 합니다."
  })
  @IsDateString({}, {message: "올바른 생년월일을 입력해주세요."})
  birthDate: string;

  @IsIn(["M","F"])
  gender: "M" | "F";

  @IsNumber({maxDecimalPlaces: 1})
  @Min(10)
  @Max(300)
  height:number;
}
