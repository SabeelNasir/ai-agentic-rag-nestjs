import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvConfigService } from "src/config/env-config.service";

const configService = new EnvConfigService(new ConfigService());

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...configService.getTypeOrmConfig(),
    }),
  ],
  exports: [
    TypeOrmModule.forRoot({
      ...configService.getTypeOrmConfig(),
    }),
  ],
})
export class DatabaseModule {}
