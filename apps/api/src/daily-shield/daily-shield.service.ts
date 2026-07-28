import { Injectable } from "@nestjs/common";
import { CreateDailyShieldDto } from "./dto/create-daily-shield.dto";
import { UpdateDailyShieldDto } from "./dto/update-daily-shield.dto";
import { PrismaService } from "../prisma/prisma.service";
import { logger } from "../config/logger";

@Injectable()
export class DailyShieldService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, dto: CreateDailyShieldDto) {
    logger.info(`DailyShieldService create. userId=${userId}`);

    return this.prisma.dailyShield.create({
      data: {
        userId: userId,
        dailyDate: dto.dailyDate,
        feel: dto.feel,
        energy: dto.energy,
        exerciseTime: dto.exerciseTime,
        exerciseType: dto.exerciseType,
        waterCup: dto.waterCup,
        supplementType: dto.supplementType,
      },
    });
  }

  async findOne(userId: number, dailyDate: string) {
    logger.info(`DailyShieldService findOne started. userId=${userId}`);

    // 1. 오늘 기록 조회
    const todayRecord = await this.prisma.dailyShield.findUnique({
      where: { userId_dailyDate: { userId, dailyDate } },
    });

    // 2. 오늘 이전의 가장 최근 기록 조회 (빠른 생성 용)
    const lastRecord = await this.prisma.dailyShield.findFirst({
      where: { userId, dailyDate: { lt: dailyDate } }, // lt = less than 오늘 이전
      orderBy: { dailyDate: "desc" }, // 가장 최근 1건 정렬
      select: {
        exerciseTime: true,
        exerciseType: true,
        waterCup: true,
        supplementType: true,
      },
    });

    // 3. 단 1회 반환 타입으로 합침
    const result = {
      id: todayRecord?.id ?? 0,
      userId: userId,
      feel: todayRecord?.feel ?? 0,
      energy: todayRecord?.energy ?? 0,
      exerciseTime: todayRecord?.exerciseTime ?? "",
      exerciseType: todayRecord?.exerciseType ?? "",
      waterCup: todayRecord?.waterCup ?? 0,
      supplementType: todayRecord?.supplementType ?? "",
      dailyDate: todayRecord?.dailyDate ?? dailyDate,

      // 빠른 생성용 (어제/최근 데이터)
      // 한번도 입력하지 않은 사용자의 경우 default: t30, 걷기, 8, 종합비타민
      lastExerciseTime: lastRecord?.exerciseTime ?? "t30",
      lastExerciseType: lastRecord?.exerciseType ?? "걷기",
      lastWaterCup: lastRecord?.waterCup ?? 8,
      lastSupplementType: lastRecord?.supplementType ?? "종합비타민",
    };

    logger.info(`DailyShieldService findOne ended. userId=${userId}`);
    logger.debug(`findOne result: ${JSON.stringify(result)}`);

    return result;
  }

  update(id: number, dto: UpdateDailyShieldDto) {
    logger.info(`DailyShieldService update. id=${id}`);
    logger.debug(`UpdateDailyShieldDto: ${JSON.stringify(dto)}`)
    const { dailyDate, ...updateData } = dto;

    return this.prisma.dailyShield.update({
      where: { id },
      data: updateData,
    });
  }
}
