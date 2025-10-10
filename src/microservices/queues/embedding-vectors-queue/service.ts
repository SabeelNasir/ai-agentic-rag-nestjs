import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { type Queue } from "bull";
import { ENUM_QUEUES } from "src/common/enums/enums";
import { IEmbeddingVectorsQueuePayload } from "./interfaces/job-payload.interface";
import { EmbeddingService } from "src/modules/rag/embeddings/embedding.service";
import { queuePool } from "../utils/get-bull-queues";

@Injectable()
export class EmbeddingVectorsQueueService {
  constructor(
    @InjectQueue(ENUM_QUEUES.VECTORS_EMBEDDING) private readonly queue: Queue,
    embeddingService: EmbeddingService,
  ) {
    queuePool.add(queue);
  }

  addJob(payload: IEmbeddingVectorsQueuePayload) {
    return this.queue.add(payload);
  }
}
