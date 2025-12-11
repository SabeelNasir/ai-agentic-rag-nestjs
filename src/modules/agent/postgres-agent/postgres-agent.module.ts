import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PostgresAgentService } from "./postgres-agent.service";
import { GroqChatModelModule } from "src/common/chat-models/groq-chat-model/groq-chat-model.module";
import { MemoryModule } from "src/modules/memory/memory.module";
import { Pool } from "pg";
import { PostgresQueryTool } from "./tools/postgres-query-tools";
import { PostgresListTablesTool } from "./tools/postgres-list-tables.tool";
import { PostgresDescribeTableTool } from "./tools/postgres-describe-table.tool";
import { EnvConfigService } from "src/config/env-config.service";

const configSerivce = new EnvConfigService(new ConfigService());

@Module({
  imports: [ConfigModule, GroqChatModelModule, MemoryModule],
  providers: [
    {
      provide: Pool,
      useFactory: () =>
        new Pool({
          host: configSerivce.getDatabaseHost(),
          port: configSerivce.getDatabasePort(),
          user: configSerivce.getDatabaseUser(),
          password: configSerivce.getDatabasePassword(),
          database: configSerivce.getDatabaseName(),
        }),
    },
    PostgresAgentService,
    PostgresQueryTool,
    PostgresListTablesTool,
    PostgresDescribeTableTool,
  ],
  exports: [PostgresAgentService],
})
export class PostgresAgentModule {}
