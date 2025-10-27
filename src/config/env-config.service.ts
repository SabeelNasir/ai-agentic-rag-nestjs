import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvType } from "./env-config-schema.validation";

@Injectable()
export class EnvConfigService {
  constructor(private configService: ConfigService) {}

  getPort() {
    return this.configService.get<number>("PORT");
  }

  getChatModelType() {
    return this.configService.get<EnvType["CHAT_MODEL_TYPE"]>("CHAT_MODEL_TYPE");
  }

  getGroqApiKey() {
    return this.configService.get<string>("GROQ_API_KEY");
  }
  getOpenAIApiKey() {
    return this.configService.get<string>("OPEN_API_KEY");
  }

  getGroqModel() {
    return this.configService.get<string>("GROQ_CHAT_MODEL");
  }
  getOpenAIModel() {
    return this.configService.get<string>("OPENAI_CHAT_MODEL");
  }
  getOpenAIEmbeddingModel() {
    return this.configService.get<string>("OPENAI_EMBEDDING_MODEL");
  }

  getChatModelMaxCompletionTokens() {
    return 1000;
  }

  getDatabaseSynchronize() {
    return this.configService.get<string>("DATABASE_SYNCHRONIZE")!.trim() === "true";
  }

  getDatabaseLogging(): boolean {
    return this.configService.get<string>("DATABASE_LOGGING")!.trim() === "true";
  }
  getDatabaseType(): any {
    return this.configService.get<string>("DATABASE_TYPE");
  }
  getDatabaseName() {
    return this.configService.get<string>("DATABASE_NAME");
  }
  getDatabaseUser() {
    return this.configService.get<string>("DATABASE_USERNAME");
  }
  getDatabasePassword() {
    return this.configService.get<string>("DATABASE_PASSWORD");
  }
  getDatabaseHost() {
    return this.configService.get<string>("DATABASE_HOST");
  }
  getDatabasePort() {
    return parseInt(this.configService.get<string>("DATABASE_PORT")!, 10);
  }
  getDatabaseUri() {
    return `postgresql://${this.getDatabaseUser()}:${this.getDatabasePassword()}@${this.getDatabaseHost()}:${this.getDatabasePort()}/${this.getDatabaseName()}?sslmode=disable`;
  }

  // Redis Credentials
  getRedisHost(): string {
    return this.configService.get<string>("REDIS_HOST")!;
  }
  getRedisPort(): string {
    return this.configService.get<string>("REDIS_PORT")!;
  }
  getRedisPrefix(): string | undefined {
    return this.configService.get<string>("REDIS_PREFIX");
  }

  // LLM Tools API Keys
  getWeatherApiKey() {
    return this.configService.get<string>("WEATHER_API_KEY");
  }
  getTavilyApiKey() {
    return this.configService.get<string>("TAVILY_API_KEY");
  }

  // Liveblocks keys
  getLiveblocksSecretKey(): string {
    return this.configService.get<string>("LIVEBLOCKS_SECRET_KEY")!;
  }
}
