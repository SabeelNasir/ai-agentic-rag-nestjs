import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AiAgentToolEntity } from "src/database/entities/ai-agent-tool.entity";
import { AiAgentEntity } from "src/database/entities/ai-agent.entity";
import { AiAgentService } from "./ai-agent.service";
import { AiAgentToolService } from "./ai-agent-tool.service";
import { AiAgentController } from "./ai-agent.controller";
import { GroqChatModelModule } from "src/common/chat-models/groq-chat-model/groq-chat-model.module";
import { MemoryModule } from "../memory/memory.module";
import { DocumentsPgVectorTool } from "../agent/tools/documents-pgvector.tool";
import { RagModule } from "../rag/rag.module";

@Module({
  imports: [TypeOrmModule.forFeature([AiAgentToolEntity, AiAgentEntity]), GroqChatModelModule, MemoryModule, RagModule],
  providers: [AiAgentService, AiAgentToolService, DocumentsPgVectorTool],
  controllers: [AiAgentController],
})
export class AiAgentModule {}
