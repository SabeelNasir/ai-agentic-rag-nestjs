import { ChatGroq } from "@langchain/groq";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { EnvConfigService } from "src/config/env-config.service";

@Injectable()
export class GroqChatModelService implements OnModuleInit {
  private model: ChatGroq;

  constructor(private readonly envConfig: EnvConfigService) {}

  onModuleInit() {
    this.model = new ChatGroq({
      apiKey: this.envConfig.getGroqApiKey(),
      model: this.envConfig.getGroqModel()!,
      maxTokens: this.envConfig.getChatModelMaxCompletionTokens(),
      temperature: 0.7,
    });
  }

  getModel() {
    return this.model;
  }
}
