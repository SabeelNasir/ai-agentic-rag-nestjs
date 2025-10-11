import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GroqChatModelService } from "src/common/chat-models/groq-chat-model/groq-chat-model.service";
import { AiAgentEntity } from "src/database/entities/ai-agent.entity";
import { Repository } from "typeorm";
import { AiAgentToolService } from "./ai-agent-tool.service";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { extractLastAIMessage } from "src/common/utils/utils";
import { PgMemorySaverService } from "../memory/pg-memory-saver.service";
import { MemoryService } from "../memory/memory.service";

@Injectable()
export class AiAgentService {
  constructor(
    @InjectRepository(AiAgentEntity) private readonly repo: Repository<AiAgentEntity>,
    private readonly llmService: GroqChatModelService,
    private readonly toolService: AiAgentToolService,
    private readonly memoryService: MemoryService,
  ) {}

  async save(payload: Partial<AiAgentEntity>) {
    return this.repo.save(payload);
  }

  findAll() {
    return this.repo.find({ order: { id: "ASC" } });
  }

  findById(id: number) {
    return this.repo.findOneBy({ id });
  }

  async chatWithAgent(agentId: number, userPrompt: string, sessionId: string) {
    const agentData = await this.repo.findOneBy({ id: agentId });
    if (!agentData) {
      throw new Error("AI Agent not found!");
    }
    const chatModel = this.llmService.getModelForDynamicAIAgents(agentData.model_provider);
    const agentTools = agentData.tools?.length
      ? [...this.toolService.prepareDynamicToolsBindings(agentData.tools)]
      : [];
    const systemPrompt = new SystemMessage(agentData.system_prompt?.content);
    const historyService = new PgMemorySaverService(this.memoryService, sessionId);
    const historyMsgs = await historyService.getMessages();
    const reactAgent = createReactAgent({
      llm: chatModel,
      tools: agentTools,
    });
    const llmResp = await reactAgent.invoke(
      { messages: [systemPrompt, ...historyMsgs, new HumanMessage(userPrompt)] },
      { configurable: { thread_id: sessionId }, recursionLimit: 25 },
    );
    const lastAIMessage = extractLastAIMessage(llmResp.messages);
    await historyService.addUserMessage(userPrompt);
    await historyService.addAIChatMessage(lastAIMessage?.toString()!);
    return lastAIMessage;
  }
}
