import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { EnvConfigService } from "./config/env-config.service";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ResponseInterceptor } from "./common/interceptors/response-interceptor";
import cors from "cors";

const configService = new EnvConfigService(new ConfigService());
const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*", // For development, you can use '*' or specify your React app's local/ngrok URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );

  //Start microservices
  app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000, () => {
    logger.log(`AI Agentic Backend running on port : ${configService.getPort()}`);
  });
}
bootstrap();
