import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
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

  //나중에 수정해야함 당장은
  //weight/week/:id로 하자
  @Get("week/:id")
  findWeek(@Param("id") id: string) {
    return this.weightService.findWeekWeight(+id);
  }

  @Get("month/:id")
  findMonth(@Param("id") id: string, @Query("year") year: string, @Query("month") month: string) {
    return this.weightService.findMonthWeight(+id, +year, +month);
  }

  @Patch("profile/:id")
  updateWeightProfile(@Param("id") id: string, @Body() dto: UpdateWeightProfileDto) {
    return this.weightService.updateWeightProfile(+id, dto);
  }
}
