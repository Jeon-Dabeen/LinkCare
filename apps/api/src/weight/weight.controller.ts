import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from "@nestjs/common";
import { WeightService } from "./weight.service";
import { CreateWeightDto } from "./dto/create-weight.dto";
import { UpdateWeightProfileDto } from "./dto/update-weight-profile-dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { CurrentUser } from "../common/decorator/current-user.decorator";

@UseGuards(JwtAuthGuard)
@Controller("weight")
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Post()
  create(
    @CurrentUser("id") userId: number, 
    @Body() createWeightDto: CreateWeightDto) {
    return this.weightService.createWeight(Number(userId), createWeightDto);
  }

  @Get("week")
  findWeek(
    @CurrentUser("id") userId: number,
    @Query("weightDate") weightDate: string,
  ) {
    return this.weightService.findWeekWeight(Number(userId), weightDate);
  }

  @Get("month")
  findMonth(
    @CurrentUser("id") userId: number,
    @Query("date") date: string
  ) {
    return this.weightService.findMonthWeight(Number(userId), date);
  }

  @Patch("profile")
  updateWeightProfile(
    @CurrentUser("id") userId: number,
    @Body() dto: UpdateWeightProfileDto
  ) {
    return this.weightService.updateWeightProfile(Number(userId), dto);
  }
}
