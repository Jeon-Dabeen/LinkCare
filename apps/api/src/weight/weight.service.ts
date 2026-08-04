import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateWeightDto } from "./dto/create-weight.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateWeightProfileDto } from "./dto/update-weight-profile-dto";
import { logger } from "../config/logger";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class WeightService {
  constructor(private readonly prisma: PrismaService) {}

  //시간 계산 
  private toDate(date: string): Date {
    return new Date(`${date}T00:00:00.000Z`);
  }
  //목표체중 증량, 감량 회원 구분
  private getGoalWeightState(weight: number, goalWeight: number): "-" | "+" | "0" {
    if (weight > goalWeight) {
      return "-";
    }

    if (weight < goalWeight) {
      return "+";
    }
    return "0"; //유지회원
  }

  /**
   * 체중 등록
   * @param userId 
   * @param createWeightDto 
   * @returns 
   */
  async createWeight(userId: number, createWeightDto: CreateWeightDto) {
    logger.info(`WeightService createWeight started. userId=${userId}`);

    const { weight, goalWeight, weightDate } = createWeightDto;
    logger.debug(
      `createWeight: weight=${weight} goalWeight=${goalWeight} weightDate=${weightDate}`,
    );

    const date = this.toDate(weightDate);

    const existTodayWeight = await this.prisma.weight.findUnique({
      where: {
        userId_weightDate:{
        userId,
        weightDate: date,
        },
      },
    });

    if (existTodayWeight) {
      throw new ConflictException("해당 날짜에 체중이 이미 등록되어 있어요.");
    }

    //사용자의 프로필 조회
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    if (!profile) {
      throw new NotFoundException("사용자 프로필을 찾을수 없음");
    }

    if (profile.height == null || profile.height <= 0) {
      throw new BadRequestException(
        "BMI 계산에 필요한 키 정보가 없어요.",
      );
    }
    
    const heightMeter = profile.height / 100;

    const bmi = Number(
      (weight / (heightMeter * heightMeter)).toFixed(1));

    /*
     * 요청에 목표체중이 있으면 요청값 사용
     * 없으면 기존 프로필의 목표체중 사용
     */
    const savedGoalWeight = goalWeight ?? profile.goalWeight;

    let goalWeightState = profile.goalWeightState as
    | "-"
    | "+"
    | "0"
    | null

    /**
     * 목표체중이 존재하는 경우에만
     * 증량, 감량, 유지 상태를 계산
     */
    if (savedGoalWeight != null){

      //기존 목표 상태가 없는 경우
      if(!goalWeightState) {
        goalWeightState = this.getGoalWeightState(weight, savedGoalWeight)
      }

      //기존 목표 상태가 있고
      //사용자가 목표체중에 도달
      else if (
        (goalWeightState === "+" &&
          weight >= savedGoalWeight) ||
        (goalWeightState === "-" &&
          weight <= savedGoalWeight)
        ){
          goalWeightState = "0";
        }
    }

    //DB 저장된 상태와 새로 계산한 것 비교
    const stateChanged = goalWeightState !== profile.goalWeightState
    
    /*
     * 목표체중이 요청으로 들어왔거나
     * 목표 상태가 변경된 경우에만 프로필 수정
     */
    if ( goalWeight != null || stateChanged ){
      await this.prisma.profile.update({
        where:{
          userId,
        },
        data: {
          goalWeight: savedGoalWeight,
          goalWeightState,
        },
      });
    }

    const createdTodayWeight = await this.prisma.weight.create({
      data: {
        userId,
        weight,
        bmi,
        weightDate: date,
      },
    });

    const result = {
      ...createdTodayWeight,
      height: profile.height,
      goalWeight: savedGoalWeight,
      goalWeightState,
    };

    logger.debug(`createdTodayWeight: ${JSON.stringify(result)}`,);
    logger.info(`WeightService createWeight ended. userId=${userId}`);

    return result;
  }

  /**
   * 7일 조회
   * @param userId
   * @param weightDate
   * @returns
   */
  async findWeekWeight(userId: number, weightDate: string) {
    logger.info(`WeightService findWeekWeight started. userId=${userId}`);
    
    const endDate = this.toDate(weightDate);
    const startDate = new Date(endDate);

    startDate.setUTCDate(startDate.getUTCDate() - 6);

    const [profile, weights] = await Promise.all([
      this.prisma.profile.findUnique({
        where: {
          userId,
        },
        select: {
          height: true,
          goalWeight: true,
          goalWeightState: true,
        },
      }),

      this.prisma.weight.findMany({
        where: {
          userId,
          weightDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          weightDate: true,
          weight: true,
          bmi: true,
        },
        orderBy: { weightDate: "asc" },
      }),
    ]);

    if(!profile){
      throw new NotFoundException(
        "사용자 프로필을 찾을 수 없어요."
      )
    }
    
    const result ={ profile, weights }

    logger.info(`WeightService findWeekWeight ended. userId =${userId}`,);
    
    return result;
  }

  /**
   * 선택 월을 포함한 최근 3개월 BMI 조회
   * @param userId 
   * @param date 
   * @returns 
   */
    async findMonthWeight(userId: number, date: string) {
    logger.info(`WeightService findMonthWeight started. userId=${userId}`);

    const selectedDate = this.toDate(date); //프론트에서 받은 날짜

    const year = selectedDate.getUTCFullYear();
    const month = selectedDate.getUTCMonth();
    const threeMonthAgo = new Date(Date.UTC(year, month - 2, 1)); //3달전의 1일
    const nextMonth = new Date(Date.UTC(year, month + 1, 1)); //다음달 1일

    const weights =await this.prisma.weight.findMany({
      where: {
        userId,
        weightDate: {
          //선택된 달의 1일 이상
          gte: threeMonthAgo,
          lt: nextMonth,
        },
      },
      select: { weightDate: true, bmi: true },
      orderBy: { weightDate: "asc" },
    });

    logger.info(`WeightService findMonthWeight ended. userId = ${userId}`)
    
    return weights;
  }

  /**
   * 프로필의 목표체중 수정
   * @param userId
   * @param dto
   * @returns
   */
  async updateWeightProfile(userId: number, dto: UpdateWeightProfileDto) {
    logger.info(`WeightService updateWeightProfile started. userId=${userId}`);

    const { goalWeight } = dto;

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException("사용자 프로필을 찾을수 없어요.");
    }

    let goalWeightState = profile.goalWeightState as
    | "-"
    | "+"
    | "0"
    | null

    //목표 체중이 patch로 들어온경우
    //가장 최근 체중을 기준으로 목표 상태 재계산
    if (goalWeight != null) {
      const latestWeight = await this.prisma.weight.findFirst({
        where: { userId },
        orderBy: { weightDate: "desc" },
      });

      //마지막 체중기록이 조회된 경우
      if (latestWeight) {
        goalWeightState = this.getGoalWeightState(latestWeight.weight, goalWeight);
      }
      //체중 기록이 하나도 없었던 경우 POST에서 체중 입력시 계산
      else {
        goalWeightState = null;
      }
    }

    const result = await this.prisma.profile.update({
      where: {
        userId,
      },
      data: {
        goalWeight: goalWeight ?? profile.goalWeight,
        goalWeightState,
      },
    });

    logger.debug(`updateWeightProfile result: ${JSON.stringify(result)}`);
    logger.info(`WeightService updateWeightProfile ended. userId=${userId}`);

    return result;
  }
}
