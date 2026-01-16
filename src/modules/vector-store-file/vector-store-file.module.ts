import { Module } from "@nestjs/common";
import { VectorStoreFileService } from "./vector-store-file.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VectorStoreFileEntity } from "src/database/entities/vector-store-file.entity";

@Module({
  imports: [TypeOrmModule.forFeature([VectorStoreFileEntity])],
  providers: [VectorStoreFileService],
  exports: [VectorStoreFileService],
})
export class VectorStoreFileModule {}
