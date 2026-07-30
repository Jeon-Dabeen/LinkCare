import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  id: number;
  email: string;
}

export const CurrentUser = createParamDecorator(
  // TODO: gender 추가
  (
    field: keyof AuthUser, // id, email, (gender)
    ctx: ExecutionContext, // nestjs 제공하는 요청 컨텍스트 httpRequest
  ) => {
    // Http 요청 객체(req)를 꺼냄
    const request = ctx.switchToHttp().getRequest();
    // JwtStategy.validate가 채워둔 사용자 정보를 꺼냄
    const user: AuthUser = request.user;
    // field가 있으면 한 필드만, 없으면 객체 전체 반환
    // CurrentUser('id') => user.id
    // CurrentUser() => user
    return field ? user?.[field] : user;
  },
);
