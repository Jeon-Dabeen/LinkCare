import { Module } from "@nestjs/common";
import { AzureDiService } from "./azure-di/azure-di.service";
import { AzureDiController } from "./azure-di/azure-di.controller";
import { AiAdvisorService } from './ai-advisor/ai-advisor.service';

@Module({
  providers: [AzureDiService, AiAdvisorService],
  controllers: [AzureDiController],
  exports: [AzureDiService],
})
export class IntegrationsModule {}
