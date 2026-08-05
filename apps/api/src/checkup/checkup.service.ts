import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCheckupDto } from "./dto/create-checkup.dto";
import { CheckupAssessmentResponseDto, DashboardResponseDto } from "./dto/checkup.dto";
import { BlobServiceClient } from "@azure/storage-blob";
import { PrismaService } from "../prisma/prisma.service";
import { logger } from "../config/logger";
import { AzureDiService } from "../integrations/azure-di/azure-di.service";
import { CheckupEvaluator } from "../integrations/evaluator/checkup-evaluator";
import { Prisma } from "@prisma/client";
import { AiAdvisorService } from "../integrations/ai-advisor/ai-advisor.service";
import { log } from "console";

@Injectable()
export class CheckupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly azureDiService: AzureDiService,
    private readonly aiAdvisorService: AiAdvisorService,
  ) {}

  async uploadPdf(file: Express.Multer.File) {
    logger.info(`CheckupService uploadPdf started. fileName: ${file.originalname}`);

    if (!file) {
      logger.error("Upload Error: 400 - PDF 업로드 실패");
      throw new BadRequestException("PDF 파일을 찾을 수 없습니다.");
    }

    const baseUrl = process.env.AZURE_STORAGE_INPUT || "";
    const sasToken = process.env.AZURE_SAS_TOKEN || "";

    if (!baseUrl || !sasToken) throw new BadRequestException("업로드할 저장소를 찾을 수 없습니다.");

    const targetFileName = encodeURIComponent(file.originalname);
    const fullUploadUrl = sasToken
      ? `${baseUrl}${targetFileName}?${sasToken}`
      : `${baseUrl}${targetFileName}`;
    logger.debug(`fullUploadUrl: ${fullUploadUrl}`);

    try {
      logger.debug(`Send pdf a file started. fileName: ${file.originalname}`);

      const response = await fetch(fullUploadUrl, {
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

      logger.debug(`Send pdf a file ended. fileName: ${file.originalname}`);
    } catch (error) {
      logger.error("Send pdf Error: 500 - 전송 실패");
      throw new InternalServerErrorException("PDF 전송 실패");
    }

    logger.debug(`Fetch Document Intelligence api started. fileName: ${file.originalname}`);
    const data = await this.azureDiService.analyzeDocumentByUrl(file.originalname);
    logger.debug(`Document Intelligence api result total count: ${data?.total_count}`);
    logger.debug(`Fetch Document Intelligence api  ended. fileName: ${file.originalname}`);

    logger.info(`CheckupService uploadPdf ended. fileName: ${file.originalname}`);
    return { result: "success", code: 201, data };
  }

  async findAIComment(userId: number, checkupId: number) {
    logger.info(`CheckupService findAIComment started. userId=${userId}, checkupId=${checkupId}`);

    const aiComment = await this.prisma.checkUpComment.findFirst({
      where: { checkUpId: checkupId },
    });

    if (!aiComment) throw new NotFoundException("AI 검진분석 결과를 찾을 수 없어요.");

    logger.debug(`findAIComment userId=${userId}, checkupId=${checkupId}, aiComment=${JSON.stringify(aiComment)}`);
    logger.info(`CheckupService findAIComment ended. userId=${userId}, checkupId=${checkupId}`);

    return { aiComment: aiComment.comment };
  }

  async create(userId: number, createCheckupDto: CreateCheckupDto) {
    logger.info(
      `CheckupService create started. createCheckupDto: ${createCheckupDto.checkup_history.length}`,
    );

    const gender = "female"; // 임시 유저 성별

    const checkupHistory = createCheckupDto.checkup_history;

    const results = await this.prisma.$transaction(async (tx) => {
      logger.debug(`Checkup create transaction started.`);
      let count = 0; // 변경사항 카운트 변수
      const results: { checkupId: number; checkupAssessment: CheckupAssessmentResponseDto }[] = [];

      for (const history of checkupHistory) {
        const { checkup_year, checkup_date, ...checkupValues } = history;
        const dateStr = checkup_date.split("/");
        const exists = await tx.checkUp.findUnique({
          where: { userId_year: { userId, year: checkup_year } },
        });

        // 이미 DB에 저장된 검진 결과를 등록할 경우
        if (exists) {
          continue;
        }
        count++;

        logger.debug(`Checkup create started.`);
        const checkup = await tx.checkUp.create({
          data: {
            userId,
            year: checkup_year,
            checkUpDate: new Date(checkup_year, +dateStr[0], +dateStr[1]),
            ...checkupValues,
          },
        });
        logger.debug(`Checkup create ended.`);

        logger.debug(`Checkup evaluate started.`);
        const { height, weight, visionLeft, visionRight, hearing, ...values } = history;
        logger.debug(`History data: ${values}`);
        const evaluateCheckup = CheckupEvaluator.evaluateList([values], gender);
        logger.debug(`Evaluate data: ${evaluateCheckup}`);
        const checkupStatus = evaluateCheckup.checkup_status[0];
        const checkupAssessment = await tx.checkupAssessment.create({
          data: {
            checkUpId: checkup.id,
            waist: checkupStatus.waist.status,
            bmi: checkupStatus.bmi.status,
            bp: `sys:${checkupStatus.bp_systolic.status}/dia:${checkupStatus.bp_diastolic.status}`,
            urine_protein: checkupStatus.urine_protein.status,
            hemoglobin: checkupStatus.hemoglobin.status,
            fbg: checkupStatus.fbg.status,
            creatinine: checkupStatus.creatinine.status,
            egfr: checkupStatus.egfr.status,
            ast: checkupStatus.ast.status,
            alt: checkupStatus.alt.status,
            ygtp: checkupStatus.ygtp.status,
          },
        });
        results.push({ checkupId: checkup.id, checkupAssessment });
        logger.debug(`Checkup evaluate ended.`);
      } // end of for

      if (count === 0) {
        logger.error("Checkup create Error: 409 - 모두 저장된 검진 결과");
        throw new ConflictException("모든 검진 결과가 이미 저장되어 있습니다.");
      }

      logger.debug(`Checkup create transaction ended.`);
      return results;
    });

    Promise.all(
      results.map(({ checkupId, checkupAssessment }) => {
        this.generateCheckupAdvice(checkupId, checkupAssessment).catch((e) => {
          logger.error(`Failed saving AI comment checkupId: ${checkupId}, ${e.message}`);
        });
      }),
    );

    logger.info(
      `CheckupService create ended. createCheckupDto: ${createCheckupDto.checkup_history.length}`,
    );
    return { result: "success", code: 201, data: results };
  }

  async generateCheckupAdvice(checkupId: number, checkupAssessment: CheckupAssessmentResponseDto) {
    logger.info(`CheckupService generateCheckupAdvice started. checkupId: ${checkupId}`);
    const result = await this.aiAdvisorService.generateCheckupAdvice(checkupAssessment);
    if (!result.success) logger.error(`다시 에이전트한테 코멘트 받아 와`);

    logger.debug("Put AI comment in Database started.");
    const comment = await this.prisma.checkUpComment.create({
      data: { checkUpId: checkupId, comment: result.advice },
    });
    logger.debug(`AI comment: ${comment}`);
    logger.debug("Put AI comment in Database ended.");
    logger.info(`CheckupService generateCheckupAdvice ended. checkupId: ${checkupId}`);
  }

  async findAll(userId: number) {
    logger.info(`CheckupService.findAll started. userId=${userId}`);

    // 1. DB 조회: 최근 3건, 본인(userId) 데이터만, 최신 연도순 정렬
    const checkups = await this.prisma.checkUp.findMany({
      where: {
        userId,
        isShow: true,
      },
      orderBy: { year: "desc" },
      take: 3,
      select: {
        id: true,
        year: true,
        height: true,
        weight: true,
        waist: true,
        bmi: true,
        visionLeft: true,
        visionRight: true,
        hearing: true,
        bp_systolic: true,
        bp_diastolic: true,
        urine_protein: true,
        hemoglobin: true,
        fbg: true,
        creatinine: true,
        egfr: true,
        ast: true,
        alt: true,
        ygtp: true,
        CheckupAssessment: {
          select: {
            id: true,
            bmi: true,
            bp: true,
            urine_protein: true,
            hemoglobin: true,
            fbg: true,
            egfr: true,
            ast: true,
            alt: true,
            ygtp: true,
          },
        },
      },
    });

    // 2. 데이터 유무 검증 (백엔드 404 처리 -> 프론트엔드에서 업로드 페이지로 유연하게 처리)
    if (!checkups || checkups.length === 0) {
      throw new NotFoundException("등록된 건강검진 결과를 찾을 수 없습니다.");
    }

    logger.debug(`Found ${checkups.length} checkup records for userId=${userId}`);

    // 3. DTO 매핑 
    const dashboardResponseList: DashboardResponseDto[] = checkups.map((checkup) => {
      const assessmentData = checkup.CheckupAssessment?.[0];

      const dto: DashboardResponseDto = {
        id: checkup.id,
        year: checkup.year,
        body_metrics: {
          height: checkup.height,
          weight: checkup.weight,
          waist: checkup.waist,
          bmi: checkup.bmi,
          visionLeft: checkup.visionLeft,
          visionRight: checkup.visionRight,
          hearing: checkup.hearing,
        },
        blood_pressure: {
          bp_systolic: checkup.bp_systolic,
          bp_diastolic: checkup.bp_diastolic,
        },
        diabetes_anemia: {
          fbg: checkup.fbg,
          hemoglobin: checkup.hemoglobin,
        },
        liver: {
          ast: checkup.ast,
          alt: checkup.alt,
          ygtp: checkup.ygtp,
        },
        kidney: {
          urine_protein: checkup.urine_protein,
          creatinine: checkup.creatinine,
          egfr: checkup.egfr,
        },
        // Assessment 정보가 없는 만약의 경우에도 서버 에러(TypeError)를 방지하는 널 병합 처리
        assessment: {
          id: assessmentData?.id ?? 0,
          bmi: assessmentData?.bmi ?? "",
          bp: assessmentData?.bp ?? "",
          urine_protein: assessmentData?.urine_protein ?? "",
          hemoglobin: assessmentData?.hemoglobin ?? "",
          fbg: assessmentData?.fbg ?? "",
          egfr: assessmentData?.egfr ?? "",
          ast: assessmentData?.ast ?? "",
          alt: assessmentData?.alt ?? "",
          ygtp: assessmentData?.ygtp ?? "",
        },
      };

      return dto;
    });

    logger.info(`CheckupService.findAll ended successfully.`);
    return { result: "success", code: 200, data: dashboardResponseList };
  }

  async findYears(userId: number) {
    logger.info(`CheckupService findYear started.`);

    const checkup = await this.prisma.checkUp.findMany({
      where: { userId, isShow: true },
      select: { year: true },
      take: 3,
      orderBy: { year: "desc" },
    });

    logger.debug(checkup.length);
    if (checkup.length === 0) throw new NotFoundException("검진 결과를 찾을 수 없습니다.");

    logger.info(`CheckupService findYear ended.`);
    return { result: "success", code: 200, data: checkup.map((years) => years.year) };
  }

  async findBodyMetrics(userId: number, years: number[]) {
    logger.info(`CheckupService findBodyMetrics started. years: ${years}`);

    const bodyMetrics = await this.findValuesByYear(
      userId,
      years,
      {
        id: true,
        year: true,
        height: true,
        weight: true,
        waist: true,
        bmi: true,
        visionLeft: true,
        visionRight: true,
        hearing: true,
        CheckupAssessment: {
          select: {
            id: true,
            waist: true,
            bmi: true,
          },
        },
      },
      "신체 지표",
    );

    logger.info(`CheckupService findBodyMetrics ended. years: ${years}`);
    return { result: "success", code: 200, data: bodyMetrics };
  }

  async findBloodPressure(userId: number, years: number[]) {
    logger.info(`CheckupService findBloodPressure started. years: ${years}`);

    const bloodPressure = await this.findValuesByYear(
      userId,
      years,
      {
        id: true,
        year: true,
        bp_systolic: true,
        bp_diastolic: true,
        CheckupAssessment: {
          select: {
            id: true,
            bp: true,
          },
        },
      },
      "혈압 수치",
    );

    logger.info(`CheckupService findBloodPressure ended. years: ${years}`);
    return { result: "success", code: 200, data: bloodPressure };
  }

  async findDiabetesAnemia(userId: number, years: number[]) {
    logger.info(`CheckupService findDiabetesAnemia started. years: ${years}`);

    const diabetesAnemia = await this.findValuesByYear(
      userId,
      years,
      {
        id: true,
        year: true,
        fbg: true,
        hemoglobin: true,
        CheckupAssessment: {
          select: {
            id: true,
            fbg: true,
            hemoglobin: true,
          },
        },
      },
      "혈당 수치나 빈혈 수치",
    );

    logger.info(`CheckupService findDiabetesAnemia ended. years: ${years}`);
    return { result: "success", code: 200, data: diabetesAnemia };
  }

  async findLiver(userId: number, years: number[]) {
    logger.info(`CheckupService findLiver started. years: ${years}`);

    const liver = await this.findValuesByYear(
      userId,
      years,
      {
        id: true,
        year: true,
        ast: true,
        alt: true,
        ygtp: true,
        CheckupAssessment: {
          select: {
            id: true,
            ast: true,
            alt: true,
            ygtp: true,
          },
        },
      },
      "간 수치",
    );

    logger.info(`CheckupService findLiver ended. years: ${years}`);
    return { result: "success", code: 200, data: liver };
  }

  async findKidney(userId: number, years: number[]) {
    logger.info(`CheckupService findKidney started. years: ${years}`);

    const kidney = await this.findValuesByYear(
      userId,
      years,
      {
        id: true,
        year: true,
        urine_protein: true,
        creatinine: true,
        egfr: true,
        CheckupAssessment: {
          select: {
            id: true,
            urine_protein: true,
            creatinine: true,
            egfr: true,
          },
        },
      },
      "신장 수치",
    );

    logger.info(`CheckupService findKidney ended. years: ${years}`);
    return { result: "success", code: 200, data: kidney };
  }

  private async findValuesByYear<T extends Prisma.CheckUpSelect>(
    userId: number,
    years: number[],
    select: T,
    errorMessage: string,
  ) {
    const data = await this.prisma.checkUp.findMany({
      where: { userId, year: { in: years }, isShow: true },
      select,
    });

    if (data.length === 0)
      throw new NotFoundException(`사용자의 ${years}년도 ${errorMessage}를 찾을 수 없습니다.`);
    return data;
  }
}
