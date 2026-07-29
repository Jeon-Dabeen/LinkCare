import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { logger } from "../config/logger";
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, mealtype, mealstatus } from "@prisma/client";

import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealQueryDto } from './dto/query-meal.dto';

import { calculateDefaultGoalCalorie } from './common/nutrition';
import { isSameDate } from './common/date';

// Meal과 MealFood가 include된 반환 타입 정의
type MealWithFoods = Prisma.MealGetPayload<{
  include: { MealFood: true };
}>;


@Injectable()
export class MealService {
  constructor(private readonly prisma: PrismaService){}

  // string 날짜 타입 변경
  private toDate(date: string): Date {
    return new Date(date.trim());
  }

  async findMeal(query: MealQueryDto){
    logger.info(`MealService findMeal started. query: ${query.date}`);

    const userId = 2; // 임시 유저 아이디
    const {date, baseDate} = query;

    const mealDate = this.toDate(date);

    // 🔍 디버깅용 로그 (터미널에서 꼭 확인해보세요!)
    console.log('====================================');
    console.log(`[findMeal] date: "baseDate: "${baseDate}"`);
    console.log(`[findMeal] 조건 검사 (baseDate === date):`, baseDate === date);
    console.log('====================================');

    // meals의 타입을 MealWithFoods[] 로 명시
    let meals: MealWithFoods[] = [];

    // date와 baseDate가 같을 때만 '없을 때 자동 생성' 로직 실행
    if(baseDate && isSameDate(date, baseDate)){
      console.log('---생성 로직(ensureAndGetDateMeal) 실행!---');
      meals = await this.ensureAndGetDateMeal(userId, mealDate);
    }else{
      console.log('---단순 조회 로직(findDateMeal) 실행!---');
      // 날짜가 다르거나 baseDate가 없으면 조회만 실행
      meals = await this.findDateMeal(userId, mealDate);
    }

    const result = meals;
    logger.info(`MealService findMeal ended.`);
    return result;
  }


  // 유저의 특정 날짜 식사 기록 조회(없으면 빈 배열)
  async findDateMeal(userId: number, mealDate: Date){
    logger.info(`MealService findDateMeal started. ${userId}, ${mealDate}`);
    const result = await this.prisma.meal.findMany({
      where: {
        userId,
        mealDate,
      },
      include: {
        MealFood: true, // 등록된 음식이 있으면 가져오고, 없으면 [] 로 반환됨
      },
      orderBy: {
        mealType: 'asc'
      }
    });
    logger.info(`MealService findDateMeal ended.`);
    return result;
  }


  // 유저의 특정 날짜 식사 기록 조회(없으면 데이터 생성 후 조회)
  async ensureAndGetDateMeal(userId: number, mealDate: Date){
    logger.info(`MealService ensureAndGetDateMeal started. ${userId}, ${mealDate}`);
    const ALL_MEAL_TYPES = [
      mealtype.BREAKFAST,
      mealtype.LUNCH,
      mealtype.DINNER,
    ];

    try{
      // Profile에서 goalCalorie 가져오기
      const profile = await this.prisma.profile.findFirst({
        where: { userId },
        select: { id: true, goalCalorie: true, gender: true, birthDate: true },
      });
      
      // 프로필에 goalCalorie가 없거나 null이면 기본값 적용
      let targetGoalCalorie = profile?.goalCalorie;

      // 설정된 목표 칼로리가 없다면 성별/나이 기반 계산 (없으면 2000)
      if(!targetGoalCalorie) {
        targetGoalCalorie = calculateDefaultGoalCalorie(
          profile?.gender,
          profile?.birthDate
        );

        // 계산된 값을 바탕으로 Profile DB에 업데이트/생성
        if(profile) {
          await this.prisma.profile.update({
            where: {id: profile.id},
            data: {goalCalorie: targetGoalCalorie},
          })
        }else{
          await this.prisma.profile.create({
            data: {
              userId,
              goalCalorie: targetGoalCalorie,
            }
          })
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
            create: { // 없으면 빈 가본값 데이터 생성
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
            }
          })
        )
      )

