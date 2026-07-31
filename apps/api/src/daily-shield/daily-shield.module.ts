import { Module } from '@nestjs/common';
import { DailyShieldService } from './daily-shield.service';
import { DailyShieldController } from './daily-shield.controller';

@Module({
  controllers: [DailyShieldController],
  providers: [DailyShieldService],
  exports: [DailyShieldService],
})
export class DailyShieldModule {}
