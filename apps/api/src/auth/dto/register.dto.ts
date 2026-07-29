import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: "happycare@demo.com" })
  email: string;

  @IsString()
  @ApiProperty({ example: "secret123" })
  @MinLength(6)
  password: string;
}
