import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { logger } from "../../config/logger";

@Catch() // 모든 에러 캐치 (HttpException뿐만 아니라 일반 Error까지)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. 에러 상태 코드 정의 (Http 예외면 해당 코드, 일반 에러면 500 Internal Server Error)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 2. 에러 메시지 추출
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const errorMessage =
      exception instanceof Error ? exception.message : "Internal server error";

    const detailMessage =
      typeof exceptionResponse === "object" && exceptionResponse !== null
        ? JSON.stringify(exceptionResponse)
        : errorMessage;

    // 3. Winston 로거로 에러 기록 (콘솔 출력 및 파일 저장)
    logger.error(
      `[${request.method}] ${request.url} | ${status} | Error: ${errorMessage}`,
    );

    // 4. 클라이언트에게 항상 일관된 포맷으로 에러 응답 보내기
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? "서버 내부 오류가 발생했습니다." // 500 에러는 보안상 메시지를 숨기기
          : errorMessage, // 4xx 에러는 클라이언트에게 명확한 에러 이유 전달
    });
  }
}
