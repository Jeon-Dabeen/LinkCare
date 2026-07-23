import { BadRequestException } from "@nestjs/common";
import { memoryStorage } from "multer";

const PDF_ALLOWED_MIME = "application/pdf";

export const PDF_MAX_FILE_SIZE = 200 * 1024;

export const pdfUploadOptions = {
  storage: memoryStorage(),
  fileFilter: (_req, file, callback) => {
    if (!PDF_ALLOWED_MIME.includes(file.mimetype)) {
      callback(new BadRequestException("PDF 파일이 아닙니다."), false);
      return;
    }
    callback(null, true);
  },
  limits: { fileSize: PDF_MAX_FILE_SIZE },
};
