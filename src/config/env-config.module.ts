import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvConfigService } from "./env-config.service";
import { validateEnv } from "./env-config-schema.validation";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      ignoreEnvFile: false,
      isGlobal: true,
      validate: (env) => validateEnv(env),
    }),
  ],
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class EnvConfigModule {}
