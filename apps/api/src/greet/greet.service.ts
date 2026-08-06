import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateGreetDto } from "./dto/create-greet.dto";
import { UpdateGreetDto } from "./dto/update-greet.dto";
import { logger } from "../config/logger";
import { PrismaService } from "../prisma/prisma.service";
import { AiAdvisorService } from "../integrations/ai-advisor/ai-advisor.service";
import { DailyShieldService } from "../daily-shield/daily-shield.service";
import { MealService } from "../meal/meal.service";

@Injectable()
export class GreetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiAdvisor: AiAdvisorService,
    private readonly dailyShield: DailyShieldService,
    private readonly meal: MealService,
  ) {}

  create(createGreetDto: CreateGreetDto) {
    return "This action adds a new greet";
  }

  async upsert(newAdvice: string, userId: number, dailyDate: string) {
    logger.info(`GreetService upsert started. userId=${userId}, dailyDate=${dailyDate}`);

    const result = await this.prisma.dailyComment.upsert({
      where: {
        userId_dailyDate: { userId, dailyDate },
      },
      update: { comment: newAdvice },
      create: { userId, dailyDate, comment: newAdvice },
    });

    logger.debug(`upsertById result=${JSON.stringify(result)}`);
    logger.info(`GreetService createById ended. userId=${userId}, dailyDate=${dailyDate}`);

    return result;
  }

  /**
   * 오늘의 AI 조언 조회
   * @param userId 
   * @param dailyDate 
   * @returns 
   */
  async findOne(userId: number, dailyDate: string) {
    logger.info(`GreetService findOne started. userId=${userId}`);

    // 1. 오늘 기록 조회
    let todayAdvice = await this.prisma.dailyComment.findUnique({
      where: { userId_dailyDate: { userId, dailyDate } },
    });

    // 2. 오늘 기록이 있으면 바로 return
    if (todayAdvice) {
      logger.debug(`findOne todayAdvice=${todayAdvice.comment}`);
      logger.info(`GreetService findOne ended. userId=${userId}`);

      return { aiComment: todayAdvice.comment };
    }

    // 3. 오늘 기록이 없으면 AI를 통해 새 조언 생성 후 DB 저장
    todayAdvice = await this.generateComment(userId, dailyDate);

    logger.debug(`findOne todayAdvice=${todayAdvice.comment}`);
    logger.info(`GreetService findOne ended. userId=${userId}`);

    return { aiComment: todayAdvice.comment };
  }

  findNickName(userId: number) {
    logger.info(`GreetService findNickName. userId=${userId}`);
    return this.prisma.profile.findUnique({
      where: { userId },
      select: { nickName: true },
    });
  }

  /**
   * 오늘의 AI 조언 새로 생성
   */
  async update(userId: number, dailyDate: string) {
    logger.info(`GreetService update started. userId=${userId}, dailyDate=${dailyDate}`);

    const todayAdvice = await this.generateComment(userId, dailyDate);

    logger.debug(`update todayAdvice=${todayAdvice.comment}`);
    logger.info(`GreetService update ended. userId=${userId}, dailyDate=${dailyDate}`);

    return { aiComment: todayAdvice.comment };
  }

  /**
   * AI 조언 생성을 위한 데이터 수집 & 요청
   * @param userId 
   * @param dailyDate 
   * @returns 
   */
  async generateComment(userId: number, dailyDate: string) {
    logger.info(`GreetService generateComment. userId=${userId}`);

    const [shield, weight, meal] = await Promise.all([
      this.dailyShield.findOne(userId, dailyDate),
      this.meal.findHomeDaily(userId, dailyDate),
      this.meal.findHomeMeals(userId, dailyDate),
    ]);

    const dailyShieldData = shield;
    const dailyWeightData = weight;
    const dailyMealData = meal;

    const dailyData = {
      shield: dailyShieldData,
      healthData: dailyWeightData,
      meals: dailyMealData,
    };

    logger.debug(`userId=${userId}, dailtWeightData: ${JSON.stringify(dailyData)}`);

    // 데이터 모두 ai 전송
    const newAdviceMeta = await this.aiAdvisor.generateDailyAdvice(JSON.stringify(dailyData));

    if (!newAdviceMeta.success) {
      throw new InternalServerErrorException(`새로운 AI 코멘트 생성 중 오류가 발생했어요.`);
    }

    return this.upsert(newAdviceMeta.advice, userId, dailyDate);
  }
}
