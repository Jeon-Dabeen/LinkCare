import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { logger } from "../config/logger";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, mealtype, mealstatus } from "@prisma/client";
import { BlobServiceClient } from "@azure/storage-blob";

import { UpdateMealDto } from "./dto/update-meal.dto";
import { MealQueryDto } from "./dto/query-meal.dto";

import { calculateDefaultGoalCalorie } from "./common/nutrition";
import { isSameDate } from "./common/date";
import { MealFoodDto } from "./dto/create-meal-food.dto";

// Meal과 MealFood가 include된 반환 타입 정의
type MealWithFoods = Prisma.MealGetPayload<{
  include: { MealFood: true };
}>;

@Injectable()
export class MealService {
  constructor(private readonly prisma: PrismaService) {}

  // string 날짜 타입 변경
  private toDate(date: string): Date {
    return new Date(date.trim());
  }

  /**
   * 하루 식사 데이터 전체내용 받아오기
   * @param userId
   * @param query
   * @returns
   */
  async findMeal(userId: number, query: MealQueryDto) {
    logger.info(`MealService findMeal started. userId: ${userId} query: ${query.date}`);

    const { date, baseDate } = query;
    const mealDate = this.toDate(date);

    // meals의 타입을 MealWithFoods[] 로 명시
    let meals: MealWithFoods[] = [];

    // date와 baseDate가 같을 때만 '없을 때 자동 생성' 로직 실행
    if (baseDate && isSameDate(date, baseDate)) {
      meals = await this.ensureAndGetDateMeal(userId, mealDate);
    } else {
      // 날짜가 다르거나 baseDate가 없으면 조회만 실행
      meals = await this.findDateMeal(userId, mealDate);
    }

    const result = meals;

    logger.info(`MealService findMeal ended.`);
    return result;
  }

  /**
   * 유저의 특정 날짜 식사 기록 조회(없으면 빈 배열)
   * @param userId
   * @param mealDate
   * @returns
   */
  async findDateMeal(userId: number, mealDate: Date) {
    logger.info(`MealService findDateMeal started. userId: ${userId}, mealDate: ${mealDate}`);
    const result = await this.prisma.meal.findMany({
      where: {
        userId,
        mealDate,
      },
      include: {
        MealFood: true, // 등록된 음식이 있으면 가져오고, 없으면 [] 로 반환됨
      },
      orderBy: {
        mealType: "asc",
      },
    });
    logger.info(`MealService findDateMeal ended. userId: ${userId}, mealDate: ${mealDate}`);
    return result;
  }

  /**
   * 유저의 특정 날짜 식사 기록 조회(없으면 데이터 생성 후 조회)
   * @param userId
   * @param mealDate
   * @returns
   */
  async ensureAndGetDateMeal(userId: number, mealDate: Date) {
    logger.info(
      `MealService ensureAndGetDateMeal started. userId: ${userId}, mealDate: ${mealDate}`,
    );

    const ALL_MEAL_TYPES = [mealtype.BREAKFAST, mealtype.LUNCH, mealtype.DINNER];

    try {
      // Profile에서 goalCalorie 가져오기
      const profile = await this.prisma.profile.findFirst({
        where: { userId },
        select: { id: true, goalCalorie: true, gender: true, birthDate: true },
      });

      // 프로필에 goalCalorie가 없거나 null이면 기본값 적용
      let targetGoalCalorie = profile?.goalCalorie;

      // 설정된 목표 칼로리가 없다면 성별/나이 기반 계산 (없으면 2000)
      if (!targetGoalCalorie) {
        targetGoalCalorie = calculateDefaultGoalCalorie(profile?.gender, profile?.birthDate);

        // 계산된 값을 바탕으로 Profile DB에 업데이트/생성
        if (profile) {
          await this.prisma.profile.update({
            where: { id: profile.id },
            data: { goalCalorie: targetGoalCalorie },
          });
        } else {
          await this.prisma.profile.create({
            data: {
              userId,
              goalCalorie: targetGoalCalorie,
            },
          });
        }
      }

      // 3가지 식사 타입에 대해 없으면 새로 생성(upsert) 후 반환
      const results = await this.prisma.$transaction(
        ALL_MEAL_TYPES.map((type) =>
          this.prisma.meal.upsert({
            where: {
              userId_mealDate_mealType: {
                userId,
                mealDate,
                mealType: type,
              },
            },
            update: {}, // 기존 데이터가 존재하면 그대로 유지
            create: {
              // 없으면 빈 가본값 데이터 생성
              userId,
              mealDate,
              mealType: type,
              mealStatus: mealstatus.PENDING,
              goalCalorie: targetGoalCalorie,
              unitCalorie: null,
              photoUrl: null,
            },
            include: {
              MealFood: true,
            },
          }),
        ),
      );

      logger.info(`[UPSERT 완료] 생성/조회된 데이터 개수: ${results.length}`);
      logger.info(
        `MealService ensureAndGetDateMeal ended. userId: ${userId}, mealDate: ${mealDate}`,
      );
      return results;
    } catch (error) {
      {
        logger.error(`식사 데이터 생성 및 조회 중 오류 : ${error}`);
        throw new InternalServerErrorException("식사 데이터 생성 및 조회 중 오류가 발생했어요");
      }
    }
  }

