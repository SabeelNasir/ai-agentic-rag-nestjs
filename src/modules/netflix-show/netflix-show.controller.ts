import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { NetflixShowService } from "./netflix-show.service";
import { NetflixShowRagService } from "./netflix-show-rag.service";
import { DtoPagination } from "src/common/dto/pagination.dto";

@Controller("netflix-show")
export class NetflixShowController {
  constructor(private readonly service: NetflixShowService) {}

  @Get()
  getShows(@Query() query: DtoPagination) {
    return this.service.getShows(query);
  }

  @Post("embeddings")
  async updateShowsVectors(@Body() query: DtoPagination) {
    return this.service.updateVectorsEmbedding(query);
  }
}
