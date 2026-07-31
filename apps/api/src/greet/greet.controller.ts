import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common";
import { GreetService } from "./greet.service";
import { CreateGreetDto } from "./dto/create-greet.dto";
import { UpdateGreetDto } from "./dto/update-greet.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";
import { CurrentUser } from "../common/decorator/current-user.decorator";
import { logger } from "../config/logger";

@Controller("greet")
export class GreetController {
  constructor(private readonly greetService: GreetService) {}

  @Post()
  create(@Body() createGreetDto: CreateGreetDto) {
    return this.greetService.create(createGreetDto);
  }

  // @Get()
  // findAll() {
  //   return this.greetService.findAll();
  // }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "데일리 건강 코멘트 조회" })
  @Get()
  findOne(@CurrentUser("id") userId: number, @Query("dailyDate") dailyDate: string) {
    logger.info(`GreetController findOne.`)
    return this.greetService.findOne(userId, dailyDate);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "사용자 닉네임 조회" })
  @Get(":name")
  findNickName(@CurrentUser("id") userId: number) {
    logger.info(`GreetController findNickName.`)
    return this.greetService.findNickName(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "데일리 건강 코멘트 재생성" })
  @Patch()
  update(@CurrentUser("id") userId: number, @Body('dailyDate') dailyDate: string) {
    return this.greetService.update(userId, dailyDate);
  }
}
