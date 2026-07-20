const winston = require("winston");
require("winston-daily-rotate-file"); // 라이브러리 로드

const { combine, timestamp, printf } = winston.format;

// 1. 텍스트 포맷 설정
const logFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  level: "debug",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    // 콘솔 출력
    new winston.transports.Console(),

    // 파일 저장 (매일 새로운 파일로 분리 생성)
    new winston.transports.DailyRotateFile({
      dirname: "log", // 로그를 저장할 폴더명
      filename: "%DATE%.log", // 파일명 패턴 (예: 2026-07-16.log)
      datePattern: "YYYY-MM-DD", // %DATE% 영역에 들어갈 날짜 포맷
      maxFiles: "30d", // 보관 기한: 30일이 지난 로그는 자동 삭제 (용량 관리용)
    }),
  ],
});
