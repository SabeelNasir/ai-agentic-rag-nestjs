import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVectorsIndexOnEmbeddings1759675101976 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE vectors 
      DROP COLUMN embedding,
      ADD COLUMN embedding vector(1536);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS vectors_embedding_ivfflat_idx
      ON vectors USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS vectors_embedding_ivfflat_idx;
      ALTER TABLE vectors DROP COLUMN embedding;
      ADD COLUMN embedding vector;
    `);
  }
}

