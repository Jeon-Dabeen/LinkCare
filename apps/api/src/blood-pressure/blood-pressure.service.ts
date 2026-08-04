import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateBloodPressureDto } from "./dto/create-blood-pressure.dto";
import { PrismaService } from "../prisma/prisma.service";
import { logger } from "../config/logger";
import { dayperiod } from "@prisma/client";
import { UpdateBloodPressurePulseDto } from "./dto/update-blood-pressure.dto";

@Injectable()
export class BloodPressureService {
  constructor(private readonly prisma: PrismaService) {}

  private toDate(date: string): Date {
    return new Date(`${date}T00:00:00.000Z`);
  }

  /**
   * 혈압 POST
   * @param userId
   * @param createBloodPressureDto
   * @returns
   */
  async createBloodPressure(userId: number, createBloodPressureDto: CreateBloodPressureDto) {
    logger.info(`bloodPressuerService createBloodPressure started.` + `userId=${userId}`);

    const { systolic, diastolic, pulse, dayPeriod, bpDate } = createBloodPressureDto;
    const date = this.toDate(bpDate); //프론트에서 받은 오늘날짜

    logger.debug(`createBloodPressure:systolic = ${systolic}, diastolic = ${diastolic},
       pulse= ${pulse}, dayPeriod =${dayPeriod}, bpDate=${bpDate}`);

    //사용자의 같은 날짜 같은 시간대의 혈압중복 확인
    const existBloodPressure = await this.prisma.bloodPressure.findFirst({
      where: { userId, bpDate: date, dayPeriod },
    });

    if (existBloodPressure) {
      throw new ConflictException("해당 날짜 해당 시간대의 혈압이 이미 등록되어 있어요.");
    }

    const result = await this.prisma.bloodPressure.create({
      data: { userId, systolic, diastolic, pulse, dayPeriod, bpDate: date },
    });

    logger.debug(`createBloodPressure result = ${JSON.stringify(result)}`);
    logger.info(`blododPressureService createBloodPressure ended.` + `userId=${userId}`);

    return result;
  }

  /**
   * 7일 조회 GET
   * @param userId
   * @param bpDate
   * @param dayPeriod
   * @returns
   */
  async findWeekBloodPressure(userId: number, bpDate: string, dayPeriod: dayperiod) {
    logger.info(`bloodPressureService FindWeekBloodPressure started.` + `userId=${userId}`);
    logger.debug(`findWeekBloodPressure: userId = ${userId}, bpDate = ${bpDate}, dayPeriod = ${dayPeriod}`);

    const endDate = this.toDate(bpDate); //프론트에서 받은 기준날짜인 오늘
    const startDate = new Date(endDate);

    //기준날짜인 오늘부터 6일전까지 조히
    startDate.setUTCDate(startDate.getUTCDate() - 6);

    const result = await this.prisma.bloodPressure.findMany({
      where: {
        userId,
        dayPeriod,
        bpDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        systolic: true,
        diastolic: true,
        pulse: true,
        dayPeriod: true,
        bpDate: true,
      },
      orderBy: {
        bpDate: "asc",
      },
    });

    logger.debug(`findWeekBloodPressure reuslt = ${JSON.stringify(result)}`);
    logger.info(`bloodPressureSerivce findWeekBloodPressure ended.` + `userId = ${userId}`);

    return result;
  }

  /**
   * 이번달 기준 최근 3달 조회 GET
   * @param userId 
   * @param bpDate 
   * @param dayPeriod 
   * @returns 
   */
  async findMonthBloodPressure(userId: number, bpDate: string, dayPeriod: dayperiod) {
    logger.info(`bloodPressureSerivce findMonthBloodPressure started` + `userId = ${userId}`);
    logger.debug(
      `findMonthBloodPressure:userId = ${userId},` + `bpDate = ${bpDate}, dayPeriod = ${dayPeriod}`,
    );

    //프론트에서 보낸 기준날짜
    const selectedDate = this.toDate(bpDate);

    //조회 기준달을 포함한 3개월 달력
    const startDate = new Date(
      Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth() - 2, 1),
    );

    //다음달 1일(미만)
    const endDate = new Date(
      Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth() + 1, 1),
    );

    const result = await this.prisma.bloodPressure.findMany({
      where: { userId, dayPeriod, 
        bpDate: { gte: startDate, lt: endDate },
      },
      select: {
        systolic:true,
        diastolic:true,
        pulse:true,
        dayPeriod:true,
        bpDate:true,
      },
      orderBy:{
        bpDate:"asc"
      }
    });
    
    logger.debug(`findMonthBloodPressure result = ${JSON.stringify(result)}`)
    logger.info(`bloodPressureService findMonthBloodPressure ended.`+ `userId=${userId}`);
    
    return result;

  }

  /**
   * 
   * @param userId 
   * @param bloodPressureId 
   * @param updateBloodPressurePulseDto 
   * @returns 
   */
  async updateBloodPressurePulse(userId: number,bloodPressureId:number, updateBloodPressurePulseDto:UpdateBloodPressurePulseDto,){
      logger.info(`bloodPressureService updateBloodPressurePulse started. userId=${userId}`);
  
      const { pulse } = updateBloodPressurePulseDto
  
      const bloodPressure = await this.prisma.bloodPressure.findFirst({
        where: { 
          id:bloodPressureId,
          userId,
         },
        select: { id: true },
      });
  
      if (!bloodPressure) {
        throw new NotFoundException("혈압 기록을 찾을 수 없어요");
      }
      
      const result = await this.prisma.bloodPressure.update({
        where:{ id:bloodPressureId},
        data:{pulse}
      })
      logger.debug(`updateBloodPressure result= ${JSON.stringify(result)}`);
      logger.info(`bloodPressureService updateBloodPressurePulse ended.`+ `userId=${userId}`);
  
      return result;
    }
}
