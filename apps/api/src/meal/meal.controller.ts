import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import { TransformInterceptor } from "../common/interceptors/transform.interceptor";
import { MealService } from "./meal.service";
import { UpdateMealDto } from "./dto/update-meal.dto";
import { ApiOperation } from "@nestjs/swagger";
import { MealQueryDto } from "./dto/query-meal.dto";
import { MealFoodDto } from "./dto/create-meal-food.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { RenameFileInterceptor } from "../common/interceptors/rename.file.interceptor";
import { imageUploadOptions } from "../config/upload.config";
import { ConvertToWebpInterceptor } from "../common/interceptors/convert.image.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { CurrentUser } from "../common/decorator/current-user.decorator";

@UseGuards(JwtAuthGuard)
@Controller("meal")
@UseInterceptors(TransformInterceptor)
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @ApiOperation({ summary: "날짜별 식사 내용 조회" })
  @Get()
  findMeal(@CurrentUser("id") userId: number, @Query() query: MealQueryDto) {
    return this.mealService.findMeal(userId, query);
  }

  @ApiOperation({ summary: "오늘 날짜의 식사 상태 수정" })
  @Patch("/:mealId/status")
  updateMealState(
    @CurrentUser("id") userId: number,
    @Param("mealId", ParseIntPipe) id: number,
    @Body() dto: UpdateMealDto,
  ) {
    return this.mealService.updateMealState(userId, id, dto);
  }

  @ApiOperation({ summary: "목표 칼로리 변경" })
  @Patch("/goalCalorie")
  updateGoalCalorie(@CurrentUser("id") userId: number, @Body() dto: UpdateMealDto) {
    return this.mealService.updateGoalCalorie(userId, dto);
  }

  @ApiOperation({ summary: "식사 상세 기록 조회" })
  @Get("/record/:mealId")
  findMealFood(@CurrentUser("id") userId: number, @Param("mealId", ParseIntPipe) id: number) {
    return this.mealService.findMealFoodDetail(userId, id);
  }

  @ApiOperation({ summary: "식사 상세 기록 등록/수정" })
  @UseInterceptors(
    FileInterceptor("image", imageUploadOptions),
    RenameFileInterceptor,
    ConvertToWebpInterceptor,
  )
  @Patch("/record/:mealId")
  createMealFood(
    @CurrentUser("id") userId: number,
    @Param("mealId", ParseIntPipe) mealId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body("foods") foodsString: string,
  ) {
    const foods = (foodsString ? JSON.parse(foodsString) : []) as MealFoodDto[];
    return this.mealService.recordMealFoodItems(userId, mealId, file, foods);
  }

  @ApiOperation({ summary: "식사 상세 기록 삭제" })
  @Delete("/record/:mealId")
  removeMealFood(@CurrentUser("id") userId: number, @Param("mealId", ParseIntPipe) mealId: number) {
    return this.mealService.removeMealFoodItems(userId, mealId);
  }

  @ApiOperation({ summary: "홈 화면 식사 기록 조회" })
  @Get("/home/meals")
  findHomeMeals(@CurrentUser("id") userId: number, @Query("date") todayDate: string) {
    return this.mealService.findHomeMeals(userId, todayDate);
  }

  @ApiOperation({ summary: "홈 화면 데일리 기록 조회" })
  @Get("/home/daily")
  findHomeDaily(@CurrentUser("id") userId: number,  @Query("date") todayDate: string) {
    return this.mealService.findHomeDaily(userId, todayDate);
  }
}
