import { config } from "dotenv";
config();
import { ConfigService } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";
import Entities from "../entities/db";
import { EnvConfigService } from "src/config/env-config.service";

const configSerivce = new EnvConfigService(new ConfigService());

export const databaseConfigurations: DataSourceOptions = {
  type: configSerivce.getDatabaseType(),
  port: configSerivce.getDatabasePort(),
  username: configSerivce.getDatabaseUser(),
  password: configSerivce.getDatabasePassword(),
  database: configSerivce.getDatabaseName(),
  synchronize: configSerivce.getDatabaseSynchronize(),
  host: configSerivce.getDatabaseHost(),
  entities: Entities,
  cache: false,
  migrations: ["dist/database/migrations/*{.ts,.js}"],
  logging: configSerivce.getDatabaseLogging(),
  poolSize: 100,
};
