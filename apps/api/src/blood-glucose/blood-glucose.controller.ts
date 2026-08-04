import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseEnumPipe } from '@nestjs/common';
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
    return this.bloodGlucoseService.createBloodGlucose(userId,createBloodGlucoseDto,);
  }

  //최근 7일 조회
  @Get("week")
  findWeekBloodGlucose(
    @CurrentUser("id") userId: number,
    @Query("bgDate") bgDate: string,
    @Query("mealType", new ParseEnumPipe(mealtype)) mealType: mealtype,
  ) {
    return this.bloodGlucoseService.findWeekBloodGlucose(userId,bgDate,mealType,);
  }

  //3개월 조회
  @Get("month")
  findMonthBloodGlucose(
    @CurrentUser("id") userId: number,
    @Query("bgDate") bgDate: string,
    @Query("mealType", new ParseEnumPipe(mealtype)) mealType: mealtype,
  ) {
    return this.bloodGlucoseService.findMonthBloodGlucose(userId,bgDate,mealType);
  }
}