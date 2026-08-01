import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RenameFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;

    if (req.file) {
      req.file.originalname = `${userId}_${req.file.originalname}`;
    }

    return next.handle();
  }
}
