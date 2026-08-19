import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { logger } from "./config/logger";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.WEB_SERVER_URL ?? "https://app-web.niceplant-976abd6a.koreacentral.azurecontainerapps.io",
    credentials: true, // ★ 쿠키/인증 정보를 위해 필수
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // ★ 허용할 HTTP 메서드 명시
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // ★ 프론트엔드가 보낼 수 있는 헤더 명시
    exposedHeaders: ["Set-Cookie"], // ★ 브라우저가 응답 헤더의 쿠키를 읽을 수 있게 허용
  });
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

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  logger.info("server start @ 3001");
}
bootstrap();
