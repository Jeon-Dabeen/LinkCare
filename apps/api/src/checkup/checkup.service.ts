import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateCheckupDto } from "./dto/create-checkup.dto";
import { UpdateCheckupDto } from "./dto/update-checkup.dto";
import { CheckupData, CheckupResponse } from "./interfaces/checkup.interface";
import { BlobServiceClient } from "@azure/storage-blob";
import { PrismaService } from "../prisma/prisma.service";
import fs from "fs";
import * as mockJsonData from "../../mock/data.json";
import { logger } from "../config/logger";
import { AzureDiService } from "../integrations/azure-di/azure-di.service";

@Injectable()
export class CheckupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly azureDiService: AzureDiService,
  ) {}

  async uploadPdf(file: Express.Multer.File) {
    logger.info(`CheckupService uploadPdf started. fileName: ${this.uploadPdf.name}`);

    if (!file) throw new BadRequestException("PDF 파일을 찾을 수 없습니다.");

    const baseUrl = process.env.AZURE_STORAGE_INPUT || "";
    const sasToken = process.env.AZURE_SAS_TOKEN || "";

    if (!baseUrl || !sasToken) throw new BadRequestException("업로드할 저장소를 찾을 수 없습니다.");

    const targetFileName = encodeURIComponent(file.originalname);
    const fullUploadUrl = sasToken
      ? `${baseUrl}${targetFileName}?${sasToken}`
      : `${baseUrl}${targetFileName}`;
    logger.debug(`fullUploadUrl: ${fullUploadUrl}`);

    try {
      logger.debug(`Send pdf a file started. fileName: ${this.uploadPdf.name}`);

      const fileBuffer = fs.readFileSync(file.path);

      const response = await fetch(fullUploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.mimetype,
          "x-ms-version": "2026-06-06",
        },
        body: fileBuffer,
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`Azure Response Error: ${response.status} - ${errorText}`);
        throw new Error(`Azure HTTP Error ${response.status}`);
      }

      logger.debug(`Send pdf a file ended. fileName: ${this.uploadPdf.name}`);
    } catch (error) {
      throw new InternalServerErrorException("PDF 전송 실패");
    }

    // 여기에 추가되어야 할 부분
    // 1. 받은 파일 Document Intelligence API로 전송
    // const result = this.azureDiService.analyzeDocumentByUrl(file.filename);
    // logger.debug(`checkup - ${this.uploadPdf.name} : \n`, result);
    // 2. 보낸 PDF에서 뽑아낸 JSON 데이터 받아오기

    // 임시로 JSON 읽어와서 사용하는 부분
    const data = mockJsonData.checkup_records;
    const checkUpDataList: CheckupData[] = [];

    data.forEach((d) => {
      const checkupData: CheckupData = {
        checkUpDate: d.date,
        height: d.vital_signs.height.value,
        weight: d.vital_signs.weight.value,
        waist: d.vital_signs.waist.value,
        bmi: d.vital_signs.bmi.value,
        visionLeft: d.vital_signs.vision_left.value,
        visionRight: d.vital_signs.vision_right.value,
        hearing: d.vital_signs.hearing.value,
        bp_systolic: d.test_results.bp_systolic.value,
        bp_diastolic: d.test_results.bp_diastolic.value,
        urine_protein: d.test_results.urine_protein.value,
        hemoglobin: d.test_results.hemoglobin.value,
        fbg: d.test_results.fbg.value,
        creatinine: d.test_results.creatinine.value,
        egfr: d.test_results.egfr.value,
        ast: d.test_results.ast.value,
        alt: d.test_results.alt.value,
        ygtp: d.test_results.ygtp.value,
      };

      checkUpDataList.push(checkupData);
    });

    logger.info(`CheckupService uploadPdf ended. fileName: ${this.uploadPdf.name}`);
    return { result: "success", code: 201, checkUpDataList };
  }

  async create(createCheckupDto: CreateCheckupDto) {
    logger.debug(`checkup - ${this.create.name} start`);

    const userId = 1; // 임시 유저 아이디
    const gender = "female"; // 임시 유저 성별

    const checkupList = createCheckupDto.checkupList;

    try {
      return await this.prisma.$transaction(async (tx) => {
        logger.debug(`checkup - ${this.create.name} transaction start`);
        const results: CheckupResponse[] = [];

        let count = 0;

        logger.debug(`checkup - ${this.create.name} 검진 결과 등록 start`);
        for (const checkup of checkupList) {
          const { checkUpDate, ...data } = checkup;
          const year = Number(checkUpDate.substring(0, 4));

          const exists = await tx.checkUp.findUnique({
            where: { userId_year: { userId, year } },
          });

          // 이미 DB에 저장된 검진 결과를 등록할 경우
          if (exists) {
            continue;
          }
          count++;

          const result = await tx.checkUp.create({
            data: { userId, year, checkUpDate: new Date(checkUpDate), ...data },
          });

          results.push(result);
        } // end of for
        logger.debug(`checkup - ${this.create.name} 검진 결과 등록 end`);

        if (count === 0) throw new ConflictException("이미 존재하는 검진 결과");

        for (const result of results) {
          // result에 있는 값으로 riskRange.json 데이터 값 비교
        } // end of for

        logger.debug(`checkup - ${this.create.name} transaction end`);
        return results;
      });
    } finally {
      logger.debug(`checkup - ${this.create.name} end`);
    }

    // if (checkUpList.length > 1) {
    //   // 여러개 등록
    //   logger.debug(`checkup - ${this.create.name} 여러개 등록`);
    //   return this.prisma.$transaction(async (tx) => {
    //     logger.debug(`checkup - ${this.create.name} transaction start`);

    //     const results: CheckupResponse[] = [];

    //     for (const checkUp of checkUpList) {
    //       const year = Number(checkUp.checkUpDate.substring(0, 4));

    //       const exists = await this.prisma.checkUp.findUnique({
    //         where: { userId_year: { userId, year } },
    //       });

    //       if (exists) throw new ConflictException("이미 존재하는 검진 결과");

    //       const { checkUpDate, ...data } = checkUp;

    //       const result = await this.prisma.checkUp.create({
    //         data: { userId, year, checkUpDate: new Date(checkUpDate), ...data },
    //       });

    //       results.push(result);
    //     } // end of for
    //     return results;
    //   });
    // } else {
    //   // 한개 등록
    //   logger.debug(`checkup - ${this.create.name} 한개 등록`);

    //   const checkUpDto: CheckupDto = checkUpList[0];
    //   const year = Number(checkUpDto.checkUpDate.substring(0, 4));

    //   const exists = await this.prisma.checkUp.findUnique({
    //     where: { userId_year: { userId, year } },
    //   });

    //   if (exists) throw new ConflictException("이미 존재하는 검진 결과");

    //   const { checkUpDate, ...data } = checkUpDto;

    //   return this.prisma.checkUp.create({
    //     data: { userId, year, checkUpDate: new Date(checkUpDate), ...data },
    //   });
    // }
  }

  findAll() {
    return `This action returns all checkup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checkup`;
  }

  update(id: number, updateCheckupDto: UpdateCheckupDto) {
    return `This action updates a #${id} checkup`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkup`;
  }
}