  /**
   * 오늘 날짜의 식사 상태 수정
   * @param userId
   * @param mealId
   * @param dto
   * @returns
   */
  async updateMealState(userId, mealId: number, dto: UpdateMealDto) {
    logger.info(`MealService updateMealState started. userId: ${userId}, mealId: ${mealId}`);

    const meal = await this.findMealFoodById(mealId);

    if (!dto.baseDate) {
      throw new BadRequestException(`기준 날짜(baseDate)가 필요합니다.`);
    }

    const formatBaseDate = this.toDate(dto.baseDate);

    // 요청한 날짜가 오늘(baseDate)이 맞는지 검증
    if (!isSameDate(meal.mealDate, formatBaseDate)) {
      throw new BadRequestException(`오늘 날짜의 식사만 수정할 수 있어요`);
    }

    // 이미 등록된 음식이 있으면 변경 불가
    if (meal.MealFood.length > 0 || meal.mealStatus === "COMPLETE") {
      throw new BadRequestException(`이미 등록된 음식이 있어 상태를 변경할 수 없어요`);
    }

    const result = await this.prisma.meal.update({
      where: { id: mealId },
      data: {
        mealStatus: dto.mealStatus as mealstatus,
      },
    });

    logger.info(`MealService updateMealState ended. userId: ${userId}, mealId: ${mealId}`);
    return result;
  }

  /**
   * Id로 mealFood 찾기
   * @param mealId
   * @returns
   */
  async findMealFoodById(mealId: number) {
    logger.info(`MealService findMealFoodById started. mealId: ${mealId}`);

    const meal = await this.prisma.meal.findUnique({
      where: { id: mealId },
      include: {
        MealFood: true,
      },
    });
    if (!meal) throw new NotFoundException(`식사 데이터를 찾을 수 없어요`);

    logger.info(`MealService findMealFoodById ended. mealId: ${mealId}`);
    return meal;
  }

  /**
   * 목표 칼로리 수정
   * @param userId
   * @param dto
   * @returns
   */
  async updateGoalCalorie(userId: number, dto: UpdateMealDto) {
    logger.info(`MealService updateGoalCalorie started. userId: ${userId}`);

    const today = new Date();

    const { goalCalorie } = dto;

    if (!goalCalorie || goalCalorie < 1 || goalCalorie > 6000) {
      throw new BadRequestException(`목표 칼로리를 1~6,000kcal 사이로 설정해주세요`);
    }

    // 유저의 profile 찾기
    const profile = await this.prisma.profile.findFirst({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`사용자 프로필을 찾을 수 없어요`);
    }

    try {
      await this.prisma.$transaction([
        this.prisma.profile.update({
          where: {
            id: profile.id,
          },
          data: {
            goalCalorie: goalCalorie,
          },
        }),

        this.prisma.meal.updateMany({
          where: {
            userId,
            mealDate: today,
          },
          data: {
            goalCalorie: goalCalorie,
          },
        }),
      ]);
      logger.info(`MealService updateGoalCalorie ended. userId: ${userId}`);
      return { goalCalorie: goalCalorie };
    } catch (error) {
      logger.error(`목표 칼로리 수정 중 에러 발생: ${error}`);
      throw new InternalServerErrorException("목표 칼로리 수정 실패");
    }
  }

  /**
   * 식사 상세 기록 조회
   * @param userId
   * @param mealId
   * @returns
   */
  async findMealFoodDetail(userId: number, mealId: number) {
    logger.info(`MealService findMealFoodDetail started. userId: ${userId}, mealId: ${mealId}`);

    const result = await this.findMealFoodByMealId(mealId);

    const meal = await this.prisma.meal.findUnique({
      where: { id: mealId },
    });

    if (!result || !meal) throw new NotFoundException(`해당 식사 내용을 찾을 수 없어요`);

    const data = {
      mealId,
      mealDate: meal.mealDate,
      photoUrl: meal.photoUrl,
      mealFood: result,
    };

    logger.info(`MealService findMealFoodDetail ended. userId: ${userId}, mealId: ${mealId}`);
    return data;
  }

