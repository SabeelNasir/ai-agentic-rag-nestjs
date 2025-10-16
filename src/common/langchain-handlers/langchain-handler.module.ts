import { Module } from "@nestjs/common";
import { ChatModelLogsQueueModule } from "src/microservices/queues/chat-model-logs-queue/chat-model-logs-queue.module";
import { DBLoggingHandler } from "./langchain-db-logging.handler";

@Module({
  imports: [ChatModelLogsQueueModule],
  providers: [],
  exports: [],
})
export class LangchainHandlerModule {}
