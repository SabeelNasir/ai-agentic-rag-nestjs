import { Module } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { FoodGraphService } from "./food-agent/food-graph.service";
import { GroqChatModelModule } from "src/common/chat-models/groq-chat-model/groq-chat-model.module";
import { HrRecuiterAgentModule } from "./hr-recuiter/hr-recuiter-agent.module";
import { NetflixShowAgentModule } from "./netflix-show/netflix-show-agent.module";
import { NetflixShowAgent } from "./netflix-show/netflix-show.agent";
import { MemoryModule } from "../memory/memory.module";
import { TavilyWebsearchTool } from "./tools/tavily-websearch.tool";
import { CustomWebsearchTool } from "./tools/custom-websearch.tool";
import { OpenAIAgentsModule } from "./openai-agents-builder/module";
import { DocumentsAgentService } from "./documents-agent/documents-agent.service";
import { DocumentsPgVectorTool } from "./tools/documents-pgvector.tool";
import { DocumentsAgentModule } from "./documents-agent/documents-agent.module";

@Module({
  imports: [
    GroqChatModelModule,
    HrRecuiterAgentModule,
    NetflixShowAgentModule,
    MemoryModule,
    OpenAIAgentsModule,
    DocumentsAgentModule,
  ],
  providers: [AgentService, FoodGraphService, NetflixShowAgent, TavilyWebsearchTool, CustomWebsearchTool],
  exports: [AgentService],
})
export class AgentModule {}
