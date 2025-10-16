import { BaseCallbackHandler } from "node_modules/@langchain/core/dist/callbacks/base";
import { computeCostFromMetadata } from "../utils/chat-call-cost-compute";
import { Serialized } from "@langchain/core/load/serializable";
import { ChatGeneration, LLMResult } from "@langchain/core/outputs";
import { Injectable, Logger } from "@nestjs/common";
import {
  ChatModelLogsQueueService,
  IChatModelLogJob,
} from "src/microservices/queues/chat-model-logs-queue/chat-model-logs-queue.service";
import { ENUM_CHAT_MODEL_PROVIDER } from "../enums/enums";

export class DBLoggingHandler extends BaseCallbackHandler {
  constructor(
    private queueService: ChatModelLogsQueueService,
    private modelProvider: ENUM_CHAT_MODEL_PROVIDER = ENUM_CHAT_MODEL_PROVIDER.GROQ,
  ) {
    super();
  }
  name = "DBLoggingHandler";
  private logger = new Logger("LLMChainLogging");

  handleLLMStart(
    llm: Serialized,
    prompts: string[],
    runId: string,
    parentRunId?: string,
    extraParams?: Record<string, unknown>,
    tags?: string[],
    metadata?: Record<string, unknown>,
    runName?: string,
  ) {
    // console.log("ChatModel LLM Start:", metadata);
  }
  async handleLLMEnd(
    output: LLMResult,
    runId: string,
    parentRunId?: string,
    tags?: string[],
    extraParams?: Record<string, unknown>,
  ) {
    console.log("CHatModel LLM End: ", "Output: ", output, runId, "Extra Params", extraParams);
    const chatGen = output.generations?.[0]?.[0] as ChatGeneration;
    const metadata = chatGen.message.response_metadata ?? {};
    // console.log("chatGen.message", chatGen.message);
    // console.log("Metadata", metadata);

    // Push in queue  for saving
    await this.queueService.addJob({ model_provider: this.modelProvider, ...chatGen.message } as IChatModelLogJob);
  }
  handleToolStart(tool: Serialized, input: string) {
    this.logger.log("ToolStart: " + tool.name + " called, input: " + input.toString());
  }
  handleToolEnd(output: any, runId: string, parentRunId?: string, tags?: string[]) {
    this.logger.log("Tool end: " + output);
  }
}
