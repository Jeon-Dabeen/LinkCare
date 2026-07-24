import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateWeightDto } from "./dto/create-weight.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateWeightProfileDto } from "./dto/update-weight-profile-dto";

@Injectable()
export class WeightService {
  constructor(private readonly prisma: PrismaService) {}

  private toDate(date: string): Date {
    return new Date(`${date}T00:00:00.000Z`);
  }
  //목표체중 증량, 감량 회원 구분
  private getGoalWeightState(weight: number, goalWeight: number): string {
    if (weight > goalWeight) {
      return "-";
    }
    if (weight < goalWeight) {
      return "+";
    }
    return "0"; //유지회원
  }
  //체중 기록
  async createWeight(userId: number, createWeightDto: CreateWeightDto) {
    const { weight, height, goalWeight, weightDate } = createWeightDto;

    const date = this.toDate(weightDate);

    const existTodayWeight = await this.prisma.weight.findFirst({
      where: {
        userId,
        weightDate: date,
      },
    });

    if (existTodayWeight) {
      throw new ConflictException("해당 날짜에 체중이 이미 등록되어 있어요.");
    }

    //사용자의 프로필 조회
    const profile = await this.prisma.profile.findFirst({
      where: {
        userId,
      },
    });

    if (!profile) {
      throw new NotFoundException("사용자 프로필을 찾을수 없음");
    }

    //bmi 계산용 키, 요청값 우선
    const heightSave = height ?? profile.height;

    let bmi: number | null = null;

    if (heightSave != null) {
      const heightMeter = heightSave / 100;
      bmi = Number((weight / (heightMeter * heightMeter)).toFixed(1));
    }
    //목표체중이 이번요청에 있는지, 없으면 프로필 목표체중을 사용
    const goalWeightSave = goalWeight ?? profile.goalWeight;

    let goalWeightState = profile.goalWeightState;

    //goalWeightState 계산
    if (goalWeightSave != null) {
      //증량,감량등 상태가 아직 정해지지 않은 경우
      if (!goalWeightState) {
        goalWeightState = this.getGoalWeightState(weight, goalWeightSave);
      }
      //상태가 정해진 회원이 목표에 도달한 경우
      else if (
        (goalWeightState === "+" && weight >= goalWeightSave) ||
        (goalWeightState === "-" && weight <= goalWeightSave)
      ) {
        goalWeightState = "0";
      }
    }
    //기존db상태와 새로 계산한것 비교
    const stateChanged = goalWeightState !== profile.goalWeightState;

    //키,목표체중이 있는 상태로 state가 기존과 다르다면 업데이트
    if (height != null || goalWeight != null || stateChanged) {
      await this.prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          height: height ?? profile.height,
          goalWeight: goalWeight ?? profile.goalWeight,
          goalWeightState,
        },
      });
    }

    const createdToddayWeight = await this.prisma.weight.create({
      data: {
        userId,
        weight,
        bmi,
        weightDate: date,
      },
    });

    return {
      ...createdToddayWeight,
      height: height ?? profile.height,
      goalWeight: goalWeight ?? profile.goalWeight,
      goalWeightState,
    };
  }
  //7일 조회
  async findWeekWeight(userId: number, weightDate: string) {
    const endDate = this.toDate(weightDate);

    const startDate = new Date(endDate);

    startDate.setUTCDate(startDate.getUTCDate() - 6);

    const [profile, weights] = await Promise.all([
      this.prisma.profile.findFirst({
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
    return { profile, weights };
  }

  async findMonthWeight(userId: number, date: string) {
    //프론트에서 받은 날짜
    const selectedDate = this.toDate(date);

    const year = selectedDate.getUTCFullYear();
    const month = selectedDate.getUTCMonth();

    //해당 달 1일
    const thisMonth = new Date(Date.UTC(year, month, 1));

    //다음달 1일
    const nextMonth = new Date(Date.UTC(year, month + 1, 1));

    return this.prisma.weight.findMany({
      where: {
        userId,
        weightDate: {
          //선택된 달의 1일 이상
          gte: thisMonth,
          lt: nextMonth,
        },
      },
      select: {
        weightDate: true,
        bmi: true,
      },
      orderBy: {
        weightDate: "asc",
      },
    });
  }
  async updateWeightProfile(userId: number, dto: UpdateWeightProfileDto) {
    const { height, goalWeight } = dto;

    const profile = await this.prisma.profile.findFirst({
      where: {
        userId,
      },
    });
    if (!profile) {
      throw new NotFoundException("사용자 프로필을 찾을수 없어요.");
    }

    let goalWeightState = profile.goalWeightState;

    //목표 체중이 patch로 들어온경우 state를 다시 계산하여 저장
    if (goalWeight != null) {
      const latestWeight = await this.prisma.weight.findFirst({
        where: {
          userId,
        },
        orderBy: {
          weightDate: "desc",
        },
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
        id: profile.id,
      },
      data: {
        height: height ?? profile.height,
        goalWeight: goalWeight ?? profile.goalWeight,
        goalWeightState,
      },
    });
    return result;
  }
}
