import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { logger } from "./config/logger";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { mkdirSync } from "fs";
import { UPLOAD_DIR } from "./config/pdf.upload.config";

async function bootstrap() {
  mkdirSync(UPLOAD_DIR, { recursive: true });

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 글로벌 예외 필터 (모든 에러 인터셉터)
  app.useGlobalFilters(new AllExceptionsFilter());

  // swagger
  const config = new DocumentBuilder()
    .setTitle("LinkCare")
    .setDescription("매일 건강해지는 나를 느끼는 시간")
    .setVersion("1.0")
    .addBearerAuth() // 보호 라우팅용
    .build();

  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3001);
  logger.info("server start @ 3001");
}
bootstrap();
