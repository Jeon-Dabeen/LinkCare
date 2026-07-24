import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseArrayPipe,
} from "@nestjs/common";
import { CheckupService } from "./checkup.service";
import { CreateCheckupDto } from "./dto/create-checkup.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { pdfUploadOptions } from "../config/upload.config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RenameFileInterceptor } from "../common/interceptors/rename.file.interceptor";

@ApiTags("CheckUp")
@Controller("checkup")
export class CheckupController {
  constructor(private readonly checkupService: CheckupService) {}

  @ApiOperation({ summary: "PDF 업로드" })
  @Post("/upload")
  @UseInterceptors(FileInterceptor("file", pdfUploadOptions), RenameFileInterceptor)
  uploadPdf(@UploadedFile() file: Express.Multer.File) {
    return this.checkupService.uploadPdf(file);
  }

  @ApiOperation({ summary: "검진 결과 확인 후 등록" })
  @Post()
  create(@Body() createCheckupDto: CreateCheckupDto) {
    return this.checkupService.create(createCheckupDto);
  }

  @ApiOperation({ summary: "검진 대시보드 수치, 분류 조회" })
  @Get()
  findAll() {
    return this.checkupService.findAll();
  }

  @ApiOperation({ summary: "검진 결과 최근 3개 데이터 조회" })
  @Get("/years")
  findYears() {
    return this.checkupService.findYears();
  }

  @ApiOperation({ summary: "신체 지표 데이터 조회" })
  @Get("/body-metrics")
  findBodyMetrics(
    @Query("years", new ParseArrayPipe({ items: Number, separator: "," })) years: number[],
  ) {
    return this.checkupService.findBodyMetrics(years);
  }

  @ApiOperation({ summary: "혈압 데이터 조회" })
  @Get("/blood-pressure")
  findBloodPressure(
    @Query("years", new ParseArrayPipe({ items: Number, separator: "," })) years: number[],
  ) {
    return this.checkupService.findBloodPressure(years);
  }

  @ApiOperation({ summary: "혈당 & 빈혈 데이터 조회" })
  @Get("/diabetes-anemia")
  findDiabetesAnemia(
    @Query("years", new ParseArrayPipe({ items: Number, separator: "," })) years: number[],
  ) {
    return this.checkupService.findDiabetesAnemia(years);
  }

  @ApiOperation({ summary: "간 데이터 조회" })
  @Get("/liver")
  findLiver(
    @Query("years", new ParseArrayPipe({ items: Number, separator: "," })) years: number[],
  ) {
    return this.checkupService.findLiver(years);
  }

  @ApiOperation({ summary: "신장 데이터 조회" })
  @Get("/kidney")
  findKidney(
    @Query("years", new ParseArrayPipe({ items: Number, separator: "," })) years: number[],
  ) {
    return this.checkupService.findKidney(years);
  }
}
