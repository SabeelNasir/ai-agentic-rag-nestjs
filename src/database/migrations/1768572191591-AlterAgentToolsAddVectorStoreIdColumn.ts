import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAgentToolsAddVectorStoreIdColumn1768572191591 implements MigrationInterface {
    name = 'AlterAgentToolsAddVectorStoreIdColumn1768572191591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agent_tools" ADD "vector_store_id" integer`);
        await queryRunner.query(`ALTER TABLE "agent_tools" ADD CONSTRAINT "agent_tools_vector_store_fk" FOREIGN KEY ("vector_store_id") REFERENCES "vector_store"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agent_tools" DROP CONSTRAINT "agent_tools_vector_store_fk"`);
        await queryRunner.query(`ALTER TABLE "agent_tools" DROP COLUMN "vector_store_id"`);
    }

}
