import { ConflictException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../config/logger";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 회원가입
   * @param data 
   * @returns 
   */
  async createUser(data: { email: string; password: string }) {
    logger.info(`UserService createUser started. email=${data.email}`);

    // TODO: 닉네임 값 수정 필요
    let uuid = uuidv4().substring(0, 4);
    const nickName = `나는 토깽이 ${uuid}`;
    logger.debug(`nickName: ${nickName}`);

    const { user, profile } = await this.prisma.$transaction(async (tx) => {
      // 1. 유저 생성
      const newUser = await tx.user.create({ data });

      // 2. 프로필 생성 (User PK 필드가 'id'인 경우 newUser.id 사용)
      const newProfile = await tx.profile.create({
        data: {
          userId: newUser.id,
          nickName: nickName,
        },
      });

      return { user: newUser, profile: newProfile };
    });

    logger.debug(`createUser result: ${JSON.stringify(user)}, ${JSON.stringify(profile)}`);
    logger.info(`UserService createUser ended. email=${data.email}`)
    
    return user;
  }

  /**
   * 이메일로 사용자 찾기 (로그인 시 사용)
   * @param email 
   * @returns 
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
