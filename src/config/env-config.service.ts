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

  getGroqModel() {
    return this.configService.get<string>("GROQ_CHAT_MODEL");
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

  getWeatherApiKey() {
    return this.configService.get<string>("WEATHER_API_KEY");
  }
}
