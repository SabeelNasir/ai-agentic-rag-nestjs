import { Module } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DocumentEntity } from "src/database/entities/document.entity";
import { DocumentsAgentModule } from "../agent/documents-agent/documents-agent.module";

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity]), DocumentsAgentModule],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}