  /**
   * 상세 식사내용 기록
   * @param mealId
   * @param file
   * @param foods
   * @returns
   */
  async recordMealFoodItems(userId: number, mealId: number, file: Express.Multer.File, foods) {
    logger.info(`MealService recordMealFoodItems started. mealId: ${mealId}`);
    logger.debug(`foods, ${JSON.stringify(foods)}`);

    try {
      await this.prisma.$transaction(async (tx) => {
        // mealFood 우선 삭제
        await tx.mealFood.deleteMany({
          where: { mealId },
        });

        // unitCalorie 계산 준비
        let unitCalorie = 0;

        // mealFood 새로 등록
        if (foods.length > 0) {
          unitCalorie = foods.reduce((sum, food) => sum + food.calorie, 0);
          await tx.mealFood.createMany({
            data: foods.map((food) => ({
              mealId,
              FoodName: food.foodName,
              calorie: food.calorie,
            })),
          });
        }

        let imageUrl = "";

        if (file) {
          imageUrl = await this.uploadImage(file);
          logger.debug(`imageUrl: ${imageUrl}`);
        }

        // mealId에 unitCalorie 수정, imageUrl 등록
        await tx.meal.update({
          where: { id: mealId },
          data: {
            unitCalorie,
            mealStatus: "COMPLETE",
            ...(imageUrl && { photoUrl: imageUrl }),
          },
        });
      });

      logger.info(`MealService recordMealFoodItems ended. mealId: ${mealId}`);
      return { mealId };
    } catch (error) {
      logger.error(`MealFood 등록 중 에러 발생: ${error}`);
      throw error;
    }
  }

  /**
   * MealFood 삭제
   * @param userId
   * @param mealId
   * @returns
   */
  async removeMealFoodItems(userId: number, mealId: number) {
    logger.info(`MealService removeMealFoodItems started. mealId: ${mealId}`);

    const meal = await this.findMealById(mealId);
    console.log("meal: ", meal);

    const mealFoods = await this.findMealFoodByMealId(mealId);
    console.log("foods: ", mealFoods);

    try {
      await this.prisma.$transaction(async (tx) => {
        // mealFood 삭제
        await tx.mealFood.deleteMany({
          where: { mealId },
        });

        // meal의 unitCalorie: 0, meaStatus: PENDING
        await tx.meal.update({
          where: { id: mealId },
          data: {
            unitCalorie: 0,
            mealStatus: "PENDING",
            photoUrl: null,
          },
        });
      });

      logger.info(`MealService removeMealFoodItems ended. mealId: ${mealId}`);
      return { mealId };
    } catch (error) {
      logger.error(`MealFood 삭제 중 에러 발생: ${error}`);
      throw error;
    }
  }

  /**
   * Meal: id로 찾기
   * @param id
   * @returns
   */
  async findMealById(id: number) {
    logger.info(`MealService findMealById started. id: ${id}`);

    const meal = await this.prisma.meal.findUnique({ where: { id: id } });
    if (!meal) throw new NotFoundException(`식사 기록이 없어요`);

    logger.info(`MealService findMealById ended. id: ${id}`);
    return meal;
  }

  /**
   * MealFood : mealId로 찾기
   * @param mealId
   * @returns
   */
  async findMealFoodByMealId(mealId) {
    logger.info(`MealService findMealFoodById started. mealId: ${mealId}`);

    const mealFoods = await this.prisma.mealFood.findMany({ where: { mealId } });

    if (!mealFoods) throw new NotFoundException(`식사 기록이 없어요`);

    logger.info(`MealService findMealFoodById ended. mealId: ${mealId}`);
    return mealFoods;
  }

  /**
   * image 파일 업로드
   * @param file
   * @returns
   */
  async uploadImage(file: Express.Multer.File) {
    logger.info(`MealService uploadImage started`);

    let imageUrl = "";

    logger.info(`fileName: ${file.originalname}`);

    const baseUrl = process.env.AZURE_STORAGE_IMAGES || "";
    const sasToken = process.env.AZURE_SAS_TOKEN || "";

    if (!baseUrl || !sasToken) throw new BadRequestException("업로드할 저장소를 찾을 수 없어요");

    const targetFileName = encodeURIComponent(file.originalname);
    imageUrl = sasToken ? `${baseUrl}${targetFileName}?${sasToken}` : `${baseUrl}${targetFileName}`;

    try {
      logger.debug(`Send image a file started. fileName: ${file.originalname}`);

      const response = await fetch(imageUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.mimetype,
          "x-ms-version": "2026-06-06",
        },
        body: new Uint8Array(file.buffer),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`Azure Response Error: ${response.status} - ${errorText}`);
        throw new Error(`Azure HTTP Error ${response.status}`);
      }

      logger.debug(`Send image a file ended. fileName: ${file.originalname}`);
    } catch (error) {
      logger.error("Send image Error: 500 - 전송 실패");
      throw new InternalServerErrorException("이미지 전송 실패");
    }

    logger.info(`MealService uploadImage ended`);
    return imageUrl;
  }
}
