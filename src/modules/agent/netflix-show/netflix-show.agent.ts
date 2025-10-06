import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { GroqChatModelService } from "src/common/chat-models/groq-chat-model/groq-chat-model.service";
import { ChatModelLogsService } from "src/modules/chat-model-logs/chat-model-logs.service";
import { NetflixShowPgVectorTool } from "./tools/netflix-show-pgvector.tool";
import { NETFLIX_SHOW_SYSTEM_MESSAGE } from "./prompts/system-message";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { extractLastAIMessage } from "src/common/utils/utils";
import { MemoryService } from "src/modules/memory/memory.service";
import { EnvConfigService } from "src/config/env-config.service";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { MemorySaver } from "@langchain/langgraph";
import { PgMemorySaverService } from "src/modules/memory/pg-memory-saver.service";
import { TavilyWebsearchTool } from "../tools/tavily-websearch.tool";
import { CustomWebsearchTool } from "../tools/custom-websearch.tool";

@Injectable()
export class NetflixShowAgent implements OnModuleInit {
  constructor(
    private readonly chatModelService: GroqChatModelService,
    private readonly toolService: NetflixShowPgVectorTool,
    private readonly envConfig: EnvConfigService,
    private readonly memoryService: MemoryService,
    private readonly tavilySearchTool: TavilyWebsearchTool,
    private readonly customWebsearchTool: CustomWebsearchTool,
  ) {}

  private chatModel: ChatGroq | ChatOpenAI;
  private reactAgent;
  private reactAgentApp;
  private systemPrompt: SystemMessage;

  async onModuleInit() {
    this.chatModel = this.chatModelService.getModel();
    this.systemPrompt = new SystemMessage(NETFLIX_SHOW_SYSTEM_MESSAGE);
  }

  async invoke(prompt: string, sessionId: string) {
    const reactAgent = createReactAgent({
      llm: this.chatModel,
      tools: [this.toolService.getTool(), this.customWebsearchTool.getTool()],
    });
    const msgService = new PgMemorySaverService(this.memoryService, sessionId);

    const pastMessages = await msgService.getMessages();

    const llmResp = await reactAgent.invoke(
      {
        messages: [this.systemPrompt, ...pastMessages, new HumanMessage(prompt)],
      },
      { configurable: { thread_id: sessionId }, recursionLimit: 10 },
    );
    const aiContent = extractLastAIMessage(llmResp.messages);
    await msgService.addUserMessage(prompt);
    await msgService.addAIChatMessage(aiContent?.toString()!);
    return aiContent;
  }
}
