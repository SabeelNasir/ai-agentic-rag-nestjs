import { Module } from "@nestjs/common";
import { FileLoaderController } from "./file-loader.controller";
import { FileLoaderService } from "./file-loader.service";
import { EmbeddingVectorsQueueModule } from "src/microservices/queues/embedding-vectors-queue/module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadFileEntity } from "src/database/entities/upload-file.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UploadFileEntity]), EmbeddingVectorsQueueModule],
  controllers: [FileLoaderController],
  providers: [FileLoaderService],
  exports: [FileLoaderService],
})
export class FileLoaderModule {}
