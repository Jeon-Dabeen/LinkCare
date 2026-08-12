import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { logger } from "../config/logger";
import type { CookieOptions, Response } from "express";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Injectable()
export class AuthService {
  // 공통 쿠키 기본 옵션
  private readonly baseCookieOptions: CookieOptions = {
    httpOnly: true, // XSS 공격 방지
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Cross-site 쿠키 전송 허용
    path: "/", // 쿠키 경로 설정
  };

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async checkDuplicateEmail(email: string) {
    logger.info(`AuthService checkDuplicateEmail started. email=${email}`);

    const exists = await this.userService.findByEmail(email);

    if (exists) {
      throw new ConflictException("이미 가입된 이메일 입니다.");
    }

    logger.info(`AuthService checkDuplicateEmail ended. email=${email}`);
    return { result: "success" };
  }

  /**
   * 회원가입
   * @param dto
   * @returns
   */
  async register(dto: RegisterDto) {
    logger.info(`AuthService register started. user=${dto.email}`);

    const exists = await this.userService.findByEmail(dto.email);

    if (exists) {
      throw new ConflictException("이미 가입된 이메일 입니다.");
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.createUser({
      email: dto.email,
      password: hashed,
      birthDate: dto.birthDate,
      gender: dto.gender,
      height: dto.height,
    });

    const { password, ...result } = user; // 비밀번호를 빼고 나머지 데이터 반환 위함

    logger.info(`AuthService register ended. user=${dto.email}`);
    return result;
  }

  /**
   * 로그인
   * @param dto
   * @returns
   */
  async login(dto: LoginDto) {
    logger.info(`AuthService login started.`);

    const user = await this.userService.findUseByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException("이메일 또는 비번이 틀려요.");
    }

    // 탈퇴한 회원 접근 차단
    if (user.useyn === "N") {
      throw new UnauthorizedException("이메일 또는 비번이 틀려요.");
    }

    const isRight = await bcrypt.compare(dto.password, user.password);

    if (!isRight) {
      throw new UnauthorizedException("이메일 또는 비번이 틀려요.");
    }

      // loginCnt +1
    const loginData = await this.userService.updateLoginCnt(user.id);
    logger.debug(`loginData: ${JSON.stringify(loginData)}`);

    const payload = {
      sub: user.id,
      email: user.email,
    };

    logger.info(`AuthService login ended.`);
    return {
      access_token: this.jwtService.sign(payload),
      count: loginData.loginCnt,
    };
  }

  /**
   * 비밀번호 변경
   * @param dto 
   * @returns 
   */
  async resetPassword(dto: ResetPasswordDto){
    logger.info(`AuthService resetPassword started. email =${dto.email}`);

    //입력한 이메일로 회원 조회
    const user = await this.userService.findByEmail(dto.email);

    if(!user){
      throw new NotFoundException("해당 이메일로 가입된 회원을 찾을 수 없습니다.");
    }

    //userService의 비밀번호 업데이트 메서드 호출
    await this.userService.updatePassword(user.id, dto.newPassword);

    logger.info(`AuthService resetPassword ended. email=${dto.email}`);

    return { success: true, message: "비밀번호가 재설정되었습니다."};
  }

  /**
   * 공통 쿠키 삭제 메서드
   * @param response
   */
  clearAuthCookie(response: Response) {
    logger.info(`AuthService clearAuthCookie started.`);

    response.clearCookie("access_token", this.baseCookieOptions);

    logger.info(`AuthService clearAuthCookie ended.`);
  }

  /**
   * 로그아웃
   * @param response
   * @returns
   */
  logout(response: Response) {
    logger.info(`AuthService logout started.`);
    
    this.clearAuthCookie(response);
    logger.info(`AuthService logout ended.`);
    
    return { message: "로그아웃 성공" };
  }
}
