import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableVectorForEmbeddings1759571455761 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `
        -- ensure pgvector extension enabled
            CREATE EXTENSION IF NOT EXISTS vector;

            CREATE TABLE IF NOT EXISTS vectors (
            id TEXT PRIMARY KEY,                 -- unique id (e.g. "netflix_shows:show_id")
            collection TEXT NOT NULL,            -- collection name (e.g. 'netflix_shows')
            embedding vector(1536),              -- vector column (dimension depends on embedding model)
            metadata JSONB,                       -- metadata (title, description, etc.)
            embedding_text TEXT,                 -- embedding text
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );

            CREATE INDEX IF NOT EXISTS vectors_collection_idx ON vectors (collection);
            -- For pgvector ivfflat index (optional, faster for large datasets)
            -- CREATE INDEX ON vectors USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
            `;
    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`Drop table vectors;`);
  }
}

