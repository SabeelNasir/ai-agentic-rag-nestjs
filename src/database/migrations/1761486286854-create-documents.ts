import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDocuments1761486286854 implements MigrationInterface {
    name = 'CreateDocuments1761486286854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "document" ("id" SERIAL NOT NULL, "title" character varying NOT NULL DEFAULT 'Untitled document', "content" jsonb, "liveblocks_room_id" character varying, "created_by" integer, "updated_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "document"`);
    }

}
