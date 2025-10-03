import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ENUM_QUEUES } from "src/common/enums/enums";
import { ChatModelLogsQueueService } from "./chat-model-logs-queue.service";
import { ChatModelLogsQueueProcess } from "./chat-model-logs-queue.process";
import { ChatModelLogsModule } from "src/modules/chat-model-logs/chat-model-logs.module";

const queueImports = [
  BullModule.registerQueue({
    name: ENUM_QUEUES.CHAT_MODEL_LOGGING,
  }),
];
@Module({
  imports: [...queueImports, ChatModelLogsModule],
  providers: [ChatModelLogsQueueService, ChatModelLogsQueueProcess],
  exports: [...queueImports, ChatModelLogsQueueService],
})
export class ChatModelLogsQueueModule {}
