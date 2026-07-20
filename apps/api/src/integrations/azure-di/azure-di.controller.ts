import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AzureDiService } from './azure-di.service';

// 외부 테스트용, 내부에서는 service 함수로 직접 호출하여 사용
@Controller('azure-di')
export class AzureDiController {
  constructor(private readonly azureDiService: AzureDiService) {}

  @Post('analyze')
  async analyzeDocument(@Body() body: { fileName: string; modelId?: string }) {
    if (!body.fileName) {
      throw new BadRequestException('분석할 문서의 url은 필수 항목입니다.');
    }

    // 서비스 함수 호출 (modelId가 없으면 서비스의 기본값 사용)
    const result = await this.azureDiService.analyzeDocumentByUrl(body.fileName, body.modelId);
    
    return result;
  }
}
