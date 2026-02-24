import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChatSessionsAndAppApiKey1771928471976 implements MigrationInterface {
    name = 'AddChatSessionsAndAppApiKey1771928471976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(150), "user_id" integer, "application_id" integer, "agent_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_efc151a4aafa9a28b73dedc485f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "api_key_hash" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "agent_id" integer`);
        await queryRunner.query(`DROP INDEX "public"."idx_sessionId"`);
        await queryRunner.query(`ALTER TABLE "chat_memory" DROP COLUMN "session_id"`);
        await queryRunner.query(`ALTER TABLE "chat_memory" ADD "session_id" uuid`);
        await queryRunner.query(`CREATE INDEX "idx_sessionId" ON "chat_memory" ("session_id") `);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_3b4257dd070be620751fbe56a1b" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_sessions" ADD CONSTRAINT "FK_247dff5dc8abfe048bd544281ba" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_sessions" ADD CONSTRAINT "FK_712f7cb86dc12446399754cf52d" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_memory" ADD CONSTRAINT "FK_b6a4de9e63109cb64265523d385" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_memory" DROP CONSTRAINT "FK_b6a4de9e63109cb64265523d385"`);
        await queryRunner.query(`ALTER TABLE "chat_sessions" DROP CONSTRAINT "FK_712f7cb86dc12446399754cf52d"`);
        await queryRunner.query(`ALTER TABLE "chat_sessions" DROP CONSTRAINT "FK_247dff5dc8abfe048bd544281ba"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_3b4257dd070be620751fbe56a1b"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7"`);
        await queryRunner.query(`DROP INDEX "public"."idx_sessionId"`);
        await queryRunner.query(`ALTER TABLE "chat_memory" DROP COLUMN "session_id"`);
        await queryRunner.query(`ALTER TABLE "chat_memory" ADD "session_id" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "idx_sessionId" ON "chat_memory" ("session_id") `);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "agent_id"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "api_key_hash"`);
        await queryRunner.query(`DROP TABLE "chat_sessions"`);
    }

}
