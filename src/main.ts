import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { EnvConfigService } from "./config/env-config.service";
import { Logger } from "@nestjs/common";
import { ResponseInterceptor } from "./common/interceptors/response-interceptor";

const configService = new EnvConfigService(new ConfigService());
const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000, () => {
    logger.log(`AI Agentic Backend running on port : ${configService.getPort()}`);
  });
}
bootstrap();
