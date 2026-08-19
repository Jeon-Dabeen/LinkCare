import { Controller, Body, Post, Res, Get, Query, HttpCode, HttpStatus } from "@nestjs/common";
import type { Response } from "express";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("check-email")
  @ApiOperation({ summary: "이메일 중복 체크" })
  @ApiQuery({ name: "email", required: true, example: "happycare@demo.com" })
  checkDuplicateEmail(@Query("email") email: string) {
    return this.authService.checkDuplicateEmail(email);
  }

  @Post("register")
  @ApiOperation({ summary: "회원 가입" })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("reset-password")
  @ApiOperation({summary: "비밀번호 재설정"})
  resetPassword(@Body() dto: ResetPasswordDto){
    return this.authService.resetPassword(dto);
  }

  @Post("login")
  @ApiOperation({ summary: "회원 로그인" })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { access_token, count } = await this.authService.login(dto);

    const isProduction = process.env.NODE_ENV === "production";

    response.cookie("access_token", access_token, {
      httpOnly: true, // XSS 공격 방지
      secure: process.env.NODE_ENV === "production",
      sameSite: isProduction ? "none" : "lax", // Cross-site 쿠키 전송 허용
      path: "/",
      domain: ".azurecontainerapps.io",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14일 (JwtModule의 expiresIn과 동일하게 설정)
    });

    return { count: count };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "회원 로그아웃" })
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
