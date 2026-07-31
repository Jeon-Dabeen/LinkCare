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
  @ApiOperation({ summary: "데일리 쉴드 조회" })
  @ApiQuery({ name: "dailyDate", required: true, example: "2026-07-22" })
  @Get()
  findOne(@CurrentUser("id") userId: number, @Query("dailyDate") dailyDate: string) {
    logger.info(`GreetController findOne started.`)
    return this.greetService.findOne(userId, dailyDate);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGreetDto: UpdateGreetDto) {
    return this.greetService.update(+id, updateGreetDto);
  }
}
