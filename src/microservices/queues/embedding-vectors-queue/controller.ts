import { Controller, Get } from "@nestjs/common";
import { EmbeddingVectorsQueueService } from "./service";

@Controller("embedding-vectors-queue")
export class EmbeddingVectorsQueueController {
  constructor(private readonly service: EmbeddingVectorsQueueService) {}

  @Get("status")
  async getQueueStatus() {
    return this.service.getQueueStatus();
  }
}

