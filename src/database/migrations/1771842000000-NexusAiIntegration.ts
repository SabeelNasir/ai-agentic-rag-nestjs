import { MigrationInterface, QueryRunner } from "typeorm";

export class NexusAiIntegration1771842000000 implements MigrationInterface {
  name = "NexusAiIntegration1771842000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create applications table
    await queryRunner.query(`CREATE TABLE "applications" (
            "id" SERIAL NOT NULL, 
            "name" character varying(150) NOT NULL, 
            "description" text, 
            "is_active" boolean NOT NULL DEFAULT true, 
            "config" jsonb, 
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            CONSTRAINT "application_name_idx_unique" UNIQUE ("name"), 
            CONSTRAINT "PK_applications_id" PRIMARY KEY ("id")
        )`);

    // Add columns to chat_model_log
    await queryRunner.query(`ALTER TABLE "chat_model_log" ADD "user_id" integer`);
    await queryRunner.query(`ALTER TABLE "chat_model_log" ADD "application_id" integer`);

    // Indexing for performance
    await queryRunner.query(`CREATE INDEX "IDX_chat_model_log_user_id" ON "chat_model_log" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_chat_model_log_application_id" ON "chat_model_log" ("application_id")`);

    // Seed initial application
    await queryRunner.query(
      `INSERT INTO "applications" ("name", "description") VALUES ('nucleus-frontend', 'Main Enterprise UI Application')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_chat_model_log_application_id"`);
    await queryRunner.query(`DROP INDEX "IDX_chat_model_log_user_id"`);
    await queryRunner.query(`ALTER TABLE "chat_model_log" DROP COLUMN "application_id"`);
    await queryRunner.query(`ALTER TABLE "chat_model_log" DROP COLUMN "user_id"`);
    await queryRunner.query(`DROP TABLE "applications"`);
  }
}
