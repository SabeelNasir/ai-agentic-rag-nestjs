import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvConfigService } from "src/config/env-config.service";
import { databaseConfigurations } from "./typeorm.config";
import { EnvConfigModule } from "src/config/env-config.module";

const configService = new EnvConfigService(new ConfigService());

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfigurations), EnvConfigModule],
  exports: [TypeOrmModule.forRoot(databaseConfigurations)],
})
export class TypeOrmConfigModule {}
