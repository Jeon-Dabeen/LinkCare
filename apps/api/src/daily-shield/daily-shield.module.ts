import { Module } from '@nestjs/common';
import { DailyShieldService } from './daily-shield.service';
import { DailyShieldController } from './daily-shield.controller';

@Module({
  controllers: [DailyShieldController],
  providers: [DailyShieldService],
})
export class DailyShieldModule {}
