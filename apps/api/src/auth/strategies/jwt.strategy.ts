import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../constants";
import { Request } from "express";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Authorization : Bearer <토큰> -> 헤더에서 jwt만 추출
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // 백엔드가 로그인 성공 시 Set-Cookie로 응답한 쿠키명 (예: 'access_token' 또는 'jwt')
          return request?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      // 검증을 위해 시크릿 키 전달 (로그인 시 sign()에 쓴 키와 동일)
      secretOrKey: jwtConstants.secret,
    });
  }

  // passport-jwt가 서명 완료된 것 확인 후 payload 넘김
  // 반환 값은 req.user
  validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
