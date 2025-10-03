import { Module } from "@nestjs/common";
import { GroqChatModelService } from "./groq-chat-model.service";
import { LangchainHandlerModule } from "src/common/langchain-handlers/langchain-handler.module";
import { ChatModelLogsQueueModule } from "src/microservices/queues/chat-model-logs-queue/chat-model-logs-queue.module";

@Module({
  imports: [LangchainHandlerModule, ChatModelLogsQueueModule],
  providers: [GroqChatModelService],
  exports: [GroqChatModelService],
})
export class GroqChatModelModule {}
