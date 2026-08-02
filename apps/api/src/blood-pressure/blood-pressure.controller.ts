import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  ParseEnumPipe,
  Patch,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { BloodPressureService } from "./blood-pressure.service";
import { CreateBloodPressureDto } from "./dto/create-blood-pressure.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { CurrentUser } from "../common/decorator/current-user.decorator";
import { dayperiod } from "@prisma/client";
import { UpdateBloodPressurePulseDto } from "./dto/update-blood-pressure.dto";

@UseGuards(JwtAuthGuard)
@Controller("blood-pressure")
export class BloodPressureController {
  constructor(private readonly bloodPressureService: BloodPressureService) {}

  //혈압 등록
  @Post()
  createBloodPressure(
    @CurrentUser("id") userId: number,
    @Body() createBloodPressureDto: CreateBloodPressureDto,
  ) {
    return this.bloodPressureService.createBloodPressure(Number(userId), createBloodPressureDto);
  }
  //최근 7일 조회
  @Get("week")
  findWeekBloodPressure(
    @CurrentUser("id") userId: number,
    @Query("bpDate") bpDate: string,
    @Query("dayPeriod", new ParseEnumPipe(dayperiod)) dayPeriod: dayperiod, //조회시
  ) {
    return this.bloodPressureService.findWeekBloodPressure(Number(userId), bpDate, dayPeriod);
  }

  //최근 3개월 조회
  @Get("month")
  findMonthBloodPressure(
    @CurrentUser("id") userId: number,
    @Query("bpDate") bpDate: string,
    @Query("dayPeriod", new ParseEnumPipe(dayperiod)) dayPeriod: dayperiod,
  ) {
    return this.bloodPressureService.findMonthBloodPressure(Number(userId), bpDate, dayPeriod);
  }

  @Patch(":id/pulse")
  updateBloodPressurePulse(
    @CurrentUser("id") userId: number,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBloodPressurePulseDto: UpdateBloodPressurePulseDto,
  ) {
    return this.bloodPressureService.updateBloodPressurePulse(
      Number(userId),
      id,
      updateBloodPressurePulseDto,
    );
  }
}
