import { Module } from "@nestjs/common";
import { NetflixShowPgVectorTool } from "./tools/netflix-show-pgvector.tool";
import { NetflixShowAgent } from "./netflix-show.agent";
import { RagModule } from "src/modules/rag/rag.module";
import { GroqChatModelService } from "src/common/chat-models/groq-chat-model/groq-chat-model.service";
import { GroqChatModelModule } from "src/common/chat-models/groq-chat-model/groq-chat-model.module";
import { MemoryModule } from "src/modules/memory/memory.module";
import { TavilyWebsearchTool } from "../tools/tavily-websearch.tool";
import { CustomWebsearchTool } from "../tools/custom-websearch.tool";

@Module({
  imports: [RagModule, GroqChatModelModule, MemoryModule],
  providers: [NetflixShowPgVectorTool, NetflixShowAgent, TavilyWebsearchTool, CustomWebsearchTool],
  exports: [NetflixShowAgent, NetflixShowPgVectorTool],
})
export class NetflixShowAgentModule {}
