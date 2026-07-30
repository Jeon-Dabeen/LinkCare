import { Module } from '@nestjs/common';
import { BloodGlucoseService } from './blood-glucose.service';
import { BloodGlucoseController } from './blood-glucose.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BloodGlucoseController],
  providers: [BloodGlucoseService],
})
export class BloodGlucoseModule {}
