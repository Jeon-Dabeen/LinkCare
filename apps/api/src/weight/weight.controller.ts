import { Controller, Get, Post, Body, Patch, Param, Query } from "@nestjs/common";
import { WeightService } from "./weight.service";
import { CreateWeightDto } from "./dto/create-weight.dto";
import { UpdateWeightProfileDto } from "./dto/update-weight-profile-dto";

@Controller("weight")
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Post(":id")
  create(@Param("id") id: string, @Body() createWeightDto: CreateWeightDto) {
    return this.weightService.createWeight(+id, createWeightDto);
  }

  @Get("week/:id")
  findWeek(@Param("id") id: string, @Query("date") date: string) {
    return this.weightService.findWeekWeight(+id, date);
  }

  @Get("month/:id")
  findMonth(@Param("id") id: string, @Query("date") date: string) {
    return this.weightService.findMonthWeight(+id, date);
  }

  @Patch("profile/:id")
  updateWeightProfile(@Param("id") id: string, @Body() dto: UpdateWeightProfileDto) {
    return this.weightService.updateWeightProfile(+id, dto);
  }
}
