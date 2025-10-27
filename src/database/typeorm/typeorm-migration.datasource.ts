import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import migrationEntities from "../entities/migration-entities";

config();
const databaseConfigurations: DataSourceOptions = {
  type: process.env.DATABASE_TYPE as any,
  port: parseInt(process.env.DATABASE_PORT!),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: process.env.DATABASE_SCHEMA,
  synchronize: false,
  host: process.env.DATABASE_HOST,
  entities: migrationEntities,
  cache: false,
  migrations: ["dist/database/migrations/*{.ts,.js}"],
  logging: true,
};

export const getDataSource = (() => {
  const dataSource = new DataSource(databaseConfigurations);
  return dataSource;
})();
