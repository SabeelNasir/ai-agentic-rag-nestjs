import { Injectable, OnModuleInit } from "@nestjs/common";
import { DocumentsPgVectorTool } from "../tools/documents-pgvector.tool";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { GroqChatModelService } from "src/common/chat-models/groq-chat-model/groq-chat-model.service";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { PgMemorySaverService } from "src/modules/memory/pg-memory-saver.service";
import { MemoryService } from "src/modules/memory/memory.service";
import { extractLastAIMessage } from "src/common/utils/utils";
import { CustomWebsearchTool } from "../tools/custom-websearch.tool";
import { DocumentsEditorAgentPrompts } from "./prompts/documents-editor-agent-prompts";
import { AICompletionsType } from "src/modules/documents/dto/documents-request.dto";

@Injectable()
export class DocumentsAgentService implements OnModuleInit {
  private chatModel: ChatGroq | ChatOpenAI;
  private systemPrompt: SystemMessage;

  constructor(
    private readonly docsPgVectorTool: DocumentsPgVectorTool,
    private readonly chatModelService: GroqChatModelService,
    private readonly memoryService: MemoryService,
    private readonly websearchTool: CustomWebsearchTool,
    private readonly docAIPrompts: DocumentsEditorAgentPrompts,
  ) {}

  onModuleInit() {
    this.systemPrompt = new SystemMessage(`You are a helpful AI Assistant for answering from documents vector store. 
            - Be very concise to the point. But you are replying to B2B CRM users so be very professional. 
            - Use tools where required and let user also know what u have
            - Always attach reference details in the end
            - Return output as a markdown always
            - Output must be very readable & intuitive for enduser`);
    this.chatModel = this.chatModelService.getModel();
  }

  async invoke(userPrompt: string, sessionId: string) {
    const reactAgent = createReactAgent({
      llm: this.chatModel,
      tools: [this.docsPgVectorTool.getTool(), this.websearchTool.getTool()],
    });

    const pgMemoryService = new PgMemorySaverService(this.memoryService, sessionId);
    const history = await pgMemoryService.getMessages();

    const result = await reactAgent.invoke({ messages: [this.systemPrompt, ...history, new HumanMessage(userPrompt)] });
    const aiContent = extractLastAIMessage(result.messages);

    await pgMemoryService.addUserMessage(userPrompt);
    await pgMemoryService.addAIChatMessage(aiContent?.toString()!);

    return aiContent;
  }

  async docEditorAICompletions(docContent: string, type: AICompletionsType) {
    let prompt: BaseMessage[] = [];
    if (type === AICompletionsType.ImproveWriting) {
      prompt = await this.docAIPrompts.improveWriting(docContent);
    } else if (type === AICompletionsType.FixGrammer) {
      prompt = await this.docAIPrompts.fixGrammer(docContent);
    }
    const result = await this.chatModelService.getModel().invoke(prompt);
    return result.content;
  }
}
