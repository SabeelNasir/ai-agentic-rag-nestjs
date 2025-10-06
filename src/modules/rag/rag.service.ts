import { Injectable } from "@nestjs/common";
import { DtoRagQuery } from "./dto/get-rag-all-request.dto";
import { EmbeddingService } from "./embeddings/embedding.service";
import { VectorstoreService } from "./vectorstore/vectorstore.service";

@Injectable()
export class RagService {
  constructor(
    private readonly vectorStoreService: VectorstoreService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async queryVectors(queryParams: DtoRagQuery) {
    const queryEmbedding = await this.embeddingService.embedText(queryParams.search);
    return this.vectorStoreService.similaritySearch({
      collection: queryParams.collection,
      queryEmbedding,
      limit: queryParams.limit,
    });
  }
}
