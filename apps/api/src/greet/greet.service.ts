import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateGreetDto } from "./dto/create-greet.dto";
import { UpdateGreetDto } from "./dto/update-greet.dto";
import { logger } from "../config/logger";
import { PrismaService } from "../prisma/prisma.service";
import { AiAdvisorService } from "../integrations/ai-advisor/ai-advisor.service";
import { DailyShieldService } from "../daily-shield/daily-shield.service";

@Injectable()
export class GreetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiAdvisor: AiAdvisorService,
    private readonly dailyShield: DailyShieldService,
  ) {}

  create(createGreetDto: CreateGreetDto) {
    return "This action adds a new greet";
  }

  async createById(newAdvice: string, userId: number, dailyDate: string) {
    logger.info(`GreetService createById started. userId=${userId}`);

    const result = await this.prisma.dailyComment.create({
      data: {
        userId: userId,
        dailyDate: dailyDate,
        comment: newAdvice,
      },
    });
    logger.debug(`createById result=${result}`);
    logger.info(`GreetService createById ended. userId=${userId}`);

    return result;
  }

  findAll() {
    return `This action returns all greet`;
  }

  async findOne(userId: number, dailyDate: string) {
    logger.info(`GreetService findOne started. userId=${userId}`);

    // 1. 오늘 기록 조회
    let todayAdvice = await this.prisma.dailyComment.findUnique({
      where: { userId_dailyDate: { userId, dailyDate } },
    });

    const nickName = await this.prisma.profile.findUnique({ where: { userId } });

    // 2. 오늘 기록이 있으면 바로 return
    if (todayAdvice) {
      const result = {
        nickName: nickName,
        aiComment: todayAdvice.comment,
      };

      logger.debug(`findOne todayAdvice=${todayAdvice}, nickName=${nickName}`);
      logger.info(`GreetService findOne ended. userId=${userId}`);

      return result;
    }

    // 3. 오늘 기록이 없으면 AI를 통해 새 조언 생성 후 DB 저장
    const dailyData = await this.dailyShield.findOne(userId, dailyDate);
    const newAdviceMeta = await this.aiAdvisor.generateDailyAdvice(JSON.stringify(dailyData));

    if (!newAdviceMeta.success) {
      throw new InternalServerErrorException(`새로운 AI 코멘트 생성 중 오류가 발생했어요.`);
    }

    todayAdvice = await this.createById(newAdviceMeta.advice, userId, dailyDate);

    const result = {
      nickName: nickName,
      aiComment: todayAdvice.comment,
    };

    logger.debug(`findOne todayAdvice=${todayAdvice}, nickName=${nickName}`);
    logger.info(`GreetService findOne ended. userId=${userId}`);

    return result;
  }

  update(id: number, updateGreetDto: UpdateGreetDto) {
    return `This action updates a #${id} greet`;
  }
}
