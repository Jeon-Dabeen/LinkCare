import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CheckNickNameDto {
  @ApiProperty({ example: "아기 코끼리" })
  @IsString()
  nickName: string;
}

export class WithdrawDto {
  @ApiProperty({ example: "비밀번호 입력" })
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: "현재 비밀번호 입력" })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: "새 비밀번호 입력" })
  @IsString()
  newPassword: string;
}
