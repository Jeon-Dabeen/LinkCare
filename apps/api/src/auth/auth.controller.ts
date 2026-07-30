import { Controller, Body, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '회원 가입' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '회원 로그인' })
  async login(
    @Body() dto: LoginDto, 
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token } = await this.authService.login(dto);

    response.cookie('access_token', access_token, {
      httpOnly: true, // XSS 공격 방지
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Cross-site 쿠키 전송 허용
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14일 (JwtModule의 expiresIn과 동일하게 설정)
    });

    return { message: '로그인 성공' };
  }
}
