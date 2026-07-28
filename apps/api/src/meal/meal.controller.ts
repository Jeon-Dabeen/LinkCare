import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Put } from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { ApiOperation } from '@nestjs/swagger';
import { MealQueryDto } from './dto/query-meal.dto';
import { mealstatus } from '@prisma/client';
import { CreateMealFoodDto } from './dto/create-meal-food.dto';

@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}


  @ApiOperation({ summary: "날짜별 식사 내용 조회" })
  @Get()
  findMeal(
    @Query() query: MealQueryDto,
  ){
    return this.mealService.findMeal(query);
  }

  @ApiOperation({summary: "오늘 날짜의 식사 상태 수정"})
  @Patch('/:mealId/status')
  updateMealState(
    @Param('mealId', ParseIntPipe) id: number,
    @Body() dto: UpdateMealDto,
  ){
    return this.mealService.updateMealState(id, dto);
  }


  @ApiOperation({summary: '목표 칼로리 변경'})
  @Patch('/goalCalorie')
  updateGoalCalorie(
    @Body() dto: UpdateMealDto 
  ){
    return this.mealService.updateGoalCalorie(dto);
  }


  @ApiOperation({summary: '식사 상세 기록 조회'})
  @Get('/record/:mealId')
  findMealFood(
    @Param('mealId', ParseIntPipe) id: number,
  ){
    return this.mealService.findMealFoodbyMealId(id);
  }

  @ApiOperation({summary: '식사 상세 기록 등록/수정'})
  @Put('/record/:mealId')
  createMealFood(
    @Param('mealId', ParseIntPipe) mealId: number,
    @Body() dto: CreateMealFoodDto[],
  ){
    console.log(dto);
    return this.mealService.recordMealFoodItems(mealId, dto);
  }

}
