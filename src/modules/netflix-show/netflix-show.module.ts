import { Module } from "@nestjs/common";
import { NetflixShowController } from "./netflix-show.controller";
import { NetflixShowService } from "./netflix-show.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NetflixShow } from "../../database/entities/netflix-show.entity";
import { NetflixShowRagService } from "./netflix-show-rag.service";
import { RagModule } from "../rag/rag.module";
import { EmbeddingVectorsQueueModule } from "src/microservices/queues/embedding-vectors-queue/module";

@Module({
  imports: [TypeOrmModule.forFeature([NetflixShow]), RagModule, EmbeddingVectorsQueueModule],
  controllers: [NetflixShowController],
  providers: [NetflixShowService, NetflixShowRagService],
  exports: [NetflixShowService],
})
export class NetflixShowModule {}

