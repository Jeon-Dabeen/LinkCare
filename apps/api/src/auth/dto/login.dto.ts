import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: "happycare@demo.com" })
  email: string;

  @IsString()
  @ApiProperty({ example: "secret123" })
  password: string;
}
