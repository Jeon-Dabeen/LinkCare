import { Module } from '@nestjs/common';
import { GreetService } from './greet.service';
import { GreetController } from './greet.controller';

@Module({
  controllers: [GreetController],
  providers: [GreetService],
})
export class GreetModule {}