      console.log(`[UPSERT 완료] 생성/조회된 데이터 개수: ${results.length}`)
      return results;

    }catch(error){{
      console.error(error);
      throw new InternalServerErrorException('식사 데이터 생성 및 조회 중 오류가 발생했어요');
    }}
  }



  // 오늘 날짜의 식사 상태 수정
  async updateMealState(mealId: number, dto: UpdateMealDto){
    logger.info(`MealService updateMealState started. ${mealId}`);

    const meal = await this.findMealFood(mealId);

    if(!dto.baseDate){
      throw new BadRequestException(`기준 날짜(baseDate)가 필요합니다.`)
    }

    const formatBaseDate = this.toDate(dto.baseDate);

    // 요청한 날짜가 오늘(baseDate)이 맞는지 검증
    if(!isSameDate(meal.mealDate, formatBaseDate)){
      throw new BadRequestException(`${meal.mealDate} ${formatBaseDate}  오늘 날짜의 식사만 수정할 수 있어요`)
    }
    
    // 이미 등록된 음식이 있으면 변경 불가
    if(meal.MealFood.length > 0 || meal.mealStatus === 'COMPLETE'){
      throw new BadRequestException(`이미 등록된 음식이 있어 상태를 변경할 수 없어요`)
    }

    const result = await this.prisma.meal.update({
      where: {id: mealId},
      data: {
        mealStatus: dto.mealStatus as mealstatus,
      }
    })

    logger.info(`MealService updateMealState ended.`);
    return result;
  }

  // mealFood 찾기
  async findMealFood(mealId: number) {
    const meal = await this.prisma.meal.findUnique({
      where: { id: mealId },
      include: {
        MealFood: true,
      },
    });
    if(!meal) throw new NotFoundException(`식사 데이터를 찾을 수 없어요`);
    return meal;
  }




  // 목표 칼로리 수정
  async updateGoalCalorie(dto: UpdateMealDto){
    logger.info(`MealService updateGoalCalorie started.`);

    const userId = 2; // 임시 유저 아이디
    const today = new Date;

    const {goalCalorie} = dto;

    if(!goalCalorie || goalCalorie < 1 || goalCalorie > 6000){
      throw new BadRequestException(`목표 칼로리를 1~6,000kcal 사이로 설정해주세요`)
    }

    // 유저의 profile 찾기
    const profile = await this.prisma.profile.findFirst({
      where: {userId},
    });
    if(!profile){
      throw new NotFoundException(`사용자 프로필을 찾을 수 없어요`)
    }

    try{
      await this.prisma.$transaction([
        this.prisma.profile.update({
          where: {
            id: profile.id,
          },
          data: {
            goalCalorie: goalCalorie
          }
        }),

         this.prisma.meal.updateMany({
          where: {
            userId,
            mealDate: today,
          },
          data: {
            goalCalorie: goalCalorie,
          }
        })
      ]);
      logger.info(`MealService updateGoalCalorie ended.`);
      return {goalCalorie: goalCalorie};
    }catch(error){
      logger.error(`목표 칼로리 수정 중 에러 발생: ${error}`, );
    }
  }



  // 식사 상세 기록 조회
  async findMealFoodbyMealId(mealId){
    logger.info(`MealService findMealFoodbyMealId started. ${mealId}`);

    const result = await this.prisma.mealFood.findMany({
      where: {mealId}
    })

    const meal = await this.prisma.meal.findUnique({
      where: {id: mealId}
    })

    if(!result || !meal) throw new NotFoundException(`해당 식사 내용을 찾을 수 없어요`);

    logger.info(`MealService findMealFoodbyMealId ended.`);
    return {
        mealId,
        mealDate: meal.mealDate,
        photoUrl: meal.photoUrl,
        mealFood: result,
      };
  }


  async recordMealFoodItems(mealId, dto){
    logger.info(`MealService recordMealFoodItems started. ${mealId}`);

    try{
      await this.prisma.$transaction(async (tx) => {
        // mealFood 우선 삭제
        await tx.mealFood.deleteMany({
          where: {mealId}
        });

        // unitCalorie 계산 준비
        let unitCalorie = 0;

        // mealFood 새로 등록
        if(dto.foods.length > 0){
          unitCalorie = dto.foods.reduce(
            (sum, food) => sum + food.calorie,
            0,
          );
          await tx.mealFood.createMany({
            data: dto.foods.map(food => ({
              mealId,
              foodName: food.foodName,
              calorie: food.calorie,
            }))
          })
        }

        // mealId에 unitCalorie 수정
        await tx.meal.update({
          where: {id: mealId},
          data: {
            unitCalorie,
          }
        })
      });

      logger.info(`MealService recordMealFoodItems ended.`);
      return { mealId };
    }catch(error){
      logger.error(`MealFood 등록 중 에러 발생: ${error}`, );
    }
  }




  create(createMealDto: CreateMealDto) {
    return 'This action adds a new meal';
  }

  findAll() {
    return `This action returns all meal`;
  }


  update(id: number, updateMealDto: UpdateMealDto) {
    return `This action updates a #${id} meal`;
  }

  remove(id: number) {
    return `This action removes a #${id} meal`;
  }
}
