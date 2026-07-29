import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = response.statusCode; // 현재 HTTP 상태코드 (예: 200, 201 등)

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        data: data, // 컨트롤러가 리턴한 알맹이 데이터가 여기에 쏙 들어갑니다!
      })),
    );
  }
}