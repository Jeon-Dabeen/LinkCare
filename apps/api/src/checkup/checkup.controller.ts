import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { CheckupService } from "./checkup.service";
import { CreateCheckupDto } from "./dto/create-checkup.dto";
import { UpdateCheckupDto } from "./dto/update-checkup.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { pdfUploadOptions } from "../config/pdf.upload.config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("CheckUp")
@Controller("checkup")
export class CheckupController {
  constructor(private readonly checkupService: CheckupService) {}

  @ApiOperation({ summary: "PDF 업로드" })
  @Post("/upload")
  @UseInterceptors(FileInterceptor("file", pdfUploadOptions))
  uploadPdf(@UploadedFile() file: Express.Multer.File) {
    return this.checkupService.uploadPdf(file);
  }

  @Post()
  create(@Body() createCheckupDto: CreateCheckupDto) {
    return this.checkupService.create(createCheckupDto);
  }

  @Get()
  findAll() {
    return this.checkupService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.checkupService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCheckupDto: UpdateCheckupDto) {
    return this.checkupService.update(+id, updateCheckupDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.checkupService.remove(+id);
  }
}
