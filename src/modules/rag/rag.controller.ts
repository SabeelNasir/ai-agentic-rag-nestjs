import { Controller, Get, Query } from "@nestjs/common";
import { DtoRagQuery } from "./dto/get-rag-all-request.dto";
import { RagService } from "./rag.service";

@Controller("rag")
export class RagController {
  constructor(private readonly ragService: RagService) {}

  // query-params: collection , search
  @Get()
  async queryVectors(@Query() queryParams: DtoRagQuery) {
    return this.ragService.queryVectors(queryParams);
  }
}
