import { MigrationInterface, QueryRunner } from "typeorm";

export class AddToolTypeInAgentToolsTable1768388739632 implements MigrationInterface {
    name = 'AddToolTypeInAgentToolsTable1768388739632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."agent_tool_type_enum" AS ENUM('http-request', 'files-vector-store', 'files')`);
        await queryRunner.query(`ALTER TABLE "agent_tools" ADD "tool_type" "public"."agent_tool_type_enum" NOT NULL DEFAULT 'http-request'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agent_tools" DROP COLUMN "tool_type"`);
        await queryRunner.query(`DROP TYPE "public"."agent_tool_type_enum"`);
    }

}
