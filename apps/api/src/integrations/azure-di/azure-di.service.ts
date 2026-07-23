import { Injectable, OnModuleInit } from "@nestjs/common";
import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { logger } from "../../config/logger";
import { AiAdvisorService } from "../ai-advisor/ai-advisor.service";
@Injectable()
export class AzureDiService implements OnModuleInit {
  private client: DocumentAnalysisClient;
  private fileStorage: string;

  constructor(private readonly aiAdvisorService: AiAdvisorService) {}

  onModuleInit() {
    logger.info("AzureDiService initialized");
    const endpoint = process.env.AZURE_DI_ENDPOINT;
    const apiKey = process.env.AZURE_DI_KEY;
    const storageInput = process.env.AZURE_STORAGE_INPUT;

    if (!endpoint || !apiKey || !storageInput) {
      logger.error("Azure DI credentials not configured");
      throw new Error("Azure DI credentials not configured");
    }

    this.fileStorage = storageInput;
    this.client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
  }

  // pdf 문서 분석 - azure blob storage
  async analyzeDocumentByUrl(fileName: string, modelId: string = "checkupV1.0") {
    logger.info(`analyzeDocumentByUrl started. fileName: ${fileName}`);

    try {
      const uploadedPdfUrl = new URL(fileName, this.fileStorage).href;
      logger.debug(`uploadedPdfUrl: ${uploadedPdfUrl}`);

      // 1. Azure DI에 파일분석 요청
      const poller = await this.client.beginAnalyzeDocumentFromUrl(modelId, uploadedPdfUrl);
      // 2. json data 응답
      const data = await poller.pollUntilDone();
      // 3. 필요한 부분만 json parsing
      const result = await this.checkupDataParser(data);

      return result;
    } catch (error: any) {
      logger.error(`Azure DI 분석 실패: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        "문서 분석 중 에러가 발생했습니다. 파일 형식을 확인해주세요.",
      );
    }
  }

  // 데이터 처리 메인 parser
  async checkupDataParser(data) {
    const checkupTable = data.documents?.[0]?.fields.checkup_table;

    if (checkupTable && checkupTable.kind !== "object") {
      return null;
    }

    // 1. 입력된 데이터 중 최근 3회 가져오기
    const filteredYears = await this.checkupYearRecord(checkupTable);
    // 2. 필요한 항목만 선별
    const result = await this.finalJson(filteredYears);

    return { total_count: result?.length, checkup_history: result };
  }

  async checkupYearRecord(checkupTable) {
    const filteredYears: Record<string, any> = {};
    let count = 0;

    for (let i = 10; i >= 1; i--) {
      if (count >= 3) break; // 최대 3개까지만

      const key = `year_${i}`;
      const yearData = checkupTable.properties[key];

      // 검진한 해만 필터링 (checkup_date value 유무로 확인)
      const checkupDateValue = yearData?.properties?.checkup_date?.value;

      if (checkupDateValue !== undefined && checkupDateValue !== null && checkupDateValue !== "") {
        filteredYears[key] = yearData;
        count++;
      }
    }

    return filteredYears;
  }

  async finalJson(filteredYears) {
    const result: any[] = [];

    if (filteredYears && Object.keys(filteredYears).length === 0) {
      return null;
    }

    // 연도별 객체 순회
    for (const [yearKey, yearData] of Object.entries(filteredYears)) {
      const props = (yearData as any)?.properties;
      if (!props) continue;

      // 각 항목의 value만 추출
      const checkupRecord = {
        checkup_year: props.checkup_year?.value ?? "",
        checkup_date: props.checkup_date?.value ?? "",
        height: props.height?.value ?? "",
        weight: props.weight?.value ?? "",
        waist: props.waist?.value ?? "",
        bmi: props.bmi?.value ?? "",
        vision_left: props.vision?.value.split("/")[0] ?? "",
        vision_right: props.vision?.value.split("/")[1] ?? "",
        bp_systolic: props["bp_systolic/bp_diastolic"]?.value.split("/")[0] ?? "",
        bp_diastolic: props["bp_systolic/bp_diastolic"]?.value.split("/")[1] ?? "",
        urine_protein: props.urine_protein?.value ?? "",
        hemoglobin: props.hemoglobin?.value ?? "",
        fbg: props.fbg?.value ?? "",
        creatinine: props.creatinine?.value ?? "",
        egfr: props.egfr?.value ?? "",
        ast: props.ast?.value ?? "",
        alt: props.alt?.value ?? "",
        ygtp: props.ygtp?.value ?? "",
      };

      result.push(checkupRecord);
    }

    return result;
  }
}
