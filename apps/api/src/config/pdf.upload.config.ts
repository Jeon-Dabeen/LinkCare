import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";

export const UPLOAD_DIR = "uploads";

const ALLOWED_MIME = "application/pdf";

export const MAX_FILE_SIZE = 200 * 1024;

export const pdfUploadOptions = {
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      callback(new BadRequestException("PDF 파일이 아닙니다."), false);
      return;
    }
    callback(null, true);
  },
  limits: { fileSize: MAX_FILE_SIZE },
};
