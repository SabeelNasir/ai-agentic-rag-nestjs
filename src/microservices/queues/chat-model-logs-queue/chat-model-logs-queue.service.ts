import { QueueJob } from "@bull-board/api/typings/app";
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { type Queue } from "bull";
import { ENUM_CHAT_MODEL_PROVIDER, ENUM_QUEUES } from "src/common/enums/enums";
import { queuePool } from "../utils/get-bull-queues";
import { AIMessage } from "@langchain/core/messages";
import { EnvConfigService } from "src/config/env-config.service";
import { computeCostFromMetadata } from "src/common/utils/chat-call-cost-compute";
import { ChatModelLog } from "src/database/entities/chat-model-log.entity";

export interface IChatModelLogJob extends AIMessage{
  model_provider: ENUM_CHAT_MODEL_PROVIDER;
  response_metadata: Record<string, any>;
}

@Injectable()
export class ChatModelLogsQueueService {
  constructor(
    @InjectQueue(ENUM_QUEUES.CHAT_MODEL_LOGGING) private queue: Queue,
    private configService: EnvConfigService,
  ) {
    queuePool.add(queue);
  }

  addJob(payload: IChatModelLogJob) {
    const respMetadata = payload.response_metadata;
    const transformedPayload: Partial<ChatModelLog> = {
      model_name: respMetadata.model || respMetadata.model_name,
      model_provider: payload.model_provider,
      input_tokens: respMetadata["tokenUsage"]["promptTokens"],
      output_tokens: respMetadata["tokenUsage"]["completionTokens"],
      latency: respMetadata['usage']['total_time'],
      request_id: ((respMetadata) => {
        try {
          return payload.model_provider == ENUM_CHAT_MODEL_PROVIDER.GROQ
            ? respMetadata["x_groq"]["id"]
            : respMetadata["x_openai"]["request_id"];
        } catch (err) {
          return null;
        }
      })(respMetadata),
      response_code: 200,
      cost: computeCostFromMetadata(respMetadata).cost,
    };
    return this.queue.add(transformedPayload);
  }
}
