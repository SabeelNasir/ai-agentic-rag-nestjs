import { Module } from "@nestjs/common";
import { VectorStoreService } from "./vector-store.service";
import { VectorStoreController } from "./vector-store.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VectorStoreEntity } from "src/database/entities/vector-store.entity";
import { VectorStoreFileModule } from "../vector-store-file/vector-store-file.module";
import { FileLoaderModule } from "../file-loader/file-loader.module";

@Module({
  imports: [TypeOrmModule.forFeature([VectorStoreEntity]), VectorStoreFileModule, FileLoaderModule],
  providers: [VectorStoreService],
  controllers: [VectorStoreController],
  exports: [VectorStoreService],
})
export class VectorStoreModule {}

