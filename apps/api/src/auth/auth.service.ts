import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { logger } from "../config/logger";

@Injectable()
export class AuthService {
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
    return {result: "success"};
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
      throw new UnauthorizedException("회원정보를 찾을 수 없어요.");
    }

    const isRight = await bcrypt.compare(dto.password, user.password);

    if (!isRight) {
      throw new UnauthorizedException("이메일 또는 비번이 틀려요.");
    }

    // TODO: loginCnt +1 로직

    const payload = {
      sub: user.id,
      email: user.email,
    };

    logger.info(`AuthService login ended.`);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
