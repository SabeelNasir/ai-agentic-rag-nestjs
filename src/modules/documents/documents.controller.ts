import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { DocumentEntity } from "src/database/entities/document.entity";
import { DtoPagination } from "src/common/dto/pagination.dto";
import { DtoDocsAICompletionsRequest } from "./dto/documents-request.dto";

@Controller("documents")
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Post()
  create(@Body() body: Partial<DocumentEntity>) {
    return this.service.save(body);
  }

  @Get()
  getAll(@Query() query: DtoPagination) {
    return this.service.getAll(query);
  }

  @Get(":id")
  getById(@Param("id") id: number) {
    return this.service.getById(id);
  }

  @Put(":id")
  update(@Param("id") id: number, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Post("ai-completions")
  docAiCompletions(@Body() body: DtoDocsAICompletionsRequest) {
    return this.service.docAiCompletions(body);
  }
}
