import { Module } from "@nestjs/common";
import { FileLoaderController } from "./file-loader.controller";
import { FileLoaderService } from "./file-loader.service";
import { EmbeddingVectorsQueueModule } from "src/microservices/queues/embedding-vectors-queue/module";

@Module({
  imports: [EmbeddingVectorsQueueModule],
  controllers: [FileLoaderController],
  providers: [FileLoaderService],
  exports: [FileLoaderService],
})
export class FileLoaderModule {}
