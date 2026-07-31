import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { DailyShieldService } from "./daily-shield.service";
import { CreateDailyShieldDto } from "./dto/create-daily-shield.dto";
import { UpdateDailyShieldDto } from "./dto/update-daily-shield.dto";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";
import { logger } from "../config/logger";
import { type AuthUser, CurrentUser } from "../common/decorator/current-user.decorator";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";

@Controller("daily-shield")
export class DailyShieldController {
  constructor(private readonly dailyShieldService: DailyShieldService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "데일리 쉴드 등록" })
  @Post()
  create(@CurrentUser("id") userId: number, @Body() dto: CreateDailyShieldDto) {
    logger.debug(`DailyShieldController create ${userId}`);
    return this.dailyShieldService.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "데일리 쉴드 조회" })
  @ApiQuery({ name: "dailyDate", required: true, example: "2026-07-22" })
  @Get()
  findOne(@CurrentUser("id") userId: number, @Query("dailyDate") dailyDate: string) {
    logger.debug(`DailyShieldController findOne ${userId}`);
    return this.dailyShieldService.findOne(userId, dailyDate);
  }

  @ApiOperation({ summary: "데일리 쉴드 업데이트" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateDailyShieldDto) {
    return this.dailyShieldService.update(+id, dto);
  }
}
