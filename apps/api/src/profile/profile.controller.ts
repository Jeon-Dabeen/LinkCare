import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  UseInterceptors,
  Post,
  Res,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import type { Response } from "express";
import { TransformInterceptor } from "../common/interceptors/transform.interceptor";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { CurrentUser } from "../common/decorator/current-user.decorator";
import { CheckNickNameDto, WithdrawDto, ChangePasswordDto } from "./dto/account-security.dto";

@Controller("profile")
@UseInterceptors(TransformInterceptor)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "회원 정보 조회" })
  @Get()
  findOne(@CurrentUser("id") userId: number) {
    return this.profileService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "회원 닉네임 중복 확인" })
  @Post("/checkNickname")
  checkNickName(@CurrentUser("id") userId: number, @Body() dto: CheckNickNameDto) {
    return this.profileService.checkNickName(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "회원 닉네임 랜덤 가져오기" })
  @Get("/getNickname")
  getNickName() {
    return this.profileService.getNickName();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "회원 정보 수정" })
  @Patch()
  update(@CurrentUser("id") userId: number, @Body() dto: UpdateProfileDto) {
    return this.profileService.update(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "회원 탈퇴" })
  @Post("/withdraw")
  withdraw(
    @CurrentUser("id") userId: number,
    @Body() dto: WithdrawDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.profileService.withdraw(userId, dto, response);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "회원 비밀번호 변경" })
  @Post("/changePassword")
  changePassword(@CurrentUser("id") userId: number, @Body() dto: ChangePasswordDto) {
    return this.profileService.changePassword(userId, dto);
  }
}
