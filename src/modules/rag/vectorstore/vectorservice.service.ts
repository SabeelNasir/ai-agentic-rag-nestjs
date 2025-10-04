import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Vector } from "src/database/entities/vector.entity";
import { Repository } from "typeorm";

@Injectable()
export class VectorstoreService {
  constructor(@InjectRepository(Vector) private readonly repo: Repository<Vector>) {}

  save(payload: Partial<Vector>) {
    return this.repo.save(payload);
  }

  /**
   * Retrieve most similar vectors using pgvector similarity search
   */
  async similaritySearch(params: { collection: string; queryEmbedding: number[]; limit?: number }) {
    const { collection, queryEmbedding, limit = 5 } = params;

    return this.repo.query(
      `
      SELECT id, collection, payload, created_at,
             1 - (embedding <-> $2) AS similarity
      FROM vectors
      WHERE collection = $1
      ORDER BY embedding <-> $2
      LIMIT $3
      `,
      [collection, queryEmbedding, limit],
    );
  }

  /**
   * Delete vectors by collection (optional cleanup)
   */
  async deleteCollection(collection: string) {
    return this.repo.delete({ collection });
  }
}
