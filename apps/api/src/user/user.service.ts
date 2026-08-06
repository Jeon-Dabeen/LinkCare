import { ConflictException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../config/logger";
import { NicknameService } from "../common/services/nickname.service";
import { log } from "console";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nickname: NicknameService,
  ) {}

  /**
   * 닉네임 중복 확인
   */
  async checkDuplicateNickName(nickName: string) {
    const found = await this.prisma.profile.findFirst({ where: { nickName } });
    logger.debug(`UserService checkDuplicateNickName ended. ${found}`);
    return !!found;
  }

  /**
   * 닉네임 생성
   * @param checkDuplicateExist
   * @param maxAttempts 최대 재시도 횟수 (기본값: 5회)
   */
  async generateUniqueNickname(maxAttempts = 5) {
    logger.info(`UserService generateUniqueNickname processing...`);

    // 1차 시도
    let nickname = this.nickname.generateBaseNickname();
    let isExist = await this.checkDuplicateNickName(nickname);

    if (!isExist) {
      return nickname;
    }

    // 2차 시도 이후: 중복이 있으면 뒤에 2자리 숫자를 붙여서 재시도 ("신난쿼카_42")
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const baseName = this.nickname.generateBaseNickname();
      const num = this.nickname.generateTwoDigitNumber();
      nickname = `${baseName}_${num}`;

      isExist = await this.checkDuplicateNickName(nickname);
      if (!isExist) {
        return nickname;
      }
    }

    // 만약 maxAttempts 동안 중복이 해소되지 않으면 시간 기반 fallback 처리
    const fallbackNum = Math.floor(Math.random() * 90 + 10);
    return `${this.nickname.generateBaseNickname()}_${fallbackNum}`;
  }

  /**
   * 회원가입
   * @param data
   * @returns
   */
  async createUser(data: { 
    email: string; 
    password: string;
    birthDate: string;
    gender: "M" | "F";
    height: number;
  }) {
    logger.info(`UserService createUser started. email=${data.email}`);

    const nickName = await this.generateUniqueNickname();
    logger.debug(`nickName: ${nickName}`);

    const { user, profile } = await this.prisma.$transaction(async (tx) => {
      // 1. 유저 생성
      const newUser = await tx.user.create({ 
        data: {
          email: data.email,
          password: data.password,
        } });

      // 2. 프로필 생성 (User PK 필드가 'id'인 경우 newUser.id 사용)
      const newProfile = await tx.profile.create({
        data: {
          userId: newUser.id,
          nickName: nickName,
          birthDate: new Date(`${data.birthDate}T00:00:00.000Z`),
          gender: data.gender,
          height: data.height,
        },
      });

      return { user: newUser, profile: newProfile };
    });

    logger.debug(`createUser result: ${JSON.stringify(user)}, ${JSON.stringify(profile)}`);
    logger.info(`UserService createUser ended. email=${data.email}`);

    return user;
  }

  /**
   * 이메일로 사용자 찾기 (로그인 시 사용)
   * @param email
   * @returns
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUseByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email, useyn: "Y" } });
  }
  /**
   * 비밀번호 변경
   * @param userId 
   * @param newPassword 
   * @returns 
   */
  async updatePassword(userId: number, newPassword: string){
    logger.info(`UserService updatePassword started. userId=${userId}`);

    //새 비밀번호 암호화
    const hashedPassword =await bcrypt.hash(newPassword, 10);

    //새 비밀번호로 변경된 유저
    const updatedUser = await this.prisma.user.update({
      where: {id: userId},
      data: {
        password: hashedPassword,
      },
    });
    
    logger.info(`UserService updatedPassword ended. userId=${userId}`);
    return updatedUser;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  updateLoginCnt(id: number) {
    logger.info(`updateLoginCnt userId=${id}`);
    
    return this.prisma.user.update({
      where: { id },
      data: { loginCnt: { increment: 1 } },
    });
  }
}
