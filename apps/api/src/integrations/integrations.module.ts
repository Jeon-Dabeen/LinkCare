import { Module } from '@nestjs/common';
import { AzureDiService } from './azure-di/azure-di.service';
import { AzureDiController } from './azure-di/azure-di.controller';

@Module({
  providers: [AzureDiService],
  controllers: [AzureDiController]
})
export class IntegrationsModule {}
