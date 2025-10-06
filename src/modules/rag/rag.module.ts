import { Module } from "@nestjs/common";
import { EmbeddingService } from "./embeddings/embedding.service";
import { VectorstoreService } from "./vectorstore/vectorstore.service";
import { Vector } from "src/database/entities/vector.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RagController } from "./rag.controller";
import { RagService } from "./rag.service";

@Module({
  imports: [TypeOrmModule.forFeature([Vector])],
  providers: [EmbeddingService, VectorstoreService, RagService],
  exports: [EmbeddingService, VectorstoreService, RagService],
  controllers: [RagController],
})
export class RagModule {}
