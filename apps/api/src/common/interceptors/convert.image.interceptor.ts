import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import sharp from "sharp";

@Injectable()
export class ConvertToWebpInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    if (req.file) {
      // 1. multer-memoryStorage로 읽은 원본 Buffer를 sharp로 압축 및 WebP 변환
      const webpBuffer = await sharp(req.file.buffer)
        .resize({ width: 1200, withoutEnlargement: true }) // 너무 크면 최대 너비 1200px로 리사이징 (선택사항)
        .webp({ quality: 80 }) // 80% 화질로 WebP 변환
        .toBuffer();

      // 2. req.file의 데이터 정보를 WebP 파일로 교체
      req.file.buffer = webpBuffer;
      req.file.mimetype = "image/webp";
      
      // 확장자 이름을 .webp로 변경
      const baseName = req.file.originalname.substring(0, req.file.originalname.lastIndexOf('.'));
      req.file.originalname = `${baseName}.webp`;
    }

    return next.handle();
  }
}