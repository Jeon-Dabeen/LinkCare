import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile } from "@nestjs/common";
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

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.checkupService.findOne(+id);
  }
}
