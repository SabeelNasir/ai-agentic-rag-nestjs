import { Module } from "@nestjs/common";
import { EmbeddingVectorsQueueService } from "./service";
import { EmbeddingVectorsQueueProcessor } from "./processor";
import { BullModule } from "@nestjs/bull";
import { ENUM_QUEUES } from "src/common/enums/enums";
import { RagModule } from "src/modules/rag/rag.module";

@Module({
  imports: [BullModule.registerQueue({ name: ENUM_QUEUES.VECTORS_EMBEDDING }), RagModule],
  providers: [EmbeddingVectorsQueueService, EmbeddingVectorsQueueProcessor],
  exports: [EmbeddingVectorsQueueService],
})
export class EmbeddingVectorsQueueModule {}
