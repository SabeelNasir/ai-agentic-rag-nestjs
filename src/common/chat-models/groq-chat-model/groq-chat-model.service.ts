import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { Global, Injectable, OnModuleInit } from "@nestjs/common";
import { ENUM_CHAT_MODEL_PROVIDER } from "src/common/enums/enums";
import { DBLoggingHandler } from "src/common/langchain-handlers/langchain-db-logging.handler";
import { EnvConfigService } from "src/config/env-config.service";
import { ChatModelLogsQueueService } from "src/microservices/queues/chat-model-logs-queue/chat-model-logs-queue.service";

@Global()
@Injectable()
export class GroqChatModelService implements OnModuleInit {
  public modelGroq: ChatGroq;
  public modelOpenAI: ChatOpenAI;

  constructor(
    private readonly envConfig: EnvConfigService,
    private readonly queueService: ChatModelLogsQueueService,
  ) {}

  onModuleInit() {
    this.modelGroq = new ChatGroq({
      apiKey: this.envConfig.getGroqApiKey(),
      model: this.envConfig.getGroqModel()!,
      maxTokens: this.envConfig.getChatModelMaxCompletionTokens(),
      temperature: 0.7,
      callbacks: [new DBLoggingHandler(this.queueService, ENUM_CHAT_MODEL_PROVIDER.GROQ)],
    });
    this.modelOpenAI = new ChatOpenAI({
      apiKey: this.envConfig.getOpenAIApiKey(),
      model: this.envConfig.getOpenAIModel()!,
      maxTokens: this.envConfig.getChatModelMaxCompletionTokens(),
      callbacks: [new DBLoggingHandler(this.queueService, ENUM_CHAT_MODEL_PROVIDER.OPENAI)],
    });
  }

  getModel() {
    return this.envConfig.getChatModelType() == ENUM_CHAT_MODEL_PROVIDER.GROQ ? this.modelGroq : this.modelOpenAI;
  }

  getModelForDynamicAIAgents(provider?: ENUM_CHAT_MODEL_PROVIDER) {
    switch (provider) {
      case ENUM_CHAT_MODEL_PROVIDER.GROQ:
        return this.modelGroq;
        break;
      case ENUM_CHAT_MODEL_PROVIDER.OPENAI:
        return this.modelOpenAI;
        break;
      default:
        return this.modelGroq;
        break;
    }
  }
}
