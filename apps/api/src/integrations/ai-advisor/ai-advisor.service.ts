import { Injectable, OnModuleInit } from "@nestjs/common";
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import { logger } from "../../config/logger";

@Injectable()
export class AiAdvisorService implements OnModuleInit {
  private client: AIProjectClient;
  private agentName: string;
  private agentVersion: string;

  onModuleInit() {
    logger.info("AiAdvisorService initialized");
    const endpoint = process.env.AZURE_AI_ADVISOR_ENDPOINT;
    const apiKey = process.env.AZURE_AI_ADVISOR_KEY;
    this.agentName = process.env.AZURE_AI_ADVISOR_AGENT_NAME || "linkcare-checkupv1";
    this.agentVersion = process.env.AZURE_AI_ADVISOR_AGENT_VERSION || "1";

    if (!endpoint || !apiKey) {
      logger.error("Azure Ai Advisor credentials not configured");
      throw new Error("Azure Ai Advisor credentials not configured");
    }

    // AIProjectClient 인스턴스 생성
    // DefaultAzureCredential 사용 (환경변수 AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID 등 자동 감지)
    this.client = new AIProjectClient(endpoint, new DefaultAzureCredential());
  }

  async generateCheckupAdvice(
    checkupData: Record<string, any>,
  ): Promise<{ success: boolean; advice: string }> {
    logger.info(`AiAdvisorService generateCheckupAdvice started. agentName: ${this.agentName}`);
    // 건강검진 데이터를 프롬프트로 구성
    const promptMessage = JSON.stringify(checkupData);

    try {
      const openAIClient = this.client.getOpenAIClient();
      logger.debug("Creating conversation with initial user message...");

      const conversation = await openAIClient.conversations.create({
        items: [{ type: "message", role: "user", content: promptMessage }],
      });
      logger.debug(`Created conversation with initial user message (id: ${conversation.id})`);

      // Generate response using the agent
      const response = await openAIClient.responses.create(
        { conversation: conversation.id },
        {
          body: {
            agent_reference: {
              name: this.agentName,
              version: this.agentVersion,
              type: "agent_reference",
            },
          },
        },
      );

      logger.debug(`Response output: ${response.output_text})`);
      const adviceContent = response.output_text;

      return {
        success: true,
        advice: adviceContent || "분석 결과를 받아왔으나 응답 텍스트가 비어있습니다.",
      };
    } catch (error: any) {
      logger.error(`Failed to execute AI Agent: ${error.message}`, error.stack);
      throw new Error("AI 건강 분석 에이전트 호출 중 오류가 발생했습니다.");
    }
  }
}
