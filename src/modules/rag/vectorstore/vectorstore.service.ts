import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Vector } from "src/database/entities/vector.entity";
import { Repository } from "typeorm";

@Injectable()
export class VectorstoreService {
  constructor(@InjectRepository(Vector) private readonly repo: Repository<Vector>) {}

  getRepo() {
    return this.repo;
  }

  save(payload: Partial<Vector>) {
    return this.repo.save(payload);
  }

  /**
   * Retrieve most similar vectors using pgvector similarity search
   */
  async similaritySearch(params: { collection: string; queryEmbedding: number[]; limit: number }) {
    const { collection, queryEmbedding, limit } = params;

    const embeddingLiteral = `[${queryEmbedding.join(",")}]`;

    return this.repo.query(
      `SELECT 
      id, 
      collection, 
      metadata, 
      created_at,
      1 - (embedding <#> $2::vector) AS similarity
      FROM vectors
      WHERE collection = $1
      ORDER BY embedding <#> $2::vector
      LIMIT $3
      `,
      [collection, embeddingLiteral, limit],
    );
  }

  /**
   * Delete vectors by collection (optional cleanup)
   */
  async deleteCollection(collection: string) {
    return this.repo.delete({ collection });
  }
}
