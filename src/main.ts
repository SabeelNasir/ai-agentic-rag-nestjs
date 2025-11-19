import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { EnvConfigService } from "./config/env-config.service";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ResponseInterceptor } from "./common/interceptors/response-interceptor";
import * as fs from "fs";
import * as https from "https";

async function bootstrap() {
  const config = new ConfigService();
  const logger = new Logger("Bootstrap");

  const httpsEnabled = config.get("HTTPS_ENABLED") === "true";

  let app;

  if (httpsEnabled) {
    const keyPath = config.get("SSL_KEY_PATH");
    const certPath = config.get("SSL_CERT_PATH");

    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    app = await NestFactory.create(AppModule, { httpsOptions });
    logger.log(`🚀 HTTPS Enabled using key=${keyPath}, cert=${certPath}`);
  } else {
    app = await NestFactory.create(AppModule);
    logger.log(`🚀 HTTP mode enabled`);
  }

  app.enableCors({
    origin: "*",
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

  await app.listen(process.env.PORT ?? 3000);

  logger.log(`AI Agentic Backend running ${httpsEnabled ? "https" : "http"}://localhost:${process.env.PORT ?? 3000}`);
}

bootstrap();
