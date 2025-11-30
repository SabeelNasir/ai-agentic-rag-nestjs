import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { GroqChatModelService } from "src/common/chat-models/groq-chat-model/groq-chat-model.service";
import { MemoryService } from "src/modules/memory/memory.service";
import { SshAgentPrompts } from "./prompts/ssh-agent-prompts";
import { PgMemorySaverService } from "src/modules/memory/pg-memory-saver.service";
import { extractLastAIMessage } from "src/common/utils/utils";
import { SshAgentTools } from "./tools/ssh-agent-tools";

@Injectable()
export class SshAgentService implements OnModuleInit {
  constructor(
    private readonly chatModelService: GroqChatModelService,
    private readonly memoryService: MemoryService,
    private readonly prompts: SshAgentPrompts,
    private readonly sshAgentTools: SshAgentTools,
  ) {}

  private chatModel: ChatGroq | ChatOpenAI;

  onModuleInit() {
    this.chatModel = this.chatModelService.getModel();
  }

  async invoke(userPrompt: string, sessionId: string) {
    const reactAgent = createReactAgent({
      llm: this.chatModel,
      tools: [this.sshAgentTools.toolConnectSsh(), this.sshAgentTools.toolRunSshCommand()],
    });

    // Bind session pg-memory
    const pgMemoryService = new PgMemorySaverService(this.memoryService, sessionId);
    const historyMsgs = await pgMemoryService.getMessages();

    const prompt = await this.prompts.sshOperations(userPrompt, historyMsgs);

    const llmResp = await reactAgent.invoke({ messages: [...prompt] }, { recursionLimit: 25 });
    const aiContent = extractLastAIMessage(llmResp.messages);

    await pgMemoryService.addUserMessage(userPrompt);
    await pgMemoryService.addAIChatMessage(aiContent?.toString()!);

    return aiContent;
  }
}
