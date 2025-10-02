import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

@Injectable()
export class EnvConfigService {
  constructor(private configService: ConfigService) {}

  getPort() {
    return this.configService.get<number>("PORT");
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
    return this.configService.get<boolean>("DATABASE_SYNCHRONIZE");
  }

  getDatabaseLogging() {
    return this.configService.get<boolean>("DATABASE_LOGGING");
  }
  getDatabaseName() {
    return this.configService.get<string>("DATABASE_NAME");
  }
  getDatabaseUser() {
    return this.configService.get<string>("DATABASE_USER");
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

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.getDatabaseHost(),
      port: this.getDatabasePort(),
      username: this.getDatabaseUser(),
      password: this.getDatabasePassword(),
      database: this.getDatabaseName(),
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      synchronize: this.getDatabaseSynchronize(),
      logging: this.getDatabaseLogging(),
    };
  }

  getWeatherApiKey() {
    return this.configService.get<string>("WEATHER_API_KEY");
  }
}
