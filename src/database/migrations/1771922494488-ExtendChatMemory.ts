import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendChatMemory1771922494488 implements MigrationInterface {
    name = 'ExtendChatMemory1771922494488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_chat_model_log_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_chat_model_log_application_id"`);
        await queryRunner.query(`ALTER TABLE "chat_memory" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "chat_memory" ADD "application_id" integer`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "application_name_idx_unique"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "application_name_idx_unique" ON "applications" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."application_name_idx_unique"`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "application_name_idx_unique" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "chat_memory" DROP COLUMN "application_id"`);
        await queryRunner.query(`ALTER TABLE "chat_memory" DROP COLUMN "user_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_chat_model_log_application_id" ON "chat_model_log" ("application_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_chat_model_log_user_id" ON "chat_model_log" ("user_id") `);
    }

}
