import { Injectable } from "@nestjs/common";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { EmbeddingVectorsQueueService } from "src/microservices/queues/embedding-vectors-queue/service";
import { ENUM_VECTOR_COLLECTIONS } from "src/common/enums/enums";

@Injectable()
export class FileLoaderService {
  constructor(private readonly queueService: EmbeddingVectorsQueueService) {}

  async processFileForEmbedding(filePath) {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    // send job for embeddings creation & store in vectors
    await this.queueService.addJob({
      collection: ENUM_VECTOR_COLLECTIONS.DOCUMENTS,
      metadata: {
        ...docs,
      },
      embedding_text: JSON.stringify(docs[0].pageContent),
      id: new Date().getTime().toString(),
    });
    return docs[0].metadata;
  }
}
