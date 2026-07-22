import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateWeightDto } from "./dto/create-weight.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateWeightProfileDto } from "./dto/update-weight-profile-dto";

@Injectable()
export class WeightService {
  constructor(private readonly prisma: PrismaService) {}

  //추가
  //ai들 검증 결과 prisma가 날짜를 utc 형태로 전달하고 date 부분 처리 과정에서 1일전으로 저장될 위험이 있다고함
  //이부분 문제를 없애기 위해 asia/seoul 기준 날짜를 추출하여야함. 그리고 자정으로 함

  private getToday(): Date {
    const now = new Date();
    const koreaTimeString = now.toLocaleDateString("en-Ca", {
      timeZone: "Asia/Seoul",
    });
    const today = new Date(`${koreaTimeString}T00:00:00.000Z`);
    return today;
  }

  //트랜잭션은 아직 안했음 고민해봐야함

  async createWeight(userId: number, createWeightDto: CreateWeightDto) {
    const { weight, height, goalWeight } = createWeightDto;
    const today = this.getToday();

    //프론트상 메인에서 넘기는 데이터로 오늘 기록여부를 파악하겠지만 일단 api상으로도
    //오늘 기록을 확인하기
    const existTodayWeight = await this.prisma.weight.findFirst({
      where: {
        userId,
        weightDate: today,
      },
    });
    if (existTodayWeight) {
      throw new ConflictException("오늘 이미 체중이 등록 되었습니다.");
    }

    //user의 profile을 조회한다.
    const profile = await this.prisma.profile.findFirst({
      where: {
        userId,
      },
    });

    //회원가입시 프로필은 생겨야함 일단막아
    if (!profile) {
      throw new NotFoundException("사용자 프로필을 찾을수 없음");
    }

    // bmi 계산하기 위한 키, 이번에 들어온 키가 있으면 그걸로 체중 계산을 해야하므로 만듬
    const heightSave = height ?? profile.height;
    // 좌항 ?? 우항   좌항이 없으면  우항을 써라

    //profile.height은 db에 있는 height. height는 방금 입력받은애
    //입력받은 키가 있다면 그걸 쓰고, 없다면 db껄 쓰기 둘다 없으면 그냥 null

    let bmi: number | null = null; //키가 없다면 bmi는 null

    if (heightSave != null) {
      const heightMeter = heightSave / 100;

      bmi = Number((weight / (heightMeter * heightMeter)).toFixed(1));
    }

    //키와 목표체중이 중 하나라도 요청에 같이 들어온다면?
    //bmi계산도 다 했고 들어온걸 db에 저장하긴 해야지..
    if (height != null || goalWeight != null) {
      await this.prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          //요청값이 있다면 요청값 쓰고 없다면 기존값을 유지
          height: height ?? profile.height,
          goalWeight: goalWeight ?? profile.goalWeight,
        },
      });
    }

    //오늘의 체중 저장
    //키는 없다면 그냥 bmi null로 저장하자( 수정될 수 있음)
    const createToddayWeight = await this.prisma.weight.create({
      data: {
        userId,
        weight,
        bmi,
        weightDate: today,
      },
    });

    return createToddayWeight;
  }

  async findWeekWeight(userId: number) {
    const endDay = this.getToday(); //오늘 포함 7일을 보는거니 오늘포함+6일전 기록들 을 조회해야함 마지막날은 오늘임

    const startDay = new Date(endDay); //끝날이 사실상 오늘이라 이렇게 했음 그래프 그리기용이니까 마지막날이 오늘이다.

    startDay.setUTCDate(startDay.getUTCDate() - 6); //setDate였는데... 시간대 수정하면서 getUTCDate()를 쓰라고 해서 바꿨는데 좀더 확인해봐야함

    //여러개의 기록을 조회 범위를 계산한 startDay~endDay까지
    //가져올 데이터는 일자, 기록된 체중,기록된 bmi
    //asc로 한 이유는 오래된 데이터를 왼쪽에두고 7일간을 보려고 한것


    //promise.all은 한번에 가져온다 순차적 x
    //프로파일에 목표체중과 키는 한번만, 기록은 범위로
    const [profile, weights] = await Promise.all([
      this.prisma.profile.findFirst({
        where:{
          userId,
        },
        select:{
          height:true,
          goalWeight:true,
        },
      }),
      this.prisma.weight.findMany({
        where:{
          userId,
          weightDate:{
            gte:startDay,
            lte:endDay,
          },
        },
        select:{
          weightDate:true,
          weight:true,
          bmi:true,
        },
        orderBy:{weightDate:'asc'}
      })
    ])
    return {profile,weights};
  }

  //알아보니까 이번달 기록만 보는것도 성능상 범위를 지정해서 하는게 맞다고 함.

  async findMonthWeight(userId: number, year: number, month: number) {
    const thisMonth = new Date(Date.UTC(year, month - 1, 1));
    //프론트로부터 받은 year, month로 선택한 달의 1일을 만든다.
    //javascript월 번호는 0부터 시작이므로

    const nextMonth = new Date(Date.UTC(year, month, 1));

    return this.prisma.weight.findMany({
      where: {
        userId,
        weightDate: {
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

  //키 목표체중 update
  //profile에 키와 목표체중을 수정하고 싶은 경우..
  async updateWeightProfile(userId: number, dto: UpdateWeightProfileDto) {
    const { height, goalWeight } = dto;

    const profile = await this.prisma.profile.findFirst({
      where: {
        userId,
      },
    });

    if (!profile) {
      throw new NotFoundException("프로파일을 못찾은 경우 일단막음 ");
    }

    //있으면 수정해주고 없으면 그냥 유지....
    const result = await this.prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        height: height ?? profile.height,
        goalWeight: goalWeight ?? profile.goalWeight,
      },
    });
    return result;
  }
}
