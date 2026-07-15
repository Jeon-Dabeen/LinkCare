import { Module } from '@nestjs/common';
import { WeightService } from './weight.service';
import { WeightController } from './weight.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WeightController],
  providers: [WeightService],
})
export class WeightModule {}
