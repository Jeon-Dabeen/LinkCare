import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import * as bcrypt from "bcrypt";
import { logger } from "../config/logger";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { AuthService } from "../auth/auth.service";
import { Response } from "express";

import { UpdateProfileDto } from "./dto/update-profile.dto";
import { WithdrawDto } from "./dto/account-security.dto";

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
    private readonly auth: AuthService,
  ) {}

  /**
   * 회원 정보 조회
   * @param userId
   * @returns
   */
  async findOne(userId: number) {
    logger.info(`ProfileService findOne started. userId: ${userId}`);

    const user = await this.prisma.profile.findUnique({ where: { userId } });

    if (!user) throw new NotFoundException(`회원을 찾을 수 없어요`);

    logger.debug(`user, ${JSON.stringify(user)}`);

    const data = {
      userId,
      nickName: user.nickName,
      gender: user.gender,
      birthDate: user.birthDate,
      height: user.height,
    };

    logger.info(`ProfileService findOne ended. userId: ${userId}`);
    return data;
  }

  /**
   * 회원 닉네임 중복 확인
   * @param userId
   * @param dto
   * @returns
   */
  async checkNickName(userId: number, dto: UpdateProfileDto) {
    logger.info(
      `ProfileService checkNickName started. userId: ${userId}, dto: ${JSON.stringify(dto)}`,
    );

    const { nickName } = dto;

    if (!nickName) throw new BadRequestException(`닉네임을 입력해주세요`);

    const existingNickName = await this.prisma.profile.findUnique({ where: { nickName } });

    if (existingNickName) throw new ConflictException(`이미 존재하는 닉네임이에요`);
    logger.debug(`nickName, ${JSON.stringify(nickName)}`);

    const result = { isAvailable: true };
    logger.info(`ProfileService checkNickName ended.`);
    return result;
  }

  /**
   * 랜덤 닉네임 가져오기
   * @returns
   */
  async getNickName() {
    logger.info(`ProfileService getNickName started.`);

    const newNickName = await this.user.generateUniqueNickname();
    logger.info(`ProfileService getNickName ended.`);
    return newNickName;
  }

  /**
   * 회원 정보 수정
   * @param userId
   * @param dto
   * @returns
   */
  async update(userId: number, dto: UpdateProfileDto) {
    logger.info(`ProfileService update started. userId: ${userId}, dto: ${JSON.stringify(dto)}`);

    // 기존 회원 정보 조회
    const user = await this.prisma.profile.findUnique({ where: { userId } });
    if (!user) throw new NotFoundException(`회원을 찾을 수 없어요`);

    // 닉네임 변경 시 중복 검사(본인 닉네임은 제외)
    if (dto.nickName && dto.nickName !== user.nickName) {
      const existingNickName = await this.prisma.profile.findUnique({
        where: { nickName: dto.nickName },
      });
      // 검색 결과가 있고, 그 결과의 주인이 내가 아니라면 중복 처리
      if (existingNickName && existingNickName.userId !== userId) {
        throw new ConflictException(`이미 존재하는 닉네임이에요`);
      }
    }

    // 업데이트할 데이터 객체 구성
    const updateData: Prisma.ProfileUpdateInput = {};
    if (dto.nickName !== undefined) updateData.nickName = dto.nickName;
    if (dto.gender !== undefined) updateData.gender = dto.gender;
    if (dto.height !== undefined) updateData.height = dto.height;

    if (dto.birthDate) {
      updateData.birthDate = new Date(dto.birthDate);
    } else if (dto.birthDate === null) {
      updateData.birthDate = null;
    }

    // db 업데이트
    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: updateData,
    });

    logger.debug(`updatedProfile, ${JSON.stringify(updatedProfile)}`);

    logger.info(`ProfileService update ended. userId: ${userId}`);
    return updatedProfile;
  }

  /**
   * 비밀번호 검증
   * @param userId
   * @param password
   * @returns
   */
  async validatePassword(userId: number, password: string): Promise<boolean> {
    logger.info(`ProfileService validatePassword started. userId: ${userId}`);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`회원을 찾을 수 없어요`);

    const isValid = await bcrypt.compare(password, user.password);

    logger.info(`ProfileService validatePassword ended. userId: ${userId}`);
    return isValid;
  }

  /**
   * 회원탈퇴
   * @param userId
   * @param dto
   * @returns
   */
  async withdraw(userId: number, dto: WithdrawDto, response: Response) {
    logger.info(`ProfileService withdraw started. userId: ${userId}`);

    // 사용자 정보 조회
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`회원을 찾을 수 없어요`);

    // 비밀번호 검증
    const isPasswordValid = await this.validatePassword(userId, dto.password);
    if (!isPasswordValid) {
      throw new BadRequestException("비밀번호가 일치하지 않아요");
    }

    // 회원 탈퇴 처리 (useyn을 'N'으로 변경)
    await this.prisma.user.update({
      where: { id: userId },
      data: { useyn: "N" },
    });

    // 인증 쿠키 삭제
    this.auth.clearAuthCookie(response);

    logger.info(`ProfileService withdraw ended. userId: ${userId}`);
    return { success: true, message: "회원 탈퇴가 완료되었어요." };
  }

  /**
   * 비밀번호 변경
   * @param userId
   * @param currentPassword
   * @param newPassword
   */
  async changePassword(userId: number, dto: { currentPassword: string; newPassword: string }) {
    logger.info(`ProfileService changePassword started. userId: ${userId}`);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`회원을 찾을 수 없어요`);

    const { currentPassword, newPassword } = dto;

    // 현재 비밀번호 검증
    const isCurrentPasswordValid = await this.validatePassword(userId, currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException("현재 비밀번호가 일치하지 않아요");
    }

    // 새 비밀번호로 업데이트
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  }
}
