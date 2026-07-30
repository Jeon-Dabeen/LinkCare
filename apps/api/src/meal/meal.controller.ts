import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { ApiOperation } from '@nestjs/swagger';
import { MealQueryDto } from './dto/query-meal.dto';
import { mealstatus } from '@prisma/client';
import { MealFoodDto } from './dto/create-meal-food.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RenameFileInterceptor } from '../common/interceptors/rename.file.interceptor';
import { imageUploadOptions } from '../config/upload.config';
import { ConvertToWebpInterceptor } from '../common/interceptors/convert.image.interceptor';

@Controller('meal')
@UseInterceptors(TransformInterceptor)
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
    return this.mealService.findMealFoodDetail(id);
  }

  @ApiOperation({summary: '식사 상세 기록 등록/수정'})
  @UseInterceptors(
    FileInterceptor('image', imageUploadOptions),
    RenameFileInterceptor,
    ConvertToWebpInterceptor,
  )
  @Patch('/record/:mealId')
  createMealFood(
    @Param('mealId', ParseIntPipe) mealId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('foods') foodsString: string,
  ){
    const foods = (foodsString ? JSON.parse(foodsString) : []) as MealFoodDto[];
    return this.mealService.recordMealFoodItems(mealId, file, foods);
  }

  @ApiOperation({summary: '식사 상세 기록 삭제'})
  @Delete('/record/:mealId')
  removeMealFood(
    @Param('mealId', ParseIntPipe) mealId: number,
  ){
    return this.mealService.removeMealFoodItems(mealId);
  }

}
