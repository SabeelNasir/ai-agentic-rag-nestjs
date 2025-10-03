import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatModelLog } from "../database/entities/chat-model-log.entity";
import { Repository } from "typeorm";
import { AIMessageChunk } from "@langchain/core/messages";
import { EnvConfigService } from "src/config/env-config.service";
import { computeCostFromMetadata } from "src/common/utils/chat-call-cost-compute";

@Injectable()
export class ChatModelLogsService {
  constructor(
    @InjectRepository(ChatModelLog) private repo: Repository<ChatModelLog>,
    private configService: EnvConfigService,
  ) {}

  save(payload: Partial<ChatModelLog>) {
    // let payload: Partial<ChatModelLog> = {};
    // const respMetadata = aiChunkMessage;
    // payload = {
    //   model_name: respMetadata.mod,
    //   model_type: this.configService.getChatModelType(),
    //   input_tokens: respMetadata["tokenUsage"]["promptTokens"],
    //   output_tokens: respMetadata["tokenUsage"]["completionTokens"],
    //   request_id: ((respMetadata) => {
    //     try {
    //       return this.configService.getChatModelType() == "groq"
    //         ? respMetadata["x_groq"]["id"]
    //         : respMetadata["x_openai"]["request_id"];
    //     } catch (err) {
    //       return null;
    //     }
    //   })(respMetadata),
    //   response_code: 200,
    //   cost: computeCostFromMetadata(respMetadata).cost,
    // };
    return this.repo.upsert(payload, { conflictPaths: { id: true } });
  }
}
