import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { mealtiming, mealtype } from "@prisma/client";
import { CreateBloodGlucoseDto } from "./dto/create-blood-glucose.dto";
import { logger } from "../config/logger";

@Injectable()
export class BloodGlucoseService {
  constructor(private readonly prisma: PrismaService) {}

  private toDate(date: string): Date {
    return new Date(`${date}T00:00:00.000Z`);
  }

  //식전,식후를 그룹화
  private groupByDate(records: { glucose: number; mealTiming: mealtiming; bgDate: Date }[]) {
    const grouped = new Map<string,
      {
        bgDate: Date;
        before: number | null;
        after: number | null;
      }>();

    for (const record of records) {
      //년,월,일 형태로 자름
      const dateKey = record.bgDate.toISOString().slice(0, 10);
      //같은 날짜 데이터가 아직 없을시엔 기본값 생성

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, {
          bgDate: record.bgDate,
          before: null,
          after: null,
        });
      }

      const dailyRecord = grouped.get(dateKey);

      //타입스크립트 에러 방지
      if (!dailyRecord) {
        continue;
      }

      if (record.mealTiming === mealtiming.BEFORE) {
        dailyRecord.before = record.glucose;
      }

      else {
        dailyRecord.after = record.glucose;
      }
    }

    const result = [...grouped.values()];

    return result;
  }

  /**
   * 혈당 기록 생성
   * @param userId 
   * @param createBloodGlucoseDto 
   * @returns 
   */
  async createBloodGlucose(userId: number, createBloodGlucoseDto: CreateBloodGlucoseDto) {
    logger.info(`blood-glucoseService createBloodGlucose started.`+`userId=${userId}`)
    
    const { glucose, mealType, mealTiming, bgDate } = createBloodGlucoseDto;
    const date = this.toDate(bgDate);
    logger.debug(
      `createBloodGlucose : glucose = ${glucose}, mealType = ${mealType} mealTiming = ${mealTiming} bgDate =${bgDate}`
    )

    //일,시간대,식전식후 중복을 확인
    const existBloodGlucose = await this.prisma.bloodGlucose.findFirst({
      where: {
        userId,
        bgDate: date,
        mealType,
        mealTiming,
      },
    });

    if (existBloodGlucose) {
      throw new ConflictException("해당 날짜 해당 시간대의 혈당이 이미 등록되어 있어요");
    }

    const result = await this.prisma.bloodGlucose.create({
      data: {
        userId,
        glucose,
        mealType,
        mealTiming,
        bgDate: date,
      },
    });
    
    logger.debug(
      `createBloodGlucose result =${JSON.stringify(result)}`
    )
    
    logger.info(`BloodGlucoseService createBloodGlucose ended. userId =${userId}`)

    return result;
  }

  /**
   * 기준 날짜를 포함한 최근 7일 혈당 조회
   * @param userId 
   * @param bgDate 
   * @param mealType 
   * @returns 
   */
  async findWeekBloodGlucose(userId: number, bgDate: string, mealType: mealtype) {
    logger.info(`BloodGlucoseSerivce findWeekBloodGlucose started.`+`userId={userId}`,
    );
    
    logger.debug(`findWeekBloodGlucose: userId=${userId},`+`bgDate=${bgDate},mealType=${mealType}`,);
    
    const endDate = this.toDate(bgDate);
    const startDate = new Date(endDate);

    startDate.setUTCDate(startDate.getUTCDate() - 6);

    //선택한 탭의 혈당 기록 조회
    const bloodGlucoseRecords = await this.prisma.bloodGlucose.findMany({
      where: {
        userId,
        mealType,
        bgDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        glucose: true,
        mealTiming: true,
        bgDate: true,
      },
      orderBy: {
        bgDate: "asc",
      },
    });

    const result = this.groupByDate(bloodGlucoseRecords);
    
    logger.debug(
      `findWeekBloodGlucose result =${JSON.stringify(result)}`,
    )

    logger.info(
      `BloodGlucoseService findWeekBloodGlucose ended`+`userId=${userId}`
    );

    return result
  }

  /**
   *  선택한 달을 포함한 최근 3개월 혈당 조회
   * @param userId 
   * @param bgDate 
   * @param mealType 
   * @returns 
   */
  async findMonthBloodGlucose(userId: number, bgDate: string, mealType: mealtype) {
    logger.info(`BloodGlucoseService findMonthBloodGlucose started. ` +
        `userId=${userId}`,
    );

    logger.debug(
      `findMonthBloodGlucose: userId=${userId}, ` +
        `bgDate=${bgDate}, mealType=${mealType}`,
    );

    // 프론트에서 받은 기준 날짜를 Date 객체로 변환
    const selectedDate = this.toDate(bgDate);

    //2개월전, 그리고 1일로 만듬
    const startDate = new Date(
      Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth() - 2, 1),
    );

    //다음달1일
    //다음달 1일 이전까지
    const endDate = new Date(
      Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth() + 1, 1),
    );

    const bloodGlucoseRecords = await this.prisma.bloodGlucose.findMany({
      where: {
        userId,
        mealType,
        bgDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        glucose: true,
        mealTiming: true,
        bgDate: true,
      },
      orderBy: {
        bgDate: "asc",
      },
    });
    // 같은 날짜의 식전 식후 기록을 묶어서 반환하는 함수에 넣었다 뺌
    const result = this.groupByDate(bloodGlucoseRecords);

    logger.debug(`findMonthBloodGlucose result=${JSON.stringify(result)}`,)
    
    logger.info(`BloodGlucoseService findMonthBloodGlucose ended. ` +
        `userId=${userId}`,
    );

    return result
  }

}
