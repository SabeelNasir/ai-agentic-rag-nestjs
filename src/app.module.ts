import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AgentController } from "./modules/agent/agent.controller";
import { AgentModule } from "./modules/agent/agent.module";
import { EnvConfigModule } from "./config/env-config.module";
import { HrRecuiterAgentModule } from "./modules/agent/hr-recuiter/hr-recuiter-agent.module";
import { ChatModelLogsModule } from "./modules/chat-model-logs/chat-model-logs.module";
import { ChatModelLogController } from "./modules/chat-model-logs/chat-model-log.controller";
import { TypeOrmConfigModule } from "./modules/database/typeorm/typeorm-config.module";
import { MicroservicesModule } from "./microservices/microservices.module";
import { ChatModelLogsQueueModule } from "./microservices/queues/chat-model-logs-queue/chat-model-logs-queue.module";
import { SharedModule } from "./modules/shared/shared.module";

@Module({
  imports: [
    TypeOrmConfigModule,
    AgentModule,
    EnvConfigModule,
    HrRecuiterAgentModule,
    ChatModelLogsModule,
    MicroservicesModule,

    //Shared Modules
    SharedModule,

    // Queue Modules
    ChatModelLogsQueueModule,
  ],
  controllers: [AppController, AgentController, ChatModelLogController],
  providers: [AppService],
})
export class AppModule {}
