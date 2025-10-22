import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AgentController } from "./modules/agent/agent.controller";
import { AgentModule } from "./modules/agent/agent.module";
import { EnvConfigModule } from "./config/env-config.module";
import { HrRecuiterAgentModule } from "./modules/agent/hr-recuiter/hr-recuiter-agent.module";
import { ChatModelLogsModule } from "./modules/chat-model-logs/chat-model-logs.module";
import { ChatModelLogController } from "./modules/chat-model-logs/chat-model-log.controller";
import { TypeOrmConfigModule } from "./database/typeorm/typeorm-config.module";
import { MicroservicesModule } from "./microservices/microservices.module";
import { ChatModelLogsQueueModule } from "./microservices/queues/chat-model-logs-queue/chat-model-logs-queue.module";
import { SharedModule } from "./modules/shared/shared.module";
import { NetflixShowModule } from "./modules/netflix-show/netflix-show.module";
import { RagModule } from "./modules/rag/rag.module";
import { GroqChatModelModule } from "./common/chat-models/groq-chat-model/groq-chat-model.module";
import { NetflixShowAgentModule } from "./modules/agent/netflix-show/netflix-show-agent.module";
import { MemoryModule } from "./modules/memory/memory.module";
import { EmbeddingVectorsQueueModule } from "./microservices/queues/embedding-vectors-queue/module";
import { GatewayModule } from "./microservices/websockets/gateway.module";
import { AiAgentModule } from "./modules/ai-agent/ai-agent.module";
import { FileLoaderModule } from "./modules/file-loader/file-loader.module";
import { DocumentsAgentModule } from "./modules/agent/documents-agent/documents-agent.module";

@Module({
  imports: [
    TypeOrmConfigModule,
    AgentModule,
    EnvConfigModule,
    HrRecuiterAgentModule,
    ChatModelLogsModule,
    MicroservicesModule,
    RagModule,
    MemoryModule,
    GatewayModule,
    AiAgentModule,
    FileLoaderModule,

    //Shared Modules
    SharedModule,
    GroqChatModelModule,

    // Queue Modules
    ChatModelLogsQueueModule,
    EmbeddingVectorsQueueModule,

    NetflixShowModule,
    NetflixShowAgentModule,
    DocumentsAgentModule,
  ],
  controllers: [AppController, AgentController, ChatModelLogController],
  providers: [AppService],
})
export class AppModule {}
