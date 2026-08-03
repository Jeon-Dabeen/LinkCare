import { Controller, Get, Post, Body, Patch, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  @ApiOperation({ summary: "사용자 한명 조회" })
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }
}
