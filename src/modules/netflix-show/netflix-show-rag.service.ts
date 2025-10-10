import { Injectable, Logger } from "@nestjs/common";
import { NetflixShowService } from "./netflix-show.service";
import { VectorstoreService } from "../rag/vectorstore/vectorstore.service";
import { NetflixShow } from "src/database/entities/netflix-show.entity";
import { Vector } from "src/database/entities/vector.entity";
import { EmbeddingService } from "../rag/embeddings/embedding.service";
import { ENUM_EMITTER_EVENTS, ENUM_VECTOR_COLLECTIONS } from "src/common/enums/enums";
import { EmbeddingVectorsQueueService } from "src/microservices/queues/embedding-vectors-queue/service";
import { IEmbeddingVectorsQueuePayload } from "src/microservices/queues/embedding-vectors-queue/interfaces/job-payload.interface";

@Injectable()
export class NetflixShowRagService {
  constructor(
    private readonly vectorStoreService: VectorstoreService,
    private readonly embeddingService: EmbeddingService,
    private readonly embeddingQueueService: EmbeddingVectorsQueueService,
  ) {}
  private readonly logger = new Logger(NetflixShowRagService.name);

  // Function to summarize netflix-show into one line text for embedding text
  createSummaryText(data: Partial<NetflixShow>) {
    const parts: string[] = [];

    if (data.title) parts.push(`"${data.title}"`);
    if (data.type) parts.push(`(${data.type})`);
    if (data.release_year) parts.push(`released in ${data.release_year}`);
    if (data.country) parts.push(`from ${data.country}`);
    if (data.director) parts.push(`directed by ${data.director}`);
    if (data.cast_members) parts.push(`starring ${data.cast_members}`);
    if (data.listed_in) parts.push(`genre: ${data.listed_in}`);
    if (data.description) parts.push(`about: ${data.description}`);
    if (data.date_added) parts.push(`added on: ${data.date_added}`);
    if (data.listed_in) parts.push(`listed in: ${data.listed_in}`);
    if (data.rating) parts.push(`rating is: ${data.rating}`);

    return parts.join(", ");
  }

  // Function to create embedding and store in vectors table
  // first 10 only rit now
  async createEmbeddings(shows: Partial<NetflixShow>[]) {
    if (shows && shows.length) {
      // prepare vectors payload
      await Promise.all(
        shows.map(async (show) => {
          const showSummary = this.createSummaryText(show);
          const payload: Record<string, any> = {
            collection: ENUM_VECTOR_COLLECTIONS.NETFLIX_SHOWS,
            metadata: { ...show },
            id: `${ENUM_VECTOR_COLLECTIONS.NETFLIX_SHOWS}-${show.show_id}`,
          };
          payload.embedding_text = showSummary;
          await this.embeddingQueueService.addJob({
            ...(payload as IEmbeddingVectorsQueuePayload),
          });
        }),
      );
    } else {
      throw new Error(`No shows data provided for embedding !`);
    }
  }

  // Function to find similar shows
  async findSimilarShows(query: string, limit = 5) {
    const queryEmbedding = await this.embeddingService.generateEmbedding(query);
    const results: Partial<Vector>[] = await this.vectorStoreService.similaritySearch({
      collection: ENUM_VECTOR_COLLECTIONS.NETFLIX_SHOWS,
      queryEmbedding,
      limit,
    });
    return results.map((item) => item.metadata);
  }
}
