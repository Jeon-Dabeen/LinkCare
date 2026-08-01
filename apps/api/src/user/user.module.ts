import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { NicknameService } from '../common/services/nickname.service';

@Module({
  providers: [UserService, NicknameService],
  exports: [UserService],
  controllers: [UserController], // AuthModule 에서 사용
})
export class UserModule {}
