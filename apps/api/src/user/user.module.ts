import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController], // AuthModule 에서 사용
})
export class UserModule {}
