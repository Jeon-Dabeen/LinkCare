import { BadRequestException } from "@nestjs/common";
import { memoryStorage } from "multer";

const PDF_ALLOWED_MIME = "application/pdf";
const IMAGE_ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];

export const PDF_MAX_FILE_SIZE = 200 * 1024;
export const IMAGE_MAX_FILE_SIZE = 20 * 1024 * 1024;

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

export const imageUploadOptions = {
  storage: memoryStorage(),
  fileFilter: (_req, file, callback) => {
    if (!IMAGE_ALLOWED_MIMES.includes(file.mimetype)) {
      callback(new BadRequestException("이미지 파일(jpg, png, webp)만 업로드할 수 있어요"), false);
      return;
    }
    callback(null, true);
  },
  limits: { fileSize: IMAGE_MAX_FILE_SIZE },
};
