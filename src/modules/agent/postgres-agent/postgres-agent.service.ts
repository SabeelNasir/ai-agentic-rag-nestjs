import { Injectable, OnModuleInit } from "@nestjs/common";
import { GroqChatModelService } from "src/common/chat-models/groq-chat-model/groq-chat-model.service";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemoryService } from "src/modules/memory/memory.service";
import { PgMemorySaverService } from "src/modules/memory/pg-memory-saver.service";
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { extractLastAIMessage } from "src/common/utils/utils";
import { PostgresQueryTool } from "./tools/postgres-query-tools";
import { PostgresListTablesTool } from "./tools/postgres-list-tables.tool";
import { PostgresDescribeTableTool } from "./tools/postgres-describe-table.tool";

@Injectable()
export class PostgresAgentService implements OnModuleInit {
  constructor(
    private readonly chatModelService: GroqChatModelService,
    private readonly memoryService: MemoryService,
    private readonly queryTools: PostgresQueryTool,
    private readonly listTablesTool: PostgresListTablesTool,
    private readonly describeTableTool: PostgresDescribeTableTool,
  ) {}
  private chatModel: ChatGroq | ChatOpenAI;

  onModuleInit() {
    this.chatModel = this.chatModelService.getModel();
  }

  /**
   * @description Invokes the postgres agent with the given user prompt and session id.
   * @param userPrompt
   * @param sessionId
   * @returns
   */
  async invoke(userPrompt: string, sessionId: string) {
    const reactAgent = createReactAgent({
      llm: this.chatModel,
      tools: [this.queryTools, this.listTablesTool, this.describeTableTool],
    });

    const pgMemoryService = new PgMemorySaverService(this.memoryService, sessionId);
    const historyMsgs = await pgMemoryService.getMessages();

    const prompt: BaseMessage[] = [
      new SystemMessage(`
        You are helpful AI Assistant for PostgreSQL Database Quering using available tools. 
        Output must be markdown formatted. 
        `),
      ...historyMsgs,
      new HumanMessage(userPrompt),
    ];
    const llmResp = await reactAgent.invoke({ messages: prompt }, { recursionLimit: 10 });
    const aiContent = extractLastAIMessage(llmResp.messages);

    await pgMemoryService.addUserMessage(userPrompt);
    await pgMemoryService.addAIChatMessage(aiContent?.toString()!);

    return aiContent;
  }
}
