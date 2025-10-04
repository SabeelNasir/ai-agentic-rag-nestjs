import { OpenAIEmbeddings } from "@langchain/openai";
import { Injectable, Logger } from "@nestjs/common";
import { EnvConfigService } from "src/config/env-config.service";

@Injectable()
export class EmbeddingService {
  private embedding: OpenAIEmbeddings;
  private logger = new Logger(EmbeddingService.name);
  constructor(private readonly config: EnvConfigService) {
    this.embedding = new OpenAIEmbeddings({
      apiKey: this.config.getOpenAIApiKey(),
      model: this.config.getOpenAIEmbeddingModel(),
    });
    this.logger.log(`Embedding Model: ${this.config.getOpenAIEmbeddingModel()}`);
  }

  embeddTexts(texts: string[]): Promise<number[][]> {
    return this.embedding.embedDocuments(texts);
  }

  async embedText(text: string) {
    const resp = await this.embeddTexts([text]);
    return resp[0];
  }
}
