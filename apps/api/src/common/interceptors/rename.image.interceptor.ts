import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RenameImageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    const uploadDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    if (req.file) {
      req.file.originalname = `${userId}_${uploadDate}_${req.file.originalname}`;
    }

    return next.handle();
  }
}
