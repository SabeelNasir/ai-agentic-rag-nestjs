import { Module } from "@nestjs/common";
import { RagModule } from "src/modules/rag/rag.module";
import { DocumentsAgentService } from "./documents-agent.service";
import { DocumentsPgVectorTool } from "../tools/documents-pgvector.tool";
import { MemoryModule } from "src/modules/memory/memory.module";
import { GroqChatModelModule } from "src/common/chat-models/groq-chat-model/groq-chat-model.module";
import { CustomWebsearchTool } from "../tools/custom-websearch.tool";
import { TavilyWebsearchTool } from "../tools/tavily-websearch.tool";
import { DocumentsEditorAgentPrompts } from "./prompts/documents-editor-agent-prompts";

@Module({
  imports: [RagModule, MemoryModule, GroqChatModelModule],
  providers: [
    DocumentsAgentService,
    DocumentsPgVectorTool,
    DocumentsEditorAgentPrompts,
    TavilyWebsearchTool,
    CustomWebsearchTool,
  ],
  exports: [DocumentsAgentService, DocumentsEditorAgentPrompts],
})
export class DocumentsAgentModule {}
