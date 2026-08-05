import { Module } from '@nestjs/common';
import { GreetService } from './greet.service';
import { GreetController } from './greet.controller';
import { IntegrationsModule } from '../integrations/integrations.module';
import { DailyShieldModule } from '../daily-shield/daily-shield.module';
import { MealModule } from '../meal/meal.module';

@Module({
  imports: [IntegrationsModule, DailyShieldModule, MealModule],
  controllers: [GreetController],
  providers: [GreetService],
})
export class GreetModule {}
