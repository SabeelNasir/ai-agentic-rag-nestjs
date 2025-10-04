import { AIMessageChunk } from "@langchain/core/messages";
import { Process, Processor } from "@nestjs/bull";
import { type Job } from "bull";
import { ENUM_QUEUES } from "src/common/enums/enums";
import { ChatModelLogsService } from "src/modules/chat-model-logs/chat-model-logs.service";
import { ChatModelLog } from "src/database/entities/chat-model-log.entity";

@Processor(ENUM_QUEUES.CHAT_MODEL_LOGGING)
export class ChatModelLogsQueueProcess {
  constructor(private logService: ChatModelLogsService) {}

  @Process()
  async saveLogs(job: Job<unknown>) {
    await this.logService.save(job.data as Partial<ChatModelLog>);
    job.progress(100);
    return job.data;
  }
}
