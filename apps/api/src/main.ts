import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { UploadedFile, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { logger } from "./config/logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

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
