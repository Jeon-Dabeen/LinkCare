import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { CheckupModule } from "./checkup/checkup.module";
import { IntegrationsModule } from "./integrations/integrations.module";

@Module({
  imports: [PrismaModule, CheckupModule, IntegrationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
