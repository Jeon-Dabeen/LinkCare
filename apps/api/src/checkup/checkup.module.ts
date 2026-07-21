import { Module } from "@nestjs/common";
import { CheckupService } from "./checkup.service";
import { CheckupController } from "./checkup.controller";
import { IntegrationsModule } from "../integrations/integrations.module";

@Module({
  imports: [IntegrationsModule],
  controllers: [CheckupController],
  providers: [CheckupService],
})
export class CheckupModule {}
