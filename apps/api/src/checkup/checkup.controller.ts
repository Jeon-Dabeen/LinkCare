import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseArrayPipe,
  UseGuards,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { CheckupService } from "./checkup.service";
import { CreateCheckupDto } from "./dto/create-checkup.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { pdfUploadOptions } from "../config/upload.config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RenameFileInterceptor } from "../common/interceptors/rename.file.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { CurrentUser } from "../common/decorator/current-user.decorator";

@ApiTags("CheckUp")
@UseGuards(JwtAuthGuard)
@Controller("checkup")
export class CheckupController {
  constructor(private readonly checkupService: CheckupService) {}

  @ApiOperation({ summary: "PDF 업로드" })
  @Post("/upload")
  @UseInterceptors(FileInterceptor("file", pdfUploadOptions), RenameFileInterceptor)
  uploadPdf(@UploadedFile() file: Express.Multer.File) {
    return this.checkupService.uploadPdf(file);
  }

  @ApiOperation({ summary: "특정 검진 결과 AI 분석 조회" })
  @Get("/ai/:checkupId")
  findAIComment(
    @CurrentUser("id") userId: number,
    @Param("checkupId", ParseIntPipe) checkupId: number,
  ) {
    return this.checkupService.findAIComment(userId, checkupId);
  }

  @ApiOperation({ summary: "검진 결과 확인 후 등록" })
  @Post()
  create(@CurrentUser("id") userId: number, @Body() createCheckupDto: CreateCheckupDto) {
    return this.checkupService.create(userId, createCheckupDto);
  }

  @ApiOperation({ summary: "검진 대시보드 수치, 분류 조회" })
  @Get()
  findAll(@CurrentUser("id") userId: number) {
    return this.checkupService.findAll(userId);
  }

  @ApiOperation({ summary: "신체 지표 데이터 조회" })
  @Get("/body-metrics")
  findBodyMetrics(@CurrentUser("id") userId: number) {
    return this.checkupService.findBodyMetrics(userId);
  }

  @ApiOperation({ summary: "혈압 데이터 조회" })
  @Get("/blood-pressure")
  findBloodPressure(@CurrentUser("id") userId: number) {
    return this.checkupService.findBloodPressure(userId);
  }

  @ApiOperation({ summary: "혈당 & 빈혈 데이터 조회" })
  @Get("/diabetes-anemia")
  findDiabetesAnemia(@CurrentUser("id") userId: number) {
    return this.checkupService.findDiabetesAnemia(userId);
  }

  @ApiOperation({ summary: "간 데이터 조회" })
  @Get("/liver")
  findLiver(@CurrentUser("id") userId: number) {
    return this.checkupService.findLiver(userId);
  }

  @ApiOperation({ summary: "신장 데이터 조회" })
  @Get("/kidney")
  findKidney(@CurrentUser("id") userId: number) {
    return this.checkupService.findKidney(userId);
  }
}
