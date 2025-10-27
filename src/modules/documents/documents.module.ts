import { Module } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DocumentEntity } from "src/database/entities/document.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity])],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}
