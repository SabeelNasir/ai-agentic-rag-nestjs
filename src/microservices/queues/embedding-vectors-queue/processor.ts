import { InjectQueue, OnQueueCompleted, Process, Processor } from "@nestjs/bull";
import { type Queue, type Job } from "bull";
import { ENUM_EMITTER_EVENTS, ENUM_QUEUES } from "src/common/enums/enums";
import { IEmbeddingVectorsQueuePayload } from "./interfaces/job-payload.interface";
import { EmbeddingService } from "src/modules/rag/embeddings/embedding.service";
import { VectorstoreService } from "src/modules/rag/vectorstore/vectorstore.service";
import { Logger } from "@nestjs/common";
import { NetflixShow } from "src/database/entities/netflix-show.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Processor(ENUM_QUEUES.VECTORS_EMBEDDING)
export class EmbeddingVectorsQueueProcessor {
  constructor(
    @InjectQueue(ENUM_QUEUES.VECTORS_EMBEDDING) private readonly queue: Queue,
    private embeddingService: EmbeddingService,
    private readonly vectorStoreService: VectorstoreService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  private logger = new Logger(EmbeddingVectorsQueueProcessor.name);

  @Process()
  async createEmbeddingVectorsAndStore(job: Job<IEmbeddingVectorsQueuePayload>) {
    const payload = job.data;
    const embedding = await this.embeddingService.embedText(payload.embedding_text);
    payload.embedding = embedding;
    await this.vectorStoreService.getRepo().save(payload);

    const show = payload.metadata as Partial<NetflixShow>;
    this.logger.log(`Embedding created for show: ${show.show_id} - ${show.title}`);
  }

  @OnQueueCompleted()
  async notifyOnJobsCompletion() {
    const [failedCount, waitingCount, activeCount, completedCount] = await Promise.all([
      this.queue.getFailedCount(),
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
    ]);
    if (!failedCount && !waitingCount && !activeCount) {
      this.logger.log(`All embedding jobs finished successfully!`);
      this.eventEmitter.emit(ENUM_EMITTER_EVENTS.EMBEDDING_COMPLETED, {
        timestamp: new Date(),
        totalJobs: completedCount,
      });
    }
  }
}
