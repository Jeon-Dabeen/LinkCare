import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BloodGlucoseService } from './blood-glucose.service';
import { CreateBloodGlucoseDto } from './dto/create-blood-glucose.dto';
import { mealtype } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorator/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller("blood-glucose")
export class BloodGlucoseController {
  constructor(
    private readonly bloodGlucoseService: BloodGlucoseService,
  ) {}

  //혈당 등록
  @Post()
  createBloodGlucose(
    @CurrentUser("id") userId: number,
    @Body() createBloodGlucoseDto: CreateBloodGlucoseDto,
  ) {
    return this.bloodGlucoseService.createBloodGlucose(Number(userId),createBloodGlucoseDto,);
  }

  //최근 7일 조회
  @Get("week")
  findWeekBloodGlucose(
    @CurrentUser("id") userId: number,
    @Query("bgDate") bgDate: string,
    @Query("mealType") mealType: mealtype,
  ) {
    return this.bloodGlucoseService.findWeekBloodGlucose(Number(userId),bgDate,mealType,);
  }

  //3개월 조회
  @Get("month")
  findMonthBloodGlucose(
    @CurrentUser("id") userId: number,
    @Query("bgDate") bgDate: string,
    @Query("mealType") mealType: mealtype,
  ) {
    return this.bloodGlucoseService.findMonthBloodGlucose(Number(userId),bgDate,mealType,);
  }
}