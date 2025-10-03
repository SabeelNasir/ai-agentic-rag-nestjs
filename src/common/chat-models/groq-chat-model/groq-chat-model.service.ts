import { ChatGroq } from "@langchain/groq";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { DBLoggingHandler } from "src/common/langchain-handlers/langchain-db-logging.handler";
import { EnvConfigService } from "src/config/env-config.service";
import { ChatModelLogsQueueService } from "src/microservices/queues/chat-model-logs-queue/chat-model-logs-queue.service";

@Injectable()
export class GroqChatModelService implements OnModuleInit {
  private model: ChatGroq;

  constructor(
    private readonly envConfig: EnvConfigService,
    private readonly queueService: ChatModelLogsQueueService,
  ) {}

  onModuleInit() {
    this.model = new ChatGroq({
      apiKey: this.envConfig.getGroqApiKey(),
      model: this.envConfig.getGroqModel()!,
      maxTokens: this.envConfig.getChatModelMaxCompletionTokens(),
      temperature: 0.7,
      callbacks: [new DBLoggingHandler(this.queueService)],
    });
  }

  getModel() {
    return this.model;
  }
}
