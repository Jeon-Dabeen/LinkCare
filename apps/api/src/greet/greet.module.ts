import { Module } from '@nestjs/common';
import { GreetService } from './greet.service';
import { GreetController } from './greet.controller';
import { IntegrationsModule } from '../integrations/integrations.module';
import { DailyShieldModule } from '../daily-shield/daily-shield.module';

@Module({
  imports: [IntegrationsModule, DailyShieldModule],
  controllers: [GreetController],
  providers: [GreetService],
})
export class GreetModule {}
